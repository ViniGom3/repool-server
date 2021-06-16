# Repool-API

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://repool-api.herokuapp.com/)

Serviço de aluguel de repúblicas universitárias.

O projeto visa o desenvolvimento de uma solução de software que sirva de auxílio para pessoas interessadas (provavelmente alunos universitários) encontrarem e alugarem moradias temporárias próximas às universidades.

Quando um aluno é aprovado em um vestibular, um novo desafio começa que é o de se preparar para conseguir estudar. Com o SISU, pessoas de qualquer parte do país e até do exterior, que fizeram o Enem, podem se cadastrar para concorrer a uma vaga universitária. Uma vez que se é aprovado, faz-se necessário que o futuro discente faça planos para que consiga estudar. Para alguns, um transporte rodoviário entre bairros e municípios basta, para outros que moram a uma maior distância, é necessário buscar moradias temporárias (geralmente durante o curso da universidade) e que sejam próximas à universidade. A maioria com um orçamento limitado, busca repartir o espaço com outros interessados e com isso, reduzir as despesas com aluguel.
Além disso, buscar em uma cidade, por vezes, desconhecida, um lugar que seja relativamente seguro, barato e próximo da universidade pode ser para muitos um desafio.
Temos ainda, por outra ótica, a oportunidade de moradores locais, com espaços ociosos, de lucrarem com o aluguem de suas propriedades.

Desta forma, vemos que é necessário um meio de ligar o proprietário de um imóvel a um interessado, considerando demandas como a divisão de custo da moradia, proximidade com o ambiente de estudos, explicitação dos custos e quaisquer outras características que sejam de interesse dos potenciais futuros inquilinos.
Este projeto visa suprir estas demandas. Oferecendo ao locador a capacidade de alugar sua propriedade.

# Hi 👋👋👋

Se você é um desenvolvedor e deseja programar neste código fonte, é necessário que entenda algumas coisas.
Em primeiro lugar, sugiro que siga o [Necessary Files](#necessary-files) e o [Getting Start](#getting-start), para criar o ambiente de desenvolvimento localmente.

A estrutura das pastas e arquivos está mostrada em [folder structure](#folder-structure).

Aqui farei uma breve explanação de como tudo está organizado:
Os arquivos de configuração, estes estão na raiz do projeto. Arquivos para o git, npm e para o typescript. Além desses arquivos, alguns recursos como o prisma, contendo as migrations, o arquivo de seed para preencher o banco e o schema que será usado no banco de dados.
Temos também testes de recursos na pasta client, leia mais sobre isso em [Test API](#resource-test).

Entrando em src, agora na pasta helpers, estão funções helpers e algumas enumerations, são recursos que teriam seu uso de alguma forma replicadas no código.

Na pasta middleware, estão o bodyparser, content-type, para configuração do express, e um arquivo de configuração do multer, para o upload para o servidor e envio de imagens para o Google Cloud Storage.

Em routes, temos 4 arquivos onde estão as apis, além do index. Nesses 4 arquivos temos: **users**, que abriga apis de uso geral, funcionalidades que todos os que utilizam o sistema podem ter acesso, **subscriber**, apis que só deveriam ser passíveis de execução e uso por usuários plenamente cadastrados e logados, **owner**, rotas de usuários com role de owner ou de administrador, e **admin**, para acesso apenas de um usuário com role de administrador.

Abaixo, temos a pasta validations, onde estão os schemas de validação, para garantir que os dados recebidos pelas requisições estão no schema correto.

Abaixo disso temos o arquivo app, que monta com o auxilio de middlewares e setupRouter a aplicação express que é iniciada em server. O arquivo middleware aplica o middlewares que estão na pasta middlwares enquanto que o arquivo setupRoutes carrega as apis que estão escritas na pasta routes.

# Necessary files {#necessary-files}

credentials.json: credencial do Google Cloud Storage. Pode ser obtido [aqui](https://cloud.google.com/storage/docs/getting-service-account?hl=pt), mas para isso é necessário criar um projeto no Google Console. Em seguida crie um bucket no Google Cloud Storage, onde os arquivos de midia, inseridos na aplicação, serão guardados, para criar um bucket [clique aqui](https://cloud.google.com/storage/docs/creating-buckets?hl=pt-br). Para mais informações acesses o [Guia de instruções](https://cloud.google.com/storage/docs/how-to?hl=pt-br).

.env: arquivo de configurações de ambiente. Deve ter o seguinte formato:

```
DATABASE_URL="postgresql://postgres:postgres@dominio:port/database?schema=public"

PORT=5050

TOKEN_JWT="INSERT-YOUR-JWT-SECRET-HERE"

ADMIN_PASSWORD="INSERT-ADMIN-PASSWORD"

GCS_BUCKET="google-cloud-storage-bucket-name"

GCLOUD_PROJECT="project-id-from-google-cloud-application"

GCS_KEYFILE=./credentials.json

```

# 🚀 Getting Start {#getting-start}

Para rodar a aplicação backend, precisará de um SGBD PostgresSQL instalado, caso não tenha, e possua instalado, tanto o Docker quanto o docker-compose, pode utilizar o arquivo docker-compose presente na raiz do projeto, de nome **docker-compose.yml**:

Execute:

```
docker-compose up
```

E um container contendo uma instancia Postgres será baixado, e iniciado no Docker.

Em seguida, tendo o NodeJS instalado e execute:

```
npm install
```

Isso irá baixar todas as dependênciais

```
npm run start
```

Isso iniciará a aplicação.

Para adicionar o schema ao banco, deve-se rodar a migration, para isso execute:

```
npx prisma migrate dev --name init
```

Isso irá gerar a migration nomeando-a como **init**.

Para preencher o banco de dados com dados aleatórios, utilize o comando:

```
npx prisma db seed --preview-feature
```

## Test API's {#resource-test}

API testes (de recurso apenas) podem ser feitos por meio da pasta client, na raiz do projeto. O arquivo user.http se refere a ações que podem ser executadas por qualquer usuário, subscriber.http se refere a ações que podem ser executados por qualquer usuário inscrito na plataforma e logado, owner.http são ações que podem ser executadas por usuário proprietários e admin.http, ações do administrador do sistema.

Para executar os testes, é necessário ter a extensão do VSCode, Rest Client, instalado. Para tanto, acesso este [link](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)

## Server tasks

### Users endpoints

✔ get all users

✔ create user

✔ create user return token

✔ email exists

✔ login

✔ get add

✔ get ad by string

✔ get ad filtred

✔ get ad filtred by maximum price and minimum price

✔ pagination on get ad

✔ upload image on create user

### Subscriber endpoints

✔ get user infos

✔ get full user infos (without password)

✔ edit user infos

✔ delete user & delete profile

✔ get favorits by user

✔ insert favorit on user

✔ remove favorit

✔ create interest

✔ get rent from user

✔ get rent from property

✔ get evaluate from property

✔ create property

✔ confirm interest

✔ remove interest

✔ remove rent

✔ create evaluate

✔ create rent by double confirmation

✔ upload image on create property

### Owner endpoints

✔ get interesteds

✔ create property

✔ create ad

✔ get property

✔ get all properties

✔ update property

✔ delete property

✔ delete ad

✔ confirm vacancy

✔ remove rent

✔ remove vacancy

✔ get users with activ vacancy

✔ get user with partial rent

✔ upload image on create property

✔ create report

## Admin endpoints

✔ create report

# Folder Structure {#folder-structure}

```
.
├── README.md
├── client
│   ├── 1.png
│   ├── admin.http
│   ├── owner.http
│   ├── subscriber.http
│   └── user.http
├── credentials.json
├── docker-compose.yml
├── lintstagedrc.json
├── package-lock.json
├── package.json
├── postgres-data
│   └── prisma
├── prisma
│   ├── migrations
│   │   ├── 20210612131600_init
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   ├── schema.prisma
│   └── seed.ts
├── src
│   ├── app.ts
│   ├── classes
│   │   ├── index.ts
│   │   ├── multer.ts
│   │   ├── pagination.ts
│   │   └── prisma.ts
│   ├── database
│   │   ├── index.ts
│   │   └── prisma.ts
│   ├── helpers
│   │   ├── admin.ts
│   │   ├── index.ts
│   │   ├── owner.ts
│   │   ├── responses.ts
│   │   ├── subscribers.ts
│   │   └── user.ts
│   ├── middleware.ts
│   ├── middlewares
│   │   ├── bodyparser.ts
│   │   ├── content-type.ts
│   │   ├── index.ts
│   │   └── multer.ts
│   ├── routes
│   │   ├── admin.ts
│   │   ├── index.ts
│   │   ├── owner.ts
│   │   ├── subscriber.ts
│   │   └── users.ts
│   ├── server.ts
│   ├── setupRoutes.ts
│   └── validations
│       ├── index.ts
│       ├── property.ts
│       ├── rent.ts
│       └── user.ts
├── tmp
│   └── uploads
└── tsconfig.json

18 directories, 45 files
```
