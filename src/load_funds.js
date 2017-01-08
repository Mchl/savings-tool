module.exports = (state = {}, funds = require('../data/funds.json')) => {
  return Object.assign(state, {funds})
}
