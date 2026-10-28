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
| `VITE_CHECKOUT_URL` | Link da página de compra do produto na Hotmart ou Kiwify. |
| `VITE_PRICE_LABEL` | Texto do preço mostrado no app, por exemplo `R$ 19,90/mês`. |
| `VITE_LEGAL_NAME` | Seu nome completo ou razão social (aparece nos Termos e na Política de Privacidade). |
| `VITE_LEGAL_DOC` | Seu CPF ou CNPJ (opcional, recomendado). |
| `VITE_LEGAL_EMAIL` | E-mail de contato para assuntos de privacidade (padrão: suporte.vetcalcpro@gmail.com). |

### Opcionais

| Variável | Para que serve |
|---|---|
| `PROMO_KEYS` | Códigos de campanha válidos para qualquer e-mail, no formato `CODIGO:AAAAMMDD`, separados por vírgula. Ex.: `LANCAMENTO:20261231`. |
| `PREMIUM_AI` | Coloque `off` para liberar a IA também no plano grátis. |
| `GEMINI_MODELS` / `GROQ_MODEL` | Trocar os modelos de IA, se o Google ou o Groq aposentarem os atuais. |
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` | Ativam os prontuários na nuvem (passo 7). |

---

## 5. Testar o site depois do deploy

- [ ] O site abre e pede o aceite dos Termos.
- [ ] Sem Premium: Assistente, Pacientes, Tabela de Emergência, Infusão contínua, Transfusão, Superfície corporal, Receita e PDFs dos bônus aparecem bloqueados.
- [ ] Abra `https://vetcalculatorpro.netlify.app/admin-licencas.html`, gere um código para o seu e-mail e ative no app (menu > Seja Premium > Já comprei).
- [ ] Com Premium: tudo libera; na Assistente, envie "Bom dia" com as opções Padrão, Gemini e Groq.
- [ ] No celular: menu do navegador > **Adicionar à tela inicial**, abra pelo ícone e teste sem internet (calculadoras e biblioteca funcionam).

---

## 6. Vendendo

1. Crie o produto na Hotmart ou na Kiwify (assinatura mensal, anual ou acesso vitalício) e coloque o link em `VITE_CHECKOUT_URL`.
2. A cada venda, abra `/admin-licencas.html`, digite a senha de administrador e o e-mail do comprador, escolha a validade e clique em **Gerar código**.
3. Clique em **Copiar mensagem para o comprador** e envie por e-mail ou WhatsApp. A mensagem já explica como ativar.
4. Renovação: gere um novo código com a nova validade para o mesmo e-mail.

Mais adiante, dá para automatizar o envio do código com o webhook da Hotmart ou da Kiwify. Peça quando o volume de vendas justificar.

---

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
