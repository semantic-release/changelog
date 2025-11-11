const {isNil, template} = require('lodash');

module.exports = ({changelogFile, changelogTitle}, context) => ({
  changelogFile: isNil(changelogFile) ? 'CHANGELOG.md' : template(changelogFile)(context),
  changelogTitle,
});
