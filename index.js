/* eslint require-atomic-updates: off */

const { defaultTo, castArray } = require('lodash');
const verifyChangelog = require('./lib/verify');
const prepareChangelog = require('./lib/prepare');

let verified;
let branches;

async function verifyConditions(pluginConfig, context) {
  const { options } = context;
  // If the Changelog prepare plugin is used and has `changelogFile` configured, validate them now in order to prevent any release if the configuration is wrong
  if (options.prepare) {
    const preparePlugin =
      castArray(options.prepare).find(config => config.path && config.path === '@semantic-release/changelog') || {};

    pluginConfig.changelogFile = defaultTo(pluginConfig.changelogFile, preparePlugin.changelogFile);
    pluginConfig.branches = defaultTo(pluginConfig.branches, preparePlugin.branches);
  }

  branches = pluginConfig.branches;

  await verifyChangelog(pluginConfig);
  verified = true;
}

async function prepare(pluginConfig, context) {
  if (!verified) {
    await verifyChangelog(pluginConfig, context);
    verified = true;
  }

  if (!branches || branches.includes(context.branch.name) >= 0) {
    await prepareChangelog(pluginConfig, context);
  }
}

module.exports = { verifyConditions, prepare };
