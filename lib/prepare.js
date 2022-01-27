const path = require('path');
const {readFile, writeFile, ensureFile} = require('fs-extra');
const resolveConfig = require('./resolve-config');
const {template} = require('lodash');

module.exports = async (pluginConfig, {cwd, nextRelease, lastRelease, branch, logger}) => {
  const {notes} = nextRelease;
  const {changelogFile, changelogTitle} = resolveConfig(pluginConfig);
  const parsedChangelogFile = template(changelogFile)({branch, lastRelease, nextRelease});
  const changelogPath = path.resolve(cwd, parsedChangelogFile);

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
