/* eslint require-atomic-updates: off */

const verifyChangelog = require('./lib/verify.js');
const prepareChangelog = require('./lib/prepare.js');

let verified;

const defaultTo = (value, defaultValue) => (Number.isNaN(value) ? null : value) ?? defaultValue;

async function verifyConditions(pluginConfig, context) {
  const {options} = context;
  // If the Changelog prepare plugin is used and has `changelogFile` configured, validate them now in order to prevent any release if the configuration is wrong
  if (options.prepare) {
    const preparePlugin = [options.prepare].flat().find((config) => config.path === '@semantic-release/changelog');

    pluginConfig.changelogFile = defaultTo(pluginConfig.changelogFile, preparePlugin?.changelogFile);
  }

  await verifyChangelog(pluginConfig);
  verified = true;
}

async function prepare(pluginConfig, context) {
  if (!verified) {
    await verifyChangelog(pluginConfig);
    verified = true;
  }

  await prepareChangelog(pluginConfig, context);
}

module.exports = {verifyConditions, prepare};
