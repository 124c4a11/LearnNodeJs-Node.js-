const
  http = require('http'),
  url = require('url'),
  path = require('path'),
  config = require('config');

const
  sendFile = require('./routes/sendFile'),
  receiveFile = require('./routes/receiveFile'),
  removeFile = require('./routes/removeFile');


const server = new http.Server();


server.on('request', (req, res) => {
  const
    pathname = decodeURI(url.parse(req.url).pathname),
    filename = pathname.slice(1); // /file.ext -> file.ext

  if (filename.includes('/') || filename.includes('..')) {
    res.statusCode = 400;
    res.end('Nested paths are not allowed');
    return;
  }

  switch (req.method) {
    case 'GET':
      const filePath = (pathname === '/')
        ? path.join(config.get('publicRoot'), 'index.html')
        : path.join(config.get('filesRoot'), filename);

      sendFile(filePath, res);
      break;

    case 'POST':
      if (!filename) {
        res.statusCode = 404;
        res.end('File Not Found!');
        return;
      }

      receiveFile(path.join(config.get('filesRoot'), filename), req, res);
      break;

    case 'DELETE':
      if (!filename) {
        res.statusCode = 404;
        res.end('File Not Found!');
        return;
      }

      removeFile(path.join(config.get('filesRoot'), filename), res);
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});


module.exports = server;
