exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('placement_test').del()
        .then(function () {
            // Inserts seed entries
            return knex('placement_test').insert([
                {
                    user_id: 1,
                    test_time: new Date(),
                    placement_content: '{"question":"how old are you?";"answer":"I am 18."}',
                    level: 1,
                    remark: 'hank test placement_test'
                }
            ]);
        });
};
