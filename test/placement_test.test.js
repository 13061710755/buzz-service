// Configure the environment and require Knex
const env = process.env.NODE_ENV || "test";
const config = require("../knexfile")[env];
const server = require("../server/index");
const knex = require("knex")(config);
const PATH = "/api/v1/placement-test";
//Require and configure the assertion library
const chai = require("chai");
const should = chai.should();
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
// Rollback, commit and populate the test database before each test
describe("routes:get placement test", () => {
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
    describe(`GET ${PATH}/`, () => {
        it("should return all the placement-test", done => {
            chai
                .request(server)
                .get(`${PATH}/`)
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.eql(201);
                    res.type.should.eql("application/json");
                    //res.body.length.should.eql(3);
                    res.body[0].should.include.keys("user_id", "placement_content");
                    done();
                });
        });

        it("should return the newly added placement-test alongside a Location header", done => {
            chai
                .request(server)
                .post(`${PATH}/1`)
                .send([{
                    user_id: 2,
                    test_time: new Date(),
                    placement_content: '{"question":"how old are you?";"answer":"I am 19."}',
                    level: 2,
                    remark: 'hank test placement_test'
                }])
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.eql(201);
                    res.should.have.header("Location");
                    res.type.should.eql("application/json");
                    done();
                });
        });
    });


});