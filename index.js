const {castArray} = require('lodash');
const verifyChangelog = require('./lib/verify');
const prepareChangelog = require('./lib/prepare');

let verified;

async function verifyConditions(pluginConfig, {options}) {
  // If the Changelog prepare plugin is used and has `changelogFile` configured, validate them now in order to prevent any release if the configuration is wrong
  if (options.prepare) {
    const preparePlugin =
      castArray(options.prepare).find(config => config.path && config.path === '@semantic-release/changelog') || {};

    pluginConfig.changelogFile = pluginConfig.changelogFile || preparePlugin.changelogFile;
  }
  await verifyChangelog(pluginConfig);
  verified = true;
}

async function prepare(pluginConfig, {nextRelease: {notes}, logger}) {
  if (!verified) {
    await verifyChangelog(pluginConfig);
    verified = true;
  }
  await prepareChangelog(pluginConfig, notes, logger);
}

module.exports = {verifyConditions, prepare};
