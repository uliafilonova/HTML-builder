const path = require('node:path');
const fs = require('node:fs/promises');
const { stdout, stderr } = require('node:process');
const targetPath = path.join(__dirname, 'secret-folder');
function getDirecory() {
  fs.readdir(targetPath, { withFileTypes: true })
    .then((files) => {
      files.forEach((file) => {
        if (file.isFile()) {
          const filePath = path.join(targetPath, file.name);
          fs.stat(filePath)
            .then((stats) => {
              stdout.write(
                `${path.parse(file.name).name} - ${path
                  .parse(file.name)
                  .ext.slice(1)} - ${Number(stats.size / 1024)}kb` + '\n',
              );
            })
            .catch((error) => {
              stderr.write('Error reading directory:', error);
            });
        }
      });
    })
    .catch((error) => {
      stderr.write('Error reading directory:', error);
    });
}
getDirecory();
