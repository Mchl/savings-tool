const {describe, it} = require('mocha')
const expect = require('expect')
const mergeFundData = require('../src/merge_fund_data')

describe('mergeFundData', () => {
  // it('should merge rawFundData into structured data', () => {
  //   const state = {
  //     funds: [
  //       {id: 1},
  //       {id: 2},
  //       {id: 3},
  //       {id: 4}
  //     ],
  //     rawFundData: [
  //       {
  //         fundIds: [1, 2],
  //         rawFundData: [2,
  //           [
  //             [1096329600000, 100],
  //             [1096416000000, 101]
  //           ], [
  //             [1096329600000, 102],
  //             [1096416000000, 103]
  //           ]
  //         ]
  //       },
  //       {
  //         fundIds: [3, 4],
  //         rawFundData: [2,
  //           [
  //             [1096329600000, 104],
  //             [1096416000000, 105]
  //           ], [
  //             [1096329600000, 106],
  //             [1096416000000, 107]
  //           ]
  //         ]
  //       }
  //     ]
  //   }
  //
  //   const expecteds = [
  //     [],
  //     [[1096329600000, 100], [1096416000000, 101]],
  //     [[1096329600000, 102], [1096416000000, 103]],
  //     [[1096329600000, 104], [1096416000000, 105]],
  //     [[1096329600000, 106], [1096416000000, 107]]
  //   ]
  //
  //   return mergeFundData(state).then(state => {
  //     state.funds.forEach(({id, quotes}) => {
  //       const actual = quotes
  //       const expected = expecteds[id]
  //       expect(actual).toEqual(expected)
  //     })
  //
  //   })
  // })
})
