const {isString, isUndefined} = require('lodash');
const SemanticReleaseError = require('@semantic-release/error');
const resolveConfig = require('./resolve-config');

module.exports = pluginConfig => {
  const {changelogFile} = resolveConfig(pluginConfig);

  if (!isUndefined(changelogFile) && !(isString(changelogFile) && changelogFile.trim())) {
    throw new SemanticReleaseError(
      'The "changelogFile" options, if defined, must be a non empty String.',
      'EINVALIDCHANGELOGFILE'
    );
  }
};
