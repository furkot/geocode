var should = require('should');
var furkotGeocode = require('../lib/geocode');

function mockService(queryId, query, result, fn) {
  fn(undefined, true, queryId, query, {
    provider: 'success'
  });
}

function timeService(timeout) {
  var timeoutId, queryInProgress, callback;
  return {
    geocode: function (queryId, query, result, fn) {
      queryInProgress = query;
      callback = fn;
      timeoutId = setTimeout(function () {
        fn(undefined, false, queryId, query);
      }, timeout);
    },
    abort: function (queryId) {
      clearTimeout(timeoutId);
      callback(undefined, true, queryId, queryInProgress);
    }
  };
}

describe('furkot-geocode node module', function () {

  it('no input no output', function (done) {
    furkotGeocode(undefined)(undefined, function (result) {
      should.not.exist(result);
      done();
    });
  });

  it('empty input no output', function (done) {
    furkotGeocode(undefined)({}, function (result) {
      should.not.exist(result);
      done();
    });
  });

  it('no service', function (done) {
    furkotGeocode({
      forward: [],
      reverse: []
    })({}, function (result) {
      should.not.exist(result);
      done();
    });
  });

  it('service', function (done) {
    furkotGeocode({
      forward: [
        mockService
      ],
      reverse: []
    })({}, function (result) {
      result.should.eql({
        provider: 'success'
      });
      done();
    });
  });

  it('only enabled services', function () {
    var options = {
        opencage_enable: function () {}
    };
    var geocode = furkotGeocode(options);
    geocode.options.should.have.property('forward').with.length(1);
    geocode.options.should.have.property('reverse').with.length(1);
  });

  it('timeout', function (done) {
    var service = timeService(200);
    furkotGeocode({
      forward: [
        service.geocode
      ],
      reverse: [],
      abort: [
        service.abort
      ],
      timeout: 100
    })({}, function (result) {
      should.not.exists(result);
      setTimeout(done, 250);
    });
  });
});
