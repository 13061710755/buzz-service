exports.up = function (knex, Promise) {
    return knex.schema.createTable('user_interests', table => {
        table.biginteger('user_id');
        table.enum('interest', ['universe', 'busines', 'art', 'food', 'environment', 'lifestyle', 'enterainment', 'science', 'technology', 'health', 'sports', 'animal', 'music', 'people', 'politics']);
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('user_interests');
};
