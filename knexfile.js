// Update with your config settings.
const path = require("path");
const BASE_PATH = path.join(__dirname, "server", "db");

module.exports = {

    development: {
        client: 'mysql',
        connection: {
            host: 'localhost',
            database: 'buzz3',
            user: 'root',
            password: '1050709',
            "timezone": "UTC"
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            directory: path.join(BASE_PATH, 'migrations')
        },
        seeds: {
            directory: path.join(BASE_PATH, 'seeds')
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
        },
        useNullAsDefault: true,
        "timezone": "UTC"
    },

    staging: {
        client: 'mysql',
        connection: process.env.CLEARDB_DATABASE_URL,
        migrations: {
            directory: path.join(BASE_PATH, 'migrations')
        },
        seeds: {
            directory: path.join(BASE_PATH, 'seeds')
        },
        "timezone": "UTC"
    },

    staging_postgresql: {
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
            directory: path.join(BASE_PATH, 'migrations')
        },
        seeds: {
            directory: path.join(BASE_PATH, 'seeds')
        }
    },

    production: {
        client: 'mysql',
        connection: process.env.RDS_MYSQL_URL,
        migrations: {
            directory: path.join(BASE_PATH, 'migrations')
        },
        seeds: {},
        "timezone": "UTC"
    }

};
