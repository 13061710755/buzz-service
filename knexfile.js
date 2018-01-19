// Update with your config settings.
const path = require("path");
const BASE_PATH = path.join(__dirname, "server", "db");

module.exports = {

    development: {
        client: 'sqlite3',
        connection: {
            filename: './dev.sqlite3'
        }
    },

    test: {
        client: 'sqlite3',
        connection: {
            filename: './test.sqlite3'
        },
        migrations: {
            directory: path.join(BASE_PATH, 'migrations')
        },
        seeds: {
            directory: path.join(BASE_PATH, 'seeds')
        }
    },

    staging: {
        client: 'postgresql',
        connection: {
            host: process.env.PG_HOST,
            database: process.env.PG_DB,
            user: process.env.PG_USER,
            password: process.env.PG_PASSWORD,
            charset: 'utf-8'
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    },

    production: {
        client: 'postgresql',
        connection: {
            database: 'my_db',
            user: 'username',
            password: 'password'
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    }

};
