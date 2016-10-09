const send = (auth, config, data) => {
    return new Promise((resolve, reject) => {
        const sheets = require('googleapis').sheets('v4')
        sheets.spreadsheets.values.update({
            auth,
            spreadsheetId: config.googleSpreadsheet.spreadsheetId,
            range: `${config.googleSpreadsheet.sheetName}!A1`,
            valueInputOption: 'USER_ENTERED',
            resource: {
                range: `${config.googleSpreadsheet.sheetName}!A1`,
                majorDimension: 'ROWS',
                values: data
            }
        }, reject)

        resolve(true)
    })
}

module.exports = {
    send
}