const should = require('should');
const service = require('../../lib/service');

describe('geocoding service', function () {

  it('empty', async function () {
    const { geocode } = service({
      name: 'test',
      prepareRequest: () => ({}),
      request: (url, req, fn) => fn(),
      status: () => undefined
    });
    const result = await geocode('forward', 'empty', {});
    should.not.exist(result);
  });

  it('failure', async function () {
    const { geocode } = service({
      name: 'test',
      prepareRequest: () => ({}),
      request: (url, req, fn) => fn(),
      status: () => 'failure'
    });
    let result = await geocode('forward', 'failure', {});
    should.not.exist(result);

    result = await geocode('forward', 'after failure', {});
    should.not.exist(result);
  });
});

it('abort', async function () {
  this.slow(200);
  const { abort, geocode } = service({
    name: 'test',
    prepareRequest: () => ({}),
    request: () => ({ abort: () => undefined })
  });
  const query = {};
  for (let queryId = 0; queryId < 3; queryId++) {
    abortAfter(queryId);
    await geocode('forward', queryId, query).should.be.fulfilledWith(undefined);
  }

  let result = await geocode('forward', 'after 3 aborts', query);
  should.not.exist(result);

  function abortAfter(queryId) {
    return setTimeout(() => abort(queryId), 40);
  }
});
