const fs = require('node:fs');
const path = require('node:path');
const { stderr } = require('node:process');
const projectDist = path.join(__dirname, 'project-dist');

async function createTemlateHtml() {
  /*создании Html*/
  await fs.promises.rm(projectDist, { recursive: true, force: true });
  await fs.promises.mkdir(path.join(projectDist, 'assets'), {
    recursive: true,
  });
  let components = await fs.promises.readdir(
    path.join(__dirname, 'components'),
  );
  let html = await fs.promises.readFile(
    path.join(__dirname, 'template.html'),
    'utf-8',
  );

  for (let file of components) {
    let templateContent = '';
    try {
      templateContent = await fs.promises.readFile(
        path.join(__dirname, 'components', file),
        'utf-8',
      );
      if (file.split('.')[1] === 'html') {
        const componentName = file.split('.')[0];
        html = html.replace(`{{${componentName}}}`, templateContent);
      } else {
        const componentName = file.split('.')[0];
        html = html.replace(`{{${componentName}}}`, '');
      }
    } catch (error) {
      stderr.write('Error', error);
    }
  }
  await fs.promises.writeFile(path.join(projectDist, 'index.html'), html);

  /*Cоздание Css*/
  const styles = path.join(__dirname, 'styles');
  const writeStream = fs.createWriteStream(
    path.join(projectDist, 'style.css'),
    'utf-8',
  );
  const files = await fs.promises.readdir(styles, { withFileTypes: true });
  files.forEach((file) => {
    if (file.isFile() && path.parse(file.name).ext === '.css') {
      const readStream = fs.createReadStream(
        path.join(styles, file.name),
        'utf-8',
      );
      readStream.on('data', async (chunk) => {
        writeStream.write(chunk);
      });
    }
  });

  /*AssetS*/

  async function copyFolderTo(currentPath, outputPath) {
    try {
      await fs.promises.rm(outputPath, { recursive: true, force: true });
      await fs.promises.mkdir(outputPath, { recursive: true });

      const items = await fs.promises.readdir(currentPath, {
        withFileTypes: true,
      });
      for (const item of items) {
        if (item.isFile()) {
          await fs.promises.copyFile(
            path.join(currentPath, item.name),
            path.join(outputPath, item.name),
          );
        } else if (item.isDirectory()) {
          await copyFolderTo(
            path.join(currentPath, item.name),
            path.join(outputPath, item.name),
          );
        }
      }
    } catch (error) {
      stderr.write('Error', error);
    }
  }

  try {
    const assetsDir = path.join(__dirname, 'assets');
    const outputAssetsPath = path.join(projectDist, 'assets');

    await copyFolderTo(assetsDir, outputAssetsPath);
  } catch (error) {
    stderr.write('Error', error);
  }
}
createTemlateHtml();
