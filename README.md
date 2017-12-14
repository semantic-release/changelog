# @semantic-release/changelog

Set of [semantic-release](https://github.com/semantic-release/semantic-release) plugins for creating or updating a changelog file.

[![Travis](https://img.shields.io/travis/semantic-release/changelog.svg)](https://travis-ci.org/semantic-release/changelog)
[![Codecov](https://img.shields.io/codecov/c/github/semantic-release/changelog.svg)](https://codecov.io/gh/semantic-release/changelog)
[![Greenkeeper badge](https://badges.greenkeeper.io/semantic-release/changelog.svg)](https://greenkeeper.io/)

## verifyConditions

Verify the `changelogFile` option configuration.

## publish

Create or update the changelog file in the local project repository.

## Configuration

### Options

| Options         | Description                 | Default        |
|-----------------|-----------------------------|----------------|
| `changelogFile` | File path of the changelog. | `CHANGELOG.md` |

### Usage

Options can be set within the plugin definition in the `semantic-release` configuration file:

```json
{
  "release": {
    "publish": [
      {
        "path": "@semantic-release/changelog",
        "changelogFile": "docs/changelog.md",
      },
      "@semantic-release/git"
    ]
  }
}
```

**It's recommended to use this plugin with the [git](https://github.com/semantic-release/git) plugin, so the changelog file will be committed to the Git repository and available on subsequent builds in order to be updated.**

**When using with the [npm](https://github.com/semantic-release/npm) plugin and/or the [git](https://github.com/semantic-release/git) plugin the `changelog` plugin must be called first in order to create or update the changelog file, so it can be included in the npm package and committed to the Git repository.**

To use with the [npm](https://github.com/semantic-release/npm), [git](https://github.com/semantic-release/git) and [condition-travis](https://github.com/semantic-release/condition-travis) plugins:

```json
{
  "release": {
    "verifyConditions": ["@semantic-release/condition-travis", "@semantic-release/changelog", "@semantic-release/npm", "@semantic-release/git"],
    "publish": ["@semantic-release/changelog", "@semantic-release/npm", "@semantic-release/git"]
  }
}
```
