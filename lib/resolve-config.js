const {isNil} = require('lodash');

module.exports = ({changelogFile, changelogTitle, ignoreBranch}) => ({
  changelogFile: isNil(changelogFile) ? 'CHANGELOG.md' : changelogFile,
  changelogTitle,
  ignoreBranch,
});
