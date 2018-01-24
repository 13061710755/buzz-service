// Configure the environment and require Knex
const env = process.env.NODE_ENV || "test";
const config = require("../knexfile")[env];
const server = require("../server/index");
const knex = require("knex")(config);
const PATH = "/api/v1/student-class-schedule";
// Require and configure the assertion library
const chai = require("chai");
const should = chai.should();
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
// Rollback, commit and populate the test database before each test
describe("routes: student class schedule", () => {
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
    describe(`GET ${PATH}/:user_id`, () => {
        it("should return all the user schedules for :user_id", done => {
            chai
                .request(server)
                .get(`${PATH}/1?start_time=2018-1-1&end_time=`)
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.eql(200);
                    res.type.should.eql("application/json");
                    res.body.length.should.eql(2);
                    res.body[0].should.include.keys("user_id", "status");
                    done();
                });
        });
    });
    /** every subsequent test must be added here !! **/

    describe.skip(`GET ${PATH}/:user_id`, () => {
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

    describe.skip(`POST ${PATH}`, () => {
        it("should return the newly added user identifier alongside a Location header", done => {
            chai
                .request(server)
                .post(`${PATH}`)
                .send({
                    facebook_id: "12345",
                    facebook_name: "John Doe",
                    role: 's',
                    name: 'John Doe',
                    user_id: '99'
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

    describe.skip(`GET ${PATH}/by-facebook/:facebook_id`, () => {
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

    describe.skip(`GET ${PATH}/by-wechat`, () => {
        it('should find user by wechat open id', done => {
            chai
                .request(server)
                .get(`${PATH}/by-wechat?openid=12345`)
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.eql(200);
                    res.type.should.eql('application/json');
                    done();
                });
        });

        it('should find user by wechat union id', done => {
            chai.request(server)
                .get(`${PATH}/by-wechat?unionid=12345`)
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.eql(200);
                    res.type.should.eql('application/json');
                    done();
                });
        });
    });

    describe.skip(`PUT ${PATH}/sign-in`, () => {
        it('should not allow empty info log in', done => {
            chai.request(server)
                .put(`${PATH}/sign-in`)
                .send({})
                .end((err, res) => {
                    should.exist(err);
                    res.status.should.eql(403);
                    done();
                });
        });

        it('should not sign in a non-exist user', done => {
            chai.request(server)
                .put(`${PATH}/sign-in`)
                .send({user_id: 999})
                .end((err, res) => {
                    should.exist(err);
                    res.status.should.eql(404);
                    done();
                });
        });

        it('should sign in a facebook user', done => {
            chai.request(server)
                .put(`${PATH}/sign-in`)
                .send({
                    user_id: 1,
                    facebook_id: 12345
                })
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.eql(200);
                    res.type.should.eql("application/json");
                    should.exist(res.headers['set-cookie']);
                    res.headers['set-cookie'][0].indexOf('user_id').should.eql(0);
                    done();
                })
        })
    });

    describe.skip(`PUT ${PATH}/:user_id`, () => {
        it('should update a user', done => {
            chai.request(server)
                .put(`${PATH}/2`)
                .send({
                    name: 'changed',
                    display_name: 'changed',
                    facebook_name: 'changed',
                    interests: ['football', 'volleyball']
                })
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.eql(201);

                    chai.request(server)
                        .get(`${PATH}/2`)
                        .end((err, res) => {
                            should.not.exist(err);

                            console.log('res = ', res.body);

                            res.status.should.eql(200);
                            res.body.name.should.eql('changed');
                            res.body.display_name.should.eql('changed');
                            res.body.facebook_name.should.eql('changed');
                            res.body.interests.should.eql('football,volleyball');

                            done();
                        });
                });
        });
    });
});