const {describe, it} = require('mocha')
const expect = require('expect')
const groupFundIds = require('../src/group_fund_ids')

describe('groupFundIds', () => {
  it('should group fund ids into groups of 4', () => {
    const data = [
      {
        funds: [],
        expected: [[]]},
      {
        funds: [{id: 1}],
        expected: [[1]]},
      {
        funds: [{id: 1}, {id: 2}],
        expected: [[1, 2]]
      },
      {
        funds: [{id: 1}, {id: 2}, {id: 3}],
        expected: [[1, 2, 3]]
      },
      {
        funds: [{id: 1}, {id: 2}, {id: 3}, {id: 4}],
        expected: [[1, 2, 3 ,4]]
      },
      {
        funds: [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}],
        expected: [[1, 2, 3, 4], [5]]
      },
      {
        funds: [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}],
        expected: [[1, 2, 3, 4], [5, 6]]
      },
      {
        funds: [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}, {id: 7}],
        expected: [[1, 2, 3, 4], [5, 6, 7]]
      },
      {
        funds: [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}, {id: 7}, {id: 8}],
        expected: [[1, 2, 3, 4], [5 ,6 ,7 ,8]]
      },
      {
        funds: [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}, {id: 7}, {id: 8}, {id: 9}],
        expected: [[1, 2, 3, 4], [5, 6, 7, 8], [9]]
      },
    ]

    data.forEach(({funds, expected}) => {
      const state = {funds}
      const actual = groupFundIds(state).groupedFundIds
      expect(actual).toEqual(expected)
    })

  })
})
