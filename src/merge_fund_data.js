module.exports = (state) => {
  // const a = state.rawFundData.map(({fundIds, rawFundData}) => Object.assign({}, {
  //   fundIds,
  //   rawFundData: rawFundData.slice(1)
  // })).map(({fundIds, rawFundData} => {}))
  //
  // console.log(a)

  return Promise.resolve(
    Object.assign(state, {})
  )
}
