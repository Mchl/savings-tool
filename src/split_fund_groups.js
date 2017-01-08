module.exports = (state, subFunction) => {
  return Promise.all(
    state.groupedFundIds.map(fundIds => subFunction({fundIds}))
  ).then(rawFundData => {
    return Object.assign(state, {
      rawFundData
    })
  })
}
