let drone = require('./utils/drone')

let repo, sha, event, branch, ci

if (process.env.TRAVIS) {
  // Reference: https://docs.travis-ci.com/user/environment-variables

  repo = process.env.TRAVIS_REPO_SLUG
  sha = process.env.TRAVIS_PULL_REQUEST_SHA || process.env.TRAVIS_COMMIT
  event = process.env.TRAVIS_EVENT_TYPE

  branch = process.env.TRAVIS_EVENT_TYPE === 'push'
    ? process.env.TRAVIS_BRANCH
    : process.env.TRAVIS_PULL_REQUEST_BRANCH

  ci = 'travis'
} else if (process.env.CIRCLECI) {
  // Reference: https://circleci.com/docs/1.0/environment-variables

  repo =
    process.env.CIRCLE_PROJECT_USERNAME +
    '/' +
    process.env.CIRCLE_PROJECT_REPONAME

  sha = process.env.CIRCLE_SHA1
  event = 'push'
  branch = process.env.CIRCLE_BRANCH
  ci = 'circle'
} else if (process.env.WERCKER) {
  repo =
    process.env.WERCKER_GIT_OWNER + '/' + process.env.WERCKER_GIT_REPOSITORY

  sha = process.env.WERCKER_GIT_COMMIT
  event = 'push'
  branch = process.env.WERCKER_GIT_BRANCH
  ci = 'wercker'
} else if (process.env.DRONE) {
  // Reference: http://readme.drone.io/usage/environment-reference/ for reference.
  
  repo = process.env.DRONE_REPO || process.env.CI_REPO || drone.getLegacyRepo(process.env)
  sha = process.env.DRONE_COMMIT || process.env.CI_COMMIT
  // DRONE_BUILD_EVENT available in drone > v0.5
  // DRONE_EVENT, CI_EVENT available in drone < v0.5
  // no EVENT available in drone < v0.4
  event = process.env.DRONE_BUILD_EVENT || process.env.DRONE_EVENT || process.env.CI_EVENT || 'push'
  branch = process.env.DRONE_BRANCH || process.env.CI_BRANCH
  ci = 'drone'
}

module.exports = { repo, sha, event, branch, ci }
