#!/bin/bash

git reset master --hard &&
git pull &&
npm test &&
npm install --dev &&
knex migrate:latest --env production &&
pm2 startOrGracefulReload ecosystem.config.js &&
pm2 save
