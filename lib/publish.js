const {readFile, writeFile, ensureFile} = require('fs-extra');
const resolveConfig = require('./resolve-config');

module.exports = async (pluginConfig, notes, logger) => {
  const {changelogFile} = resolveConfig(pluginConfig);

  if (notes) {
    await ensureFile(changelogFile);
    const currentFile = (await readFile(changelogFile)).toString().trim();

    if (currentFile) {
      logger.log('Update %s', changelogFile);
    } else {
      logger.log('Create %s', changelogFile);
    }
    await writeFile(changelogFile, `${notes.trim()}\n${currentFile ? `\n${currentFile}\n` : ''}`);
  }
};
