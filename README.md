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

### 🐳 Passos para executar via Docker

1. **Construa e inicie os containers:**

   ```bash
    docker-compose up --build
   ```
2. **Acesse a aplicação:**

   ```arduino
    http://localhost:3000
   ```

3. **Limpar volumes e imagens (opcional):**
Se quiser remover tudo (containers, volumes e imagens associadas):

   ```bash
    docker-compose down --volumes --rmi all
   ```

## 🔑 Variáveis de Ambiente

Defina as variáveis em um arquivo `.env` na raiz do projeto ou diretamente no ambiente de execução:

- `EVOLUTION_API_URL` - URL base da Evolution API (ex.: `http://localhost:8080`)
- `EVOLUTION_API_KEY` - chave de API para operações administrativas (criação/gerência de instâncias)
- `EVOLUTION_INSTANCE_NAME` - nome da instância padrão 
- `EVOLUTION_API_HASH` - hash de instância (se aplicável/externo; não usado diretamente pelo código)
- `WEBHOOK_URL` - URL pública do webhook do bot (ex.: `http://localhost:3000/webhook/whatsapp`)
- `JWT_SECRET` - segredo para assinar tokens JWT

- `DB_HOST` - host do MySQL (padrão: `127.0.0.1`)
- `DB_DATABASE` - nome do banco (padrão: `app_db`)
- `DB_USER` - usuário do banco (padrão: `root`)
- `DB_PASSWORD` - senha do banco
- `DB_PORT` - porta (padrão: `3306`)

- `MINIO_ENDPOINT` - endpoint do MinIO (ex.: `http://localhost:9000`)
- `MINIO_ACCESS_KEY` - access key do MinIO
- `MINIO_SECRET_KEY` - secret key do MinIO
- `MINIO_BUCKET` - bucket para armazenamento (padrão: `app-media`)

- `WHATSAPP_TEST_NUMBER` - número de teste (opcional, usado para filtrar mensagens em homologação)

Se não definidas, valores padrão seguros de desenvolvimento serão utilizados conforme o código fonte.

### 🗄️ Banco de Dados

O sistema utiliza MySQL com as seguintes tabelas principais:
- `acoes_automatizadas` - Controle e registro de ações automatizadas
- `clientes` - Armazena informações dos clientes
- `conversas` - Registro das conversas ativas
- `mensagens` - Histórico de mensagens
- `etapas` - Controle do fluxo de navegação
- `users` - Controle e registro de usuários do sistema

### 📁 Armazenamento de Arquivos (MinIO)

O sistema utiliza MinIO (compatível com S3) para armazenar mídias recebidas/enviadas:
- Arquivos de mídia (imagens, vídeos, documentos) são armazenados no bucket configurado em `MINIO_BUCKET` (padrão: `app-media`).
- Configure via variáveis: `MINIO_ENDPOINT`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`, `MINIO_BUCKET`.

Exemplo de execução local do MinIO via Docker (desenvolvimento):

```bash
docker run -p 9000:9000 -p 9001:9001 \
  -e MINIO_ROOT_USER=minioadmin \
  -e MINIO_ROOT_PASSWORD=minioadmin \
  -v $(pwd)/.minio/data:/data \
  -v $(pwd)/.minio/config:/root/.minio \
  quay.io/minio/minio server /data --console-address ":9001"
```

Exemplo de variáveis no `.env`:

```bash
MINIO_ENDPOINT=http://localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=app-media
```

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
