module.exports = state => {
  const groupedFundIds = state.funds.reduce((accumulator, current) => {
    if (accumulator[accumulator.length - 1].length >= 4) {
      accumulator.push([])
    }
    accumulator[accumulator.length - 1].push(current.id)

    return accumulator
  }, [[]])

  return Object.assign(state, {groupedFundIds})
}
