# 📊 Sistema de Indicadores Educacionais - Backend & Frontend

[![Laravel](https://img.shields.io/badge/Laravel-12.x-red.svg)](https://laravel.com)
[![PHP](https://img.shields.io/badge/PHP-8.2%2B-blue.svg)](https://php.net)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Sistema completo para gerenciamento de indicadores educacionais, diagnósticos estudantis e questionários avaliativos, desenvolvido com Laravel (backend) e recursos modernos de frontend integrado.

## 🎯 Descrição Geral

### Backend (Laravel API)
O backend fornece uma API REST robusta para:
- **Gerenciamento de Usuários**: Sistema completo de autenticação com JWT
- **Sistema de Indicadores**: Criação e gestão de indicadores educacionais (BNCC/SAEB)
- **Diagnósticos Estudantis**: Avaliações com até 25 questões por estudante
- **Questionários Dinâmicos**: Sistema de questões e alternativas
- **Integração com Sistema Legado**: Conexão com banco de dados externo para instituições, séries e disciplinas

### Frontend (Integração)
O projeto utiliza Laravel com Vite para recursos de frontend:
- **TailwindCSS**: Framework CSS moderno para interface
- **Axios**: Cliente HTTP para comunicação com API
- **Recursos Laravel**: Views Blade para páginas administrativas

### Relação Backend ↔ Frontend
- Backend expõe API REST em `/api/*`
- Frontend consome API via Axios
- Autenticação via JWT com cookies HTTPOnly
- Cache Redis para otimização de performance

## 🏗️ Arquitetura do Projeto

```
indicators-backend-aramari/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/              # Controllers da API
│   │   │   │   ├── AuthController.php
│   │   │   │   └── IndicatorController.php
│   │   │   ├── DiagnosticController.php
│   │   │   ├── QuestionController.php
│   │   │   └── UserController.php
│   │   ├── Middleware/           # Middleware customizado
│   │   │   └── JwtMiddleware.php
│   │   └── Resources/           # API Resources
│   ├── Models/                  # Models Eloquent
│   │   ├── User.php
│   │   ├── Indicator.php
│   │   ├── Diagnostic.php
│   │   ├── Questions.php
│   │   └── DiagnosticStudent.php
│   └── Helpers/
│       └── ResponseHelper.php   # Helper para respostas padronizadas
├── database/
│   ├── migrations/              # Migrações do banco
│   └── seeders/                # Seeders
├── routes/
│   ├── api.php                 # Rotas da API
│   └── web.php                 # Rotas web
├── resources/
│   ├── js/                     # Recursos JavaScript
│   ├── css/                    # Recursos CSS
│   └── views/                  # Views Blade
├── config/
│   ├── jwt.php                 # Configuração JWT
│   └── database.php           # Configuração banco de dados
└── docker-compose.yml         # Configuração Docker (Redis)
```

## 💻 Tecnologias Utilizadas

### Backend
- **Framework**: Laravel 12.x
- **PHP**: 8.2+
- **Autenticação**: JWT (tymon/jwt-auth)
- **Banco Principal**: SQLite (desenvolvimento) / MySQL/PostgreSQL (produção)
- **Banco Externo**: MySQL (sistema legado)
- **Cache**: Redis com Predis
- **Validação**: Laravel Validator
- **Testes**: PHPUnit

### Frontend/Interface
- **CSS Framework**: TailwindCSS 4.0
- **Build Tool**: Vite 6.2
- **HTTP Client**: Axios 1.8
- **Views**: Laravel Blade
- **Fonts**: Instrument Sans

### Serviços Adicionais
- **Container**: Docker (Redis)
- **Deploy**: HostGator cPanel com Git Version Control
- **Cache**: Redis 7
- **Logs**: Laravel Pail

## 📥 Guia de Instalação e Desenvolvimento

### Requisitos Prévios
- **PHP** 8.2 ou superior
- **Composer** (última versão)
- **Node.js** (para assets frontend)
- **Docker** (opcional, para Redis)

### 1. Configuração Inicial

```bash
# Clone o repositório
git clone <repository-url>
cd indicators-backend-aramari

# Instalar dependências PHP
composer install

# Instalar dependências Node.js
npm install
```

### 2. Configuração de Ambiente

```bash
# Copiar arquivo de ambiente
cp .env.example .env

# Gerar chave da aplicação
php artisan key:generate

# Gerar chave JWT
php artisan jwt:secret
```

### 3. Configuração do Banco de Dados

```bash
# Criar banco SQLite (desenvolvimento)
touch database/database.sqlite

# Executar migrações
php artisan migrate
```

### 4. Configuração de Variáveis de Ambiente

Configure seu `.env` com:

```env
# Aplicação
APP_NAME="Sistema de Indicadores Educacionais"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Banco de Dados Principal
DB_CONNECTION=sqlite
DB_DATABASE=/caminho/completo/database/database.sqlite

# Banco Externo (Sistema Legado)
EXTERNAL_DB_CONNECTION=mysql
EXTERNAL_DB_HOST=127.0.0.1
EXTERNAL_DB_PORT=3306
EXTERNAL_DB_DATABASE=sistema_legado
EXTERNAL_DB_USERNAME=usuario
EXTERNAL_DB_PASSWORD=senha

# Redis
REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# JWT
JWT_SECRET=sua-chave-jwt-secreta
JWT_TTL=60

# Frontend
FRONTEND_URL=http://localhost:3000
VITE_APP_NAME="${APP_NAME}"
```

### 5. Comandos Principais para Desenvolvimento

#### Backend
```bash
# Iniciar servidor Laravel
php artisan serve

# Executar migrações
php artisan migrate

# Limpar cache
php artisan cache:clear
php artisan config:clear
composer dump-autoload
```

#### Frontend
```bash
# Desenvolver com hot reload
npm run dev

# Build para produção
npm run build
```

#### Redis (Docker)
```bash
# Iniciar serviços
make start

# Parar serviços
make stop

# Testar Redis
docker exec -it redis-laravel redis-cli ping
```

### 6. Comandos Extras do DOC_README.md

#### Criação de Migrações
```bash
# Criar nova tabela
php artisan make:migration create_permissions_table --create=permissions
php artisan make:migration create_user_permissions_table --create=user_permissions

# Adicionar coluna a tabela existente
php artisan make:migration add_more_five_questions_columns_to_diagnostic_student_table --table=diagnostic_student
```

#### Criação de Models e Controllers
```bash
# Criar Model
php artisan make:model Questionnaire

# Criar Controller API
php artisan make:controller UserController --api
```

#### Cache e Debugging
```bash
# Testar cache Redis
php artisan tinker
>>> Cache::put('foo', 'bar', 10);
>>> Cache::get('foo');

# Verificar container Redis
docker exec -it redis-laravel redis-cli
```

## 🚀 Deploy em Produção

### Processo de Deploy via HostGator cPanel

O projeto está configurado para deploy automático via Git Version Control no cPanel:

1. **Acessar Painel HostGator**
   - URL: https://cliente.hostgator.com.br/produtos
   - Navegar: Hospedagens e Servidores > Painel WHM > Listar contas

2. **Acessar cPanel do Domínio**
   - Atualmente 15/09/2025 o dominio desse app:
     - Domínio: `minhanovaescola.com.br`

3. **Deploy via Git Version Control**
   ```bash
   # No cPanel Domínio minhanovaescola.com.br
   # 1. Entrar em "Git Version Control"
   # 2. Localizar repositório "indicador-backend"
   # 3. Clicar em "Gerenciar"
   # 4. Clicar em "Pull or Deploy"
   ```

4. **Atualizar Produção**
   ```bash
   # No cPanel Git Manager:
   # 1. Clicar em "Update from remote"
   # 2. Clicar em "Deploy HEAD commit"
   ```

### Configuração Automática (.cpanel.yml)

O arquivo `.cpanel.yml` executa automaticamente:

```yaml
deployment:
  tasks:
    - /bin/echo "Rodando o script de deploy!"
    - /usr/bin/touch /home/minhanov/aramari.minhanovaescola.com.br/indicadores-backend/deploy-test.txt
    - /bin/echo "Iniciando deploy..."
    - /bin/rsync -av --exclude='.git' --exclude='.cpanel.yml' ./ /home/minhanov/aramari.minhanovaescola.com.br/indicadores-backend/
    - /bin/echo "Deploy concluído com sucesso!"
```

### Comandos Pós-Deploy

Após deploy, executar comandos de otimização:

```bash
# Via terminal ou script automatizado
# Caso o projeto fique com a permissão 700 você deve alterar para 755
su - minhanov
cd aramari.minhanovaescola.com.br/
chmod -R 755 indicadores-backend/

# Atualizar banco de dados com novas colunas e rotas cacheadas pelo laravel
cd indicadores-backend/
composer install --no-dev --optimize-autoloader
php82 artisan migrate --force
php82 artisan config:cache
php82 artisan route:cache

# Ou usar comando make
# Verificar  se está correto os comando dentro do arquivo Makefile
# Ou você pode altomatizar os comandos acima dentro do Makefile
# make deploy
```

### Permissões de Produção

```bash
# Configurar permissões (se necessário)
sudo chown -R www-data:www-data /home/minhanov/aramari.minhanovaescola.com.br/indicadores-backend
sudo chmod -R 775 storage
sudo chmod -R 775 bootstrap/cache
```

## ⚙️ Funcionalidades Principais

### 1. Sistema de Autenticação
- **Login JWT**: Autenticação via email/senha
- **Cookies Seguros**: Tokens armazenados em cookies HTTPOnly
- **Middleware Customizado**: Verificação automática de tokens
- **Refresh Token**: Renovação automática de sessões

### 2. Gerenciamento de Indicadores
- **Tipos**: BNCC e SAEB
- **Vinculação**: Associação com disciplinas e séries
- **CRUD Completo**: Criação, leitura, atualização e exclusão
- **Filtros Avançados**: Por nome, tipo, disciplina e série

### 3. Sistema de Diagnósticos
- **Criação**: Diagnósticos por instituição/série/disciplina
- **Estudantes**: Até 25 questões por estudante 
  - Para aumentar a quantidade de questões você pode criar uma migration adicionadno mais colunas com a quantidade de colunas desejada
  - Cada questão é uma coluna no banco de dados do tipo inteiro 0 para Não acertou/Não preenchido 1 Para questão correta.
- **Status**: SIM/NÃO/S-N para cada questão
- **A.E.E.**: Suporte para Atendimento Educacional Especializado
- **Questionários**: Conteúdo personalizado por diagnóstico

### 4. Gerenciamento de Questões
- **Questões Dinâmicas**: Criação de questões por indicador
- **Alternativas**: Múltiplas alternativas por questão
- **Vinculação**: Questões associadas a séries e disciplinas
- **Correção**: Alternativas marcadas como corretas

### 5. Integração com Sistema Legado
- **Instituições**: Consulta de instituições ativas
- **Séries/Cursos**: Listagem por instituição
- **Disciplinas**: Disciplinas por série
- **Turmas**: Turmas por ano letivo
- **Cache**: Otimização com Redis

## 🧪 Testes

### Frameworks de Teste
- **PHPUnit**: Framework principal de testes
- **Laravel Testing**: Helpers do Laravel para testes

### Executar Testes

```bash
# Todos os testes
php artisan test

# Testes específicos
php artisan test --filter=IndicatorTest

# Com coverage
php artisan test --coverage
```

### Configuração de Testes (phpunit.xml)

```xml
<phpunit>
    <testsuites>
        <testsuite name="Unit">
            <directory>tests/Unit</directory>
        </testsuite>
        <testsuite name="Feature">
            <directory>tests/Feature</directory>
        </testsuite>
    </testsuites>
    <php>
        <env name="APP_ENV" value="testing"/>
        <env name="DB_CONNECTION" value="sqlite"/>
        <env name="DB_DATABASE" value=":memory:"/>
    </php>
</phpunit>
```

## 📏 Boas Práticas e Convenções

### Padrões de Código
- **PSR-12**: Seguir padrões PSR-12 de codificação
- **Laravel Pint**: Ferramenta de formatação automática
- **Arquitetura MVC**: Separação clara de responsabilidades

### Organização do Código
- **Resources**: Transformação de dados da API
- **Helpers**: Funções utilitárias reutilizáveis
- **Middlewares**: Lógica de autenticação e validação
- **Migrations**: Versionamento de schema de banco

### Convenções de Banco
- **UUIDs**: Uso de UUIDs para chaves primárias
- **Timestamps**: Created_at e updated_at automáticos
- **Soft Deletes**: Exclusão lógica quando aplicável
- **Foreign Keys**: Integridade referencial

### Ferramentas de Qualidade

```bash
# Laravel Pint (formatação)
./vendor/bin/pint

# Cache de otimização
php artisan optimize

# Análise de rotas
php artisan route:list
```

## 🔮 Futuras Melhorias

### Backend
- [ ] **API Versioning**: Implementar versionamento da API
- [ ] **Rate Limiting**: Controle de taxa de requisições
- [ ] **Logs Estruturados**: Implementar logging estruturado
- [ ] **Backup Automatizado**: Sistema de backup do banco
- [ ] **Métricas**: Dashboard de métricas e monitoramento

### Sistema de Diagnósticos
- [ ] **Questões JSON**: Migrar de colunas fixas para JSON
- [ ] **Relatórios**: Geração de relatórios em PDF
- [ ] **Exportação**: Export para Excel/CSV
- [ ] **Notificações**: Sistema de notificações por email

### Performance
- [ ] **Query Optimization**: Otimização de consultas N+1
- [ ] **CDN**: Implementar CDN para assets
- [ ] **Background Jobs**: Processamento assíncrono
- [ ] **Database Indexing**: Otimização de índices

### Segurança
- [ ] **API Throttling**: Limitação de requisições por usuário
- [ ] **Input Sanitization**: Sanitização avançada de inputs
- [ ] **HTTPS Enforcement**: Forçar HTTPS em produção
- [ ] **Security Headers**: Headers de segurança

## 📄 Licença e Créditos

### Licença
Este projeto está licenciado sob a **Licença MIT**. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

### Tecnologias Utilizadas
- [Laravel Framework](https://laravel.com) - Framework PHP
- [JWT Auth](https://jwt-auth.readthedocs.io) - Autenticação JWT
- [TailwindCSS](https://tailwindcss.com) - Framework CSS
- [Redis](https://redis.io) - Cache em memória
- [Docker](https://docker.com) - Containerização

### Autores e Contribuidores
- **Equipe de Desenvolvimento**: Aramari Projetos
- **Sistema Legado**: Integração com sistema educacional existente
- **Deploy**: HostGator cPanel com Git Version Control

---

## 📞 Suporte e Documentação

### Para Suporte Técnico
- Crie uma issue no repositório
- Consulte a documentação do Laravel: https://laravel.com/docs
- Revise os logs em `storage/logs/laravel.log`

### Debugging em Produção
```env
# Em caso de erro em produção, ativar debug temporariamente
APP_DEBUG=true
```

### Comandos de Manutenção
```bash
# Limpar todos os caches
php artisan optimize:clear

# Recriar caches de produção
php artisan optimize

# Verificar status da aplicação
php artisan about
```

---

**🚀 Desenvolvido com excelência pela equipe usando Laravel Framework**
