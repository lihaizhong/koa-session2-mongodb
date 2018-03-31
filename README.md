# koa-session2-mongo3

mongodb store for koa-session2

## Require

Node > 7.x
MongoDB > 3.x

Install

```javascript
npm install koa-session2-mongo3 -S
or
yarn add koa-session2-mongo3 -S
```

## Usage

```javascript
const Koa = require('koa')
const session = require('koa-session2');
const MongoStore = require('koa-session2-mongo3');
const app = new Koa();
app.use(session({
    store: new MongoStore({
        url:  DB_URL,     // your mongodb url  required
        dbName: DB_NAME   // your mongodb database  required
    })
}))
```

## Options

- `url`: required, db url
- `dbName`: required, db dbName
- `collection`: optional, db session collection name,default "koa__session"
- `maxAge`: optional, expire time, default 10 \* 24 \* 3600 seconds
- `options`: optional, [mongodb options](http://mongodb.github.io/node-mongodb-native/3.0/api/MongoClient.html)
