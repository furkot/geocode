const should = require('should');
const geocodio = require('../../../lib/service/geocodio');

describe('geocodio geocoding', function () {

  const { geocode } = geocodio({
    interval: 1,
    name: 'geocodio',
    geocodio_key: process.env.GEOCODIO_KEY || 'furkot'
  });

  it('forward', function (done) {

    const query = {
      address: 'Rua Cafelândia, Carapicuíba, Brasil'
    };
    geocode('forward', 1, query, {}, function (err, value, id, query, result) {
      should.not.exist(err);
      value.should.equal(true);
      should.exist(result);
      result.should.have.property('places').with.length(2);
      result.places[0].should.deepEqual({
        ll: [ -87.12502, 39.52365 ],
        address: 'Brazil, IN 47834',
        town: 'Brazil',
        county: 'Clay County',
        province: 'IN',
        country: 'USA'
      });
      result.should.have.property('provider', 'geocodio');
      result.should.have.property('stats', ['geocodio']);
      done();
    });
  });

  it('place', function (done) {

    const query = {
      place: 'Sołdek',
      lang: 'pl'
    };
    geocode('forward', 1, query, {}, function (err, value, id, query, result) {
      should.not.exist(err);
      value.should.equal(false);
      result.should.not.have.property('places');
      done();
    });
  });

  it('reverse', function (done) {

    const query = {
      ll: [ -111.401389, 45.283333 ]
    };
    geocode('reverse', 1, query, {}, function (err, value, id, query, result) {
      should.not.exist(err);
      value.should.equal(true);
      should.exist(result);
      result.should.have.property('places').with.length(8);
      result.places[0].should.deepEqual({
        ll: [ -111.400596, 45.284265 ],
        address: '50 Big Sky Resort Rd, Big Sky, MT 59716',
        housenumber: '50',
        street: 'Big Sky Resort',
        county: 'Madison County',
        province: 'MT',
        town: "Big Sky",
        country: 'USA'
      });
      result.should.have.property('provider', 'geocodio');
      result.should.have.property('stats', ['geocodio']);
      done();
    });
  });
});
