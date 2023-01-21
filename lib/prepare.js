const path = require('path');
const {readFile, writeFile, ensureFile} = require('fs-extra');
const resolveConfig = require('./resolve-config.js');

const isPrerelease = ({type, main}) => type === 'prerelease' || (type === 'release' && !main);

module.exports = async (pluginConfig, {cwd, nextRelease: {notes}, logger, branch}) => {
  const {changelogFile, changelogTitle, skipOnPrerelease} = resolveConfig(pluginConfig);
  const changelogPath = path.resolve(cwd, changelogFile);

  if (skipOnPrerelease && isPrerelease(branch)) {
    logger.log('Skipping because branch is a prerelease branch and option skipOnPrerelease is active');
    return;
  }

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
