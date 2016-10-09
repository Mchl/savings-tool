const send = (auth, config, message) => {
    const gmail = require('googleapis').gmail('v1')
    const mime = [
        'Content-Type: text/plain; charset="UTF-8"\n',
        'MIME-Version: 1.0\n',
        'Content-Transfer-Encoding: 7bit\n',
        `to: ${config.gmail.to}\n`,
        `from: ${config.gmail.from}\n`,
        `subject: ${config.gmail.subject} ${new Date}\n\n`,
        JSON.stringify(message)
    ].join('')

    const raw = new Buffer(mime).toString('base64').replace(/\+/g, '-').replace(/\//g, '_')

    gmail.users.messages.send({
        auth,
        userId: 'me',
        resource: {
            raw
        }
    })
}

module.exports = {
    send
}