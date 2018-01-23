Buzz-Corner-Service
===============
Visit online: https://buzz-corner-service.herokuapp.com/api/v1/monitors/health-check

Inspired by https://www.valentinog.com/blog/test-driven-api-koa-2-mocha-chai/

Run locally:
```
git clone https://github.com/buzz-buzz/buzz-service.git
npm install
npm start
```

Run test:
```
npm test
```

Commands to create seeds data
```
node node_modules/knex/bin/cli.js migrate:make users --env test

node node_modules/knex/bin/cli.js seed:make user_social_accounts --env test
```


