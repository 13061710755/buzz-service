exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('user_profiles').del()
        .then(function () {
            return knex('user_profiles').insert([
                {user_id: 1, avatar: 'rowValue1'},
                {user_id: 2, avatar: 'rowValue2'},
                {user_id: 3, avatar: 'rowValue3'}
            ]);
        });
};
