'use strict'

const https = require('https')
const funds = require('./funds')
const utils = require('./utils')

const options = {
    hostname: 'www.nntfi.pl',
    path: '/?action=quotes.getQuotesValuesAsJSON&unitCategoryId=5&fundId=',
    method: 'POST',
    header: {
        'Content-Length': 0
    }
}

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
    options.path = '/?action=quotes.getQuotesValuesAsJSON&unitCategoryId=5&fundId=' + group.join()

    requestsInProgress++

    const request = https.request(options, res => {
        res.on('data', (d) => {
            if (receivedData[index] === undefined) {
                receivedData[index] = ''
            }
            receivedData[index] += d
        })

        res.on('end', () =>{
            const parsedData = JSON.parse(receivedData[index])
            const readFunds = parsedData.shift()
            if (readFunds !== group.length) {
                console.error('received fewer funds than requested! ', group, readFunds)
            }
            parsedData.forEach((fundData) => {
                const fundId = group.shift()
                const lastDayData = fundData.pop()
                const previousDayData = fundData.pop()
                result.push({
                    fundId,
                    name: utils.nameFormat(utils.fundById(fundId).name),
                    date: utils.dateFormat(new Date(lastDayData[0])),
                    value: lastDayData[1],
                    change: utils.calculateChange(lastDayData[1], previousDayData[1])
                })
            })
            requestsInProgress--

            if (requestsInProgress === 0) {
                result
                    .sort((v1,v2) => {
                        if (v1.name > v2.name) {
                            return 1
                        } else if (v1.name < v2.name) {
                            return -1
                        } else {
                            return 0
                        }
                    })
                    .forEach(data => {
                    console.log(`${data.date}\t${data.name}\t${data.value}\t${data.change}`)
                })
            }
        })
    })

    request.end()

    request.on('error', (e) => {
        console.error(e)
    })
})

