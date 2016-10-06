'use strict';

const dateFormat = (date) => `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`

const https = require('https')

const funds = [
    {
        id : 1,
        name : 'NN Akcji'
    }, {
        id : 27,
        name : 'NN (L) Japonia'
    }, {
        id : 1500037,
        name : 'NN (L) Stabilny Globalnej Alokacji'
    }, {
        id : 18,
        name : 'NN (L) Globalny Spółek Dywidendowych'
    }, {
        id : 20,
        name : 'NN (L) Europejski Spółek Dywidendowych'
    }, {
        id : 3,
        name : 'NN Obligacji'
    }, {
        id : 24,
        name : 'NN (L) Globalny Długu Korporacyjnego'
    }, {
        id : 17,
        name : 'NN Akcji Środkowoeuropejskich'
    }, {
        id : 8,
        name : 'NN Gotówkowy'
    }, {
        id : 4,
        name : 'NN Stabilnego Wzrostu'
    }, {
        id : 15,
        name : 'NN Lokacyjny Plus'
    }, {
        id : 2,
        name : 'NN Zrównoważony'
    }, {
        id : 34,
        name : 'NN Perspektywa 2020'
    }, {
        id : 16,
        name : 'NN Perspektywa 2025'
    }, {
        id : 33,
        name : 'NN Perspektywa 2030'
    }, {
        id : 32,
        name : 'NN Perspektywa 2035'
    }, {
        id : 31,
        name : 'NN Perspektywa 2040'
    }, {
        id : 26,
        name : 'NN Perspektywa 2045'
    }, {
        id : 19,
        name : 'NN (L) Spółek Dywidendowych USA'
    }, {
        id : 22,
        name : 'NN (L) Spółek Dywidendowych Rynków Wschodzących'
    }, {
        id : 29,
        name : 'NN (L) Obligacji Rynków Wschodzących (Waluta Lokalna)'
    }
]

const fundById = (id) => funds.find(fund => id === fund.id)

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
                result.push([fundById(fundId).name, dateFormat(new Date(lastDayData[0])), lastDayData[1]])
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

