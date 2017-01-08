const {describe, it} = require('mocha')
const expect = require('expect')
const filterFunds = require('../src/filter_funds')

describe('filterFunds', () => {
  it('should filter out funds according to config', () => {
    const state = {
      config: {
        fundsToTrack: [1 ,2, 4, 6, 7, 8]
      },
      funds: [
        {id: 1},
        {id: 2},
        {id: 3},
        {id: 4},
        {id: 5},
        {id: 6},
      ]
    }

    const expected = [
      {id: 1},
      {id: 2},
      {id: 4},
      {id: 6},
    ]

    const actual = filterFunds(state).funds

    expect(actual).toEqual(expected)
  })
})
