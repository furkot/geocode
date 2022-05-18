const should = require('should');
const maptiler = require('../../../lib/service/maptiler');

describe('maptiler geocoding', function () {

  const { geocode } = maptiler({
    interval: 1,
    name: 'maptiler',
    maptiler_key: process.env.MAPTILER_KEY || 'furkot'
  });

  it('forward', function (done) {

    const query = {
      address: 'Rua Cafelândia, Carapicuíba, Brasil',
      lang: 'en'
    };
    geocode('forward', 1, query, {}, function (err, value, id, query, result) {
      should.not.exist(err);
      value.should.equal(true);
      should.exist(result);
      result.should.have.property('places').with.length(7);
      result.places[0].should.deepEqual({
        ll: [ -46.8365592, -23.5372062 ],
        type: 'street',
        place: 'Rua Cafelândia, Carapicuíba, Região Metropolitana de São Paulo, São Paulo',
        street: 'Rua Cafelândia',
        city: 'Carapicuíba',
        county: 'Região Metropolitana de São Paulo',
        country: 'Brazil',
        state: 'São Paulo'
      });
      result.places[1].should.deepEqual({
        ll: [ -46.8900124, -23.4851747 ],
        type: 'street',
        place: 'Rua Cafelândia, Barueri, Região Metropolitana de São Paulo, São Paulo',
        street: 'Rua Cafelândia',
        city: 'Barueri',
        county: 'Região Metropolitana de São Paulo',
        country: 'Brazil',
        state: 'São Paulo'
      });
      result.should.have.property('provider', 'maptiler');
      result.should.have.property('stats', ['maptiler']);
      done();
    });
  });

  it('place', function (done) {

    const query = {
      place: 'Golden Gate Bridge',
      bounds: [
        [-125.225345, 33.460096],
        [-113.349125, 41.567177]
      ]
    };
    geocode('forward', 1, query, {}, function (err, value, id, query, result) {
      should.not.exist(err);
      value.should.equal(true);
      should.exist(result);
      result.should.have.property('places').with.length(7);
      result.places[0].should.deepEqual({
        ll: [ -122.4773342, 37.8096796 ],
        type: 'street',
        place: 'Golden Gate Bridge, San Francisco, San Francisco City and County, California',
        street: 'Golden Gate Bridge',
        city: 'San Francisco',
        county: 'San Francisco City and County',
        country: 'United States',
        state: 'CA'
      });
      result.should.have.property('provider', 'maptiler');
      result.should.have.property('stats', ['maptiler']);
      done();
    });
  });

  it('reverse', function (done) {

    const query = {
      ll: [ 14.5272, -22.6792 ]
    };
    geocode('reverse', 1, query, {}, function (err, value, id, query, result) {
      should.not.exist(err);
      value.should.equal(true);
      should.exist(result);
      result.should.have.property('places').with.length(3);
      result.places[0].should.deepEqual({
        ll: [ 14.526695, -22.6793015 ],
        type: 'street',
        place: 'Woermann St, Erongo Region',
        street: 'Woermann St',
        country: 'Namibia',
        state: 'Erongo Region'
      });
      result.should.have.property('provider', 'maptiler');
      result.should.have.property('stats', ['maptiler']);
      done();
    });
  });

  it('reverse usa', function (done) {

    const query = {
      ll: [ -122.573125,48.849833 ]
    };
    geocode('reverse', 1, query, {}, function (err, value, id, query, result) {
      should.not.exist(err);
      value.should.equal(true);
      should.exist(result);
      result.should.have.property('places').with.length(5);
      result.places[0].should.deepEqual({
        ll: [ -122.5720456, 48.8493008 ],
        type: 'address',
        place: 'Barrett Road, Ferndale, Whatcom County, Washington',
        house: '5670',
        street: 'Barrett Road',
        city: 'Ferndale',
        county: 'Whatcom County',
        country: 'United States',
        state: 'WA'
      });
      result.should.have.property('provider', 'maptiler');
      result.should.have.property('stats', ['maptiler']);
      done();
    });
  });
});
