const {castArray} = require('lodash');
const verifyChangelog = require('./lib/verify');
const publishChangelog = require('./lib/publish');

let verified;

async function verifyConditions(pluginConfig, {options}) {
  // If the Changelog publish plugin is used and has `changelogFile` configured, validate them now in order to prevent any release if the configuration is wrong
  if (options.publish) {
    const publishPlugin = castArray(options.publish).find(
      config => config.path && config.path === '@semantic-release/changelog'
    );
    if (publishPlugin && publishPlugin.changelogFile) {
      pluginConfig.changelogFile = publishPlugin.changelogFile;
    }
  }
  await verifyChangelog(pluginConfig);
  verified = true;
}

async function publish(pluginConfig, {nextRelease: {notes}, logger}) {
  if (!verified) {
    await verifyChangelog(pluginConfig);
    verified = true;
  }
  await publishChangelog(pluginConfig, notes, logger);
}

module.exports = {verifyConditions, publish};
