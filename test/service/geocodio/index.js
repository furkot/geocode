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
        city: 'Brazil',
        county: 'Clay County',
        state: 'IN',
        country: 'United States',
        type: 'city'
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
        house: '50',
        street: 'Big Sky Resort Rd',
        county: 'Madison County',
        state: 'MT',
        city: "Big Sky",
        country: 'United States',
        type: 'address'
      });
      result.should.have.property('provider', 'geocodio');
      result.should.have.property('stats', ['geocodio']);
      done();
    });
  });

  it('reverse canada', function (done) {

    const query = {
      ll: [ -123.100939, 49.252869 ]
    };
    geocode('reverse', 1, query, {}, function (err, value, id, query, result) {
      should.not.exist(err);
      value.should.equal(true);
      should.exist(result);
      result.should.have.property('places').with.length(5);
      result.places[0].should.deepEqual({
        ll: [ -123.101278, 49.252893 ],
        house: '199',
        street: 'E 20th Ave',
        city: 'Vancouver',
        state: 'BC',
        country: 'Canada',
        type: 'address'
      });
      result.should.have.property('provider', 'geocodio');
      result.should.have.property('stats', ['geocodio']);
      done();
    });
  });
});
