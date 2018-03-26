const classHours = require('./class-hours')
module.exports = {
    async removeStudents(trx, userIds, classId) {
        await trx('student_class_schedule')
            .where('user_id', 'in', userIds)
            .andWhere({ class_id: classId })
            .del()

        await Promise.all(userIds.map(userId => classHours.charge(trx, userId, 1, `cancelled booking for class id = ${classId}`)))
    },

    async addStudents(trx, studentSchedules, classId) {
        const startTime = await trx('student_class_schedule')
            .returning('start_time')
            .insert(studentSchedules.map(s => {
                s.class_id = classId
                return s
            }))

        await Promise.all(studentSchedules.map(s => classHours.consume(trx, s.user_id, 1, `booked a class id = ${classId}`)))
    },
}
