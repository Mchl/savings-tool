const funds = require('./data/funds')

const zeroPad = value => Array(3 - value.toString().length).join(0) + value

const fundById = id => funds.find(fund => id === fund.id)

const dateFormat = date => `${date.getFullYear()}-${zeroPad(date.getMonth() + 1)}-${zeroPad(date.getDate())}`

const timeFormat = date => `${zeroPad(date.getHours())}:${zeroPad(date.getMinutes())}:${zeroPad(date.getSeconds())}`

const nameFormat = name => name + Array(60 - name.length).join(' ')

const calculateChange = (v1, v2) => (v1 >= v2 ? ' ' : '') + Math.round((v1 - v2) / v1 * 10000) / 100 + '%'

module.exports = {
  fundById,
  dateFormat,
  timeFormat,
  nameFormat,
  calculateChange
}
