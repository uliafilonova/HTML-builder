const fs = require('node:fs');
const path = require('node:path');
const { stderr } = require('node:process');
const stylesPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist/bundle.css');
const writableStream = fs.createWriteStream(bundlePath);

async function createBundle() {
  try {
    const stylesDir = await fs.promises.readdir(stylesPath, {
      withFileTypes: true,
    });

    for (const file of stylesDir) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const readableStream = fs.createReadStream(
          path.join(stylesPath, file.name),
          'utf-8',
        );

        readableStream.pipe(writableStream);
      }
    }
  } catch (err) {
    stderr.write('Error', err);
  }
}
createBundle();
