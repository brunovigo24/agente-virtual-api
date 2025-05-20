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

## 📲 Uso

Configure seu provedor de WhatsApp para enviar webhooks para o endpoint:
```
POST /webhook/whatsapp
```
O corpo da requisição deve seguir o formato esperado pelo sistema.

## 📂 Estrutura do Projeto

- `src/` - Código-fonte da aplicação
- `src/config/` - Configurações da aplicação 
- `src/controllers/` - Lógica dos controladores
- `src/data/` - Modelos e dados da aplicação
- `src/interfaces/` - Interfaces e tipos TypeScript 
- `src/routes/` - Rotas da API
- `src/services/` - Serviços de negócio e integrações
- `src/utils/` - Funções utilitárias e helpers


## 🔁 Comunicação com a API
🧠 Mensagens do Sistema
- Listar mensagens:
```
GET /api/mensagens
```
Exemplo de retorno:
```
{
  "boasVindas": "mensagem",
  "menuPrincipal": "Sobre o que você quer falar ?\n🏫 Matrículas\n🎓 Coordenação\n💰 Financeiro\n📄 Documentação\n👨‍💼 Recursos Humanos\n👋 Encerrar atendimento"
}
```
- Atualizar uma mensagem:
```
PUT /api/mensagens/:chave
```
Body (JSON):
```
{
  "conteudo": "Nova mensagem personalizada"
}
```

🗺️ Menus e Submenus
- Listar menus:
Exemplo de retorno:
```
{
  "menu_principal": {
    "titulo": "Menu Principal",
    "descricao": "Escolha uma das opções abaixo:\n📝 Matrículas\n📘 Coordenação\n💰 Financeiro\n📄 Documentação\n👥 Recursos Humanos\n👋 Encerrar atendimento",
    "opcoes": [
      { "id": "1", "titulo": "Matrículas" },
      { "id": "2", "titulo": "Coordenação" },
      { "id": "3", "titulo": "Financeiro" },
      { "id": "4", "titulo": "Documentação" },
      { "id": "5", "titulo": "RH" },
      { "id": "0", "titulo": "Encerrar atendimento" }
    ]
  }
}
```

- Atualizar um menu:
```
PUT /api/menus/:id
```
Body (JSON):
```
{
  "titulo": "Menu Principal",
  "descricao": "Escolha uma das opções:",
  "opcoes": [
    { "id": "1", "titulo": "Matrículas" },
    { "id": "2", "titulo": "RH" }
  ]
}
```

📍 Destinos
- Listar destinos:
```
GET /api/destinos
```
- Atualizar número de redirecionamento:
```
PUT /api/destinos/:menu
```
Body (JSON):
```
{
  "conteudo": "Novo número"
}
```

🔄 Fluxo
- Listar fluxos:
```
GET /api/fluxo
```
- Atualizar redirecionamentos de um fluxo:
```
PATCH /api/fluxo/:etapa
```
Body (JSON):
```
{
  "1": "matriculas_infantil",
  "2": "matriculas_anos_iniciais",
  "3": "matriculas_anos_finais",
  "4": "matriculas_ensino_medio"
}
```

---

Desenvolvido por [Bruno Vigo](https://www.linkedin.com/in/bruno-vigo-506026206/).
