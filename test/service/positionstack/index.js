const should = require('should');
const positionstack = require('../../../lib/service/positionstack');

describe('positionstack geocoding', function () {

  const { geocode } = positionstack({
    interval: 1,
    name: 'positionstack',
    positionstack_key: process.env.POSITIONSTACK_KEY || 'furkot'
  });

  it('forward', async function () {

    const query = {
      address: 'Rua Cafelândia, Carapicuíba, Brasil'
    };
    const result = await geocode('forward', 1, query);
    should.exist(result);
    result.should.have.property('places').with.length(1);
    result.places[0].should.deepEqual({
      ll: [-46.830942, -23.532918],
      type: 'locality',
      town: 'Carapicuíba',
      province: 'Sao Paulo',
      country: 'Brazil',
      place: 'Carapicuíba',
      address: 'Carapicuíba, Sao Paulo, Brazil',
      normal: 'Carapicuíba,Sao Paulo,BR'
    });
  });

  it('place', async function () {

    const query = {
      place: 'Golden Gate Bridge'
    };
    const result = await geocode('forward', 1, query);
    should.exist(result);
    result.should.have.property('places').with.length(10);
    result.places[0].should.deepEqual({
      ll: [-122.478861, 37.822118],
      type: 'venue',
      town: 'San Francisco',
      province: 'CA',
      country: 'USA',
      place: 'Golden Gate Bridge',
      address: 'San Francisco, CA, USA',
      normal: 'San Francisco,CA,US'
    });
  });

  it('partial', async function () {

    const query = {
      place: 'Golden Gate Br'
    };
    const result = await geocode('forward', 1, query);
    should.exist(result);
    result.should.have.property('places').with.length(10);
    result.places[0].should.deepEqual({
      ll: [-49.542449, -11.928923],
      type: 'country',
      country: 'Brazil',
      place: 'Brazil',
      address: 'Brazil',
      normal: 'BR'
    });
  });

  it('reverse', async function () {

    const query = {
      ll: [14.5272, -22.6792]
    };
    const result = await geocode('reverse', 1, query);
    should.exist(result);
    result.should.have.property('places').with.length(10);
    result.places[0].should.deepEqual({
      ll: [14.526802, -22.679183],
      type: 'venue',
      province: 'Erongo',
      country: 'Namibia',
      place: 'Beryl\'s Restaurant',
      address: 'Erongo, Namibia',
      normal: 'Erongo,NA'
    });
  });
});
