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
      range: `${config.googleSpreadsheet.sheetName}!A2`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        range: `${config.googleSpreadsheet.sheetName}!A2`,
        majorDimension: 'ROWS',
        values: dataArray
      }
    }, reject)

    resolve(true)
  })
}

module.exports = {
  send
}
