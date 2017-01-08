const {describe, it} = require('mocha')
const expect = require('expect')
const splitFundGroups = require('../src/split_fund_groups')

describe('splitFundGroups', () => {
  it('should pass each fund group to a function passed as the second argument', () => {
    const state = {
      groupedFundIds: [[1, 2, 3], [4, 5, 6]]
    }
    const subFunction = expect.createSpy()

    splitFundGroups(state, subFunction)

    const expected = [
      [1, 2, 3],
      [4, 5, 6]
    ]

    const actual = subFunction.calls.map(({arguments}) => arguments[0].fundIds)

    expect(actual).toMatch(expected)
  })

  it('should resolve to a conjunction of values from processing all groups', () => {
    const state = {
      groupedFundIds: [[1, 2, 3], [4, 5, 6]]
    }
    const expected = [
      'foo', 'foo'
    ]
    const subFunction = expect.createSpy().andReturn(Promise.resolve('foo'))

    splitFundGroups(state, subFunction)
      .then(state => {
        const actual = state.rawFundData
        expect(actual).toEqual(expected)
      })
  })
})
