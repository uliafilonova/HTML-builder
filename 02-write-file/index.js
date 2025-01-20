const path = require('node:path');
const fs = require('node:fs');
const { stdin, stdout, stderr } = require('node:process');

try {
  const writableStream = fs.createWriteStream(
    path.join(__dirname, 'my-text.txt'),
  );

  writableStream.on('error', (e) => {
    stderr.write(`Error writing to file: ${e.message}`);
    process.exit(1);
  });

  stdout.write('Hi! please, enter some text here:\n');

  stdin.on('data', (chunk) => {
    if (chunk.toString().trim() === 'exit') {
      writableStream.end(() => {
        process.exit();
      });
    } else {
      writableStream.write(chunk);
    }
  });

  process.on('exit', (code) => {
    if (code === 0) {
      stdout.write('Goodbye, good luck on the course!');
    } else {
      stderr.write(`Error: ${code}`);
    }
  });

  process.on('SIGINT', () => {
    writableStream.end(() => {
      process.exit();
    });
  });
} catch (e) {
  stderr.write(`Error: ${e.message}`);
  process.exit(1);
}
