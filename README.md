# crypto-annunciator-bot

[https://crypto-annunciator-bot.up.railway.app/](https://crypto-annunciator-bot.up.railway.app/)

### Create .env file in root folder with variables:

```yaml
TELEGRAM_API_KEY = 
DATABASE_URL = 
ADMIN_ID = 
NODE_ENV = 
DOMAIN = 
```

## Project initialize
### Install dependencies:
```
npm install
```

### Migrate db with Prisma:
```
npx prisma migrate dev --name init
```

### Seed db:
```
npx prisma db seed
```

## Project setup

### Start bot:
```
npm run start
```
+ For Production mode (webhooks) set NODE_ENV variable to "production" value
+ In Development mode tg bot will be run in pooling
