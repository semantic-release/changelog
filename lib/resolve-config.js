const {isNil} = require('lodash');

module.exports = ({changelogFile, changelogTitle, skipOnPrerelease}) => ({
  changelogFile: isNil(changelogFile) ? 'CHANGELOG.md' : changelogFile,
  changelogTitle,
  skipOnPrerelease: isNil(skipOnPrerelease) ? false : skipOnPrerelease,
});
