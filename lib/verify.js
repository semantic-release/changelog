const {isString, isUndefined} = require('lodash');
const AggregateError = require('aggregate-error');
const getError = require('./get-error');
const resolveConfig = require('./resolve-config');

module.exports = pluginConfig => {
  const {changelogFile} = resolveConfig(pluginConfig);
  const errors = [];

  if (!isUndefined(changelogFile) && !(isString(changelogFile) && changelogFile.trim())) {
    errors.push(getError('EINVALIDCHANGELOGFILE', {changelogFile}));
  }

  if (errors.length > 0) {
    throw new AggregateError(errors);
  }
};
