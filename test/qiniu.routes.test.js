// Configure the environment and require Knex
const env = process.env.NODE_ENV || 'test'
const config = require('../knexfile')[env]
const server = require('../server/index')
const knex = require('knex')(config)
const PATH = '/api/v1/qiniu'
// Require and configure the assertion library
const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
// Rollback, commit and populate the test database before each test
describe('routes: qiniu', () => {
  describe(`GET ${PATH}/token`, () => {
    it('should return the correct qiniu uptoken and config', done => {
      chai
        .request(server)
        .get(`${PATH}/token`)
        .end((err, res) => {
          should.not.exist(err)
          res.status.should.eql(200)
          res.type.should.eql('application/json')
          res.body.should.include.keys(['resources_url', 'upload_url', 'uptoken'])
          done()
        })
    })
  })
})
