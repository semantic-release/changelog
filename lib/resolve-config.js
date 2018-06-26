const {isUndefined} = require('lodash');

module.exports = ({changelogFile, changelogTitle}) => ({
  changelogFile: isUndefined(changelogFile) ? 'CHANGELOG.md' : changelogFile,
  changelogTitle,
});
