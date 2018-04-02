function checkTimeConflicts(data) {
    for (let i = 0; i < data.length - 1; i++) {
        for (let j = i + 1; j < data.length; j++) {
            if (
                (data[i].start_time >= data[j].start_time
                    && data[i].start_time <= data[j].end_time) ||
                (data[i].end_time >= data[j].start_time
                    && data[i].end_time <= data[j].end_time)) {
                throw new Error('schedule conflicts!')
            }
        }
    }
}

const uniformTime = function (theStartTime, theEndTime) {
    let start_time = theStartTime
    if (start_time) {
        start_time = new Date(start_time)
    } else {
        start_time = new Date(0, 0, 0)
    }

    let end_time = theEndTime
    if (end_time) {
        end_time = new Date(end_time)
    } else {
        end_time = new Date(9999, 11, 30)
    }
    return { start_time, end_time }
}

const uniformTimes = function (data) {
    for (let i = 0; i < data.length; i++) {
        const u = uniformTime(data[i].start_time, data[i].end_time)
        data[i].start_time = u.start_time
        data[i].end_time = u.end_time
    }
}

module.exports = { uniformTimes, checkTimeConflicts, uniformTime }
