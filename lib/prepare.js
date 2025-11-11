const path = require('path');
const {readFile, writeFile, ensureFile} = require('fs-extra');
const resolveConfig = require('./resolve-config.js');

module.exports = async (pluginConfig, {cwd, stdout, stderr, logger, ...context}) => {
  const {changelogFile, changelogTitle} = resolveConfig(pluginConfig, context);
  const changelogPath = path.resolve(cwd, changelogFile);
  const {
    nextRelease: {notes},
  } = context;

  if (notes) {
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
