#!/bin/bash

npm install &&
knex migrate:latest --env production &&
pm2 startOrGracefulReload ecosystem.config.js &&
pm2 save
