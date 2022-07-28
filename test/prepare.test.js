const path = require('path');
const test = require('ava');
const {outputFile, readFile} = require('fs-extra');
const {stub} = require('sinon');
const tempy = require('tempy');
const prepare = require('../lib/prepare.js');

test.beforeEach((t) => {
  // Stub the logger
  t.context.log = stub();
  t.context.logger = {log: t.context.log};
});

test('Create new CHANGELOG.md', async (t) => {
  const cwd = tempy.directory();
  const notes = 'Test release note';
  const changelogFile = 'CHANGELOG.md';
  const changelogPath = path.resolve(cwd, changelogFile);

  await prepare({}, {cwd, nextRelease: {notes}, logger: t.context.logger});

  // Verify the content of the CHANGELOG.md
  t.is((await readFile(changelogPath)).toString(), `${notes}\n`);

  t.deepEqual(t.context.log.args[0], ['Create %s', changelogPath]);
});

test('Create new changelog with custom path', async (t) => {
  const cwd = tempy.directory();
  const notes = 'Test release note';
  const changelogFile = 'docs/changelog.txt';
  const changelogPath = path.resolve(cwd, 'docs/changelog.txt');

  await prepare({changelogFile}, {cwd, nextRelease: {notes}, logger: t.context.logger});

  // Verify the content of the CHANGELOG.md
  t.is((await readFile(changelogPath)).toString(), `${notes}\n`);

  t.deepEqual(t.context.log.args[0], ['Create %s', changelogPath]);
});

test('Prepend the CHANGELOG.md if there is an existing one', async (t) => {
  const cwd = tempy.directory();
  const notes = 'Test release note';
  const changelogFile = 'CHANGELOG.md';
  const changelogPath = path.resolve(cwd, changelogFile);
  await outputFile(changelogPath, 'Initial CHANGELOG');

  await prepare({}, {cwd, nextRelease: {notes}, logger: t.context.logger});

  // Verify the content of the CHANGELOG.md
  t.is((await readFile(changelogPath)).toString(), `${notes}\n\nInitial CHANGELOG\n`);
  t.deepEqual(t.context.log.args[0], ['Update %s', changelogPath]);
});

test('Prepend title in the CHANGELOG.md if there is none', async (t) => {
  const cwd = tempy.directory();
  const notes = 'Test release note';
  const changelogTitle = '# My Changelog Title';
  const changelogFile = 'CHANGELOG.md';
  const changelogPath = path.resolve(cwd, changelogFile);
  await outputFile(changelogPath, 'Initial CHANGELOG');

  await prepare({changelogTitle}, {cwd, nextRelease: {notes}, logger: t.context.logger});

  t.is((await readFile(changelogPath)).toString(), `${changelogTitle}\n\n${notes}\n\nInitial CHANGELOG\n`);
});

test('Keep the title at the top of the CHANGELOG.md', async (t) => {
  const cwd = tempy.directory();
  const notes = 'Test release note';
  const changelogTitle = '# My Changelog Title';
  const changelogFile = 'CHANGELOG.md';
  const changelogPath = path.resolve(cwd, changelogFile);
  await outputFile(changelogPath, `${changelogTitle}\n\nInitial CHANGELOG`);

  await prepare({changelogTitle}, {cwd, nextRelease: {notes}, logger: t.context.logger});

  t.is((await readFile(changelogPath)).toString(), `${changelogTitle}\n\n${notes}\n\nInitial CHANGELOG\n`);
});

test.serial('Create new changelog with title if specified', async (t) => {
  const cwd = tempy.directory();
  const notes = 'Test release note';
  const changelogTitle = '# My Changelog Title';
  const changelogFile = 'HISTORY.md';
  const changelogPath = path.resolve(cwd, changelogFile);

  await prepare({changelogTitle, changelogFile}, {cwd, nextRelease: {notes}, logger: t.context.logger});

  t.is((await readFile(changelogPath)).toString(), `${changelogTitle}\n\n${notes}\n`);
});
