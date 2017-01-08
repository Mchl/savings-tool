
Promise.resolve(require('./load_config')())
  .then(require('./load_funds'))
  .then(require('./filter_funds'))
  .then(require('./group_fund_ids'))
  .then(
    state => {
      return require('./split_fund_groups')(
        state,
        require('./load_fund_data_from_disk')
      )
    }
  )
  .then(require('./inspect_state'))
