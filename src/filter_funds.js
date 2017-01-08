module.exports = state => {
  return Object.assign(state, {
    funds: state.funds.filter(({id}) => state.config.fundsToTrack.indexOf(id) > -1)
  })
}
