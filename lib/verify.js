const { isString, isNil, isArray, isNull } = require('lodash');
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
  if (!context || !context.branch) {
    context = { ...context, branch: { name: null } };
  }

  const {
    branch: { name },
  } = context;

  const options = resolveConfig(pluginConfig);

  const errors = Object.entries(options).reduce(
    (errors, [option, value]) =>
      !isNil(value) && !VALIDATORS[option](value)
        ? [...errors, getError(`EINVALID${option.toUpperCase()}`, { [option]: value })]
        : errors,
    []
  );

  if (
    pluginConfig.branches &&
    !pluginConfig.branches
      .includes(name)
  ) {
    errors.push(
      `Branch [${name}] is in changelog branch list [${pluginConfig.branches.join(', ')
      }]`
    );
  }

  if (errors.length > 0) {
    throw new AggregateError(errors);
  }
};
