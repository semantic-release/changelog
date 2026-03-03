import { isString, isNil } from "lodash-es";
import AggregateError from "aggregate-error";
import getError from "./get-error.js";
import resolveConfig from "./resolve-config.js";

const isNonEmptyString = (value) => isString(value) && value.trim();

const VALIDATORS = {
  changelogFile: isNonEmptyString,
  changelogTitle: isNonEmptyString,
};

export default (pluginConfig) => {
  const options = resolveConfig(pluginConfig);

  const errors = Object.entries(options).reduce(
    (errors, [option, value]) =>
      !isNil(value) && !VALIDATORS[option](value)
        ? [...errors, getError(`EINVALID${option.toUpperCase()}`, { [option]: value })]
        : errors,
    []
  );

  if (errors.length > 0) {
    throw new AggregateError(errors);
  }
};
