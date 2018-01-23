exports.up = function (knex, Promise) {
    return knex.schema.createTable('user_interests', table => {
        table.biginteger('user_id');
        table.enum('interest', ['football', 'volleyball', 'ping-pang', 'basketball']);
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('user_interests');
};
