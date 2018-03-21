module.exports = {
  converged(prevCenters, currCenters) {
    return !!prevCenters && !!currCenters && !(prevCenters < currCenters) && !(currCenters < prevCenters)
  },

  reCalculateCenters(clusters) {
    return clusters.map(elements => elements.reduce((prev, next) => prev + next, 0) / elements.length)
  },

  clusterTo(flatData, centers) {
    const result = new Array(centers.length)

    for (let i = 0; i < flatData.length; i++) {
      const point = flatData[i]
      let minDistance = Infinity
      let minDistanceIndex = -1

      for (let j = 0; j < centers.length; j++) {
        const d = Math.abs(centers[j] - point)

        if (d < minDistance) {
          minDistance = d
          minDistanceIndex = j
        }
      }

      if (!(result[minDistanceIndex] instanceof Array)) {
        result[minDistanceIndex] = []
      }

      result[minDistanceIndex].push(point)
    }

    return { clusters: result, centers: this.reCalculateCenters(result) }
  },

  cluster(flatData, centers = [1, 10], maxIteration = 100) {
    let loops = 0
    let result = this.clusterTo(flatData, centers)

    while (loops < maxIteration) {
      if (this.converged(centers, result.centers)) {
        return result
      }

      centers = result.centers.slice(0)

      result = this.clusterTo(flatData, centers)
      loops += 1
    }

    return result
  },
}
