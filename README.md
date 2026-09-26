# <img src="frontend/public/favicon.svg" alt="Logo Resolve Aí" width="30" height="30" /> Resolve Aí

> Plataforma Full Stack para registro, acompanhamento e gestão de ocorrências.

## 🌐 Aplicação em produção

Acesse o Resolve Aí em [resolveai.primellout.com](https://resolveai.primellout.com/).

O **Resolve Aí** é uma aplicação web desenvolvida para centralizar o registro, acompanhamento e gerenciamento de problemas do dia a dia em ambientes como condomínios, empresas, bairros e organizações.

A plataforma permite que usuários registrem ocorrências, acompanhem seu andamento e interajam com os responsáveis pela resolução. Gestores possuem uma visão administrativa para analisar ocorrências, definir prioridades, atribuir responsáveis, atualizar status, registrar soluções e acompanhar indicadores.

---

## 📌 Sobre o projeto

O Resolve Aí foi desenvolvido com foco em uma experiência simples para quem precisa **registrar um problema** e em uma visão mais completa para quem precisa **gerenciar e solucionar esses problemas**.

A aplicação possui dois perfis de acesso:

* **Solicitante:** registra e acompanha suas próprias ocorrências.
* **Gestor:** administra as ocorrências da plataforma e acompanha seus indicadores.

Cada ocorrência possui um ciclo de vida, histórico de alterações, comentários e, quando resolvida, pode receber uma avaliação do solicitante.

---

## 🎯 Problema

Em muitos ambientes, problemas são comunicados por diferentes canais, como mensagens, e-mails ou conversas informais.

Isso pode dificultar:

* o registro das solicitações;
* a priorização dos problemas;
* o acompanhamento do andamento;
* a definição de responsáveis;
* o histórico das alterações;
* a comunicação entre solicitante e responsável;
* a avaliação da resolução.

O **Resolve Aí** centraliza esse processo em uma única plataforma.

---

## 💡 Solução

A plataforma organiza o fluxo de uma ocorrência desde seu registro até sua resolução.

### Fluxo principal

```text
Solicitante
    │
    ▼
Criação da ocorrência
    │
    ▼
Ocorrência aberta
    │
    ▼
Análise pelo gestor
    │
    ▼
Atribuição de responsável
    │
    ▼
Atendimento
    │
    ├──────────────► Cancelada
    │
    ▼
Resolução
    │
    ▼
Avaliação do solicitante
```

O histórico registra as alterações de status realizadas durante esse processo.

---

## ✨ Funcionalidades

### 👤 Solicitante

* [x] Criar uma conta
* [x] Autenticar-se na plataforma
* [x] Visualizar suas ocorrências
* [x] Registrar uma nova ocorrência
* [x] Informar título
* [x] Informar descrição
* [x] Selecionar categoria
* [x] Informar localização
* [x] Adicionar imagem
* [x] Acompanhar o status da ocorrência
* [x] Visualizar prioridade
* [x] Visualizar responsável atribuído
* [x] Consultar histórico de alterações
* [x] Adicionar comentários
* [x] Visualizar comentários
* [x] Visualizar a solução registrada
* [x] Avaliar uma ocorrência resolvida
* [x] Informar nota de 1 a 5
* [x] Adicionar comentário à avaliação

### 🧑‍💼 Gestor

* [x] Autenticar-se na plataforma
* [x] Visualizar todas as ocorrências
* [x] Pesquisar ocorrências
* [x] Filtrar por categoria
* [x] Filtrar por status
* [x] Filtrar por prioridade
* [x] Visualizar detalhes da ocorrência
* [x] Alterar prioridade
* [x] Atribuir responsável
* [x] Atualizar status
* [x] Registrar observação durante alteração de status
* [x] Adicionar comentários
* [x] Visualizar histórico
* [x] Registrar a solução aplicada
* [x] Visualizar indicadores no dashboard

---

## 🔄 Ciclo de vida da ocorrência

Uma ocorrência pode assumir os seguintes estados:

| Status           | Descrição                                  |
| ---------------- | ------------------------------------------ |
| `ABERTA`         | Ocorrência registrada e aguardando análise |
| `EM_ANALISE`     | Ocorrência sendo analisada                 |
| `EM_ATENDIMENTO` | Ocorrência em processo de atendimento      |
| `RESOLVIDA`      | Problema solucionado                       |
| `CANCELADA`      | Ocorrência cancelada                       |

Cada alteração de status gera um registro no histórico contendo:

* status anterior;
* novo status;
* data e horário;
* usuário responsável pela alteração;
* observação.

---

## 🚨 Prioridades

As ocorrências podem possuir diferentes níveis de prioridade:

| Prioridade | Descrição                                |
| ---------- | ---------------------------------------- |
| `BAIXA`    | Problema de menor urgência               |
| `MEDIA`    | Problema que requer atenção              |
| `ALTA`     | Problema prioritário                     |
| `URGENTE`  | Problema que requer atendimento imediato |

---

## 🗂️ Categorias

A aplicação possui categorias para facilitar a organização das ocorrências:

* 💡 Iluminação
* 🔧 Equipamento
* ♿ Acessibilidade
* 🧹 Limpeza
* 💧 Vazamento
* 🛡️ Segurança
* 🔨 Manutenção
* 📌 Outro

---

## 🏗️ Arquitetura

O projeto utiliza uma arquitetura dividida entre frontend e backend:

```text
resolve-ai/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── dtos/
│   │   ├── middlewares/
│   │   ├── prisma/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   │
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── ...
│   │
│   └── ...
│
└── docker-compose.yml
```

A comunicação entre frontend e backend é realizada através de uma **API REST**.

---

## 🛠️ Tecnologias

### Frontend

* React
* TypeScript
* Vite
* React Router
* Axios
* Lucide React
* CSS

### Backend

* Node.js
* TypeScript
* Express
* Prisma ORM
* Zod
* JWT
* bcryptjs

### Banco de dados

* PostgreSQL

### Testes

* Vitest
* Supertest

### Infraestrutura

* Docker
* Docker Compose

---

## 🔐 Autenticação e autorização

A autenticação utiliza **JWT (JSON Web Token)**.

Após o login, o token é armazenado no frontend e enviado nas requisições autenticadas através do header:

```http
Authorization: Bearer <token>
```

O backend possui controle de acesso baseado no perfil do usuário.

### Solicitante

Um solicitante pode:

* visualizar suas próprias ocorrências;
* criar ocorrências;
* adicionar comentários nas próprias ocorrências;
* consultar histórico;
* avaliar suas ocorrências resolvidas.

### Gestor

Um gestor pode:

* visualizar todas as ocorrências;
* alterar prioridade;
* atribuir responsáveis;
* atualizar status;
* registrar soluções;
* adicionar comentários;
* visualizar indicadores.

Além do controle no frontend, as permissões são verificadas no backend.

---

# 🌐 API

A API está organizada por recursos.

## 🔑 Autenticação

### Criar conta

```http
POST /auth/register
```

### Login

```http
POST /auth/login
```

---

## 📋 Ocorrências

### Criar ocorrência

```http
POST /occurrences
```

### Listar ocorrências

```http
GET /occurrences
```

### Filtros disponíveis

* `category`
* `status`
* `priority`
* `page`
* `limit`

### Exemplo

```http
GET /occurrences?status=EM_ATENDIMENTO&priority=ALTA
```

### Visualizar ocorrência

```http
GET /occurrences/:id
```

### Alterar prioridade

```http
PATCH /occurrences/:id/priority
```

### Atribuir responsável

```http
PATCH /occurrences/:id/responsible
```

### Alterar status

```http
PATCH /occurrences/:id/status
```

### Registrar solução

```http
PATCH /occurrences/:id/solution
```

---

## 📜 Histórico

### Consultar histórico

```http
GET /occurrences/:id/history
```

Cada alteração de status mantém informações sobre a transição realizada.

### Exemplo conceitual

```json
{
  "previousStatus": "ABERTA",
  "newStatus": "EM_ANALISE",
  "observation": "Ocorrência encaminhada para análise."
}
```

---

## 💬 Comentários

### Listar comentários

```http
GET /occurrences/:id/comments
```

### Adicionar comentário

```http
POST /occurrences/:id/comments
```

### Exemplo

```json
{
  "content": "O problema continua acontecendo."
}
```

---

## ⭐ Avaliação

### Avaliar ocorrência

```http
POST /occurrences/:id/rating
```

### Exemplo

```json
{
  "score": 5,
  "comment": "Problema resolvido rapidamente."
}
```

A avaliação possui nota de **1 a 5** e só pode ser realizada pelo solicitante da ocorrência depois que ela estiver marcada como `RESOLVIDA`.

Cada ocorrência pode receber uma única avaliação.

---

## 👥 Gestores

### Listar gestores

```http
GET /users/gestores
```

Esse endpoint é utilizado para permitir que um gestor atribua uma ocorrência a outro gestor responsável.

---

## 📊 Dashboard

### Indicadores

```http
GET /dashboard
```

O dashboard disponibiliza indicadores relacionados às ocorrências, incluindo:

* total de ocorrências;
* distribuição por status;
* distribuição por prioridade;
* distribuição por categoria.

---

# 🗄️ Banco de dados

O projeto utiliza **PostgreSQL** como banco de dados e **Prisma** para acesso e modelagem.

### Principais modelos

* `User`
* `Occurrence`
* `OccurrenceHistory`
* `Comment`
* `Rating`

### Relacionamentos principais

```text
User
 ├── solicita → Occurrence
 ├── gerencia → Occurrence
 ├── comenta → Comment
 ├── altera status → OccurrenceHistory
 └── avalia → Rating

Occurrence
 ├── possui → History
 ├── possui → Comments
 └── possui → Rating
```

---

# ⚙️ Configuração do ambiente

## Pré-requisitos

Para executar o projeto localmente, é necessário ter instalado:

* Node.js
* Yarn
* Docker
* Docker Compose

---

## 📥 Instalação

Clone o repositório:

```bash
git clone <https://github.com/MellPecanha/resolve-ai>
```

Entre no projeto:

```bash
cd resolve-ai
```

---

## 🔙 Backend

Entre na pasta:

```bash
cd backend
```

Instale as dependências:

```bash
yarn install
```

Configure as variáveis de ambiente no arquivo:

```text
backend/.env
```

### Exemplo

```env
DATABASE_URL=postgresql://resolveai:resolveai@localhost:5432/resolveai
JWT_SECRET=seu_secret
S3_PUBLIC_ENDPOINT=http://localhost:9001
S3_BUCKET=occurrence-images
S3_ACCESS_KEY=resolveai
S3_SECRET_KEY=resolveai-rustfs-password
S3_CORS_ORIGIN=http://localhost:5173
```

---

## 🐳 Serviços locais com Docker

Na raiz do projeto:

```bash
docker compose up -d
```

Isso inicia o PostgreSQL e o RustFS, o storage de objetos compatível com S3. O backend cria o bucket privado `occurrence-images` e configura o CORS automaticamente na primeira inicialização.

Para acesso local, a API S3 do RustFS fica em `http://localhost:9001` e o console administrativo em `http://localhost:9002`.

Para verificar os containers:

```bash
docker ps
```

---

# 🌱 Seed

O projeto possui um **seed** para facilitar a criação de dados de demonstração.

O seed cria usuários, ocorrências, históricos, comentários, soluções e avaliações para permitir testar a aplicação com dados reais.

As contas criadas pelo seed utilizam a senha:

```text
123456
```

Após configurar o banco, execute o seed através do comando definido no backend.

Consulte os scripts disponíveis no `package.json` do backend para executar o seed na versão atual do projeto.

---

# ▶️ Executando o projeto

## Backend

Na pasta `backend`:

```bash
yarn dev
```

O servidor é executado por padrão em:

```text
http://localhost:3333
```

---

## Frontend

Em outro terminal:

```bash
cd frontend
```

Instale as dependências:

```bash
yarn install
```

Execute:

```bash
yarn dev
```

O frontend será disponibilizado pelo Vite, normalmente em:

```text
http://localhost:5173
```

---

## 🔑 Variáveis de ambiente

No frontend, a URL da API pode ser configurada através de:

```env
VITE_API_URL=http://localhost:3333
```

Caso a variável não seja definida, a aplicação utiliza a URL padrão configurada no projeto.

Em produção, configure `S3_PUBLIC_ENDPOINT` com a URL HTTPS que o navegador consegue alcançar, por exemplo `https://storage.seudominio.com`, e `S3_CORS_ORIGIN` com a origem pública do frontend. O bucket permanece privado e as imagens são entregues por URLs assinadas de curta duração.

---

# 🧪 Testes

O backend possui testes automatizados utilizando **Vitest** e **Supertest**.

Para executar:

```bash
cd backend
yarn test
```

Os testes cobrem principalmente:

* autenticação;
* criação de ocorrências;
* consulta de ocorrências;
* permissões;
* alteração de status;
* prioridade;
* responsável;
* histórico;
* comentários;
* avaliações;
* dashboard.

---

# 📦 Build

Para validar a compilação do frontend:

```bash
cd frontend
yarn build
```

O processo executa a verificação TypeScript e o build de produção através do Vite.

---

# 🎨 Interface

A interface foi construída com foco em:

* simplicidade;
* clareza das informações;
* hierarquia visual;
* navegação objetiva;
* responsividade;
* feedback das ações;
* diferenciação entre as experiências de solicitante e gestor.

A aplicação utiliza uma interface em **dark mode**, com componentes reutilizáveis, cards, badges, indicadores e ícones para representar ações e estados.

---

# 🛡️ Segurança

Entre as medidas implementadas estão:

* autenticação baseada em JWT;
* senhas armazenadas com hash;
* autorização baseada em perfil;
* validação de dados com Zod;
* proteção das rotas autenticadas;
* validação das permissões também no backend;
* separação de responsabilidades entre controllers e services.

---

# 📐 Regras de negócio

## Ocorrências

* Solicitantes visualizam apenas suas próprias ocorrências.
* Gestores podem visualizar todas as ocorrências.
* Apenas gestores podem alterar prioridade.
* Apenas gestores podem atribuir responsáveis.
* O responsável atribuído deve possuir perfil de gestor.
* Apenas gestores podem alterar o status.
* Uma alteração para o mesmo status não é permitida.
* Toda alteração de status gera um registro no histórico.

## Comentários

* Solicitantes podem comentar suas próprias ocorrências.
* Gestores podem comentar ocorrências.
* Comentários possuem autor e data de criação.

## Avaliações

* Apenas o solicitante da ocorrência pode avaliá-la.
* A ocorrência precisa estar `RESOLVIDA`.
* A nota deve estar entre 1 e 5.
* Cada ocorrência pode receber apenas uma avaliação.

---

# 🧩 Estrutura de responsabilidades

A aplicação segue uma separação entre camadas para facilitar manutenção e evolução.

```text
Routes
   ↓
Controllers
   ↓
Services
   ↓
Prisma / Database
```

### Routes

Responsáveis pelo mapeamento dos endpoints.

### Controllers

Responsáveis por receber as requisições e devolver as respostas HTTP.

### Services

Concentram as regras de negócio.

### DTOs

Responsáveis pela validação dos dados recebidos pela API.

### Prisma

Responsável pela comunicação com o PostgreSQL.

---

# 🎯 Objetivos técnicos

O projeto foi desenvolvido com foco em práticas como:

* TypeScript;
* arquitetura modular;
* API REST;
* autenticação e autorização;
* validação de dados;
* separação de responsabilidades;
* persistência relacional;
* testes automatizados;
* containerização;
* componentização no frontend;
* tipagem compartilhada entre serviços;
* tratamento de erros;
* responsividade.

---

# 🗺️ Roadmap

Algumas evoluções que podem ser incorporadas futuramente:

* [ ] Upload real de imagens para armazenamento em Cloud
* [ ] Notificações em tempo real
* [ ] Paginação visual avançada
* [ ] Busca mais abrangente
* [ ] Exportação de relatórios
* [ ] Histórico de ações administrativas
* [ ] Melhorias nos indicadores do dashboard
* [ ] Deploy em ambiente Cloud
* [ ] Pipeline de CI/CD
* [ ] Monitoramento e observabilidade

---

# 📌 Status

O projeto possui os principais fluxos funcionais implementados, incluindo:

* autenticação;
* gerenciamento de ocorrências;
* controle de acesso por perfil;
* histórico;
* comentários;
* avaliações;
* dashboard.

A arquitetura foi estruturada para permitir a evolução da aplicação sem depender de alterações concentradas em uma única camada.

---

# 📄 Licença

Este projeto está disponível para fins de **estudo, demonstração de conhecimento técnico e portfólio**.

---

# 💻 Desenvolvido com

| Tecnologia         | Uso             |
| ------------------ | --------------- |
| React + TypeScript | Frontend        |
| Node.js + Express  | Backend         |
| Prisma             | ORM             |
| PostgreSQL         | Banco de dados  |
| Docker             | Containerização |
| Vitest + Supertest | Testes          |

---

<div align="center">

**Resolve Aí**

Plataforma de Gestão de Ocorrências

</div>
