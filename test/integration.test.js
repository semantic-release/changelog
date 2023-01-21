const path = require('path');
const test = require('ava');
const {outputFile, readFile} = require('fs-extra');
const {stub} = require('sinon');
const clearModule = require('clear-module');
const tempy = require('tempy');

test.beforeEach((t) => {
  // Clear npm cache to refresh the module state
  clearModule('..');
  t.context.m = require('..');
  // Stub the logger
  t.context.log = stub();
  t.context.logger = {log: t.context.log};
});

test.serial('Verify "changelogFile"', async (t) => {
  const cwd = tempy.directory();
  const notes = 'Test release note';
  const changelogFile = 'docs/changelog.txt';

  await t.notThrowsAsync(t.context.m.verifyConditions({changelogFile}, {cwd, options: {}, nextRelease: {notes}}));
});

test.serial('Create new CHANGELOG.md', async (t) => {
  const cwd = tempy.directory();
  const notes = 'Test release note';
  const changelogFile = 'docs/changelog.txt';
  const changelogPath = path.resolve(cwd, changelogFile);

  await t.context.m.prepare({changelogFile}, {cwd, options: {}, nextRelease: {notes}, logger: t.context.logger});

  // Verify the content of the CHANGELOG.md
  t.is((await readFile(changelogPath)).toString(), `${notes}\n`);

  t.deepEqual(t.context.log.args[0], ['Create %s', changelogPath]);
});

test.serial('Skip changelog update if the release is empty', async (t) => {
  const cwd = tempy.directory();
  const changelogFile = 'CHANGELOG.txt';
  const changelogPath = path.resolve(cwd, changelogFile);
  await outputFile(changelogPath, 'Initial CHANGELOG');

  await t.context.m.prepare({}, {cwd, options: {}, nextRelease: {}, logger: t.context.logger});

  // Verify the content of the CHANGELOG.md
  t.is((await readFile(changelogPath)).toString(), 'Initial CHANGELOG');
});

test.serial('Skip changelog update if the release is a prerelease and skipOnPrerelease option is set', async (t) => {
  const cwd = tempy.directory();
  const changelogFile = 'CHANGELOG.txt';
  const changelogPath = path.resolve(cwd, changelogFile);
  await outputFile(changelogPath, 'Initial CHANGELOG');

  await t.context.m.prepare(
    {skipOnPrerelease: true},
    {cwd, options: {}, nextRelease: {}, logger: t.context.logger, branch: {type: 'prerelease'}}
  );

  // Verify the content of the CHANGELOG.md
  t.is((await readFile(changelogPath)).toString(), 'Initial CHANGELOG');
});

test.serial('Verify only on the fist call', async (t) => {
  const cwd = tempy.directory();
  const notes = 'Test release note';
  const changelogFile = 'docs/changelog.txt';
  const changelogPath = path.resolve(cwd, changelogFile);

  await t.context.m.verifyConditions(
    {changelogFile},
    {nextRelease: {notes}, options: {prepare: ['@semantic-release/git']}}
  );
  await t.context.m.prepare({changelogFile}, {cwd, nextRelease: {notes}, logger: t.context.logger});

  // Verify the content of the CHANGELOG.md
  t.is((await readFile(changelogPath)).toString(), `${notes}\n`);

  t.deepEqual(t.context.log.args[0], ['Create %s', changelogPath]);
});

test('Throw SemanticReleaseError if prepare "changelogFile" option is not a string', async (t) => {
  const cwd = tempy.directory();
  const changelogFile = 42;
  const errors = [
    ...(await t.throwsAsync(
      t.context.m.verifyConditions(
        {},
        {cwd, options: {prepare: ['@semantic-release/git', {path: '@semantic-release/changelog', changelogFile}]}}
      )
    )),
  ];

  t.is(errors[0].name, 'SemanticReleaseError');
  t.is(errors[0].code, 'EINVALIDCHANGELOGFILE');
});
