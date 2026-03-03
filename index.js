/* eslint require-atomic-updates: off */

import {defaultTo, castArray} from 'lodash-es';
import verifyChangelog from './lib/verify.js';
import prepareChangelog from './lib/prepare.js';

export default function changelogPlugin() {
  let verified;

  async function verifyConditions(pluginConfig, context) {
    const {options} = context;
    // If the Changelog prepare plugin is used and has `changelogFile` configured, validate them now in order to prevent any release if the configuration is wrong
    if (options.prepare) {
      const preparePlugin =
        castArray(options.prepare).find((config) => config.path && config.path === '@semantic-release/changelog') || {};

      pluginConfig.changelogFile = defaultTo(pluginConfig.changelogFile, preparePlugin.changelogFile);
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

  return {verifyConditions, prepare};
}

const {verifyConditions, prepare} = changelogPlugin();
export {verifyConditions, prepare};
