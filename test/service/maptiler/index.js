const { describe, it } = require('node:test');
const should = require('should');
const maptiler = require('../../../lib/service/maptiler');

describe('maptiler geocoding', function () {

  const { geocode } = maptiler({
    interval: 1,
    name: 'maptiler',
    maptiler_key: process.env.MAPTILER_KEY || 'furkot'
  });

  it('forward', async function () {

    const query = {
      address: 'Rua Cafelândia, Carapicuíba, Brasil'
    };
    const result = await geocode('forward', 1, query);
    should.exist(result);
    result.should.have.property('places').with.length(5);
    result.places[0].should.deepEqual({
      ll: [-46.83655746281147, -23.537200177660463],
      type: 'street',
      place: 'Rua Cafelândia',
      country: 'Brazil',
      address: 'Brazil',
      normal: 'BR'
    });
    result.places[1].should.deepEqual({
      ll: [-46.895270850509405, -23.61090479385711],
      type: 'street',
      place: 'Rua Cafelândia',
      country: 'Brazil',
      address: 'Brazil',
      normal: 'BR'
    });
  });

  it('place', async function () {

    const query = {
      place: 'Golden Gate Bridge'
    };
    const result = await geocode('forward', 1, query);
    should.exist(result);
    result.should.have.property('places').with.length(5);
    result.places[0].should.deepEqual({
      ll: [-122.28275321424007, 37.84177777704476],
      type: 'place',
      place: 'Golden Gate',
      country: 'USA',
      address: 'United States',
      normal: 'US'
    });
  });

  it('reverse', async function () {

    const query = {
      ll: [14.5272, -22.6792]
    };
    const result = await geocode('reverse', 1, query);
    should.exist(result);
    result.should.have.property('places').with.length(5);
    result.places[0].should.deepEqual({
      ll: [14.526541957636255, -22.679326596603442],
      type: 'street',
      place: 'Woermann Street',
      country: 'Namibia',
      address: 'Namibia',
      normal: 'NA'
    });
  });
});
