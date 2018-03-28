// Configure the environment and require Knex
const env = process.env.NODE_ENV || 'test'
const config = require('../knexfile')[env]
const server = require('../server/index')
const knex = require('knex')(config)
const PATH = '/api/v1/monitors'
// Require and configure the assertion library
const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
// Rollback, commit and populate the test database before each test
describe('routes: monitors', () => {
    beforeEach(() => {
    })
    // Rollback the migration after each test
    afterEach(() => {
    })
    // Here comes the first test
    describe(`GET ${PATH}/health-check`, () => {
        it('should be healthy', done => {
            chai
                .request(server)
                .get(`${PATH}/health-check`)
                .end((err, res) => {
                    should.not.exist(err)
                    res.status.should.eql(200)
                    res.type.should.eql('application/json')
                    res.body.should.include.keys('everything', 'version')
                    res.body.everything.should.eql('is ok')
                    done()
                })
        })
    })
    /** every subsequent test must be added here !! * */
})
