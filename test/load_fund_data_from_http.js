const {describe, it} = require('mocha')
const expect = require('expect')
const loadFundDataFromHttp = require('../src/load_fund_data_from_http')

describe('loadFundDataFromHttp', () => {
  it('should call request method of http passing options from config', () => {
    const http = {
      request: expect.createSpy()
    }
    const state = {
      config: {
        requestOptions: {
          requestOptions: 'requestOptions'
        }
      }
    }

    loadFundDataFromHttp(state, http)
    const expected = state.config.requestOptions
    const actual = http.request.calls[0].arguments[0]

    expect(actual).toEqual(expected)
    expect.restoreSpies()
  })
})
