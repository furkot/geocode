import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import service from '../../lib/service/index.js';

describe('geocoding service', () => {
  it('empty', async () => {
    const { geocode } = service({
      name: 'test',
      prepareRequest: () => ({}),
      request: (_url, _req, fn) => fn(),
      status: () => undefined
    });
    const result = await geocode('forward', 'empty', {});
    assert.equal(result, undefined, 'should not exist');
  });

  it('failure', async () => {
    const { geocode } = service({
      name: 'test',
      prepareRequest: () => ({}),
      request: (_url, _req, fn) => fn(),
      status: () => 'failure'
    });
    let result = await geocode('forward', 'failure', {});
    assert.equal(result, undefined, 'should not exist');

    result = await geocode('forward', 'after failure', {});
    assert.equal(result, undefined, 'should not exist');
  });
});

it('abort', { timeout: 200 }, async () => {
  const { abort, geocode } = service({
    name: 'test',
    prepareRequest: () => ({}),
    request: () => ({ abort: () => undefined })
  });
  const query = {};
  for (let queryId = 0; queryId < 3; queryId++) {
    abortAfter(queryId);
    const r = await geocode('forward', queryId, query);
    assert.equal(r, undefined, 'should not exist');
  }

  const result = await geocode('forward', 'after 3 aborts', query);
  assert.equal(result, undefined, 'should not exist');

  function abortAfter(queryId) {
    return setTimeout(() => abort(queryId), 40);
  }
});
