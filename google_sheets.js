const send = (auth, config, data) => {
  return new Promise((resolve, reject) => {
    const dataArray = data.map(row => [
      row.fundId,
      row.date,
      row.name,
      row.value,
      row.change
    ])

    const sheets = require('googleapis').sheets('v4')
    sheets.spreadsheets.values.update({
      auth,
      spreadsheetId: config.googleSpreadsheet.spreadsheetId,
      range: `${config.googleSpreadsheet.sheets.lastDay}!A2`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        range: `${config.googleSpreadsheet.sheets.lastDay}!A2`,
        majorDimension: 'ROWS',
        values: dataArray
      }
    }, reject)

    resolve(true)
  })
}

const getTransactions = config => {
  const auth = require('./google_authorize').getClient()
  const sheets = require('googleapis').sheets('v4')

  return new Promise((resolve, reject) => {
    sheets.spreadsheets.values.get({
      auth,
      spreadsheetId: config.googleSpreadsheet.spreadsheetId,
      range: `${config.googleSpreadsheet.sheets.transactions}!A2:C`,
      valueRenderOption: 'UNFORMATTED_VALUE'
    }, (err, response) => {
      if (err) {
         reject(err)
      }

      const data = response.values
        .map(row => {
          return {
            fundId: row[0],
            value: row[2],
            timestamp: new Date(row[1]).getTime()
          }
        })
        .sort(
          (a, b) => a.timestamp - b.timestamp
        ).reduce((acc, row) => {
          if (acc.length === 0 || acc.slice(-1)[0].timestamp !== row.timestamp) {
            acc.push({
              timestamp: row.timestamp,
              transactions: []
            })
          }
          acc[acc.length - 1].transactions.push({
            fundId: row.fundId,
            value: row.value
          })

          return acc
        }, [])

      resolve(data)
    })
  })
}

module.exports = {
  send,
  getTransactions
}
