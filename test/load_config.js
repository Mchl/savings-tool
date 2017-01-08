const {describe, it} = require('mocha')
const expect = require('expect')
const loadConfig = require('../src/load_config')


describe('loadConfig', () => {
  it('return a state in which config property is set to the one given in argument', () => {
    const state = {}
    const config = {
      config: 'config'
    }

    const expected = config
    const actual = loadConfig(state, config).config

    expect(actual).toEqual(expected)
  })
})
