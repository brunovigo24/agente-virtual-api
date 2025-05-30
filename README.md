# Agente Virtual CCIM

O **Agente Virtual CCIM** é uma API desenvolvida em Node.js com Express para automação de atendimento virtual via WhatsApp. O sistema simula um fluxo de conversas automatizadas, recebendo mensagens via webhook, processando e respondendo automaticamente conforme regras definidas. Pode ser integrado a sistemas de atendimento, bots ou CRMs.

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
- `EVOLUTION_API_HASH` - Hash para autenticação
- `EVOLUTION_INSTANCE_NAME` - Nome da instância configurada na Evolution
- `EVOLUTION_API_KEY` - Senha da evolution API


Se não definidas, valores padrão serão utilizados conforme o código fonte.

### 🗄️ Banco de Dados

O sistema utiliza MySQL com as seguintes tabelas principais:
- `acoes_automatizadas` - Controle e registro de ações automatizadas
- `clientes` - Armazena informações dos clientes
- `conversas` - Registro das conversas ativas
- `mensagens` - Histórico de mensagens
- `etapas` - Controle do fluxo de navegação
- `users` - Controle e registro de usuários do sistema

## 📂 Estrutura do Projeto

- `src/` - Código-fonte da aplicação
- `src/config/` - Configurações da aplicação 
- `src/controllers/` - Lógica dos controladores
- `src/data/` - Modelos e dados da aplicação
- `src/interfaces/` - Interfaces e tipos TypeScript
- `src/middlewares/` - Middlewares
- `src/routes/` - Rotas da API
- `src/services/` - Serviços de negócio e integrações
- `src/utils/` - Funções utilitárias e helpers

## 🤖 Integração Evolution API
O sistema integra com a Evolution API para:

- Envio de mensagens de texto
- Envio de listas interativas
- Gerenciamento de instâncias WhatsApp


## 🔁 Comunicação com a API
Abaixo estão os principais endpoints disponíveis para interação com a API:

🔐  Autenticação
- ``` POST /api/auth/login ```

    Envia username e password, retorna um token Bearer para autenticação nas demais rotas.

📋 Menus e Fluxos
- ``` GET /api/menus ```

    Retorna todos os menus e submenus do sistema.

- ``` PUT /api/menus/:id ```
    
    Salva alterações nos fluxos de menu.

- ``` GET /api/fluxo ```
    
    Lista todos os fluxos do sistema.

- ``` PATCH /api/fluxo/:etapa ```

    Atualiza parcialmente uma etapa do fluxo.

💬 Mensagens
- ``` GET /api/mensagens ```

    Retorna todas as mensagens cadastradas no sistema.

- ``` PUT /api/mensagens/:chave ```

    Atualiza o texto de uma mensagem específica.

📞 Redirecionamentos
- ``` GET /api/destinos ```

    Lista os destinos de redirecionamento.

- ``` PUT /api/destinos/:menu ```
    
    Altera o número de redirecionamento de um menu específico.

🧩 Evolution API (Instâncias)
- ``` POST /api/evolution/instance/create ```

    Cria uma nova instância no Evolution API.

- ``` POST /api/evolution/instance/connect/:nome ```

    Gera QR code e código de pareamento para uma instância específica.

- ``` GET /api/evolution/instance/fetchInstances ```

    Lista todas as instâncias existentes.

- ``` DELETE /api/evolution/instance/delete/:instance ```
    
    Remove uma instância da Evolution API.

- ``` DELETE /api/evolution/instance/logout/:instance ```

    Faz logout da instância especificada.
---

Desenvolvido por [Bruno Vigo](https://www.linkedin.com/in/bruno-vigo-506026206/).
