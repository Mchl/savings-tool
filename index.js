'use strict'

const config = require('./config')
const https = require('https')
const funds = require('./data/funds').filter(fund => config.fundsToTrack.indexOf(fund.id) > -1)
const utils = require('./utils')

const authorize = require('./google_authorize').authorize
const googleApiKey = require(config.googleSpreadsheet.apiKeyFile)

const prepareData = (data) => {
    return new Promise((resolve) => {
        const values = data.sort((v1,v2) => {
            if (v1.name > v2.name) {
                return 1
            } else if (v1.name < v2.name) {
                return -1
            } else {
                return 0
            }
        })
        .map(data => [
            data.date,
            data.name,
            data.value,
            data.change
        ])

        resolve(values)
    })
}

let latestDataTimestamp = 0
let shouldSendData = false

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
                    parsedData.forEach((fundData) => {
                        const fundId = group.shift()
                        const lastDayData = fundData.pop()
                        const previousDayData = fundData.pop()

                        if (latestDataTimestamp < lastDayData[0]) {
                            latestDataTimestamp = lastDayData[0]
                            shouldSendData = true
                        }
                        if (shouldSendData && latestDataTimestamp != lastDayData[0]) {
                            latestDataTimestamp = Math.min(latestDataTimestamp, lastDayData[0])
                            shouldSendData = false
                        }

                        result.push({
                            fundId,
                            name: utils.nameFormat(utils.fundById(fundId).name),
                            date: utils.dateFormat(new Date(lastDayData[0])),
                            value: lastDayData[1],
                            change: utils.calculateChange(lastDayData[1], previousDayData[1])
                        })
                    })
                    requestsInProgress--

                    if (requestsInProgress === 0 && shouldSendData) {
                        resolve(result)
                        shouldSendData = false
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

authorize(googleApiKey)
    .then((auth) => {
        console.log('Interval polling started')
        const interval = setInterval(
            () => {
                fetchData()
                    .then(prepareData)
                    .then(data => {
                        console.log('sending data')
                        return Promise.all[
                            require('./gmail').send(auth, config, data),
                            require('./google_sheets').send(auth, config, data)
                        ]
                    })
                    .catch(err => {
                        console.log('Error while polling', err)
                        if (err.code === 'SELF_SIGNED_CERT_IN_CHAIN') return
                        if (err.code === 'ERROR_PARSING_DATA') return
                        if (err.code === 'ECONNRESET') return
                        if (err.code === 'ENOTFOUND') return
                        console.log('Unexpected error - stopping')
                        clearInterval(interval)
                    }
                )
            },
            config.requestInterval
        )
    })
    .catch(err => {
        console.log('Error while authenticating', err)
    })



