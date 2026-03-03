import {isNil} from 'lodash-es';

export default ({changelogFile, changelogTitle}) => ({
  changelogFile: isNil(changelogFile) ? 'CHANGELOG.md' : changelogFile,
  changelogTitle,
});
