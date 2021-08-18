const path = require('path');
const {readFile, writeFile, ensureFile} = require('fs-extra');
const resolveConfig = require('./resolve-config');

module.exports = async (pluginConfig, context) => {
  if (!context || !context.branch) {
    context = {...context, branch: {name: null}};
  }

  const {
    cwd,
    branch: {name: branchName},
    nextRelease: {notes},
    logger,
  } = context;
  const {changelogFile, changelogTitle, ignoreBranch} = resolveConfig(pluginConfig);
  const changelogPath = path.resolve(cwd, changelogFile);
  let ignore = false;

  if (ignoreBranch && ignoreBranch.split(',').includes(branchName)) {
    ignore = true;
  }

  if (notes && !ignore) {
    await ensureFile(changelogPath);
    const currentFile = (await readFile(changelogPath)).toString().trim();

    if (currentFile) {
      logger.log('Update %s', changelogPath);
    } else {
      logger.log('Create %s', changelogPath);
    }

    const currentContent =
      changelogTitle && currentFile.startsWith(changelogTitle)
        ? currentFile.slice(changelogTitle.length).trim()
        : currentFile;
    const content = `${notes.trim()}\n${currentContent ? `\n${currentContent}\n` : ''}`;

    await writeFile(changelogPath, changelogTitle ? `${changelogTitle}\n\n${content}` : content);
  }
};
