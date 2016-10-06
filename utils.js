const funds = require('./funds')

const fundById = (id) => funds.find(fund => id === fund.id)
const dateFormat = (date) => `${date.getFullYear()}-${date.getMonth()+1}-${Array(3 - date.getDate().toString.length).join(0) + date.getDate()}`
const nameFormat = (name) => name + Array(60 - name.length).join(' ')
const calculateChange = (v1,v2) => (v1>v2 ? ' ' : '') + Math.round((v1 - v2)/v1*10000)/100+'%'

module.exports = {
    fundById,
    dateFormat,
    nameFormat,
    calculateChange
}
