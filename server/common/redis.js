const Redis = require('ioredis')

const config = process.env.REDISCLOUD_URL || {
    host: '127.0.0.1',
    // password: '',
    // port: 6379,
    // db: 4,
}

const redis = new Redis(config)

redis.on('ready', () => {
    console.log('redis:default', 'ready')
})
redis.on('error', e => {
    console.error('redis:default:error', e)
})

module.exports = {
    redis,
}
