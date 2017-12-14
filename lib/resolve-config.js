const {isUndefined} = require('lodash');

module.exports = ({changelogFile}) => ({
  changelogFile: isUndefined(changelogFile) ? 'CHANGELOG.md' : changelogFile,
});
