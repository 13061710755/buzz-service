module.exports = fn => new Promise((resolve, reject) => fn(resolve, reject))
