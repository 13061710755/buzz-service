// Configure the environment and require Knex
const env = process.env.NODE_ENV || 'test'
const config = require('../knexfile')[env]
const server = require('../server/index')
const knex = require('knex')(config)
const PATH = '/api/v1/companion-class-schedule'
// Require and configure the assertion library
const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
// Rollback, commit and populate the test database before each test
describe('routes: companion class schedule', () => {
    beforeEach(() => knex.migrate
        .rollback()
        .then(() => knex.migrate.latest())
        .then(() => knex.seed.run()))

    afterEach(() => knex.migrate.rollback())

    // Here comes the first test
    describe(`GET ${PATH}/:user_id`, () => {
        it('should return all the user schedules for :user_id', done => {
            chai
                .request(server)
                .get(`${PATH}/1?start_time=2018-1-1&end_time=`)
                .end((err, res) => {
                    should.not.exist(err)
                    res.status.should.eql(200)
                    res.type.should.eql('application/json')
                    res.body.length.should.eql(3)
                    res.body[0].should.include.keys('user_id', 'status')
                    done()
                })
        })
    })

    // create companion class schedule
    describe(`POST ${PATH}/:user_id`, () => {
        it('should return the newly added companion class schedules alongside a Location header', done => {
            chai
                .request(server)
                .post(`${PATH}/2`)
                .send([{
                    start_time: new Date(2018, 1, 1, 1, 0),
                    end_time: new Date(2018, 1, 1, 2, 0),
                }, {
                    start_time: new Date(2018, 1, 2, 1, 0),
                    end_time: new Date(2018, 1, 2, 2, 0),
                }])
                .end((err, res) => {
                    should.not.exist(err)
                    res.status.should.eql(201)
                    res.should.have.header('Location')
                    res.type.should.eql('application/json')
                    done()
                })
        })
        it('should return an error when the schedule conflicts', done => {
            chai
                .request(server)
                .post(`${PATH}/1`)
                .send([{
                    start_time: new Date(2018, 1, 24, 9, 0),
                    end_time: new Date(2018, 1, 24, 10, 0),
                }, {
                    start_time: new Date(2018, 1, 2, 1, 0),
                    end_time: new Date(2018, 1, 2, 2, 0),
                }])
                .end((err, res) => {
                    should.exist(err)
                    res.status.should.eql(409)
                    res.type.should.eql('text/plain')
                    res.text.should.eql('Schedule start_time conflicts!')
                    done()
                })
        })
    })

    describe(`PUT ${PATH}/:user_id`, () => {
        it('should allow companion cancel a booking', done => {
            chai
                .request(server)
                .put(`${PATH}/1`)
                .send({
                    start_time: new Date(2018, 1, 24, 9, 0),
                })
                .end((err, res) => {
                    should.not.exist(err)
                    res.status.should.eql(200)
                    res.type.should.eql('application/json')
                    res.body.should.eql({ status: 'cancelled', user_id: 1 })

                    done()
                })
        })
    })
})
