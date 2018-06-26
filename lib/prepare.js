const {readFile, writeFile, ensureFile} = require('fs-extra');
const resolveConfig = require('./resolve-config');

module.exports = async (pluginConfig, notes, logger) => {
  const {changelogFile, changelogTitle} = resolveConfig(pluginConfig);

  if (notes) {
    await ensureFile(changelogFile);
    const currentFile = (await readFile(changelogFile)).toString().trim();

    if (currentFile) {
      logger.log('Update %s', changelogFile);
    } else {
      logger.log('Create %s', changelogFile);
    }

    const currentContent =
      changelogTitle && currentFile.startsWith(changelogTitle)
        ? currentFile.slice(changelogTitle.length).trim()
        : currentFile;
    const content = `${notes.trim()}\n${currentContent ? `\n${currentContent}\n` : ''}`;

    await writeFile(changelogFile, changelogTitle ? `${changelogTitle}\n\n${content}` : content);
  }
};
