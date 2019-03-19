const
  fs = require('fs'),
  mime = require('mime');


module.exports = function sendFile(filePath, res) {
  const readStream = fs.createReadStream(filePath);

  readStream.pipe(res);

  readStream.on('open', () => res.setHeader('Content-Type', mime.getType(filePath)));
  readStream.on('error', (err) => {
    if (err.code === 'ENOENT') {
      res.statusCode = 404;
      res.end('Not Found!');
      return;
    }

    console.error(err);

    if (err) {
      res.statusCode = 500;
      res.end('Internal error');
      return;
    } else {
      res.end();
    }
  });

  res.on('close', () => readStream.destroy());
}
