const should = require('should');
const service = require('../../lib/service');

describe('geocoding service', function () {

  it('empty', done => {
    const s = service({
      name: 'test',
      prepareRequest: () => ({}),
      request: (url, req, fn) => fn(),
      status: () => undefined
    });
    const queryId = 'empty';
    const query = {};
    s.geocode('forward', queryId, query, undefined, function (err, finished, outQueryId, outQuery, result) {
      should.not.exist(err);
      finished.should.eql(false);
      outQueryId.should.eql(queryId);
      outQuery.should.eql(query);
      outQuery.should.have.property('stats', [ 'test' ]);
      result.should.have.property('stats', [ 'test' ]);
      result.should.have.property('provider', 'test');
      done();
    });
  });

  it('failure', done => {
    const s = service({
      name: 'test',
      prepareRequest: () => ({}),
      request: (url, req, fn) => fn(),
      status: () => 'failure'
    });
    let queryId = 'failure';
    let query = {};
    s.geocode('forward', queryId, query, undefined, function (err, finished, outQueryId, outQuery, result) {
      should.not.exist(err);
      finished.should.eql(false);
      outQueryId.should.eql(queryId);
      outQuery.should.eql(query);
      outQuery.should.have.property('stats', [ 'test' ]);
      result.should.have.property('stats', [ 'test' ]);
      result.should.have.property('provider', 'test');

      queryId = 'after failure';
      query = {};
      s.geocode('forward', queryId, query, undefined, function (err, finished, outQueryId, outQuery, result) {
        should.not.exist(err);
        finished.should.eql(false);
        outQueryId.should.eql(queryId);
        outQuery.should.eql(query);
        outQuery.should.not.have.property('stats');
        result.should.have.property('stats', undefined);
        result.should.have.property('provider', 'test');
        done();
      });
    });
  });

  function testAbort(s, i, fn) {
    const queryId = 'abort';
    const query = {};
    s.geocode('forward', queryId, query, undefined, function (err, finished, outQueryId, outQuery, result) {
      if (i) {
        err.should.eql('input error');
        finished.should.eql(false);
        outQueryId.should.eql(queryId);
        outQuery.should.eql(query);
        outQuery.should.have.property('stats', [ 'test' ]);
        result.should.have.property('stats', [ 'test' ]);
        result.should.have.property('provider', 'test');
      }
      else {
        should.not.exist(err);
        finished.should.eql(false);
        outQueryId.should.eql(queryId);
        outQuery.should.eql(query);
        outQuery.should.not.have.property('stats');
        result.should.have.property('stats', undefined);
        result.should.have.property('provider', 'test');
        return fn();
      }
      i -= 1;
      testAbort(s, i, fn);
    });
    setTimeout(() => s.abort(queryId), 500);
  }

  it('abort', function(done) {
    this.timeout(2500);
    const s = service({
      name: 'test',
      prepareRequest: () => ({}),
      request: () => ({ abort: () => undefined })
    });
    testAbort(s, 3, done);
  });
});
