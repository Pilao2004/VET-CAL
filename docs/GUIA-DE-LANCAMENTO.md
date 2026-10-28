# Guia de lançamento do VET CALC PRO

O que falta para começar a vender, em ordem. Tudo o que dependia de código já está pronto no repositório.

---

## 1. Revisão clínica (você, como médico-veterinário)

O conteúdo foi escrito com base em referências da literatura veterinária (incluindo as diretrizes RECOVER), mas precisa do seu aval antes de ser vendido. Leia e me diga no chat o que corrigir; eu altero e publico.

| O que revisar | Onde aparece no app | Arquivo |
|---|---|---|
| 19 fármacos de emergência: dose por kg (cão e gato), concentração padrão, via e observações | Calculadoras > Tabela de Emergência; Guia de Urgências (PDF) | `src/data/emergencyDrugs.ts` |
| Texto do Guia de Urgências e do Checklist de Anamnese | Bônus > PDFs | `src/utils/bonusPdfs.ts` |
| 10 sintomas: perguntas, diferenciais, exames, sinais de alerta e dicas | Sintomas | `src/data/symptoms.ts` |
| Alertas de segurança por espécie | Resultado da calculadora e Assistente | `src/utils/safetyRules.ts` |
| Valores de referência de 20 parâmetros laboratoriais (cão e gato) | Exames | `src/data/labTests.ts` |
| Doses padrão das apresentações mais usadas na sua rotina (amostragem) | Calculadora de medicamentos e Assistente | `src/data/commercialProducts.ts` |
| Instruções de comportamento da Assistente IA | Assistente IA | `src/services/vetAssistantAI.ts` (função `buildRules`) |

Sugestão: comece pela Tabela de Emergência e pelos alertas, que são os itens de maior risco.

---

## 2. Deixar o repositório privado

GitHub > repositório **VET-CAL** > **Settings** > **General** > no fim da página, **Change visibility** > **Private**. O Netlify continua funcionando normalmente.

---

## 3. Publicar no Netlify pelo GitHub

Arrastar a pasta deixa de fora a IA e a ativação do Premium. Use o GitHub:

1. Netlify > site **vetcalculatorpro** > **Site configuration** > **Build & deploy** > **Link repository** > GitHub > **VET-CAL**.
2. As configurações de build vêm do arquivo `netlify.toml` (comando `npm run build`, pasta `dist`).
3. A partir daí, cada alteração enviada ao GitHub é publicada sozinha.

---

## 4. Variáveis de ambiente

Netlify > **Site configuration** > **Environment variables** > **Add a variable**. Depois de adicionar ou mudar qualquer uma, faça um novo deploy (**Deploys** > **Trigger deploy**).

### Obrigatórias

| Variável | O que colocar |
|---|---|
| `LICENSE_SECRET` | Uma senha longa e aleatória (mínimo 32 caracteres; use um gerador de senhas). **Nunca compartilhe e não mude depois de começar a vender**: mudar invalida todos os códigos já entregues. |
| `ADMIN_PASSWORD` | A senha da sua página de geração de códigos. |
| `GEMINI_API_KEY` | Chave criada em aistudio.google.com/apikey, num projeto **sem faturamento ativado** (plano gratuito). |
| `GROQ_API_KEY` | Chave criada em console.groq.com > API Keys (gratuita, sem cartão). É a IA de reserva. |
| `VITE_KIWIFY_CHECKOUT_URL` | Link do checkout do produto na Kiwify. |
| `VITE_HOTMART_CHECKOUT_URL` | Link do checkout do produto na Hotmart. Pode usar só uma das duas plataformas. |
| `VITE_PRICE_LABEL` | Preço mostrado na página de vendas, por exemplo `R$ 97,00`. |
| `KIWIFY_TOKEN` | Token do webhook criado na Kiwify (passo 6). |
| `HOTMART_HOTTOK` | Hottok da sua conta Hotmart (passo 6). |
| `VITE_LEGAL_NAME` | Seu nome completo ou razão social (aparece nos Termos e na Política de Privacidade). |
| `VITE_LEGAL_DOC` | Seu CPF ou CNPJ (opcional, recomendado). |
| `VITE_LEGAL_EMAIL` | E-mail de contato para assuntos de privacidade (padrão: suporte.vetcalcpro@gmail.com). |

### Opcionais

| Variável | Para que serve |
|---|---|
| `VITE_PRICE_FROM_LABEL` | Preço "de", riscado, ex.: `R$ 197,00`. |
| `PROMO_KEYS` | Códigos de campanha válidos para qualquer e-mail, no formato `CODIGO:AAAAMMDD`, separados por vírgula. Ex.: `LANCAMENTO:20261231`. |
| `GEMINI_MODELS` / `GROQ_MODEL` | Trocar os modelos de IA, se o Google ou o Groq aposentarem os atuais. |
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` | Ativam os prontuários na nuvem (passo 7). |

---

## 5. Testar o site depois do deploy

- [ ] O site abre na página de vendas, com o preço e os botões de compra.
- [ ] Faça uma compra de teste (ou use o webhook de teste da plataforma) e confira em **Avisos de venda** na página `admin-licencas.html` se aparece "acesso liberado".
- [ ] Na página de vendas, toque em **Já comprei**, informe o e-mail e o nº do pedido: o app abre e pede o aceite dos Termos.
- [ ] Na Assistente, envie "Bom dia" com as opções Padrão, Gemini e Groq.
- [ ] No celular: menu do navegador > **Adicionar à tela inicial**, abra pelo ícone e teste sem internet (calculadoras e biblioteca funcionam).

---

## 6. Vendendo (compra única, liberação automática)

O app inteiro é pago. Quem entra no site vê a página de vendas; depois de pagar, libera o acesso para sempre. Reembolso ou chargeback bloqueia o acesso automaticamente; uma nova compra libera de novo.

### Kiwify
1. Crie o produto com **pagamento único** e copie o link do checkout para `VITE_KIWIFY_CHECKOUT_URL`.
2. **Apps** > **Webhooks** > **Criar webhook**: URL `https://vetcalculatorpro.netlify.app/api/webhooks/kiwify`, produto VET CALC PRO, eventos **Compra aprovada**, **Reembolso** e **Chargeback**.
3. Copie o **token** do webhook para `KIWIFY_TOKEN` e faça um novo deploy.

### Hotmart
1. Crie o produto com **pagamento único** e copie o link do checkout para `VITE_HOTMART_CHECKOUT_URL`.
2. **Ferramentas** > **Webhook (API e notificações)** > **Cadastrar webhook**: URL `https://vetcalculatorpro.netlify.app/api/webhooks/hotmart`, versão 2.0, eventos **Compra aprovada**, **Compra completa**, **Compra reembolsada**, **Chargeback** e **Compra cancelada**.
3. Copie o **Hottok** da mesma tela para `HOTMART_HOTTOK` e faça um novo deploy.

### Página de obrigado (recomendado)
Nas duas plataformas, configure a página de obrigado/redirecionamento para `https://vetcalculatorpro.netlify.app/?ativar=1`. O comprador cai direto no formulário **Já comprei**.

### Conferir e resolver problemas
- `admin-licencas.html` > **Avisos de venda**: mostra os últimos avisos recebidos e o status de um e-mail.
- Se um aviso não chegou, gere um código manual na mesma página e envie ao comprador; ele usa **Já comprei** > **Recebi um código de acesso**.
- Após o reembolso, o app bloqueia na próxima vez que o comprador abrir com internet (no máximo em 7 dias se ficar offline).

## 7. Prontuários na nuvem (opcional, gratuito)

Sem isso, os prontuários ficam só no aparelho de cada cliente (com botão de backup).

1. Crie uma conta em supabase.com e um projeto novo (plano gratuito).
2. No projeto: **SQL Editor** > cole o conteúdo do arquivo `supabase/schema.sql` do repositório > **Run**.
3. **Project Settings** > **API**: copie a **Project URL** e a chave **anon public**.
4. No Netlify, crie `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` com esses valores e faça um novo deploy.
5. No app, cada cliente cria a conta em **Perfil** e os prontuários passam a sincronizar.

---

## 8. Cuidados finais

- **Termos e Política de Privacidade:** o texto cobre os pontos principais da LGPD e do Código de Defesa do Consumidor, mas vale uma revisão rápida por um advogado antes de escalar as vendas.
- **Imagens:** confirme que a foto da tela inicial pode ser usada comercialmente (ou troque por uma de banco gratuito com licença comercial, como Unsplash ou Pexels).
- **Marcas:** o app não usa mais o nome de concorrentes. Nomes comerciais de medicamentos são citados apenas para identificar os produtos.
