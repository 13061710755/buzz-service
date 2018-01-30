// Configure the environment and require Knex
const env = process.env.NODE_ENV || "test";
const config = require("../knexfile")[env];
const server = require("../server/index");
const knex = require("knex")(config);
const PATH = "/api/v1/class-feedback";
//Require and configure the assertion library
const chai = require("chai");
const should = chai.should();
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
// Rollback, commit and populate the test database before each test
describe("routes:get class feedback", () => {
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
    describe(`GET ${PATH}/:class_id`, () => {
        it("should return all the class_feedback :class_id", done => {
            chai
                .request(server)
                .get(`${PATH}/1`)
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.eql(201);
                    res.type.should.eql("application/json");
                    res.body.length.should.eql(1);
                    res.body[0].should.include.keys("class_id", "from_user_id", "to_user_id", "comment", "score");
                    done();
                });
        });
    });


});