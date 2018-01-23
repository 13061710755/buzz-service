exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('user_interests').del()
        .then(function () {
            return knex('user_interests').insert([
                {user_id: 1, interest: 'football'},
                {user_id: 2, interest: 'volleyball'}
            ]);
        });
};
