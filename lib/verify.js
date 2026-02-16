const AggregateError = require('aggregate-error');
const getError = require('./get-error.js');
const resolveConfig = require('./resolve-config.js');
const {isStringObject} = require('util/types');

const isString = (value) => typeof value === 'string' || isStringObject(value);
const isNonEmptyString = (value) => isString(value) && value.trim();

const VALIDATORS = {
  changelogFile: isNonEmptyString,
  changelogTitle: isNonEmptyString,
};

module.exports = (pluginConfig) => {
  const options = resolveConfig(pluginConfig);

  const errors = Object.entries(options).reduce(
    (errors, [option, value]) =>
      (value ?? null) !== null && !VALIDATORS[option](value)
        ? [...errors, getError(`EINVALID${option.toUpperCase()}`, {[option]: value})]
        : errors,
    []
  );

  if (errors.length > 0) {
    throw new AggregateError(errors);
  }
};
