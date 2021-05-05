# repool-server

# Necessary files
credentials.json: credencial do Google Cloud Storage. Pode ser obtido [aqui](https://cloud.google.com/storage/docs/getting-service-account?hl=pt).

.env: arquivo de configurações de ambiente. Deve ter o seguinte formato:

```
DATABASE_URL="postgresql://postgres:postgres@dominio:port/database?schema=public"

TOKEN_JWT="INSERT-YOUR-JWT-SECRET-HERE"

ADMIN_PASSWORD="INSERT-ADMIN-PASSWORD"

GCS_BUCKET="google-cloud-storage-bucket-name"

GCLOUD_PROJECT="project-id-from-google-cloud-application"

GCS_KEYFILE=./credentials.json 

```

# 🚀 Getting Start

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

Para preencher os dados com dados aleatórios, utilize o comando:

```
npx prisma db seed --preview-feature
```

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

# Folder Structure

```
.
├── README.md
├── credentials.json
├── dist
│   ├── app.js
│   ├── app.js.map
│   ├── classes
│   │   ├── index.js
│   │   ├── index.js.map
│   │   ├── pagination.js
│   │   ├── pagination.js.map
│   │   ├── prisma.js
│   │   └── prisma.js.map
│   ├── database
│   │   ├── index.js
│   │   ├── index.js.map
│   │   ├── prisma.js
│   │   └── prisma.js.map
│   ├── helpers
│   │   ├── admin.js
│   │   ├── admin.js.map
│   │   ├── index.js
│   │   ├── index.js.map
│   │   ├── owner.js
│   │   ├── owner.js.map
│   │   ├── subscribers.js
│   │   ├── subscribers.js.map
│   │   ├── user.js
│   │   └── user.js.map
│   ├── middleware.js
│   ├── middleware.js.map
│   ├── middlewares
│   │   ├── bodyparser.js
│   │   ├── bodyparser.js.map
│   │   ├── content-type.js
│   │   ├── content-type.js.map
│   │   ├── index.js
│   │   ├── index.js.map
│   │   ├── multer.js
│   │   └── multer.js.map
│   ├── routes
│   │   ├── admin.js
│   │   ├── admin.js.map
│   │   ├── index.js
│   │   ├── index.js.map
│   │   ├── owner.js
│   │   ├── owner.js.map
│   │   ├── subscriber.js
│   │   ├── subscriber.js.map
│   │   ├── users.js
│   │   └── users.js.map
│   ├── server.js
│   ├── server.js.map
│   ├── setupRoutes.js
│   └── setupRoutes.js.map
├── docker-compose.yml
├── lintstagedrc.json
├── package-lock.json
├── package.json
├── prisma
│   ├── migrations
│   │   ├── 20210501131546_init
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   ├── schema.prisma
│   └── seed.ts
├── src
│   ├── api
│   ├── app.ts
│   ├── classes
│   │   ├── index.ts
│   │   ├── pagination.ts
│   │   └── prisma.ts
│   ├── database
│   │   ├── index.ts
│   │   └── prisma.ts
│   ├── helpers
│   │   ├── admin.ts
│   │   ├── index.ts
│   │   ├── owner.ts
│   │   ├── subscribers.ts
│   │   └── user.ts
│   ├── middleware.ts
│   ├── middlewares
│   │   ├── bodyparser.ts
│   │   ├── content-type.ts
│   │   ├── index.ts
│   │   └── multer.ts
│   ├── routes
│   │   ├── admin.ts
│   │   ├── index.ts
│   │   ├── owner.ts
│   │   ├── subscriber.ts
│   │   └── users.ts
│   ├── server.ts
│   └── setupRoutes.ts
├── tmp
│   └── uploads
└── tsconfig.json
```
