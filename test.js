const test = require("ava");

const {
  buildUrl,
  jobUrl,
  repo,
  sha,
  event,
  commit_message,
  pull_request_number,
  branch,
  ci,
  platform
} = require("./index");

if (ci) {
  console.log("values: ", {
    repo,
    sha,
    event,
    commit_message,
    pull_request_number,
    branch,
    ci
  });

  test("ci is correctly set", t => {
    if (process.env.TRAVIS) t.is(ci, "travis");
    else if (process.env.CIRCLECI) t.is(ci, "circle");
    else if (process.env.WERCKER) t.is(ci, "wercker");
    else if (process.env.DRONE) t.is(ci, "drone");
    else if (process.env.CI_NAME === "codeship") t.is(ci, "codeship");
    else if (process.env.CI === "woodpecker") t.is(ci, "woodpecker");
    else if (process.env.GITHUB_ACTION) t.is(ci, "github_actions");
    else if (process.env.GITLAB_CI) t.is(ci, "gitlab");
    else if (process.env.CF_BUILD_URL) t.is(ci, "codefresh");
    else if (process.env.CF_PAGES) t.is(ci, "cloudflare");
  });

  test("repo is correctly set", t => {
    if (process.env.GITLAB_CI) t.is(repo, process.env.CI_PROJECT_PATH);
    else t.is(repo, "siddharthkp/ci-env");
  });

  test("sha is set", t => {
    const real_sha =
      process.env.TRAVIS_PULL_REQUEST_SHA ||
      process.env.TRAVIS_COMMIT ||
      process.env.CIRCLE_SHA1 ||
      process.env.WERCKER_GIT_COMMIT ||
      process.env.DRONE_COMMIT ||
      process.env.GITHUB_SHA ||
      process.env.CI_COMMIT_SHA || //gitlab & woodpecker
      process.env.CF_REVISION ||
      process.env.CF_PAGES_COMMIT_SHA;

    t.is(sha, real_sha);
  });

  test("commit_message is set", t => {
    const real_commit_message =
      process.env.TRAVIS_COMMIT_MESSAGE ||
      process.env.CI_COMMIT_MESSAGE ||
      process.env.CI_MESSAGE ||
      process.env.CF_COMMIT_MESSAGE ||
      process.env.CI_COMMIT_MESSAGE || // woodpecker
      "";
    // Only travis and codeship set commit message
    t.is(commit_message, real_commit_message);
  });

  test("pull_request_number is set", t => {
    let pullRequestNumber;
    if (process.env.CI_PULL_REQUEST)
      pullRequestNumber = process.env.CI_PULL_REQUEST.split("/").pop();
    if(process.env.GITHUB_ACTION && event === "pull_request")
      pullRequestNumber = process.env.GITHUB_REF.split('/')[2];

    const real_pull_request_number =
      process.env.TRAVIS_PULL_REQUEST ||
      process.env.DRONE_PULL_REQUEST ||
      process.env.CI_MERGE_REQUEST_ID || // gitlab
      process.env.CF_PULL_REQUEST_NUMBER ||
      process.env.CI_COMMIT_PULL_REQUEST || // woodpecker
      pullRequestNumber ||
      ""; // wercker does not expose pull request number

    t.is(pull_request_number, real_pull_request_number);
  });

  test("jobUrl is set", t => {
    let realJobUrl;
    if (process.env.TRAVIS)
    realJobUrl = `https://travis-ci.org/${repo}/jobs/${
        process.env.TRAVIS_JOB_ID
      }`;
    else if (process.env.GITLAB_CI) realJobUrl = process.env.CI_JOB_URL;

    const real_job_url =
      process.env.CI_BUILD_LINK ||
      realJobUrl;
    t.is(jobUrl, real_job_url);
  });

  test("buildUrl is set", t => {
    let realBuildUrl;
    if (process.env.TRAVIS)
    realBuildUrl = `https://travis-ci.org/${repo}/builds/${
        process.env.TRAVIS_JOB_ID
      }`;
    else if (process.env.CF_BUILD_URL) realBuildUrl = process.env.CF_BUILD_URL;

    const real_build_url =
      process.env.CI_BUILD_LINK ||
      realBuildUrl;
    t.is(buildUrl, real_build_url);
  });

  test("event is correctly set", t => {
    if (
      (ci === "travis" && process.env.TRAVIS_EVENT_TYPE === "pull_request") ||
      (ci === "github_actions" && process.env.GITHUB_EVENT_NAME === "pull_request") ||
      (ci === "woodpecker" && process.env.CI_BUILD_EVENT === "pull_request")
    )
      t.is(event, "pull_request");
    else t.is(event, "push");
  });

  test("branch is correctly set", t => {
    if (event === "pull_request")
      t.is(
        branch,
        process.env.TRAVIS_PULL_REQUEST_BRANCH || process.env.GITHUB_HEAD_REF || process.env.CI_COMMIT_TARGET_BRANCH
      );
    else {
      let real_branch =
        process.env.TRAVIS_BRANCH ||
        process.env.CIRCLE_BRANCH ||
        process.env.WERCKER_GIT_BRANCH ||
        process.env.DRONE_BRANCH ||
        process.env.CI_BRANCH || // codeship
        process.env.CI_COMMIT_REF_NAME || // gitlab
        process.env.CI_COMMIT_BRANCH // woodpecker
        process.env.CF_BRANCH ||
        process.env.CF_PAGES_BRANCH;

      if (process.env.GITHUB_ACTION) real_branch = process.env.GITHUB_REF.split('/')[2]

      t.is(branch, real_branch);
    }
  });
} else {
  test.skip("These tests can only run in CI environments", t => t.pass());
}
