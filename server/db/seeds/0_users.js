exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('users').del()
        .then(function () {
            // Inserts seed entries
            return knex('users').insert([
                {name: 'user1', role: 'a', created_at: new Date(2018, 1, 24, 9, 0)},
                {name: 'rowValue2', role: 'c', created_at: new Date(2018, 1, 25, 9, 0)},
                {name: 'rowValue3', role: 's', created_at: new Date(2018, 1, 23, 9, 0)}
            ]);
        });
};