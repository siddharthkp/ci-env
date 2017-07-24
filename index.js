let repo, sha, event, commit_message, branch, ci

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
} else if (process.env.WERCKER) {
  // Reference: https://devcenter.wercker.com/docs/environment-variables/available-env-vars

  repo =
    process.env.WERCKER_GIT_OWNER + '/' + process.env.WERCKER_GIT_REPOSITORY

  sha = process.env.WERCKER_GIT_COMMIT
  event = 'push'
  commit_message = '' // wercker does not expose commit message
  branch = process.env.WERCKER_GIT_BRANCH
  ci = 'wercker'
} else if (process.env.CI) {
  // Generic variables for docker images, custom CI builds, etc.
  
  repo =
    process.env.CI_REPO_OWNER + '/' + process.env.CI_REPO_NAME

  sha = process.env.CI_COMMIT_SHA
  event = process.env.CI_EVENT || 'push'
  commit_message = process.env.CI_COMMIT_MESSAGE
  branch = process.env.CI_BRANCH
  ci = 'custom'
}

module.exports = { repo, sha, event, commit_message, branch, ci }
