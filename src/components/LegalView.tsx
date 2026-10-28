import React, { useState } from 'react';
import { FileText, ShieldCheck } from 'lucide-react';

// Dados do responsável: configure no Netlify (VITE_LEGAL_NAME, VITE_LEGAL_DOC, VITE_LEGAL_EMAIL)
const env = (import.meta as any).env || {};
export const LEGAL = {
  name: env.VITE_LEGAL_NAME || 'o responsável pelo VET CALC PRO',
  doc: env.VITE_LEGAL_DOC || '',
  email: env.VITE_LEGAL_EMAIL || 'suporte.vetcalcpro@gmail.com',
  updatedAt: '28/10/2026',
};

export const TERMS_VERSION = '2026-10-28';

type Section = { title: string; body: string[] };

const TERMS: Section[] = [
  {
    title: '1. Sobre o VET CALC PRO',
    body: [
      `O VET CALC PRO é uma ferramenta de apoio ao estudo e à rotina de Medicina Veterinária, oferecida por ${LEGAL.name}${LEGAL.doc ? ` (${LEGAL.doc})` : ''}. Ao usar o app você concorda com estes Termos e com a Política de Privacidade.`,
    ],
  },
  {
    title: '2. Ferramenta de apoio, não substitui o médico-veterinário',
    body: [
      'Cálculos, doses de referência, conteúdos de sintomas e exames, alertas, materiais bônus e respostas da Assistente IA têm finalidade educativa e de apoio. Eles não substituem o exame clínico, o julgamento profissional nem a bula do fabricante.',
      'A prescrição, a escolha da dose e a conduta são de responsabilidade exclusiva do médico-veterinário com registro ativo no CRMV. Confira sempre os dados inseridos, a concentração do produto e o resultado antes de usar.',
      'A Assistente IA pode cometer erros. Use as respostas como ponto de partida e confirme as informações relevantes.',
    ],
  },
  {
    title: '3. Conta, Premium e código de acesso',
    body: [
      'O plano grátis pode ser usado sem cadastro. O Premium é liberado com o e-mail da compra e um código de acesso pessoal e intransferível, válido pelo período contratado.',
      'O pagamento é processado pela plataforma de vendas indicada no app, conforme as regras dela. Em compras pela internet, você pode desistir em até 7 dias da contratação (art. 49 do Código de Defesa do Consumidor).',
      'Compartilhar, revender ou divulgar códigos de acesso pode levar ao cancelamento do acesso sem reembolso.',
    ],
  },
  {
    title: '4. Uso adequado',
    body: [
      'Você se compromete a usar o app de forma lícita, a não tentar burlar o controle de acesso, sobrecarregar os serviços ou copiar o conteúdo para outro produto.',
      'Ao registrar dados de pacientes e tutores, você é responsável por ter base legal para isso e por mantê-los corretos (veja a Política de Privacidade).',
    ],
  },
  {
    title: '5. Disponibilidade e serviços de terceiros',
    body: [
      'O app depende de serviços de terceiros (hospedagem, provedores de IA e banco de dados). A IA gratuita tem limites diários de uso; quando o limite acaba, o app continua funcionando no modo automático de cálculo.',
      'Podemos atualizar, alterar ou descontinuar funcionalidades para melhorar o serviço, avisando no app quando a mudança for relevante.',
    ],
  },
  {
    title: '6. Propriedade intelectual',
    body: ['Marca, código, textos, tabelas e materiais do VET CALC PRO pertencem ao responsável pelo app. Nomes comerciais de medicamentos pertencem aos respectivos fabricantes e são citados apenas para identificação.'],
  },
  {
    title: '7. Limitação de responsabilidade',
    body: [
      'Na extensão permitida pela lei, o VET CALC PRO não responde por decisões clínicas tomadas com base no app, por dados inseridos incorretamente, por perda de dados guardados apenas no aparelho sem backup, nem por indisponibilidade de serviços de terceiros.',
    ],
  },
  {
    title: '8. Alterações e foro',
    body: [
      'Estes Termos podem ser atualizados; a versão vigente fica sempre disponível no app. Fica eleito o foro do domicílio do consumidor, nos termos do Código de Defesa do Consumidor.',
      `Dúvidas: ${LEGAL.email}.`,
    ],
  },
];

const PRIVACY: Section[] = [
  {
    title: '1. Quem trata os dados',
    body: [
      `${LEGAL.name}${LEGAL.doc ? ` (${LEGAL.doc})` : ''} é o controlador dos dados da sua conta e do seu uso do app. Contato do encarregado (LGPD): ${LEGAL.email}.`,
      'Quanto aos dados de pacientes e tutores que você registra nos prontuários, você (médico-veterinário ou clínica) é o controlador, e o VET CALC PRO atua como operador, tratando esses dados apenas para prestar o serviço.',
    ],
  },
  {
    title: '2. Quais dados',
    body: [
      'Licença Premium: e-mail da compra e validade do acesso.',
      'Prontuários: dados que você digita (nome, espécie, raça, peso do animal, nome e telefone do tutor, consultas, exames, prescrições e evoluções).',
      'Mensagens da Assistente IA e relatos de evolução: o texto que você envia para gerar a resposta.',
      'Preferências locais: tema, histórico de cálculos, favoritos, nome e CRMV para a receita.',
    ],
  },
  {
    title: '3. Onde ficam guardados',
    body: [
      'No modo local, os prontuários e preferências ficam apenas no seu aparelho (armazenamento do navegador). Se o navegador for limpo, eles se perdem: use o botão Fazer backup.',
      'Quando o salvamento em nuvem estiver ativado, os prontuários ficam no banco de dados Supabase, com acesso restrito à sua conta.',
    ],
  },
  {
    title: '4. Para que usamos e base legal',
    body: [
      'Liberar o Premium e prestar o serviço contratado (execução de contrato).',
      'Gerar respostas da Assistente IA e organizar evoluções a pedido seu (execução de contrato).',
      'Segurança, prevenção de fraude e melhoria do app (legítimo interesse).',
    ],
  },
  {
    title: '5. Compartilhamento',
    body: [
      'Hospedagem (Netlify), banco de dados (Supabase, quando ativado), provedores de IA que geram as respostas (Google Gemini e Groq; Anthropic Claude na versão dentro do claude.ai) e a plataforma de pagamento. Esses fornecedores podem processar dados fora do Brasil, com as salvaguardas da LGPD.',
      'Os planos gratuitos de IA podem usar o conteúdo enviado para melhorar os serviços dos provedores. Por isso, não envie à Assistente nome, telefone, CPF ou endereço de tutores.',
      'Não vendemos dados pessoais.',
    ],
  },
  {
    title: '6. Seus direitos',
    body: [
      'Você pode pedir confirmação, acesso, correção, anonimização, portabilidade e exclusão dos seus dados, além de informações sobre compartilhamento (art. 18 da LGPD), pelo e-mail do encarregado.',
      'Os prontuários do modo local podem ser apagados por você a qualquer momento no próprio app.',
    ],
  },
  {
    title: '7. Retenção e segurança',
    body: [
      'Mantemos os dados da licença enquanto o acesso estiver ativo e pelo prazo exigido por lei. Usamos conexão segura (HTTPS), controle de acesso e o mínimo de dados necessário.',
      `Política atualizada em ${LEGAL.updatedAt}.`,
    ],
  },
];

export const LegalView: React.FC = () => {
  const [tab, setTab] = useState<'terms' | 'privacy'>('terms');
  const sections = tab === 'terms' ? TERMS : PRIVACY;
  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-16">
      <div className="bg-[var(--surface)] rounded-3xl p-5 sm:p-6 border border-[var(--border)] space-y-4">
        <h1 className="text-2xl font-extrabold text-[var(--text-main)]">Termos e Privacidade</h1>
        <div role="tablist" className="inline-flex p-1 rounded-xl bg-[var(--input-bg)] border border-[var(--border)]">
          {(
            [
              ['terms', 'Termos de Uso', FileText],
              ['privacy', 'Política de Privacidade', ShieldCheck],
            ] as const
          ).map(([id, label, Icon]) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                tab === id ? 'bg-[var(--primary)] text-[#062C23]' : 'text-[var(--text-secondary)]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
        <p className="text-xs text-[var(--text-secondary)]">Versão de {LEGAL.updatedAt}</p>
      </div>
      <div className="bg-[var(--surface)] rounded-3xl p-5 sm:p-7 border border-[var(--border)] space-y-6">
        {sections.map((s) => (
          <section key={s.title} className="space-y-2">
            <h2 className="text-base font-bold text-[var(--text-main)]">{s.title}</h2>
            {s.body.map((para, i) => (
              <p key={i} className="text-sm leading-relaxed text-[var(--text-secondary)] max-w-[65ch]">
                {para}
              </p>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
};
