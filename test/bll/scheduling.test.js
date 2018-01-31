const Scheduling = require('../../server/bll/scheduling');
const chai = require("chai");
const should = chai.should();
describe('scheduling tests', () => {
    it('should make groups', () => {
        let studentBookings = [{
            user_id: 1,
            start_time: new Date(2018, 1, 1, 9, 0).getTime(),
            end_time: new Date(2018, 1, 1, 10, 0).getTime()
        }];

        let companionSlots = [{
            user_id: 2,
            start_time: new Date(2018, 1, 1, 9, 0).getTime(),
            end_time: new Date(2018, 1, 1, 10, 0).getTime()
        }];

        Scheduling.makeGroups(studentBookings, companionSlots).should.eql({
            perfectMatches: [{
                students: [{
                    user_id: 1,
                    start_time: new Date(2018, 1, 1, 9, 0).getTime(),
                    end_time: new Date(2018, 1, 1, 10, 0).getTime()
                }],
                companions: [{
                    user_id: 2,
                    start_time: new Date(2018, 1, 1, 9, 0).getTime(),
                    end_time: new Date(2018, 1, 1, 10, 0).getTime()
                }]
            }]
        });
    });

    it('should cluster student bookings', () => {
        let bookings = [
            {
                user_id: 1,
                start_time: new Date(2018, 1, 1, 9, 0).getTime(),
                end_time: new Date(2018, 1, 1, 10, 0).getTime()
            },
            {
                user_id: 2,
                start_time: new Date(2018, 1, 1, 9, 0).getTime(),
                end_time: new Date(2018, 1, 1, 10, 0).getTime()
            },
            {
                user_id: 3,
                start_time: new Date(2018, 1, 2, 9, 0).getTime(),
                end_time: new Date(2018, 1, 2, 10, 0).getTime()
            }
        ];

        let groups = Scheduling.clusterBookings(bookings);

        groups.length.should.be(2);
    });

    it('should calculate booking distance', () => {
        Scheduling.bookingDistance(new Date(2018, 1, 1, 9, 0).getTime(), new Date(2018, 1, 1, 10, 0).getTime()).should.eql(60 * 60 * 1000);
    });
});