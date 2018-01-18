exports.seed = function (knex, Promise) {
    return knex("articles")
        .del()
        .then(function () {
            return knex("articles").insert([
                {
                    title: "An Introduction to Building Test Driven RESTful APIs with Koa",
                    body: "An Introduction to Building Test Driven RESTful APIs with Koa ...",
                    tags: "koa, tdd, nodejs"
                },
                {
                    title: "Going real time with Socket.IO, Node.Js and React",
                    body: "Going real time with Socket.IO, Node.Js and React",
                    tags: "socket.io, nodejs, react"
                }
            ]);
        });
};
