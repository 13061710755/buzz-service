exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('user_balance').del()
    .then(() =>
    // Inserts seed entries
      knex('user_balance').insert([
        { user_id: 51, class_hours: 10 },
        { user_id: 41, class_hours: 10 },
      ]))
}
