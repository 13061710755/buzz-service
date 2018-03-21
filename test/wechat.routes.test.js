// Configure the environment and require Knex
const env = process.env.NODE_ENV || 'test'
const config = require('../knexfile')[env]
const server = require('../server/index')
const knex = require('knex')(config)
const PATH = '/api/v1/wechat'
// Require and configure the assertion library
const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
// Rollback, commit and populate the test database before each test
describe('routes: wechat', () => {
  describe(`POST ${PATH}/js-config`, () => {
    it('should return the correct wechat js config', done => {
      chai
        .request(server)
        .post(`${PATH}/js-config`)
        .send({
          debug: true,
          jsApiList: ['startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice'],
          url: 'https://corner-test.buzzbuzzenglish.com/1',
        })
        .end((err, res) => {
          should.not.exist(err)
          res.status.should.eql(200)
          res.type.should.eql('application/json')
          res.body.should.include.keys(['jsConfig'])
          res.body.jsConfig.should.include.keys(['debug', 'appId', 'timestamp', 'nonceStr', 'signature'])
          done()
        })
    })
  })
})
