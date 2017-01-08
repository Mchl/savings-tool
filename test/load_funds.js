const {describe, it} = require('mocha')
const expect = require('expect')
const loadFunds = require('../src/load_funds')


describe('loadFunds', () => {
  it('should return a state in which funds property is set to the one given in argument', () => {
    const state = {}
    const funds = {
      funds: 'funds'
    }

    const expected = funds
    const actual = loadFunds(state, funds).funds

    expect(actual).toEqual(expected)
  })
})
