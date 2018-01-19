exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('user_social_accounts').del()
        .then(function () {
            return knex('user_social_accounts').insert([
                {user_id: 1, facebook_id: 12345}
            ]);
        });
};
