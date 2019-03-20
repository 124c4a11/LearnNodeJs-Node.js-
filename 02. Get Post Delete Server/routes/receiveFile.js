const
  fs = require('fs'),
  config = require('config');

const LimitSizeStream = require('../LimitSizeStream');


module.exports = function receiveFiles (filePath, req, res) {
  const
    writeStream = fs.createWriteStream(filePath, { flags: 'wx' }),
    limitStream = new LimitSizeStream({ limit: config.get('limitFileSize') });

  req
    .pipe(limitStream)
    .pipe(writeStream);

  limitStream.on('error', (err) => {
    if (err.code === 'LIMIT_EXCEEDED') {
      res.statusCode = 413;
      res.setHeader('Connection', 'close');
      res.end('File is too big');

      fs.unlink(filepath, (err) => {});
      return;
    }

    console.error(err);

    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Connection', 'close');
      res.end('Internal server error');
    } else {
      res.end();
    }

    fs.unlink(filepath, (err) => {});
  });

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
