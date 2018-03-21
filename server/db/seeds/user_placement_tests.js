exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('user_placement_tests').del()
    .then(() =>
    // Inserts seed entries
      knex('user_placement_tests').insert([
        { user_id: 1, level: 'A' },
      ]))
}
