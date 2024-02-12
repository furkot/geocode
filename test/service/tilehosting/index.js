const should = require('should');
const tilehosting = require('../../../lib/service/tilehosting');

describe('tilehosting geocoding', function () {

  const { geocode } = tilehosting({
    interval: 1,
    name: 'tilehosting',
    tilehosting_key: process.env.TILEHOSTING_KEY || 'furkot'
  });

  it('forward', async function () {

    const query = {
      address: 'Rua Cafelândia, Carapicuíba, Brasil'
    };
    const result = await geocode('forward', 1, query);
    should.exist(result);
    result.should.have.property('places').with.length(9);
    result.places[0].should.deepEqual({
      ll: [-46.8365592, -23.5372062],
      type: 'street',
      place: 'Rua Cafelândia',
      address: '',
      normal: ''
    });
    result.places[1].should.deepEqual({
      ll: [-46.8900124, -23.4851747],
      type: 'street',
      place: 'Rua Cafelândia',
      address: '',
      normal: ''
    });
  });

  it('place', async function () {

    const query = {
      place: 'Golden Gate Bridge'
    };
    const result = await geocode('forward', 1, query);
    should.exist(result);
    result.should.have.property('places').with.length(17);
    result.places[0].should.deepEqual({
      ll: [-122.4773342, 37.8096796],
      type: 'street',
      place: 'Golden Gate Bridge',
      address: '',
      normal: ''
    });
  });

  it('reverse', async function () {

    const query = {
      ll: [14.5272, -22.6792]
    };
    const result = await geocode('reverse', 1, query);
    should.exist(result);
    result.should.have.property('places').with.length(3);
    result.places[0].should.deepEqual({
      ll: [14.526695, -22.6793015],
      type: 'street',
      place: 'Woermann St',
      address: '',
      normal: ''
    });
  });
});
