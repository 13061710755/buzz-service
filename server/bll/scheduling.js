function converged(prevCenters, currCenters) {
    return !!prevCenters && !!currCenters && !(prevCenters < currCenters) && !(currCenters < prevCenters)
}

function recenterAndCluster(clusters) {

}

module.exports = {
    bookingDistance(startTime1, startTime2) {
        return Math.abs(startTime1 - startTime2)
    },

    converged,

    clusterBookings(studentBookings, clusters = [], centers = [], loops = 0, maxInteration = 100) {
        while (loops < maxInteration) {
            console.log('loops = ', loops)
            const ret = recenterAndCluster(clusters)

            if (converged(centers, ret.centers)) {
                break
            }

            loops += 1
        }
    },
    makeGroups(studentBookings, companionSlots) {
        const students = []

        return {
            perfectMatches: [{
                students: [{
                    user_id: 1,
                    start_time: new Date(2018, 1, 1, 9, 0).getTime(),
                    end_time: new Date(2018, 1, 1, 10, 0).getTime(),
                }],
                companions: [{
                    user_id: 2,
                    start_time: new Date(2018, 1, 1, 9, 0).getTime(),
                    end_time: new Date(2018, 1, 1, 10, 0).getTime(),
                }],
            }],
        }
    },
}
