module.exports = ({changelogFile, changelogTitle}) => ({
  changelogFile: changelogFile ?? 'CHANGELOG.md',
  changelogTitle,
});
