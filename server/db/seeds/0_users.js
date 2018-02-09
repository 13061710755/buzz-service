exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('users').del()
        .then(function () {
            // Inserts seed entries
            return knex('users').insert([
                {name: 'user1', role: 'a'},
                {name: 'rowValue2', role: 'c'},
                {name: 'rowValue3', role: 's'}
            ]);
        });
};