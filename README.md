# Resolve Aí

### Plataforma de Gestão de Ocorrências

O **Resolve Aí** é uma plataforma para **registro, gerenciamento e acompanhamento de ocorrências**, criada para centralizar informações, organizar processos e facilitar o acompanhamento de cada ocorrência desde sua abertura até a resolução.

A plataforma permite que ocorrências sejam registradas de forma estruturada, acompanhadas por diferentes etapas e tenham suas alterações registradas ao longo do tempo, proporcionando **rastreabilidade, organização e transparência** no processo de resolução.

---

## Objetivo

O Resolve Aí busca simplificar o gerenciamento de ocorrências através de um fluxo centralizado e organizado.

A plataforma estrutura o ciclo de uma ocorrência em diferentes etapas:

**Registro → Análise → Tratamento → Resolução**

Cada ocorrência possui informações próprias, responsáveis e um histórico de alterações, permitindo acompanhar sua evolução e identificar o estado atual de cada caso.

---

## Funcionalidades

### Usuários e autenticação

* [x] Cadastro de usuários
* [x] Autenticação
* [x] Controle de acesso
* [x] Gerenciamento de sessão
* [x] Proteção de rotas

### Ocorrências

* [x] Criação de ocorrências
* [x] Visualização de ocorrência
* [x] Listagem de ocorrências
* [x] Atualização de ocorrências
* [ ] Exclusão de ocorrências
* [x] Identificação da ocorrência por status
* [x] Associação de responsável
* [x] Registro de informações relevantes para o atendimento

### Gestão de status

* [x] Controle do ciclo de vida da ocorrência
* [x] Atualização de status
* [ ] Validação das transições de status
* [x] Registro das alterações de status

### Histórico

* [x] Registro das alterações realizadas
* [x] Histórico de status
* [x] Identificação do usuário responsável pela alteração
* [x] Registro de data e hora das alterações

### Consulta e organização

* [x] Listagem estruturada
* [x] Filtros por status
* [x] Consulta de ocorrências
* [ ] Busca avançada
* [ ] Paginação

### Dashboard

* [x] Visão geral das ocorrências
* [x] Indicadores por status
* [ ] Indicadores de resolução
* [ ] Métricas de acompanhamento
* [ ] Gráficos e visualizações

---

## Arquitetura

O projeto é estruturado separando as responsabilidades entre **backend** e **frontend**, permitindo uma arquitetura organizada e preparada para evolução.

```text
resolve-ai/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── prisma/
│   └── ...
│
└── frontend/
    ├── src/
    │   ├── com
```
