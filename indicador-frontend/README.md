# Sistema de Indicadores Educacionais - Frontend

## 🎯 Descrição Geral

**Nome do Projeto:** Indicadores Aramari - Frontend  
**Objetivo:** Interface web para gerenciamento e análise de indicadores educacionais, permitindo o cadastro de questões, criação de diagnósticos, tabulação de dados e geração de relatórios analíticos para a rede municipal de educação.

**Conexão com o Backend:** O frontend se comunica com uma API REST desenvolvida em Laravel/PHP através de requisições HTTP autenticadas por cookies/sessões. A URL do backend é configurável através do arquivo `public/env.js`.
- Em produção você terá o arquivo `env.js` na raiz do projeto com a URL do backend.
- Localmente ele fica dentro de `public/env.js` com a url `localhost:port` *caso use o docker será o nome do serviço*

## 🏗️ Arquitetura do Frontend

### Estrutura de Pastas Principais

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Charts/         # Componentes de gráficos (ApexCharts)
│   ├── Diagnostic/     # Componentes específicos de diagnósticos
│   ├── Employee/       # Gestão de funcionários
│   ├── Elements/       # Elementos base (Button, Input, Select, etc.)
│   ├── General/        # Componentes gerais (Loading, Search, etc.)
│   ├── Header/         # Cabeçalho da aplicação
│   ├── Indicator/      # Gestão de indicadores educacionais
│   ├── Login/          # Formulários de autenticação
│   ├── Modal/          # Modais reutilizáveis
│   ├── Navbar/         # Navegação
│   ├── Questions/      # Gestão de questões
│   ├── Sidebar/        # Menu lateral
│   └── tiptap-*/       # Editor de texto rico (TipTap)
├── context/            # Contextos React (Auth)
├── hooks/              # Hooks customizados
├── lib/                # Utilitários e helpers
├── pages/              # Páginas da aplicação
├── routes/             # Configuração de rotas
├── schema/             # Schemas de validação (Zod)
├── services/           # Camada de comunicação com API
├── styles/             # Estilos globais (SCSS)
└── types/              # Definições de tipos TypeScript
```

### Fluxo de Dados

1. **Autenticação:** Context API gerencia estado global de autenticação
2. **Comunicação API:** Axios com interceptors para tratamento de erros
3. **Validação:** Zod schemas com React Hook Form
4. **Estado Local:** useState/useEffect para componentes
5. **Notificações:** React Toastify para feedbacks ao usuário

## 🚀 Tecnologias Utilizadas

### Core Framework
- **React 18.3.1** - Biblioteca principal
- **TypeScript 5.6.2** - Tipagem estática
- **Vite 6.0.5** - Build tool e dev server

### Roteamento e Estado
- **React Router DOM 7.1.2** - Roteamento client-side
- **React Context API** - Gerenciamento de estado de autenticação

### UI e Estilização
- **Tailwind CSS 3.4.17** - Framework CSS utilitário
- **DaisyUI 4.12.23** - Componentes UI para Tailwind
- **Headless UI 2.2.0** - Componentes acessíveis
- **Radix UI** - Primitivos de UI (Dialog, Popover, Icons)
- **Lucide React 0.474.0** - Ícones
- **FontAwesome** - Ícones adicionais

### Formulários e Validação
- **React Hook Form 7.54.2** - Gerenciamento de formulários
- **Zod 3.24.1** - Validação de schemas
- **@hookform/resolvers 3.10.0** - Integração Zod + RHF

### Editor de Texto Rico
- **TipTap 2.12.0** - Editor WYSIWYG extensível
- **Extensões TipTap:** Highlight, Image, Link, Task Lists, Typography, etc.

### Visualização de Dados
- **ApexCharts 4.7.0** - Gráficos interativos
- **FullCalendar 6.1.15** - Componente de calendário

### Comunicação HTTP
- **Axios 1.7.9** - Cliente HTTP
- **React Toastify 11.0.3** - Notificações

### Utilitários
- **UUID 11.1.0** - Geração de identificadores únicos
- **React Color 2.19.3** - Seletor de cores
- **Class Variance Authority** - Utilitário para classes CSS
- **Tailwind Merge** - Otimização de classes Tailwind

## 📦 Guia de Instalação e Desenvolvimento

### Requisitos Prévios
- **Node.js 18+** 
- **NPM ou Yarn**
- **Backend Laravel** rodando (configurar URL em `public/env.js`)

### Instalação
```bash
# Clonar o repositório
git clone [repository-url]

# Instalar dependências
npm install

# Configurar URL do backend
# Editar public/env.js com a URL correta do backend
```

### Comandos de Desenvolvimento
```bash
# Servidor de desenvolvimento (http://127.0.0.1:1234)
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Linting
npm run lint
```

### Configuração de Variáveis de Ambiente
A configuração do backend é feita através do arquivo `public/env.js`:
```javascript
window.BACKEND_URL = "http://127.0.0.1:8000/api";
```

## Deploy
### Caso queira adicionar alterações em produção você precisa:
- Rodar o comando `npm run build`
  - Isso irá criar/atualizar uma pasta `dist`
- crie um arquivo .zip da pasta `dist`
  - No windows acesse a raiz desse projeto
  - Clique com o botão direito na pasta `dist` e selecione `add to archive...`
  - Escolha a opção `ZIP`
### Subindo o frontend para a nuvem
- Entre na `hostgator`
  - Em hospedagem e servidores acesse o painel WHM
  - Liste todas as contas e acesse o Cpanel da `minhanovaescola.com.br`
  - Clique em Gerenciar Arquivos
  - Acesse `aramari.minhanovaescola.com.br/indicadores`
  - Clique em `Carregar` e faça o upload do seu arquivo `dist.zip`
  - faça o `unzip`
### Você terá uma nova pasta dist
Você precisa:
- Mover *APENAS* a pasta `assets`, suas novas imagens (ou todas imagens) e o seu novo arquivo `index.html` para dentro de `aramari.minhanovaescola.com.br/indicadores`

Com isso você precisa apenas atualizar a página do frontend para ver as novas atualizações.

_Você é livre para melhorar esse fluxo de atualizar o frontend._

## 🎛️ Regras de Negócio

### 1. **Autenticação e Autorização**
- **Login obrigatório:** Todas as rotas (exceto login) requerem autenticação
- **Verificação contínua:** Sistema verifica status de autenticação via endpoint `/auth/check`
- **Redirecionamento automático:** Usuários não autenticados são redirecionados para `/login`
- **Logout seguro:** Invalidação de sessão no backend via endpoint `/auth/logout`

### 2. **Gestão de Funcionários**
- **Perfis de usuário:** Admin ou Professor
- **Validações:** 
  - Nome obrigatório (mín. 1 caractere)
  - Usuário único (1-50 caracteres)
  - Senha obrigatória no cadastro (1-32 caracteres)
  - Limites de reservas mensais (≥ 0)
  - Limite de equipamentos por reserva (≥ 0)
- **Registro opcional** pode ser nulo

### 3. **Indicadores Educacionais**
- **Tipos suportados:** BNCC, SAEB, SABE
- **Validações obrigatórias:**
  - Código único (mín. 1 caractere)
  - Pelo menos uma série associada
  - Pelo menos uma disciplina associada
  - Tipo de indicador obrigatório
- **Integração externa:** Busca séries e disciplinas via API externa

### 4. **Questões e Banco de Questões**
- **Tipos de questão:** Única escolha ou Múltipla escolha
- **Níveis de dificuldade:** Fácil, Médio, Difícil
- **Validações:**
  - Conteúdo da questão obrigatório
  - Indicador obrigatório
  - Série obrigatória
  - Pelo menos uma alternativa
- **Alternativas:** ID único (UUID), conteúdo obrigatório, flag de correta
- **Editor rico:** Suporte a TipTap para formatação avançada

### 5. **Diagnósticos Educacionais**
- **Criação de diagnósticos:**
  - Nome obrigatório (máx. 255 caracteres)
  - Instituição, série, turma e disciplina obrigatórias
  - Ano letivo obrigatório
  - Quantidade de questões (10-25)
- **Tabulação de resultados:**
  - Estados por questão: "SIM" (acertou), "NÃO" (errou), "S/N" (não respondido)
  - Ciclo de estados: S/N → SIM → NÃO → S/N
  - Contagem automática de acertos por aluno
- **Funcionalidades especiais:**
  - Toggle de tabulação por aluno
  - Marcação A.E.E (Atendimento Educacional Especializado)
  - Associação de indicadores a questões
- **Validações de submissão:**
  - Pelo menos um estudante tabulado
  - Todas as questões devem ter indicadores associados

### 6. **Relatórios e Análises**
- **Gráficos automáticos:** 
  - Aproveitamento por turma
  - Rendimento por questão/série
  - Distribuição de status (Tabulados/Não Tabulados/A.E.E)
- **Filtros dinâmicos:** Por instituição, série, turma, disciplina
- **Exportação:** Suporte a impressão via CSS print

### 7. **Gestão de Equipamentos** (Módulo Reservas)
- **Categorização obrigatória:** 1-4 categorias por equipamento
- **Cores identificadoras:** Código hexadecimal obrigatório
- **Descrição opcional**
- **Integração com sistema de reservas**

### 8. **Validações de Formulários (Zod Schemas)**
- **UUID obrigatório** em entidades principais
- **Strings não vazias** para campos obrigatórios
- **Números não negativos** para limites e quantidades
- **Enums específicos** para tipos controlados
- **Arrays com tamanhos mínimos** para relacionamentos

### 9. **Editor de Texto (TipTap)**
- **Funcionalidades:** Negrito, itálico, sublinhado, listas, links, imagens
- **Extensões ativas:** Typography, Text Align, Task Lists, Highlight
- **Validação de esquema** para elementos suportados
- **Upload de imagens** integrado

## 📄 Funcionalidades Principais

|   Página/Módulo  | Funcionalidade | Regras de Negócio |
|------------------|----------------|-------------------|
| **Login**        | Autenticação de usuários | Login obrigatório, redirecionamento automático |
| **Indicadores**  | CRUD de indicadores educacionais | Código único, séries/disciplinas obrigatórias, tipos BNCC/SAEB/SABE |
| **Funcionários** | Gestão de usuários do sistema | Perfis Admin/Professor, validações de limites de reserva |
| **Questões**     | Banco de questões educacionais | Editor rico, alternativas obrigatórias, níveis de dificuldade |
| **Diagnósticos** | Aplicação e tabulação de avaliações | 10-25 questões, estados SIM/NÃO/S-N, marcação A.E.E |
| **Relatórios**   | Análise de resultados | Gráficos automáticos, filtros dinâmicos, exportação |
| **Equipamentos** | Gestão de recursos escolares | Categorização 1-4, cores identificadoras |
| **Reservas**     | Sistema de agendamentos | Integração com equipamentos e funcionários |

## 🎨 Boas Práticas e Convenções

### Padrões de Nomenclatura
- **Componentes:** PascalCase (`FormDiagnostic`, `QuestionCard`)
- **Hooks:** camelCase com prefixo `use` (`useModal`, `useTiptapEditor`)
- **Tipos:** PascalCase com prefixo `T` (`TIndicatorFormValues`)
- **Schemas:** camelCase (`diagnosticSchema`, `questionSchema`)
- **Services:** PascalCase + "Api" (`IndicatorsApi`, `QuestionsApi`)

### Organização dos Componentes
- **Atomic Design:** Elements → Components → Pages
- **Co-location:** Schemas próximos aos formulários que os utilizam
- **Separação de responsabilidades:** Services para API, hooks para lógica reutilizável
- **Props tipadas:** Interfaces TypeScript para todas as props

### Design System
- **Tailwind CSS:** Classes utilitárias para estilização consistente
- **DaisyUI:** Componentes pré-construídos para rapidez
- **Cores personalizadas:** Variáveis CSS para tema consistente
- **Responsividade:** Mobile-first approach
- **Gradientes animados:** Para backgrounds dinâmicos

### Validação e Formulários
- **React Hook Form + Zod:** Validação robusta e performance otimizada
- **Mensagens de erro:** Traduzidas para português brasileiro
- **Estados de loading:** Feedbacks visuais durante operações assíncronas
- **Toasts informativos:** Notificações não intrusivas

## 🧪 Testes

**Status atual:** O projeto não possui testes implementados.

### Sugestões para Implementação Futura
- **Vitest** - Framework de testes rápido para Vite
- **React Testing Library** - Testes de componentes
- **MSW (Mock Service Worker)** - Mock de APIs
- **Cypress** - Testes end-to-end

## 🚀 Futuras Melhorias

### Funcionalidades
- [ ] **Dashboard analítico** com métricas gerais
- [ ] **Exportação avançada** (PDF, Excel) de relatórios
- [ ] **Sistema de notificações** em tempo real
- [ ] **Modo offline** com sincronização posterior
- [ ] **Filtros salvos** para relatórios recorrentes
- [ ] **Gestão de permissões** mais granular
- [ ] **Editor de questões** com preview em tempo real
- [ ] **Backup automático** de diagnósticos

### Técnicas
- [ ] **Implementação de testes** unitários e integração
- [ ] **PWA (Progressive Web App)** para uso mobile
- [ ] **Cache inteligente** com React Query/TanStack Query
- [ ] **Lazy loading** de rotas e componentes
- [ ] **Bundle optimization** e tree shaking
- [ ] **Monitoramento de performance** (Web Vitals)
- [ ] **Acessibilidade** (WCAG 2.1 compliance)
- [ ] **Internacionalização** (i18n)

### DevOps
- [ ] **CI/CD pipeline** automatizado
- [ ] **Docker containers** para desenvolvimento
- [ ] **Análise de código** (SonarQube)
- [ ] **Documentação automática** (Storybook)

## 📄 Licença e Créditos

**Licença:** Proprietária - Rede Municipal de Educação de Aramari

**Autores/Colaboradores:**
- Desenvolvimento Frontend: Equipe Edutec
- Integração com API Externa: Sistema SIMPLES
- Design System: Baseado em Tailwind CSS e DaisyUI

---
