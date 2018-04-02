const timeHelper = require('../../server/common/time-helper')
const chai = require('chai')
const should = chai.should()

describe('time helper', () => {
    it('should detect time conflicts', () => {
        (() => {
            timeHelper.checkTimeConflicts([
                {
                    start_time: new Date(2018, 4, 2, 18, 0, 0),
                    end_time: new Date(2018, 4, 2, 18, 30, 0),
                },
                {
                    start_time: new Date(2018, 4, 2, 18, 0, 0),
                    end_time: new Date(2018, 4, 2, 18, 30, 0),
                },
            ])
        }).should.throw(Error)
    })
})
