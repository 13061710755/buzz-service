// Configure the environment and require Knex
const env = process.env.NODE_ENV || "test";
const config = require("../knexfile")[env];
const server = require("../server/index");
const knex = require("knex")(config);
const PATH = "/api/v1/companion-class-schedule";
//Require and configure the assertion library
const chai = require("chai");
const should = chai.should();
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
// Rollback, commit and populate the test database before each test
describe("routes: companion class schedule", () => {
    beforeEach(() => {
        return knex.migrate
            .rollback()
            .then(() => {
                return knex.migrate.latest();
            })
            .then(() => {
                return knex.seed.run();
            });
    });

    afterEach(() => {
        return knex.migrate.rollback();
    });

    // Here comes the first test
    describe(`GET ${PATH}/:user_id`, () => {
        it("should return all the user schedules for :user_id", done => {
            chai
                .request(server)
                .get(`${PATH}/1?start_time=2018-1-1&end_time=`)
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.eql(200);
                    res.type.should.eql("application/json");
                    res.body.length.should.eql(3);
                    res.body[0].should.include.keys("user_id", "status");
                    done();
                });
        });
    });
});