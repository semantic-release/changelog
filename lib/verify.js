const {isString, isUndefined} = require('lodash');
const AggregateError = require('aggregate-error');
const SemanticReleaseError = require('@semantic-release/error');
const resolveConfig = require('./resolve-config');

module.exports = pluginConfig => {
  const {changelogFile} = resolveConfig(pluginConfig);
  const errors = [];

  if (!isUndefined(changelogFile) && !(isString(changelogFile) && changelogFile.trim())) {
    errors.push(
      new SemanticReleaseError(
        'The "changelogFile" options, if defined, must be a non empty String.',
        'EINVALIDCHANGELOGFILE'
      )
    );
  }

  if (errors.length > 0) {
    throw new AggregateError(errors);
  }
};
