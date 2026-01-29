import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import furkotGeocode from '../lib/geocode.js';

function timeService(timeout) {
  let timeoutId;
  const fn = {};
  const pr = new Promise(resolve => (fn.resolve = resolve));

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
    places: [
      {
        place: 'a'
      },
      {
        street: 'a'
      }
    ]
  };
}

describe('furkot-geocode node module', () => {
  it('no input no output', async () => {
    const result = await furkotGeocode()();
    assert.equal(result, undefined, 'should not exist');
  });

  it('empty input no output', async () => {
    const result = await furkotGeocode()({});
    assert.equal(result, undefined, 'should not exist');
  });

  it('no service', async () => {
    const result = await furkotGeocode({
      forward: [],
      reverse: []
    })({});
    assert.equal(result, undefined, 'should not exist');
  });

  it('service', async () => {
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
    assert.ok(result != null, 'should exist');
    assert.deepEqual(result, {
      result: 'success',
      provider: 'mock',
      stats: ['mock']
    });
  });

  it('only enabled services', () => {
    const options = {
      opencage_enable() {}
    };
    const geocode = furkotGeocode(options);
    assert.equal(geocode.options.forward?.length, 1);
    assert.equal(geocode.options.reverse?.length, 1);
  });

  it('timeout', { timeout: 200 }, async () => {
    const service = timeService(100);
    const geocode = furkotGeocode({
      forward: [service.geocode],
      reverse: [],
      timeout: 50
    });
    return geocode({})
      .then(() => assert.fail('exception expected'))
      .catch(err => assert.equal(err.cause, Symbol.for('timeout')));
  });

  it('abort', { timeout: 200 }, async () => {
    const service = timeService(100);
    const geocode = furkotGeocode({
      forward: [service.geocode],
      reverse: []
    });
    const ac = new AbortController();
    const p = geocode({}, { signal: ac.signal });
    ac.abort();
    return p.then(() => assert.fail('exception expected')).catch(err => assert.equal(err.name, 'AbortError'));
  });

  it('maximum items', async () => {
    const geocode = furkotGeocode({
      forward: [() => ({ places: new Array(10) })],
      reverse: []
    });
    const result = await geocode({ max: 2 });
    assert.ok(result != null, 'should exist');
    assert.equal(result.places?.length, 2);
  });

  it('places', async () => {
    const result = await furkotGeocode({
      forward: [placeService],
      reverse: []
    })({
      place: 'a'
    });
    assert.ok(result != null, 'should exist');
    assert.equal(result.places?.length, 1);
    assert.equal(result.places[0].place, 'a');
  });
});
