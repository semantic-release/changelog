import test from 'ava';
import verify from '../lib/verify';

test.serial('Verify String "changelogFile"', t => {
  const changelogFile = 'docs/changelog.txt';
  t.notThrows(() => verify({changelogFile}));
});

test.serial('Verify undefined "changelogFile"', t => {
  t.notThrows(() => verify({}));
});

test('Throw SemanticReleaseError if "changelogFile" option is not a String', t => {
  const changelogFile = 42;
  const [error] = t.throws(() => verify({changelogFile}));

  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EINVALIDCHANGELOGFILE');
});

test('Throw SemanticReleaseError if "changelogFile" option is an empty String', t => {
  const changelogFile = '';
  const [error] = t.throws(() => verify({changelogFile}));

  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EINVALIDCHANGELOGFILE');
});

test('Throw SemanticReleaseError if "changelogFile" option is a whitespace String', t => {
  const changelogFile = '  \n \r ';
  const [error] = t.throws(() => verify({changelogFile}));

  t.is(error.name, 'SemanticReleaseError');
  t.is(error.code, 'EINVALIDCHANGELOGFILE');
});
