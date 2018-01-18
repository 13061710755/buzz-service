exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('users').del()
        .then(function () {
            // Inserts seed entries
            return knex('users').insert([
                {user_id: 1, name: 'user1'},
                {user_id: 2, name: 'rowValue2'},
                {user_id: 3, name: 'rowValue3'}
            ]);
        });
};
