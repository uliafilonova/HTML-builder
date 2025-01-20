const path = require('node:path');
const fs = require('node:fs');
const { stdout, stderr } = require('node:process');

try {
  const readableStream = fs.createReadStream(
    path.join(__dirname, 'text.txt'),
    'utf-8',
  );

  readableStream.on('data', (chunk) => {
    stdout.write(chunk);
  });

  readableStream.on('error', (e) => {
    stderr.write(`An error occurred while reading the file: ${e.message}`);
    process.exit(1);
  });
} catch (e) {
  stderr.write(`Unexpected error: ${e.message}`);
  process.exit(1);
}
