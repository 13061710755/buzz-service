// Configure the environment and require Knex
const env = process.env.NODE_ENV || 'test'
const config = require('../knexfile')[env]
const server = require('../server/index')
const knex = require('knex')(config)
const PATH = '/api/v1/class-feedback'
// Require and configure the assertion library
const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
// Rollback, commit and populate the test database before each test
describe('routes:get class feedback', () => {
    beforeEach(() => knex.migrate
        .rollback()
        .then(() => knex.migrate.latest())
        .then(() => knex.seed.run()))

    afterEach(() => knex.migrate.rollback())

    // Here comes the first test
    describe(`GET ${PATH}/admin-list/:class_id`, () => {
        it('should return admin-list', done => {
            chai
                .request(server)
                .get(`${PATH}/admin-list/1`)
                .end((err, res) => {
                    done()
                })
        })

        it('should return a class_feedback', done => {
            chai
                .request(server)
                .get(`${PATH}/1/1/evaluate/2`)
                .end((err, res) => {
                    should.not.exist(err)
                    res.status.should.eql(201)
                    res.type.should.eql('application/json')
                    res.body.length.should.eql(1)
                    res.body[0].should.include.keys('class_id', 'from_user_id', 'to_user_id', 'comment', 'score')
                    done()
                })
        })

        it('should return the newly added feed_back alongside a Location header', done => {
            chai
                .request(server)
                .post(`${PATH}/2/1/evaluate/2`)
                .send([{
                    class_id: 2,
                    from_user_id: 1,
                    to_user_id: 2,
                    feedback_time: new Date(),
                    score: 5,
                    comment: 'a good english speaker, too.',
                    remark: 'hank test, create a feedback',
                }])
                .end((err, res) => {
                    should.not.exist(err)
                    res.status.should.eql(201)
                    res.should.have.header('Location')
                    res.type.should.eql('application/json')
                    done()
                })
        })
    })
})
