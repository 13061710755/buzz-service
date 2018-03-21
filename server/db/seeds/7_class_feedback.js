exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('class_feedback').del()
    .then(() =>
    // Inserts seed entries
      knex('class_feedback').insert([
        {
          class_id: 1,
          from_user_id: 1,
          to_user_id: 2,
          feedback_time: new Date(),
          score: 1,
          comment: 'a good english speaker.',
          remark: 'hank test',
        },
      ]))
}
