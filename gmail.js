const colorFormat = value => {
  if (parseFloat(value) > 0) return "green"
  if (parseFloat(value) < 0) return "maroon"
  return "black"
}

const htmlify = data => {
  const message = [
    `<html>
        <table>
          <tr><th width="80px">Data</th><th>Nazwa</th><th>Wartość</th><th>Zmiana</th></tr>`,
    ...data.map(row => `<tr>
                            <td>${row[0]}</td>
                            <td>${row[1]}</td>
                            <td style="text-align: right; width: 60px;">${row[2]}</td>
                            <td style="text-align: right; width: 60px; color:${colorFormat(row[3])}">${row[3]}</td>
                        </tr>`),
      `</table>
    </html>`
  ].join('')
  return message
}

const send = (auth, config, data) => {
  const gmail = require('googleapis').gmail('v1')
  const date = new Date
  const formattedDate = `${require('./utils').dateFormat(date)} ${require('./utils').timeFormat(date)}`
  const mime = [
    'Content-Type: text/html; charset="UTF-8"\n',
    'MIME-Version: 1.0\n',
    'Content-Transfer-Encoding: 7bit\n',
    `to: ${config.gmail.to}\n`,
    `from: ${config.gmail.from}\n`,
    `subject: ${config.gmail.subject} ${formattedDate}\n\n`,
    htmlify(data)
  ].join('')

  const raw = new Buffer(mime).toString('base64').replace(/\+/g, '-').replace(/\//g, '_')

  return new Promise((resolve, reject) => {
    gmail.users.messages.send({
      auth,
      userId: 'me',
      resource: {
        raw
      }
    }, reject)

    resolve(true)
  })

}

module.exports = {
  send
}
