workflow "Test for pr" {
  resolves = ["npm test (pr)"]
  on = "pull_request"
}

action "npm install (pr)" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "install"
}

action "npm test (pr)" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["npm install (pr)"]
  args = "test"
}

workflow "Test for push" {
  resolves = ["npm test (push)"]
  on = "push"
}

action "npm install (push)" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "install"
}

action "npm test (push)" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["npm install (push)"]
  args = "test"
}
