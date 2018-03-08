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
                    res.body[0].should.include.keys("user_id", "name", "created_at", "role", "avatar", "facebook_id", "wechat_data", "class_hours");
                    done();
                });
        });
    });

    describe(`GET ${PATH}?role=s`, () => {
        it('should return all the students', done => {
            chai
                .request(server)
                .get(`${PATH}?role=s`)
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.eql(200);
                    res.type.should.eql('application/json');
                    res.body.length.should.eql(1);
                    res.body[0].should.include.keys('user_id', 'name', 'created_at', 'role', 'avatar', 'facebook_id', 'wechat_data', 'country', 'city');
                    done();
                });
        });

        it('should allow search by mobile', done => {
            chai
                .request(server)
                .get(`${PATH}?mobile=17717373367`)
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.eql(200);
                    res.type.should.eql('application/json');
                    res.body.length.should.eql(1);
                    res.body[0].should.include.keys('user_id', 'name', 'created_at', 'role', 'avatar', 'facebook_id', 'wechat_data');
                    done();
                });
        });

        it('should allow search by email', done => {
            chai
                .request(server)
                .get(`${PATH}?email=jie.tian@hotmail.com`)
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.eql(200);
                    res.type.should.eql('application/json');
                    res.body.length.should.eql(1);
                    res.body[0].should.include.keys('user_id', 'name', 'created_at', 'role', 'avatar', 'facebook_id', 'wechat_data');
                    done();
                });
        });

        it('should allow search by wechat name', done => {
            chai
                .request(server)
                .get(`${PATH}?wechat_name=xx`)
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.eql(200);
                    res.type.should.eql('application/json');
                    res.body.length.should.eql(1);
                    res.body[0].should.include.keys('user_id', 'name', 'created_at', 'role', 'avatar', 'facebook_id', 'wechat_data');
                    done();
                });
        });

        it('should allow search by display_name', done => {
            chai
                .request(server)
                .get(`${PATH}?display_name=zzzz`)
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.eql(200);
                    res.type.should.eql('application/json');
                    res.body.length.should.eql(0);
                    done();
                });
        });
    });

    describe(`GET ${PATH}/:user_id`, () => {
            it("should return a single user", done => {
                chai
                    .request(server)
                    .get(`${PATH}/1`)
                    .end((err, res) => {
                        should.not.exist(err);
                        res.status.should.eql(200);
                        res.type.should.eql("application/json");
                        res.body.should.include.keys("user_id", "name", "created_at", "role", "avatar", "facebook_id", "wechat_data", "level");
                        res.body.level.should.eql('A');
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
                    role: 's',
                    name: 'John Doe',
                    user_id: '99',
                    wechat_name: 'xxx yyy'
                })
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.eql(201);
                    res.should.have.header("Location");
                    res.type.should.eql("application/json");
                    res.body.should.be.a("number");

                    chai
                        .request(server)
                        .get(`${PATH}/${res.body}`)
                        .end((err, res) => {
                            should.not.exist(err);
                            res.status.should.eql(200);
                            res.type.should.eql("application/json");
                            res.body.should.include.keys("user_id", "name", "created_at", "role", "avatar", "facebook_id", "wechat_data");
                            res.body.wechat_name.should.eql('xxx yyy');
                            done();
                        });
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

    describe(`GET ${PATH}/by-wechat`, () => {
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

    describe(`PUT ${PATH}/sign-in`, () => {
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

    describe(`PUT ${PATH}/:user_id`, () => {
        it('should update a user', done => {
            chai.request(server)
                .put(`${PATH}/2`)
                .send({
                    name: 'changed',
                    country: '美国',
                    display_name: 'changed',
                    facebook_name: 'changed',
                    interests: ['business', 'art']
                })
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.eql(200);
                    res.body.country.should.eql('美国');

                    chai.request(server)
                        .get(`${PATH}/2`)
                        .end((err, res) => {
                            should.not.exist(err);

                            console.log('res = ', res.body);

                            res.status.should.eql(200);
                            res.body.name.should.eql('changed');
                            res.body.display_name.should.eql('changed');
                            res.body.facebook_name.should.eql('changed');
                            res.body.interests.should.eql('art,business');
                            res.body.country.should.eql('美国');

                            done();
                        });
                });
        });
    });

    describe(`DEL ${PATH}/:user_id`, () => {
        it('should delete a user', done => {
            chai.request(server)
                .del(`${PATH}/251`)
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.eql(200);
                    done();
                });
        })
    });
});