const {isNil} = require('lodash');

module.exports = ({changelogFile, changelogTitle, branches}) => ({
  changelogFile: isNil(changelogFile) ? 'CHANGELOG.md' : changelogFile,
  changelogTitle,
  branches,
});
