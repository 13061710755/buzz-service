// Configure the environment and require Knex
const env = process.env.NODE_ENV || 'test'
const config = require('../knexfile')[env]
const server = require('../server/index')
const knex = require('knex')(config)
const PATH = '/api/v1/user-placement-tests'
// Require and configure the assertion library
const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
// Rollback, commit and populate the test database before each test
describe('routes: placement-tests', () => {
  beforeEach(() => knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => knex.seed.run()))
  // Rollback the migration after each test
  afterEach(() => knex.migrate.rollback())
  // Here comes the first test
  describe(`PUT ${PATH}/:user_id`, () => {
    it('can create a placement test for a user', done => {
      chai
        .request(server)
        .put(`${PATH}/1`)
        .send({
          detail: JSON.stringify({ test: 'value' }),
          level: 'A',
        })
        .end((err, res) => {
          should.not.exist(err)
          res.status.should.eql(201)
          res.type.should.eql('application/json')
          res.body.level.should.eql('A')

          chai
            .request(server)
            .get(`${PATH}/1`)
            .end((err, res) => {
              should.not.exist(err)
              res.status.should.eql(200)
              res.type.should.eql('application/json')
              res.body.level.should.eql('A')

              chai
                .request(server)
                .put(`${PATH}/1`)
                .send({
                  level: 'B',
                })
                .end((err, res) => {
                  should.not.exist(err)
                  res.status.should.eql(201)
                  res.type.should.eql('application/json')
                  res.body.level.should.eql('B')

                  done()
                })
            })
        })
    })
  })
  /** every subsequent test must be added here !! * */

  describe(`GET ${PATH}/:user_id`, () => {
    it('when a user\'s placement is null, can get a {}', done => {
      chai
        .request(server)
        .get(`${PATH}/51`)
        .end((err, res) => {
          should.not.exist(err)
          res.status.should.eql(200)
          res.type.should.eql('application/json')
          res.body.should.eql({})

          done()
        })
    })
  })
})
