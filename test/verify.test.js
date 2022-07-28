const test = require('ava');
const verify = require('../lib/verify.js');

test('Verify String "changelogFile" and "chagngelogTitle"', (t) => {
  const changelogFile = 'docs/changelog.txt';
  const changelogTitle = '# My title here';
  t.notThrows(() => verify({changelogFile, changelogTitle}));
});

test('Verify undefined "changelogFile" and "chagngelogTitle"', (t) => {
  t.notThrows(() => verify({}));
});

test('Throw SemanticReleaseError if "changelogFile" option is not a String', (t) => {
  const changelogFile = 42;
  const [error] = t.throws(() => verify({changelogFile}));

  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EINVALIDCHANGELOGFILE');
});

test('Throw SemanticReleaseError if "changelogFile" option is an empty String', (t) => {
  const changelogFile = '';
  const [error] = t.throws(() => verify({changelogFile}));

  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EINVALIDCHANGELOGFILE');
});

test('Throw SemanticReleaseError if "changelogFile" option is a whitespace String', (t) => {
  const changelogFile = '  \n \r ';
  const [error] = t.throws(() => verify({changelogFile}));

  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EINVALIDCHANGELOGFILE');
});

test('Throw SemanticReleaseError if "changelogTitle" option is not a String', (t) => {
  const changelogTitle = 42;
  const [error] = t.throws(() => verify({changelogTitle}));

  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EINVALIDCHANGELOGTITLE');
});

test('Throw SemanticReleaseError if "changelogTitle" option is an empty String', (t) => {
  const [error] = t.throws(() => verify({changelogTitle: ''}));

  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EINVALIDCHANGELOGTITLE');
});

test('Throw SemanticReleaseError if "changelogTitle" option is a whitespace String', (t) => {
  const changelogTitle = '  \n \r ';
  const [error] = t.throws(() => verify({changelogTitle}));

  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EINVALIDCHANGELOGTITLE');
});
