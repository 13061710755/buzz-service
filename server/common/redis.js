const Redis = require('ioredis')

const config = process.env.REDISCLOUD_URL || 'redis://rediscloud:UP18QdLqqApiPtX8Y3cnbOBT9DrAQMVk@redis-16745.c12.us-east-1-4.ec2.cloud.redislabs.com:16745'

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
