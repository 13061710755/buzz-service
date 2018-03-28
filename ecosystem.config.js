module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps: [

        // First application
        {
            name: 'buzz-corner-service',
            script: 'server/index.js',
            env: {
                COMMON_VARIABLE: 'true',
            },
            env_production: {
                NODE_ENV: 'production',
            },
        },
    ],

    /**
     * Deployment section
     * http://pm2.keymetrics.io/docs/usage/deployment/
     */
    deploy: {
        qa: {
            user: 'root',
            host: '106.15.205.136',
            ref: 'origin/master',
            repo: 'git@github.com:buzz-buzz/buzz-service.git',
            path: '/root/apps/buzz-service',
            'post-deploy': 'npm install && knex migrate:latest --env qa && pm2 startOrGracefulReload ecosystem.config.js --env qa && pm2 save',
        },
    },
}
