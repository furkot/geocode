const should = require('should');
const geocodio = require('../../../lib/service/geocodio');

describe('geocodio geocoding', function () {
  const { geocode } = geocodio({
    interval: 1,
    name: 'geocodio',
    geocodio_key: process.env.GEOCODIO_KEY || 'furkot'
  });

  it('forward', async function () {
    const query = {
      address: 'Rua Cafelândia, Carapicuíba, Brasil'
    };
    const result = await geocode('forward', 1, query);
    should.exist(result);
    result.should.have.property('places').with.length(2);
    result.places[0].should.deepEqual({
      ll: [-87.12502, 39.52365],
      address: 'Brazil, IN',
      normal: 'Brazil,IN,US',
      town: 'Brazil',
      county: 'Clay County',
      province: 'IN',
      country: 'USA'
    });
  });

  it('place', async function () {

    const query = {
      place: 'Sołdek',
      lang: 'pl'
    };
    const result = await geocode('forward', 1, query);
    should.not.exist(result);
  });

  it('reverse', async function () {
    const query = {
      ll: [-111.401389, 45.283333]
    };
    const result = await geocode('reverse', 1, query);
    should.exist(result);
    result.should.have.property('places').with.length(8);
    result.places[0].should.deepEqual({
      ll: [-111.400596, 45.284265],
      address: '50 Big Sky Resort Rd, Big Sky, MT',
      normal: '50 Big Sky Resort Rd,Big Sky,MT,US',
      house: '50',
      street: 'Big Sky Resort Rd',
      county: 'Madison County',
      province: 'MT',
      town: "Big Sky",
      country: 'USA'
    });
  });
});
