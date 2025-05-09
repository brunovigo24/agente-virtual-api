# Atendente Virtual CCIM

O **Atendente Virtual CCIM** é uma API desenvolvida em Node.js com Express para automação de atendimento virtual via WhatsApp. O sistema simula um fluxo de conversas automatizadas, recebendo mensagens via webhook, processando e respondendo automaticamente conforme regras definidas. Pode ser integrado a sistemas de atendimento, bots ou CRMs.

## 🖼️ Funcionalidades

- Recebe mensagens de WhatsApp via webhook (`/webhook/whatsapp`)
- Processa e registra mensagens recebidas
- Responde automaticamente conforme o fluxo definido nos serviços
- Estrutura modular para fácil expansão e customização

## 🛠️  Como baixar e executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- [Git](https://git-scm.com/)

### Passos para instalação

1. **Clone o repositório:**
   ```bash
   git clone git@github.com:brunovigo24/atendente-virtual-ccim.git
   cd atendente-virtual-ccim
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor:**
   ```bash
   npm run dev
   ```
   O servidor será iniciado na porta 3000 por padrão.

## 🔑 Variáveis de Ambiente

O sistema utiliza variáveis de ambiente para configurar a integração com a Evolution API. Você pode definir essas variáveis em um arquivo `.env` na raiz do projeto ou diretamente no ambiente de execução:

- `EVOLUTION_API_URL` - URL base da API Evolution (exemplo: `http://172.26.0.4:8080`)
- `EVOLUTION_API_KEY` - Chave de API para autenticação
- `EVOLUTION_INSTANCE_NAME` - Nome da instância configurada na Evolution

Se não definidas, valores padrão serão utilizados conforme o código fonte.

### 🗄️ Banco de Dados

O sistema utiliza MySQL com as seguintes tabelas principais:
- `clientes` - Armazena informações dos clientes
- `conversas` - Registro das conversas ativas
- `mensagens` - Histórico de mensagens
- `etapas` - Controle do fluxo de navegação

### 🤖 Integração Evolution API

O sistema integra com a Evolution API para:
- Envio de mensagens de texto
- Envio de listas interativas
- Gerenciamento de instâncias WhatsApp

## Uso

Configure seu provedor de WhatsApp para enviar webhooks para o endpoint:
```
POST /webhook/whatsapp
```
O corpo da requisição deve seguir o formato esperado pelo sistema.

## 📂 Estrutura do Projeto

- `src/` - Código-fonte da aplicação
- `src/routes/` - Rotas da API
- `src/controllers/` - Lógica dos controladores
- `src/services/` - Serviços de negócio e integrações

---

Desenvolvido por [Bruno Vigo](https://www.linkedin.com/in/bruno-vigo-506026206/).
