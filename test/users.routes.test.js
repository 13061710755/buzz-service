// Configure the environment and require Knex
const env = process.env.NODE_ENV || "test";
const config = require("../knexfile")[env];
const server = require("../server/index");
const knex = require("knex")(config);
const PATH = "/api/v1/users";
// Require and configure the assertion library
const chai = require("chai");
const should = chai.should();
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
// Rollback, commit and populate the test database before each test
describe("routes: users", () => {
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
// Rollback the migration after each test
    afterEach(() => {
        return knex.migrate.rollback();
    });
// Here comes the first test
    describe(`GET ${PATH}`, () => {
        it("should return all the users", done => {
            chai
                .request(server)
                .get(`${PATH}`)
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.eql(200);
                    res.type.should.eql("application/json");
                    res.body.length.should.eql(3);
                    res.body[0].should.include.keys("user_id", "name", "created_at", "role", "avatar", "facebook_id", "wechat_data");
                    done();
                });
        });
    });
    /** every subsequent test must be added here !! **/

    describe(`GET ${PATH}/:user_id`, () => {
            it("should return a single user", done => {
                chai
                    .request(server)
                    .get(`${PATH}/1`)
                    .end((err, res) => {
                        should.not.exist(err);
                        res.status.should.eql(200);
                        res.type.should.eql("application/json");
                        res.body.should.include.keys("user_id", "name", "created_at", "role", "avatar", "facebook_id", "wechat_data");
                        done();
                    });
            });
            it("should return an error when the requested user does not exists", done => {
                chai
                    .request(server)
                    .get(`${PATH}/9999`)
                    .end((err, res) => {
                        should.exist(err);
                        res.status.should.eql(404);
                        res.type.should.eql("application/json");
                        res.body.error.should.eql("The requested user does not exists");
                        done();
                    });
            });
        }
    )
    ;

    describe(`POST ${PATH}`, () => {
        it("should return the newly added user identifier alongside a Location header", done => {
            chai
                .request(server)
                .post(`${PATH}`)
                .send({
                    facebook_id: "12345",
                    facebook_name: "John Doe",
                    role: 's'
                })
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.eql(201);
                    res.should.have.header("Location");
                    res.type.should.eql("application/json");
                    res.body.should.be.a("number");
                    done();
                });
        });
        it("should return an error when the resource already exists", done => {
            chai
                .request(server)
                .post(`${PATH}`)
                .send({
                    name: "user1",
                    user_id: '1'
                })
                .end((err, res) => {
                    should.exist(err);
                    res.status.should.eql(409);
                    res.type.should.eql("application/json");
                    res.body.error.should.eql("The user already exists");
                    done();
                });
        });
    });

    describe(`GET ${PATH}/by-facebook/:facebook_id`, () => {
        it('should find user by facebook id', done => {
            chai
                .request(server)
                .get(`${PATH}/by-facebook/12345`)
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.eql(200);
                    res.type.should.eql('application/json');
                    done();
                });
        });
    });
});