const {describe, it} = require('mocha')
const expect = require('expect')
const inspectState = require('../src/inspect_state')

describe('inspectState', () => {
  it('should return the state given in argument', () => {
    const expected = {state: 'state'}

    const actual = inspectState(expected)
    expect(actual).toBe(expected)
  })
})
