module.exports = state => {
  return Object.assign(state, {
    rawFundData: require(`../data/${state.fundIds[0]}.json`)
  })
}
