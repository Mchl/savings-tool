module.exports = {
    fundsToTrack: [1500037,3,26,22],
    requestInterval: 60000,
    requestOptions: {
        hostname: 'www.nntfi.pl',
        path: '/?action=quotes.getQuotesValuesAsJSON&unitCategoryId=5&fundId=',
        method: 'POST',
        header: {
            'Content-Length': 0
        }
    }
}