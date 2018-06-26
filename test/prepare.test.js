import test from 'ava';
import {outputFile, readFile} from 'fs-extra';
import {stub} from 'sinon';
import tempy from 'tempy';
import prepare from '../lib/prepare';

// Save the current working diretory
const cwd = process.cwd();

test.beforeEach(t => {
  // Change current working directory to a temp directory
  process.chdir(tempy.directory());
  // Stub the logger
  t.context.log = stub();
  t.context.logger = {log: t.context.log};
});

test.afterEach.always(() => {
  // Restore the current working directory
  process.chdir(cwd);
});

test.serial('Create new CHANGELOG.md', async t => {
  const notes = 'Test release note';

  await prepare({}, notes, t.context.logger);

  // Verify the content of the CHANGELOG.md
  t.is((await readFile('CHANGELOG.md')).toString(), `${notes}\n`);

  t.deepEqual(t.context.log.args[0], ['Create %s', 'CHANGELOG.md']);
});

test.serial('Create new changelog with custom path', async t => {
  const notes = 'Test release note';
  const changelogFile = 'docs/changelog.txt';

  await prepare({changelogFile}, notes, t.context.logger);

  // Verify the content of the CHANGELOG.md
  t.is((await readFile(changelogFile)).toString(), `${notes}\n`);

  t.deepEqual(t.context.log.args[0], ['Create %s', changelogFile]);
});

test.serial('Prepend the CHANGELOG.md if there is an existing one', async t => {
  const notes = 'Test release note';
  await outputFile('CHANGELOG.md', 'Initial CHANGELOG');

  await prepare({}, notes, t.context.logger);

  // Verify the content of the CHANGELOG.md
  t.is((await readFile('CHANGELOG.md')).toString(), `${notes}\n\nInitial CHANGELOG\n`);
  t.deepEqual(t.context.log.args[0], ['Update %s', 'CHANGELOG.md']);
});

test.serial('Prepend title in the CHANGELOG.md if there is none', async t => {
  const notes = 'Test release note';
  await outputFile('CHANGELOG.md', 'Initial CHANGELOG');

  const changelogTitle = '# My Changelog Title';
  await prepare({changelogTitle}, notes, t.context.logger);

  t.is((await readFile('CHANGELOG.md')).toString(), `${changelogTitle}\n\n${notes}\n\nInitial CHANGELOG\n`);
});

test.serial('Keep the title at the top of the CHANGELOG.md', async t => {
  const notes = 'Test release note';
  const changelogTitle = '# My Changelog Title';
  await outputFile('CHANGELOG.md', `${changelogTitle}\n\nInitial CHANGELOG`);

  await prepare({changelogTitle}, notes, t.context.logger);

  t.is((await readFile('CHANGELOG.md')).toString(), `${changelogTitle}\n\n${notes}\n\nInitial CHANGELOG\n`);
});

test.serial('Create new changelog with title if specified', async t => {
  const notes = 'Test release note';
  const changelogTitle = '# My Changelog Title';
  const changelogFile = 'HISTORY.md';

  await prepare({changelogTitle, changelogFile}, notes, t.context.logger);

  t.is((await readFile(changelogFile)).toString(), `${changelogTitle}\n\n${notes}\n`);
});
