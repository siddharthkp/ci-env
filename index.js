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
}
sha = 'asd'

module.exports = { repo, sha, event, branch, ci }
