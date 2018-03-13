[![Build Status](http://drone-community.eastus.cloudapp.azure.com/api/badge/github.com/siddharthkp/ci-env/status.svg?branch=master)](http://drone-community.eastus.cloudapp.azure.com/github.com/siddharthkp/ci-env)

<p align="center">
  <br>
  <b>Environment variables exposed by CI tools</b>
  <br>
</p>

&nbsp;

Supports travis, circle, wercker, drone and codeship.

Kinda supports custom CI as well. [Specs here](https://github.com/siddharthkp/ci-env/blob/master/index.js#L68-L79)

&nbsp;

#### Installation

```
npm install ci-env
```

&nbsp;

#### Usage

```js
const { repo, sha, event, commit_message, pull_request_number, branch, ci } = require('ci-env')
```

&nbsp;

#### like it?

⭐️ this repo

&nbsp;

#### License

MIT © siddharthkp
