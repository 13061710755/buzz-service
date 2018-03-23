// Configure the environment and require Knex
const env = process.env.NODE_ENV || 'test'
const config = require('../knexfile')[env]
const server = require('../server/index')
const knex = require('knex')(config)
const PATH = '/api/v1/user-balance'
// Require and configure the assertion library
const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
// Rollback, commit and populate the test database before each test
describe('routes: user balance', () => {
    beforeEach(() => knex.migrate
        .rollback()
        .then(() => knex.migrate.latest())
        .then(() => knex.seed.run()))
    // Rollback the migration after each test
    afterEach(() => knex.migrate.rollback())
    // Here comes the first test
    describe(`PUT ${PATH}/:user_id`, () => {
        it('can charge class hours for a user', done => {
            chai
                .request(server)
                .put(`${PATH}/1`)
                .send({
                    class_hours: 10,
                })
                .end((err, res) => {
                    should.not.exist(err)
                    res.status.should.eql(201)
                    res.type.should.eql('application/json')
                    res.body.should.eql({ class_hours: 10 })
                    done()
                })
        })
    })
    /** every subsequent test must be added here !! * */

    describe(`DELETE ${PATH}/:user_id`, () => {
        it('can consume class hours of a user', done => {
            chai
                .request(server)
                .del(`${PATH}/1`)
                .send({
                    class_hours: 3,
                })
                .end((err, res) => {
                    should.not.exist(err)
                    res.status.should.eql(201)
                    res.type.should.eql('application/json')
                    res.body.should.eql({ class_hours: -3 })
                    done()
                })
        })
    })

    describe(`PUT ${PATH}/integral/:user_id`, () => {
        it('can change integral of a user', done => {
            chai
                .request(server)
                .put(`${PATH}/integral/1`)
                .send({
                    integral: 10
                })
                .end((err, res) => {
                    should.not.exist(err)
                    res.status.should.eql(201)
                    res.type.should.eql('application/json')
                    res.body.should.eql({ integral: 10 })
                    done()
                })
        });
    })
    describe(`DELETE ${PATH}/integral/:user_id`, () => {
        it('can consume integral of a user', done => {
            chai
                .request(server)
                .del(`${PATH}/integral/1`)
                .send({
                    integral: 3
                })
                .end((err, res) => {
                    should.not.exist(err)
                    res.status.should.eql(201)
                    res.type.should.eql('application/json')
                    res.body.should.eql({ integral: -3 })
                    done()
                })
        });
    })
})
