let drone = require('./utils/drone')
let repo, sha, event, commit_message, pull_request_number, branch, ci, jobUrl, buildUrl

if (process.env.TRAVIS) {
  // Reference: https://docs.travis-ci.com/user/environment-variables

  repo = process.env.TRAVIS_REPO_SLUG
  sha = process.env.TRAVIS_PULL_REQUEST_SHA || process.env.TRAVIS_COMMIT
  event = process.env.TRAVIS_EVENT_TYPE
  commit_message = process.env.TRAVIS_COMMIT_MESSAGE
  pull_request_number = process.env.TRAVIS_PULL_REQUEST
  jobUrl = `https://travis-ci.org/${repo}/jobs/${process.env.TRAVIS_JOB_ID}`
  buildUrl = `https://travis-ci.org/${repo}/builds/${process.env.TRAVIS_JOB_ID}`

  branch =
    process.env.TRAVIS_EVENT_TYPE === 'push'
      ? process.env.TRAVIS_BRANCH
      : process.env.TRAVIS_PULL_REQUEST_BRANCH

  ci = 'travis'
} else if (process.env.CIRCLECI) {
  // Reference: https://circleci.com/docs/1.0/environment-variables

  repo = process.env.CIRCLE_PROJECT_USERNAME + '/' + process.env.CIRCLE_PROJECT_REPONAME

  sha = process.env.CIRCLE_SHA1
  event = 'push'
  commit_message = '' // circle does not expose commit message
  if (process.env.CI_PULL_REQUEST) {
    pull_request_number = process.env.CI_PULL_REQUEST.split('/').pop() // take number from returns url
  } else pull_request_number = ''
  branch = process.env.CIRCLE_BRANCH
  ci = 'circle'
} else if (process.env.WERCKER) {
  // Reference: https://devcenter.wercker.com/docs/environment-variables/available-env-vars

  repo = process.env.WERCKER_GIT_OWNER + '/' + process.env.WERCKER_GIT_REPOSITORY

  sha = process.env.WERCKER_GIT_COMMIT
  event = 'push'
  commit_message = '' // wercker does not expose commit message
  pull_request_number = '' // wercker does not expose pull request number
  branch = process.env.WERCKER_GIT_BRANCH
  ci = 'wercker'
} else if (process.env.DRONE) {
  // Reference: http://readme.drone.io/usage/environment-reference

  repo = process.env.DRONE_REPO || process.env.CI_REPO || drone.getLegacyRepo(process.env)
  sha = process.env.DRONE_COMMIT || process.env.CI_COMMIT
  // DRONE_BUILD_EVENT available in drone > v0.5
  // DRONE_EVENT, CI_EVENT available in drone < v0.5
  // no EVENT available in drone < v0.4
  event = process.env.DRONE_BUILD_EVENT || process.env.DRONE_EVENT || process.env.CI_EVENT || 'push'
  commit_message = '' // drone does not expose commit message
  pull_request_number = process.env.DRONE_PULL_REQUEST
  branch = process.env.DRONE_BRANCH || process.env.CI_BRANCH
  ci = 'drone'
} else if (process.env.CI_NAME === 'codeship') {
  // Reference: https://documentation.codeship.com/basic/builds-and-configuration/set-environment-variables/#default-environment-variables

  repo = process.env.CI_REPO_NAME
  branch = process.env.CI_BRANCH
  commit_message = process.env.CI_COMMIT_MESSAGE || process.env.CI_MESSAGE

  event = 'push'
  sha = ''
  pull_request_number = ''

  ci = 'codeship'
} else if (process.env.CI) {
  // Generic variables for docker images, custom CI builds, etc.

  repo = process.env.CI_REPO_OWNER + '/' + process.env.CI_REPO_NAME

  sha = process.env.CI_COMMIT_SHA
  event = process.env.CI_EVENT || 'push'
  commit_message = process.env.CI_COMMIT_MESSAGE
  pull_request_number = process.env.CI_PULL_REQUEST_NUMBER
  branch = process.env.CI_BRANCH
  ci = 'custom'
}

module.exports = { repo, sha, event, commit_message, branch, pull_request_number, ci, jobUrl, buildUrl }
