import path from "node:path";
import test from "ava";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { stub } from "sinon";
import { temporaryDirectory } from "tempy";
import { verifyConditions, prepare } from "../index.js";

const outputFile = async (filePath, content) => {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content);
};

test.beforeEach((t) => {
  // Create a fresh plugin instance to reset the `verified` state
  t.context.m = { verifyConditions, prepare };
  // Stub the logger
  t.context.log = stub();
  t.context.logger = { log: t.context.log };
});

test.serial('Verify "changelogFile"', async (t) => {
  const cwd = temporaryDirectory();
  const notes = "Test release note";
  const changelogFile = "docs/changelog.txt";

  await t.notThrowsAsync(t.context.m.verifyConditions({ changelogFile }, { cwd, options: {}, nextRelease: { notes } }));
});

test.serial("Create new CHANGELOG.md", async (t) => {
  const cwd = temporaryDirectory();
  const notes = "Test release note";
  const changelogFile = "docs/changelog.txt";
  const changelogPath = path.resolve(cwd, changelogFile);

  await t.context.m.prepare({ changelogFile }, { cwd, options: {}, nextRelease: { notes }, logger: t.context.logger });

  // Verify the content of the CHANGELOG.md
  t.is(await readFile(changelogPath, "utf8"), `${notes}\n`);

  t.deepEqual(t.context.log.args[0], ["Create %s", changelogPath]);
});

test.serial("Skip changelog update if the release is empty", async (t) => {
  const cwd = temporaryDirectory();
  const changelogFile = "CHANGELOG.txt";
  const changelogPath = path.resolve(cwd, changelogFile);
  await outputFile(changelogPath, "Initial CHANGELOG");

  await t.context.m.prepare({}, { cwd, options: {}, nextRelease: {}, logger: t.context.logger });

  // Verify the content of the CHANGELOG.md
  t.is(await readFile(changelogPath, "utf8"), "Initial CHANGELOG");
});

test.serial("Verify only on the fist call", async (t) => {
  const cwd = temporaryDirectory();
  const notes = "Test release note";
  const changelogFile = "docs/changelog.txt";
  const changelogPath = path.resolve(cwd, changelogFile);

  await t.context.m.verifyConditions(
    { changelogFile },
    { nextRelease: { notes }, options: { prepare: ["@semantic-release/git"] } }
  );
  await t.context.m.prepare({ changelogFile }, { cwd, nextRelease: { notes }, logger: t.context.logger });

  // Verify the content of the CHANGELOG.md
  t.is(await readFile(changelogPath, "utf8"), `${notes}\n`);

  t.deepEqual(t.context.log.args[0], ["Create %s", changelogPath]);
});

test('Throw SemanticReleaseError if prepare "changelogFile" option is not a string', async (t) => {
  const cwd = temporaryDirectory();
  const changelogFile = 42;
  const { errors } = await t.throwsAsync(
    t.context.m.verifyConditions(
      {},
      { cwd, options: { prepare: ["@semantic-release/git", { path: "@semantic-release/changelog", changelogFile }] } }
    )
  );

  t.is(errors[0].name, "SemanticReleaseError");
  t.is(errors[0].code, "EINVALIDCHANGELOGFILE");
});
