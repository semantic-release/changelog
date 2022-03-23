const {isString, isNil, isArray, isNull} = require('lodash');
const AggregateError = require('aggregate-error');
const getError = require('./get-error');
const resolveConfig = require('./resolve-config');

const isNonEmptyString = value => isString(value) && value.trim();
const isArrayOrNull = value => isArray(value) || isNull(value);

const VALIDATORS = {
  changelogFile: isNonEmptyString,
  changelogTitle: isNonEmptyString,
  branches: isArrayOrNull,
};

module.exports = (pluginConfig, context) => {
  const options = resolveConfig(pluginConfig);
  const errors = Object.entries(options).reduce(
    (errors, [option, value]) =>
      !isNil(value) && !VALIDATORS[option](value)
        ? [...errors, getError(`EINVALID${option.toUpperCase()}`, {[option]: value})]
        : errors,
    []
  );

  if (errors.length > 0) {
    throw new AggregateError(errors);
  }
};
