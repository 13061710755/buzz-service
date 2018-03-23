const _ = require('lodash')
const { DYSMS } = require('waliyun')
const sms = DYSMS({ AccessKeyId: process.env.buzz_sms_access_key_id, AccessKeySecret: process.env.buzz_sms_access_key_secret })

module.exports = {
    async send({ mobile, param }) {
        const { Code, Message } = await sms.sendSms({
            SignName: 'BuzzBuzz英语角',
            TemplateCode: 'SMS_127154352',
            PhoneNumbers: _.isArray(mobile) ? mobile : [mobile],
            TemplateParam: JSON.stringify(param),
        })
        if (Code !== 'OK' && Message !== 'OK') throw new Error(`${Code}: ${Message}`)
    },
}
