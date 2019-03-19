const fs = require('fs');


module.exports = function removeFlies (filePath, res) {
  fs.unlink(filePath, (err) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.statusCode = 404;
        res.end('Not Found!');
        return;
      }

      console.error(err);
      res.statusCode = 500;
      res.end('Internal error');
      return;
    }

    res.statusCode = 200;
    res.end('File Deleted!');
  });
}
