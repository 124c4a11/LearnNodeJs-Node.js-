const
  fse = require('fs-extra'),
  path = require('path'),
  assert = require('assert'),
  request = require('request'),
  config = require('config');

const server = require('../server');


describe('server tests', () => {
  before((done) => {
    fse.mkdirpSync(config.get('filesRoot'));
    fse.emptyDirSync(config.get('filesRoot'));
    server.listen(3000, () => done());
  });

  after((done) => {
    fse.removeSync(config.get('filesRoot'));
    server.close(() => done());
  });

  beforeEach(() => fse.emptyDirSync(config.get('filesRoot')));

  describe('GET', () => {
    it('should return index.html', (done) => {
      const content = fse.readFileSync(path.join(config.get('publicRoot'), 'index.html'));

      request('http://localhost:3000', (err, res, body) => {
        if (err) return done();

        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(res.headers['content-type'], 'text/html');
        assert.strictEqual(content.toString('utf-8'), body);

        done();
      });
    });

    it('returs status 200 and the file', (done) => {
      fse.copyFileSync(
        path.join(config.get('fixturesRoot'), 'index.js'),
        path.join(config.get('filesRoot'), 'index.js')
      );

      const content = fse.readFileSync(path.join(config.get('filesRoot'), 'index.js'));

      request('http://localhost:3000/index.js', (err, res, body) => {
        if (err) return done();

        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(res.headers['content-type'], 'application/javascript');
        assert.strictEqual(content.toString('utf-8'), body);

        done();
      });
    });

    it('should return status 404', (done) => {
      request('http://localhost:3000/not_exist.file', (err, res, body) => {
        if (err) return done();

        assert.strictEqual(res.statusCode, 404);
        assert.strictEqual(body, 'Not Found!');

        done();
      });
    });

    it('should return status 400', (done) => {
      request('http://localhost:3000/nested/path', (err, res, body) => {
        if (err) return done();

        assert.strictEqual(res.statusCode, 400);
        assert.strictEqual(body, 'Nested paths are not allowed');

        done();
      });
    });
  });

  describe('POST', () => {
    it('should file not modified and return status 409', (done) => {
      fse.copyFileSync(
        path.join(config.get('fixturesRoot'), 'index.js'),
        path.join(config.get('filesRoot'), 'index.js')
      );

      const mtime = fse.statSync(path.join(config.get('filesRoot'), 'index.js')).mtime;

      const req = request.post('http://localhost:3000/index.js', (err, res, body) => {
        if (err) return done();

        const newMtime = fse.statSync(path.join(config.get('filesRoot'), 'index.js')).mtime;

        assert.deepStrictEqual(mtime, newMtime);
        assert.strictEqual(res.statusCode, 409);
        assert.strictEqual(body, 'File Exists!');

        done();
      });

      fse.createReadStream(path.join(config.get('fixturesRoot'), 'index.js')).pipe(req);
    });

    it('status 409 when zero file size', (done) => {
      fse.copyFileSync(
        path.join(config.get('fixturesRoot'), 'index.js'),
        path.join(config.get('filesRoot'), 'index.js')
      );

      const mtime = fse.statSync(path.join(config.get('filesRoot'), 'index.js')).mtime;

      const req = request.post('http://localhost:3000/index.js', (err, res, body) => {
        if (err) return done(err);

        const newMtime = fse.statSync(path.join(config.get('filesRoot'), 'index.js')).mtime;

        assert.deepStrictEqual(mtime, newMtime);
        assert.strictEqual(res.statusCode, 409);
        assert.strictEqual(body, 'File Exists!');

        done();
      });

      req.end();
    });

    it('should created file', (done) => {
      const req = request.post('http://localhost:3000/spall.png', (err, res, body) => {
        if (err) return done(err);

        assert.strictEqual(res.statusCode, 201);
        assert.strictEqual(body, 'File Created!');
        assert.ok(fse.existsSync(path.join(config.get('filesRoot'), 'spall.png')));

        done();
      });

      fse.createReadStream(path.join(config.get('fixturesRoot'), 'small.png')).pipe(req);
    });
  });

  describe('DELETE', () => {
    it('should remove file', (done) => {
      fse.copyFileSync(
        path.join(config.get('fixturesRoot'), 'small.png'),
        path.join(config.get('filesRoot'), 'small.png')
      );

      request.delete('http://localhost:3000/small.png', (err, res, body) => {
        if (err) return done(err);

        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(body, 'File Deleted!');
        assert.strictEqual(
          fse.existsSync(path.join(config.get('filesRoot'), 'small.png')),
          false
        );

        done();
      });
    });

    it('should return 404', (done) => {
      request.delete('http://localhost:3000/small.png', (err, res, body) => {
        if (err) return done(err);

        assert.strictEqual(res.statusCode, 404);
        assert.strictEqual(body, 'Not Found!');

        done();
      });
    });
  })
});
