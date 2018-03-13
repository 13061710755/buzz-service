exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('classes').del()
        .then(function () {
            // Inserts seed entries
            return knex('classes').insert([
                {
                    class_id: 1,
                    name: 'class 1',
                    level: 'ddd',
                    start_time: new Date(2019, 1, 23, 18, 50),
                    end_time: new Date(2019, 1, 23, 19, 50),
                    room_url: 'https://zoom.us/j/9746042931',
                    status: 'opened'
                },
                {
                    class_id: 2,
                    name: 'class 2',
                    level: 'aaa',
                    start_time: new Date(2018, 1, 24, 9, 0),
                    end_time: new Date(2018, 1, 24, 10, 0),
                    room_url: 'https://zoom.us/j/9746042932',
                    status: 'started'
                },
                {
                    class_id: 3,
                    name: 'class 3',
                    level: 'ccc',
                    start_time: new Date(2018, 1, 25, 8, 0),
                    end_time: new Date(2018, 1, 25, 9, 0),
                    room_url: 'https://zoom.us/j/9746042933',
                    status: 'ended'
                },
                {
                    class_id: 4,
                    name: 'class 4',
                    level: 'ccc',
                    start_time: new Date(2018, 1, 25, 8, 0),
                    end_time: new Date(2018, 1, 25, 9, 0),
                    room_url: 'https://zoom.us/j/9746042933',
                    status: 'ready'
                }
            ]);
        });
};
