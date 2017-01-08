module.exports = (state = {}, config = require('../config.json')) => {
  return Object.assign(state, {config})
}
