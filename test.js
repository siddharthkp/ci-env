const test = require('ava')

const { repo, sha, event, branch, ci } = require('./index')

if (!ci) {
  console.log('These tests can only run in CI environments')
  process.exit(0)
}

console.log('values: ', repo, sha, event, branch, ci)

test('ci is correctly set', t => {
  if (process.env.TRAVIS) t.is(ci, 'travis')
  else if (process.env.CIRCLECI) t.is(ci, 'circle')
})

test('repo is correctly set', t => t.is(repo, 'siddharthkp/ci-env'))

test('sha is set', t => {
  const real_sha =
    process.env.TRAVIS_PULL_REQUEST_SHA ||
    process.env.TRAVIS_COMMIT ||
    process.env.CIRCLE_SHA1

  t.is(sha, real_sha)
})

test('event is correctly set', t => {
  if (ci === 'travis' && process.env.TRAVIS_EVENT_TYPE === 'pull_request')
    t.is(event, 'pull_request')
  else t.is(event, 'push')
})

test('branch is correctly set', t => {
  if (ci === 'travis' && event === 'push')
    t.is(branch, process.env.TRAVIS_BRANCH)
  else if (ci === 'travis' && event === 'pull_request')
    t.is(branch, process.env.TRAVIS_PULL_REQUEST_BRANCH)
  else if (ci === 'circle') t.is(branch, process.env.CIRCLE_BRANCH)
})
