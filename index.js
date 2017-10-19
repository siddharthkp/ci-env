let drone = require('./utils/drone')
let repo, sha, event, commit_message, branch, ci, platform

// Generic pattern that is mostly used
// First matched group captured by capturing parenthesis will be the "platform"
// Will use exec method to get the matched groups. 1st index of the matched groups
// array will hold the "platform"
const pattern = new RegExp(/https:\/\/([a-z]+)/i)

if (process.env.TRAVIS) {
  // Reference: https://docs.travis-ci.com/user/environment-variables

  repo = process.env.TRAVIS_REPO_SLUG
  sha = process.env.TRAVIS_PULL_REQUEST_SHA || process.env.TRAVIS_COMMIT
  event = process.env.TRAVIS_EVENT_TYPE
  commit_message = process.env.TRAVIS_COMMIT_MESSAGE

  branch = process.env.TRAVIS_EVENT_TYPE === 'push'
    ? process.env.TRAVIS_BRANCH
    : process.env.TRAVIS_PULL_REQUEST_BRANCH

  ci = 'travis'

  // As travis ci works only with github.com
  // Reference: https://docs.travis-ci.com/user/customizing-the-build/#What-repository-providers-or-version-control-systems-can-I-use%3F
  platform = 'github'
} else if (process.env.CIRCLECI) {
  // Reference: https://circleci.com/docs/1.0/environment-variables

  repo =
    process.env.CIRCLE_PROJECT_USERNAME +
    '/' +
    process.env.CIRCLE_PROJECT_REPONAME

  sha = process.env.CIRCLE_SHA1
  event = 'push'
  commit_message = '' // circle does not expose commit message
  branch = process.env.CIRCLE_BRANCH
  ci = 'circle'
  platform = pattern.exec(process.env.CIRCLE_REPOSITORY_URL)[1]
} else if (process.env.WERCKER) {
  // Reference: https://devcenter.wercker.com/docs/environment-variables/available-env-vars

  repo =
    process.env.WERCKER_GIT_OWNER + '/' + process.env.WERCKER_GIT_REPOSITORY

  sha = process.env.WERCKER_GIT_COMMIT
  event = 'push'
  commit_message = '' // wercker does not expose commit message
  branch = process.env.WERCKER_GIT_BRANCH
  ci = 'wercker'

  // As wercker provides only the domain (like github.com) not the full repo url
  platform = /[a-z]+/i.exec(process.env.WERCKER_GIT_DOMAIN)[0]
} else if (process.env.DRONE) {
  // Reference: http://readme.drone.io/usage/environment-reference/ for reference.
  
  repo = process.env.DRONE_REPO || process.env.CI_REPO || drone.getLegacyRepo(process.env)
  sha = process.env.DRONE_COMMIT || process.env.CI_COMMIT
  // DRONE_BUILD_EVENT available in drone > v0.5
  // DRONE_EVENT, CI_EVENT available in drone < v0.5
  // no EVENT available in drone < v0.4
  event = process.env.DRONE_BUILD_EVENT || process.env.DRONE_EVENT || process.env.CI_EVENT || 'push'
  commit_message = '' // drone does not expose commit message
  branch = process.env.DRONE_BRANCH || process.env.CI_BRANCH
  ci = 'drone'
  platform = pattern.exec(process.env.DRONE_REMOTE_URL)[1]
} else if (process.env.CI) {
  // Generic variables for docker images, custom CI builds, etc.
  
  repo =
    process.env.CI_REPO_OWNER + '/' + process.env.CI_REPO_NAME

  sha = process.env.CI_COMMIT_SHA
  event = process.env.CI_EVENT || 'push'
  commit_message = process.env.CI_COMMIT_MESSAGE
  branch = process.env.CI_BRANCH
  ci = 'custom'
  platform = process.env.CI_PLATFORM
}

module.exports = { repo, sha, event, commit_message, branch, ci, platform }
