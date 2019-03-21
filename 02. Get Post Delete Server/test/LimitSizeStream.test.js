const
  assert = require('assert'),
  sinon = require('sinon');

const LimitSizeSream = require('../LimitSizeStream');


describe('LimitSizeSream tests', () => {
  it('should throw error after second write', (done) => {
    const limitStream = new LimitSizeSream({ limit: 1 });

    const onData = sinon.spy();

    limitStream.on('data', onData);
    limitStream.on('error', (err) => {
      assert.strictEqual(err.code, 'LIMIT_EXCEEDED');
      assert.ok(onData.calledOnce);

      done();
    });

    limitStream.write('a');
    limitStream.write('b');
  });

  it('should pass original values and handle ending', (done) => {
    const limitStream = new LimitSizeSream({ limit: 3, encoding: 'utf-8' });

    const onData = sinon.spy();

    limitStream.on('data', onData);
    limitStream.on('end', () => {
      assert.ok(onData.calledTwice);
      assert.strictEqual(onData.firstCall.args[0], 'a');
      assert.strictEqual(onData.secondCall.args[0], 'b');

      done();
    });

    limitStream.write('a');
    limitStream.write('b');
    limitStream.end();
  });
});
