const { describe, it } = require('node:test');
const should = require('should');
const opencage = require('../../../lib/service/opencage');

describe('opencage geocoding', function () {

  const { geocode } = opencage({
    interval: 1,
    name: 'opencage',
    opencage_key: process.env.OPENCAGE_KEY || 'furkot'
  });

  it('forward', async function () {

    const query = {
      address: 'Rua Cafelândia, Carapicuíba, Brasil'
    };
    const result = await geocode('forward', 1, query);
    should.exist(result);
    result.should.have.property('places').with.length(2);
    result.places[0].should.deepEqual({
      ll: [-46.8359735, -23.5370962],
      type: 'road',
      place: 'Rua Cafelândia',
      address: 'Rua Cafelândia, Carapicuíba, São Paulo, Brazil',
      normal: 'Rua Cafelândia,Carapicuíba,São Paulo,BR',
      street: 'Rua Cafelândia',
      town: 'Carapicuíba',
      county: 'Região Metropolitana de São Paulo',
      province: 'São Paulo',
      country: 'Brazil'
    });
    result.places[1].should.deepEqual({
      ll: [-46.835, -23.52272],
      type: 'city',
      address: 'Carapicuíba, São Paulo, Brazil',
      normal: 'Carapicuíba,São Paulo,BR',
      town: 'Carapicuíba',
      county: 'Carapicuíba',
      province: 'São Paulo',
      country: 'Brazil'
    });
  });

  it('place', async function () {

    const query = {
      place: 'Sołdek',
      lang: 'pl'
    };
    const result = await geocode('forward', 1, query);
    should.exist(result);
    result.should.have.property('places').with.length(1);
    result.places[0].should.deepEqual({
      ll: [18.6586312, 54.351451],
      place: 'SS Sołdek',
      type: 'museum',
      address: 'Długie Pobrzeże, Gdańsk, województwo pomorskie, Poland',
      normal: 'Długie Pobrzeże,Gdańsk,województwo pomorskie,PL',
      street: 'Długie Pobrzeże',
      community: 'Wyspa Spichrzów',
      town: 'Gdańsk',
      province: 'województwo pomorskie',
      country: 'Poland'
    });
  });

  it('reverse', async function () {

    const query = {
      ll: [14.5272, -22.6792]
    };
    const result = await geocode('reverse', 1, query);
    should.exist(result);
    result.should.have.property('places').with.length(1);
    result.places[0].should.deepEqual({
      ll: [14.5268016, -22.6791826],
      place: 'Beryl\'s Restaurant',
      type: 'restaurant',
      address: 'Woermann St, Swakopmund, Namibia',
      normal: 'Woermann St,Swakopmund,,NA',
      street: 'Woermann St',
      town: 'Swakopmund',
      country: 'Namibia'
    });
  });

  it('address', async function () {

    const query = {
      address: '2200 S. Jason St, Denver, CO 80223',
      partial: true
    };
    const result = await geocode('forward', 10, query);
    should.exist(result);
    result.should.have.property('places').with.length(3);
    result.places[0].should.deepEqual({
      type: 'building',
      ll: [-104.999354, 39.676536],
      address: '2200 South Jason Street, Denver, CO',
      normal: '2200 South Jason Street,Denver,CO,US',
      house: '2200',
      street: 'South Jason Street',
      town: 'Denver',
      province: 'CO',
      country: 'USA'
    });
  });
});
