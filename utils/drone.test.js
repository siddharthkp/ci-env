const test = require('ava')
const drone = require('./drone')

test('getLegacyRepo', t => {
  const valid = [{
    DRONE_REMOTE: 'git://github.com/montmanu/ci-env.git'
  }, {
    CI_REMOTE: 'git://github.com/montmanu/ci-env.git'
  }]
  const invalid = [{}]
  const expected = 'montmanu/ci-env'
  
  valid.forEach(env => {
    const actual = drone.getLegacyRepo(env)
    t.is(actual, expected)
  })

  invalid.forEach(env => {
    const actual = drone.getLegacyRepo(env)
    t.is(actual, '')
  })
})