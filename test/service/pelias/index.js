const should = require('should');
const pelias = require('../../../lib/service/pelias');

describe('pelias geocoding', function () {

  const { geocode } = pelias({
    interval: 1,
    name: 'pelias',
    pelias_parameters: {
      enablePartial: true
    },
    pelias_key: process.env.PELIAS_KEY || 'furkot'
  });

  it('forward', async function () {

    const query = {
      address: 'Rua Cafelândia, Carapicuíba, Brasil'
    };
    const result = await geocode('forward', 1, query);
    should.exist(result);
    result.should.have.property('places').with.length(1);
    result.places[0].should.deepEqual({
      ll: [-46.836557, -23.5372],
      type: 'street',
      address: 'Rua Cafelândia, Carapicuíba, Sao Paulo, Brazil',
      street: 'Rua Cafelândia',
      town: 'Carapicuíba',
      county: 'Carapicuiba',
      province: 'Sao Paulo',
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
    result.should.have.property('places').with.length(2);
    result.places[0].should.deepEqual({
      ll: [18.658675, 54.351453],
      place: 'SS Sołdek',
      type: 'venue',
      address: 'Gdańsk, pomorskie, Polska',
      county: 'Gdańsk',
      province: 'pomorskie',
      town: 'Gdańsk',
      country: 'Polska'
    });
  });

  it('partial', async function () {

    const query = {
      place: 'arches national',
      partial: true
    };
    const result = await geocode('forward', 1, query);
    should.exist(result);
    result.should.have.property('places').with.length(4);
    result.places[0].should.deepEqual({
      ll: [-109.608784, 38.612304],
      place: 'Arches National Park',
      type: 'venue',
      county: 'Grand County',
      province: 'UT',
      country: 'USA',
      address: 'Grand County, UT, USA'
    });
    result.places[1].should.deepEqual({
      ll: [-109.61995, 38.616497],
      place: 'Arches National Park Visitor Center',
      type: 'venue',
      county: 'Grand County',
      province: 'UT',
      country: 'USA',
      address: 'Grand County, UT, USA'
    });
    result.places[2].should.deepEqual({
      ll: [125.23645, 6.815029],
      place: 'Pedro A. Arches National High School',
      type: 'venue',
      county: 'Bansalan',
      province: 'Davao del Sur',
      country: 'Philippines',
      address: 'Bansalan, Davao del Sur, Philippines'
    });
    result.places[3].should.deepEqual({
      ll: [-109.548641, 38.561166],
      place: 'Quality Suites Moab Near Arches National Park',
      type: 'venue',
      street: '800 South Main Street',
      town: 'Moab',
      county: 'Grand County',
      province: 'UT',
      country: 'USA',
      address: '800 South Main Street, Moab, UT, USA'
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
      place: 'Beryl\'s Restaurant',
      type: 'venue',
      address: 'Swakopmund, Erongo, Namibia',
      county: 'Swakopmund',
      province: 'Erongo',
      country: 'Namibia'
    });
  });

  it('address', async function () {

    const query = {
      ll: [-118.983976, 37.63619]
    };
    const result = await geocode('reverse', 1, query);
    should.exist(result);
    result.should.have.property('places').with.length(6);
    result.places[0].should.deepEqual({
      ll: [-118.983976, 37.63619],
      type: 'venue',
      address: '3253 Meridian, Mammoth Lakes, CA, USA',
      place: 'The Summit',
      street: '3253 Meridian',
      town: 'Mammoth Lakes',
      county: 'Mono County',
      province: 'CA',
      country: 'USA'
    });
    result.places[1].should.deepEqual({
      ll: [-118.983976, 37.63619],
      type: 'address',
      address: '3253 Meridian, Mammoth Lakes, CA, USA',
      street: '3253 Meridian',
      town: 'Mammoth Lakes',
      county: 'Mono County',
      province: 'CA',
      country: 'USA'
    });
  });
});
