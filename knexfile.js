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
            filename: './test.sqlite3',
            "timezone": "UTC"
        },
        migrations: {
            directory: path.join(BASE_PATH, 'migrations')
        },
        seeds: {
            directory: path.join(BASE_PATH, 'seeds')
        },
        useNullAsDefault: true,
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
    },

    staging_postgresql: {
        client: 'postgresql',
        connection: {
            host: process.env.PG_HOST,
            database: process.env.PG_DB,
            user: process.env.PG_USER,
            password: process.env.PG_PASSWORD,
            charset: 'utf-8',
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

    production: {
        client: 'mysql',
        connection: {
            host: process.env.RDS_BUZZ_HOST,
            user: process.env.RDS_BUZZ_USER,
            password: process.env.RDS_BUZZ_PASSWORD,
            database: process.env.RDS_BUZZ_DB,
            "timezone": "UTC"
        },
        migrations: {
            directory: path.join(BASE_PATH, 'migrations')
        },
        seeds: {},
    }

};
