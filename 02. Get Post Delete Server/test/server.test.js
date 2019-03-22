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
});
