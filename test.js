const test = require('ava')

const { buildUrl, repo, sha, event, commit_message, pull_request_number, branch, ci } = require('./index')

if (ci) {
  console.log('values: ', { repo, sha, event, commit_message, pull_request_number, branch, ci })

  test('ci is correctly set', t => {
    if (process.env.TRAVIS) t.is(ci, 'travis')
    else if (process.env.CIRCLECI) t.is(ci, 'circle')
    else if (process.env.WERCKER) t.is(ci, 'wercker')
    else if (process.env.DRONE) t.is(ci, 'drone')
    else if (process.env.CI_NAME === 'codeship') t.is(ci, 'codeship')
    else if (process.env.CF_BUILD_URL) t.is(ci, 'codefresh')
  })

  test('repo is correctly set', t => t.is(repo, 'siddharthkp/ci-env'))

  test('sha is set', t => {
    const real_sha =
      process.env.TRAVIS_PULL_REQUEST_SHA ||
      process.env.TRAVIS_COMMIT ||
      process.env.CIRCLE_SHA1 ||
      process.env.WERCKER_GIT_COMMIT ||
      process.env.DRONE_COMMIT ||
      process.env.CF_REVISION

    t.is(sha, real_sha)
  })

  test('commit_message is set', t => {
    const real_commit_message =
      process.env.TRAVIS_COMMIT_MESSAGE ||
      process.env.CI_COMMIT_MESSAGE ||
      process.env.CI_MESSAGE ||
      process.env.CF_COMMIT_MESSAGE ||
      ''
    // Only travis, codefresh and codeship set commit message
    t.is(commit_message, real_commit_message)
  })

  test('pull_request_number is set', t => {
    let circlePullRequestNumber
    if (process.env.CI_PULL_REQUEST)
      circlePullRequestNumber = process.env.CI_PULL_REQUEST.split('/').pop()

    const real_pull_request_number =
      process.env.TRAVIS_PULL_REQUEST ||
      process.env.DRONE_PULL_REQUEST ||
      circlePullRequestNumber ||
      process.env.CF_PULL_REQUEST_NUMBER ||
      '' // wercker does not expose pull request number

    t.is(pull_request_number, real_pull_request_number)
  })

  test('buildUrl is set', t => {
    let real_buildUrl
    if (process.env.TRAVIS) real_buildUrl = `https://travis-ci.org/${repo}/builds/${process.env.TRAVIS_JOB_ID}`
    if (process.env.CF_BUILD_URL) real_buildUrl = process.env.CF_BUILD_URL
    t.is(buildUrl, real_buildUrl)
  })

  test('event is correctly set', t => {
    if (ci === 'travis' && process.env.TRAVIS_EVENT_TYPE === 'pull_request')
      t.is(event, 'pull_request')
    else t.is(event, 'push')
  })

  test('branch is correctly set', t => {
    if (event === 'pull_request') t.is(branch, process.env.TRAVIS_PULL_REQUEST_BRANCH)
    else {
      const real_branch =
        process.env.TRAVIS_BRANCH ||
        process.env.CIRCLE_BRANCH ||
        process.env.WERCKER_GIT_BRANCH ||
        process.env.DRONE_BRANCH ||
        process.env.CI_BRANCH || // codeship
        process.env.CF_BRANCH
      t.is(branch, real_branch)
    }
  })
} else {
  console.log('These tests can only run in CI environments')
  test(t => t.pass())
}
