'use strict'

const config = require('./config')
const https = require('https')
const funds = require('./data/funds').filter(fund => config.fundsToTrack.indexOf(fund.id) > -1)
const utils = require('./utils')

const authorize = require('./google_authorize').authorize
const googleApiKey = require(config.googleApi.apiKeyFile)

const sortData = (data) => {
  return new Promise((resolve) => {
    const values = data.sort((v1, v2) => {
      if (v1.name > v2.name) {
        return 1
      } else if (v1.name < v2.name) {
        return -1
      } else {
        return 0
      }
    })
    resolve(values)
  })
}

const fetchData = () => {
  console.log(new Date(), 'fetching data')
  return new Promise((resolve, reject) => {
    const groupedIds = funds.reduce((accumulator, current) => {
      if (accumulator[accumulator.length - 1].length >= 4) {
        accumulator.push([])
      }
      accumulator[accumulator.length - 1].push(current.id)

      return accumulator
    }, [[]])

    let receivedData = []
    let requestsInProgress = 0
    let result = []

    groupedIds.forEach((group, index) => {
      const options = Object.assign({}, config.requestOptions, {
        path: config.requestOptions.path + group.join()
      })

      requestsInProgress++

      const request = https.request(options, res => {
        res.on('data', (d) => {
          if (receivedData[index] === undefined) {
            receivedData[index] = ''
          }
          receivedData[index] += d
        })

        res.on('end', () => {
          let parsedData
          try {
            parsedData = JSON.parse(receivedData[index])
          } catch (e) {
            console.log(e)
            reject({code: 'ERROR_PARSING_DATA'})
            return
          }

          const readFunds = parsedData.shift()
          if (readFunds !== group.length) {
            console.error('received fewer funds than requested! ', group, readFunds)
          }
          parsedData.forEach((fundData, index) => {
            const fundId = group[index]
            const data = fundData.map(row => {
              return {
                timestamp: row[0],
                value: row[1]
              }
            })

            result.push({
              fundId,
              name: utils.fundById(fundId).name,
              data
            })
          })
          requestsInProgress--

          if (requestsInProgress === 0) {
            resolve(result)
          }
        })
      })

      request.end()

      request.on('error', (e) => {
        reject(e)
      })
    })
  })
}

const shouldProcessData = data => {
  let latestDataTimestamp = 0
  let processData = false

  data.forEach(fund => {
    const lastDayData = fund.data.slice(-1)[0]

    if (latestDataTimestamp < lastDayData.timestamp) {
      latestDataTimestamp = lastDayData.timestamp
      processData = true
    }
    if (processData && latestDataTimestamp != lastDayData.timestamp) {
      latestDataTimestamp = Math.min(latestDataTimestamp, lastDayData.timestamp)
      processData = false
    }
  })

  return new Promise(resolve => {
    resolve({
      processData,
      data
    })
  })
}

const matchQuotesToTransaction = (portfolio, quotes, transaction, timestamp) => {
  const fundId = transaction.fundId
  const fundData = quotes.filter(d => d.fundId === fundId)[0]

  fundData.data.forEach(quote => {
    if (
      Math.abs(timestamp - quote.timestamp) < 1000 * 3600 * 24 &&
      new Date(timestamp).getDate() === new Date(quote.timestamp).getDate()
    ) {
      portfolio[timestamp][fundId].units += transaction.value / quote.value
      portfolio[timestamp][fundId].value = portfolio[timestamp][fundId].units * quote.value
    }
  })
  return portfolio
}

const matchQuotesToTransactionDay = (portfolio, quotes, transactionDay) => {
  const timestamp = transactionDay.timestamp
  transactionDay.transactions.forEach(transaction => {
    const fundId = transaction.fundId

    if (!portfolio[timestamp][fundId]) {
      portfolio[timestamp][fundId] = {
        units: 0
      }
    }

    portfolio = matchQuotesToTransaction(portfolio, quotes, transaction, timestamp)
  })

  return portfolio
}

const initializePortfolioDay = (portfolio, quotes, transactionDay) => {
  const timestamp = transactionDay.timestamp
  portfolio[timestamp] = {}

  if (Object.keys(portfolio).length > 1) {
    const lastPortfolio = portfolio[Object.keys(portfolio).slice(-2)[0]]
    Object.keys(lastPortfolio).forEach(fundId => {
      portfolio[timestamp][fundId] = Object.assign({}, lastPortfolio[fundId])
    })
  }

  return portfolio
}

const processData = quotes => {
  return new Promise((resolve, reject) => {
    if (!quotes.processData) {
      resolve(false)
    } else {
      const transactions = require('./google_sheets').getTransactions(config)

      transactions.then(transactionData => {
        let portfolio = {}

        transactionData.forEach(transactionDay => {
          portfolio = initializePortfolioDay(portfolio, quotes.data, transactionDay)
          portfolio = matchQuotesToTransactionDay(portfolio, quotes.data, transactionDay)
        })

        const lastPortfolio = portfolio[Object.keys(portfolio).slice(-1)[0]]

        let totalUnits = 0
        let totalChange = 0
        Object.keys(lastPortfolio).forEach(fundId => {
          const fundData = quotes.data.filter(d => d.fundId === parseInt(fundId, 10))[0].data
          const lastDays = fundData.slice(-2)
          totalUnits += lastPortfolio[fundId].units
          totalChange += lastPortfolio[fundId].units * (lastDays[1].value/lastDays[0].value-1)

          Object.assign(lastPortfolio[fundId], {
            lastDayChange: lastDays[1].value/lastDays[0].value-1
          })
        })

        const result = {
          portfolio,
          lastDay: {
            portfolio: lastPortfolio,
            change: totalChange/totalUnits
          }
        }

        console.log(result)
      }).catch(err => {
        console.trace(err)
      })
    }
  })
}

authorize(googleApiKey)
  .then(() => {
    console.log('Interval polling started')
    const interval = setInterval(
      () => {
        const state = {
          raw: {},
          config: {},
          processed: {},
          errors: []
        }

        loadConfig(state)

        // fetchData()
        //   .then(shouldProcessData)
        //   .then(processData)
        //   .catch(err => {
        //       console.log('Error while polling', err)
        //       if (err.code === 'SELF_SIGNED_CERT_IN_CHAIN') return
        //       if (err.code === 'ERROR_PARSING_DATA') return
        //       if (err.code === 'ECONNRESET') return
        //       console.log('Unexpected error - stopping')
        //       clearInterval(interval)
        //     }
        //   )
        clearInterval(interval)
      },
      config.requestInterval
    )
  })
  .catch(err => {
    console.log('Error while authenticating', err)
  })



