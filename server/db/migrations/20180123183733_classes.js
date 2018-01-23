exports.up = function (knex, Promise) {
    return knex.schema.createTable('classes', table => {
        table.bigIncrements('class_id');
        table.biginteger('adviser_id');
        table.dateTime('start_time');
        table.dateTime('end_time');
        table.enum('status', ['opened', 'cancelled', 'ready', 'started', 'ended']);
        table.string('name');
        table.text('remark');
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('classes');
};
