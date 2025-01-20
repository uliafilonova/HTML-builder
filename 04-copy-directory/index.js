const fs = require('node:fs/promises');
const path = require('node:path');
const { stderr } = require('node:process');
const fromPath = path.join(__dirname, 'files');
const toPath = path.join(__dirname, 'files-copy');

async function copyDirectory(from, to) {
  try {
    await fs.rm(to, { recursive: true, force: true });
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }

  try {
    await fs.mkdir(to, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }

  try {
    const items = await fs.readdir(from, { withFileTypes: true });

    items.forEach(async (item) => {
      if (item.isFile()) {
        try {
          await fs.copyFile(
            path.join(from, item.name),
            path.join(to, item.name),
          );
        } catch (error) {
          stderr.write('Error copying file');
        }
      } else if (item.isDirectory()) {
        try {
          await fs.mkdir(path.join(to, item.name), { recursive: true });
          await copyDirectory(
            path.join(from, item.name),
            path.join(to, item.name),
          );
        } catch (error) {
          stderr.write('Error when creating a folder or copying its contents');
        }
      }
    });
  } catch (error) {
    stderr.write('Error', error);
  }
}

copyDirectory(fromPath, toPath);
