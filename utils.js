const funds = require('./funds')

const fundById = (id) => funds.find(fund => id === fund.id)
const dateFormat = (date) => `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`

module.exports = {
    fundById,
    dateFormat
}
