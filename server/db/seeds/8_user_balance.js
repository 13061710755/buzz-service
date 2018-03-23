exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('user_balance').del()
        .then(() =>
        // Inserts seed entries
            knex('user_balance').insert([
                { user_id: 1, class_hours: null , integral: null}
            ]))
}
