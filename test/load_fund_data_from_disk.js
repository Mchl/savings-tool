const {describe, it} = require('mocha')
const expect = require('expect')
const loadFundDataFromDisk = require('../src/load_fund_data_from_disk')

describe('loadFundDataFromDisk', () => {
  it('should load the file matching the first index given in argument', () => {
    const data = [
      {fundIds: [1, 2, 3], expected: [1096329600000,187.5500]},
      {fundIds: [8, 9, 10], expected: [1411516800000,255.3600]}
    ]

    data.forEach(({fundIds, expected}) => {
      const actual = loadFundDataFromDisk({fundIds}).rawFundData[1][0]
      expect(actual).toEqual(expected)
    })
  })
})
