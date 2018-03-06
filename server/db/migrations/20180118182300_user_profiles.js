exports.up = function (knex, Promise) {
    return knex.schema.createTable('user_profiles', table => {
        table.integer('user_id');
        table.string('display_name');
        table.enum('gender', ['f', 'm', 'u', 'o']);
        table.date('date_of_birth');
        table.text('description');
        table.string('mobile');
        table.string('email');
        table.string('language').defaultTo('en-US');
        table.string('location');
        table.string('avatar');
        table.string('grade');
        table.string('parent_name');
        table.timestamp('create_at').defaultTo(new Date());
        table.timestamp('update_at').defaultTo(new Date());

        table.foreign('user_id').references('users.user_id');
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('user_profiles');
};
