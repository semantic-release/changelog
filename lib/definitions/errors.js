const url = require('url');
const pkg = require('../../package.json');

const homepage = url.format({...url.parse(pkg.homepage), ...{hash: null}});
const linkify = file => `${homepage}/blob/master/${file}`;

module.exports = {
  EINVALIDCHANGELOGFILE: ({changelogFile}) => ({
    message: 'Invalid `changelogFile` option.',
    details: `The [changelogFile option](${linkify(
      'README.md#options'
    )}) option, if defined, must be a non empty \`String\`.

Your configuration for the \`changelogFile\` option is \`${changelogFile}\`.`,
  }),
  EINVALIDCHANGELOGTITLE: ({changelogTitle}) => ({
    message: 'Invalid `changelogTitle` option.',
    details: `The [changelogTitle option](${linkify(
      'README.md#options'
    )}) option, if defined, must be a non empty \`String\`.

Your configuration for the \`changelogTitle\` option is \`${changelogTitle}\`.`,
  }),
};
