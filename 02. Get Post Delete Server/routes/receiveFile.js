const fs = require('fs');


module.exports = function receiveFiles (filePath, req, res) {
  const writeStream = fs.createWriteStream(filePath, { flags: 'wx' });

  req.pipe(writeStream);

  writeStream.on('error', (err) => {
    if (err.code === 'EEXIST') {
      res.statusCode = 409;
      res.end('File Exists!');
      return;
    }

    console.error(err);

    if (!err.headersSent) {
      res.statusCode = 500;
      res.setHeader('Connection', 'close');
      res.end('Internal server error');
    } else {
      res.end();
    }

    fs.unlink(filePath, (err) => {});
  });

  // req.on('end')
  // writeStream.on('finish')
  // writeStream.on('close')
  writeStream.on('close', () => {
    res.statusCode = 201;
    res.end('File Created!');
  });

  req.on('close', () => {
    if (res.finished) return;
    fs.unlink(filePath, (err) => {});
  });
}
