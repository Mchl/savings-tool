'use strict';

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

const groupedIds = funds.reduce((accumulator, current, index, array) => {
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
        });

        res.on('end', () =>{
            const parsedData = JSON.parse(receivedData[index])
            const readFunds = parsedData.shift()
            if (readFunds !== group.length) {
                console.error('received fewer funds than requested! ', group, readFunds)
            }
            const processedData = parsedData.forEach((fundData) => {
                const fundId = group.shift()
                const lastDayData = fundData.pop()
                result.push([utils.fundById(fundId).name, utils.dateFormat(new Date(lastDayData[0])), lastDayData[1]])
            })
            requestsInProgress--
            if (requestsInProgress === 0) {
                console.log(result)
            }
        })

    })

    request.end()

    request.on('error', (e) => {
        console.error(e)
    });
})

