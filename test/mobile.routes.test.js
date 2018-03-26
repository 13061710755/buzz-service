// Configure the environment and require Knex
const env = process.env.NODE_ENV || 'test'
const config = require('../knexfile')[env]
const server = require('../server/index')
const knex = require('knex')(config)
const PATH = '/api/v1/mobile'
// Require and configure the assertion library
const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
// Rollback, commit and populate the test database before each test
describe('routes: mobile', () => {
    describe(`POST ${PATH}/sms`, () => {
        it('should return the correct code and expire', done => {
            chai
                .request(server)
                .post(`${PATH}/sms`)
                .send({
                    mobile: '18657198908',
                })
                .end((err, res) => {
                    should.not.exist(err)
                    res.status.should.eql(200)
                    res.type.should.eql('application/json')
                    res.body.should.include.keys(['code', 'expire'])
                    done()
                })
        })
    })
    describe(`POST ${PATH}/verify`, () => {
        it('should return verified', done => {
            chai
                .request(server)
                .post(`${PATH}/sms`)
                .send({
                    mobile: '18600000000',
                })
                .end((err, res) => {
                    should.not.exist(err)
                    res.status.should.eql(200)
                    res.type.should.eql('application/json')
                    res.body.should.include.keys(['code', 'expire'])
                    chai
                        .request(server)
                        .post(`${PATH}/verify`)
                        .send({
                            mobile: '18600000000',
                            code: res.body.code,
                        })
                        .end((err, res) => {
                            should.not.exist(err)
                            res.status.should.eql(200)
                            res.type.should.eql('application/json')
                            res.body.should.include.keys(['verified'])
                            res.body.verified.should.eql(true)
                            done()
                        })
                })
        })
    })
    describe(`POST ${PATH}/verify`, () => {
        it('should return verification error', done => {
            chai
                .request(server)
                .post(`${PATH}/sms`)
                .send({
                    mobile: '18600000000',
                    expire: 1,
                })
                .end((err, res) => {
                    should.not.exist(err)
                    res.status.should.eql(200)
                    res.type.should.eql('application/json')
                    res.body.should.include.keys(['code', 'expire'])
                    setTimeout(() => {
                        chai
                            .request(server)
                            .post(`${PATH}/verify`)
                            .send({
                                mobile: '18600000000',
                                code: res.body.code,
                            })
                            .end((err, res) => {
                                should.exist(err)
                                done()
                            })
                    }, (res.body.expire + 1) * 1000)
                })
        })
    })
})
