// Webhook da Wiapy (/api/wiapy-webhook): libera o Assistente IA Premium sozinho a cada pagamento.
// Pagamento aprovado do Premium (produto, order bump ou assinatura) = Premium até o fim do período (ou 30 dias).
// Estorno ou chargeback = Premium encerrado. A Wiapy manda o token cadastrado no header Authorization.
import { assinantes, hojeSP, lerAssinante, maiorData, type Assinante } from '../lib/premium-store.mts';

const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
const ehPremium = (t: unknown) => /ia\s*premium|assistente\s*ia/i.test(String(t || ''));
const maisDias = (iso: string, dias: number) => new Date(Date.parse(iso.slice(0, 10)) + dias * 86400000).toISOString().slice(0, 10);

export default async (req: Request) => {
  if (req.method !== 'POST') return json(405, { ok: false });
  const token = process.env.WIAPY_WEBHOOK_TOKEN;
  const recebido = String(req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '').trim();
  if (!token || recebido !== token) return json(401, { ok: false });

  let b: any;
  try {
    b = await req.json();
  } catch {
    return json(400, { ok: false });
  }
  const email = String(b?.customer?.email || '').trim().toLowerCase();
  const pay = b?.payment;
  if (!email || !pay) return json(200, { ok: true, ignorado: 'sem pagamento' }); // ex.: carrinho abandonado

  // A compra tem o Premium? (produto principal, order bump ou produtos liberados)
  const temPremium =
    ehPremium(b?.checkout?.title) ||
    (b?.checkout?.orderbump || []).some((o: any) => ehPremium(o?.title)) ||
    (b?.products || []).some((p: any) => ehPremium(p?.title));
  if (!temPremium) return json(200, { ok: true, ignorado: 'sem premium' });

  const atual = await lerAssinante(email);
  const pagamentos = atual?.pagamentos || [];
  const id = String(pay.id || '');
  const status = String(pay.status || '');
  const sub = b?.subscription && Object.keys(b.subscription).length ? b.subscription : null;
  let ate = atual?.ate || null;

  if (status === 'paid') {
    // Assinatura: vale até o fim do período pago (+1 dia de folga). Compra avulsa (order bump): 30 dias.
    const fim = sub?.dt_end ? maisDias(String(sub.dt_end), 1) : maisDias(String(pay.dt_create || hojeSP()), 30);
    ate = maiorData(ate, fim);
  } else if (status === 'refunded' || status === 'chargedback') {
    ate = maisDias(hojeSP(), -1);
  } else {
    return json(200, { ok: true, ignorado: status }); // pendente, recusado: nada muda
  }

  const reg: Assinante = {
    ate: ate!,
    origem: sub ? 'assinatura' : 'order bump / compra avulsa',
    status,
    atualizadoEm: new Date().toISOString(),
    pagamentos: id && !pagamentos.includes(id) ? [...pagamentos, id].slice(-50) : pagamentos,
  };
  await assinantes().setJSON(email, reg);
  return json(200, { ok: true, email, ate: reg.ate });
};

export const config = { path: '/api/wiapy-webhook' };
