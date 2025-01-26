const { describe, it } = require('node:test');
const should = require('chai').should();
const furkotGeocode = require('../lib/geocode');

/* global AbortController */

function timeService(timeout) {
  let timeoutId;
  const fn = {};
  const pr = new Promise(resolve => fn.resolve = resolve);

  return {
    geocode() {
      timeoutId = setTimeout(() => fn.resolve(), timeout);
      return pr;
    },
    abort() {
      clearTimeout(timeoutId);
      fn.resolve();
    }
  };
}

function placeService() {
  return {
    places: [{
      place: 'a'
    }, {
      street: 'a'
    }]
  };
}

describe('furkot-geocode node module', function () {

  it('no input no output', async function () {
    const result = await furkotGeocode()();
    should.not.exist(result);
  });

  it('empty input no output', async function () {
    const result = await furkotGeocode()({});
    should.not.exist(result);
  });

  it('no service', async function () {
    const result = await furkotGeocode({
      forward: [],
      reverse: []
    })({});
    should.not.exist(result);
  });

  it('service', async function () {
    function mockService() {
      return {
        result: 'success'
      };
    }
    mockService.provider = 'mock';
    const result = await furkotGeocode({
      forward: [mockService],
      reverse: []
    })({});
    should.exist(result);
    result.should.eql({
      result: 'success',
      provider: 'mock',
      stats: ['mock']
    });
  });

  it('only enabled services', function () {
    const options = {
      opencage_enable() { }
    };
    const geocode = furkotGeocode(options);
    geocode.options.should.have.property('forward').with.length(1);
    geocode.options.should.have.property('reverse').with.length(1);
  });

  it('timeout', { timeout: 200 }, async function () {
    const service = timeService(100);
    const geocode = furkotGeocode({
      forward: [
        service.geocode
      ],
      reverse: [],
      timeout: 50
    });
    return geocode({})
      .then(() => should.fail('exception expected'))
      .catch(err => err.should.have.property('cause', Symbol.for('timeout')));
  });


  it('abort', { timeout: 200 }, async function () {
    const service = timeService(100);
    const geocode = furkotGeocode({
      forward: [
        service.geocode
      ],
      reverse: []
    });
    const ac = new AbortController();
    const p = geocode({}, { signal: ac.signal });
    ac.abort();
    return p
      .then(() => should.fail('exception expected'))
      .catch(err => err.should.have.property('name', 'AbortError'));
  });


  it('maximum items', async function () {
    const geocode = furkotGeocode({
      forward: [
        () => ({ places: new Array(10) })
      ],
      reverse: []
    });
    const result = await geocode({ max: 2 });
    should.exist(result);
    result.should.have.property('places').with.length(2);
  });

  it('places', async function () {
    const result = await furkotGeocode({
      forward: [
        placeService
      ],
      reverse: []
    })({
      place: 'a'
    });
    should.exist(result);
    result.should.have.property('places').with.length(1);
    result.places[0].should.have.property('place', 'a');
  });
});
