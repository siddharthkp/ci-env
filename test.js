const test = require('ava')

const { repo, sha, event, commit_message, branch, ci, platform } = require('./index')

if (ci) {
  console.log('values: ', repo, sha, event, branch, ci, platform)

  test('ci is correctly set', t => {
    if (process.env.TRAVIS) t.is(ci, 'travis')
    else if (process.env.CIRCLECI) t.is(ci, 'circle')
    else if (process.env.WERCKER) t.is(ci, 'wercker')
    else if (process.env.DRONE) t.is(ci, 'drone')
  })

  test('repo is correctly set', t => t.is(repo, 'siddharthkp/ci-env'))

  test('sha is set', t => {
    const real_sha =
      process.env.TRAVIS_PULL_REQUEST_SHA ||
      process.env.TRAVIS_COMMIT ||
      process.env.CIRCLE_SHA1 ||
      process.env.WERCKER_GIT_COMMIT ||
      process.env.DRONE_COMMIT

    t.is(sha, real_sha)
  })

  test('commit_message is set', t => {
    const real_commit_message = process.env.TRAVIS_COMMIT_MESSAGE || ''
    // Only travis sets commit message
    t.is(commit_message, real_commit_message)
  })

  test('event is correctly set', t => {
    if (ci === 'travis' && process.env.TRAVIS_EVENT_TYPE === 'pull_request')
      t.is(event, 'pull_request')
    else t.is(event, 'push')
  })

  test('branch is correctly set', t => {
    if (event === 'pull_request')
      t.is(branch, process.env.TRAVIS_PULL_REQUEST_BRANCH)
    else {
      const real_branch =
        process.env.TRAVIS_BRANCH ||
        process.env.CIRCLE_BRANCH ||
        process.env.WERCKER_GIT_BRANCH ||
        process.env.DRONE_BRANCH

      t.is(branch, real_branch)
    }
  })

  test('platform is correctly set', t => {
    const pattern = new RegExp(/https:\/\/([a-z]+)/i)
    let matchedStrings;
    let real_platform;
    if(process.env.TRAVIS){
      real_platform = 'github'
    }
    if(process.env.CIRCLECI){
      matchedStrings = pattern.exec(process.env.CIRCLE_REPOSITORY_URL)
      real_platform = (matchedStrings && matchedStrings[1]) || ''
    }
    if(process.env.WERCKER){
      matchedStrings = /[a-z]+/i.exec(process.env.CIRCLE_REPOSITORY_URL)
      real_platform = (matchedStrings && matchedStrings[0]) || ''
    }
    if(process.env.DRONE){
      matchedStrings = pattern.exec(process.env.CIRCLE_REPOSITORY_URL)
      real_platform = (matchedStrings && matchedStrings[1]) || ''
    }
    if(process.env.CI){
      real_platform = process.env.CI_PLATFORM
    }

  t.is(platform, real_platform)
  })
} else {
  console.log('These tests can only run in CI environments')
  test(t => t.pass())
}
