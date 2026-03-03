import path from 'node:path';
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import resolveConfig from './resolve-config.js';

const ensureFile = async (filePath) => {
  await mkdir(path.dirname(filePath), {recursive: true});
  try {
    await readFile(filePath);
  } catch {
    await writeFile(filePath, '');
  }
};

export default async (pluginConfig, {cwd, nextRelease: {notes}, logger}) => {
  const {changelogFile, changelogTitle} = resolveConfig(pluginConfig);
  const changelogPath = path.resolve(cwd, changelogFile);

  if (notes) {
    await ensureFile(changelogPath);
    const currentFile = (await readFile(changelogPath, 'utf8')).trim();

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
