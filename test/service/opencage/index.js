var should = require('should');

describe('opencage geocoding', function () {

  var response;
  var geocode = require('../../../lib/service/opencage')({
    interval: 1,
    name: 'opencage',
    request: function (url, req, fn) {
      fn(undefined, response);
    }
  }).geocode;

  it('forward', function (done) {
    var query;

    response = require('./fixtures/forward');

    query = {
      address: 'Rua Cafelândia, Carapicuíba, Brasil'
    };
    geocode('forward', 1, query, {}, function (err, value, id, query, result) {
      should.not.exist(err);
      value.should.equal(true);
      should.exist(result);
      result.should.have.property('places').with.length(2);
      result.places[0].should.deepEqual({
        ll: [ -46.8356555, -23.5370391 ],
        type: 'road',
        place: 'Rua Cafelândia',
        address: 'Rua Cafelândia, Carapicuíba - SP, 06381-010, Brazil',
        street: 'Rua Cafelândia',
        town: 'Carapicuíba',
        county: 'Microrregião de Osasco',
        province: 'SP',
        country: 'Brazil'
      });
      result.places[1].should.deepEqual({
        ll: [ -46.835, -23.52272 ],
        type: 'city',
        address: 'Carapicuíba, Brazil',
        town: 'Carapicuíba',
        county: 'Carapicuíba',
        province: 'SP',
        country: 'Brazil'
      });
      result.should.have.property('provider', 'opencage');
      result.should.have.property('stats', ['opencage']);
      done();
    });
  });

  it('place', function (done) {
    var query;

    response = require('./fixtures/place');

    query = {
      place: 'Sołdek',
      lang: 'pl'
    };
    geocode('forward', 1, query, {}, function (err, value, id, query, result) {
      should.not.exist(err);
      value.should.equal(true);
      should.exist(result);
      result.should.have.property('places').with.length(1);
      result.places[0].should.deepEqual({
        ll: [ 18.6586892, 54.3515282 ],
        place: 'SS Sołdek',
        type: 'museum',
        address: 'Długie Pobrzeże, 80-751 Gdańsk, Polska',
        street: 'Długie Pobrzeże',
        community: 'Ołowianka',
        town: 'Gdańsk',
        county: 'Gdańsk',
        country: 'Polska'
      });
      result.should.have.property('provider', 'opencage');
      result.should.have.property('stats', ['opencage']);
      done();
    });
  });

  it('reverse', function (done) {
    var query;

    response = require('./fixtures/reverse');

    query = {
      ll: [ 14.5272, -22.6792 ]
    };
    geocode('reverse', 1, query, {}, function (err, value, id, query, result) {
      should.not.exist(err);
      value.should.equal(true);
      should.exist(result);
      result.should.have.property('places').with.length(1);
      result.places[0].should.deepEqual({
        ll: [ 14.5268016, -22.6791826 ],
        place: 'Beryl\'s Restaurant',
        type: 'restaurant',
        address: 'Woermann St, Swakopmund, Namibia',
        street: 'Woermann St',
        town: 'Swakopmund',
        country: 'Namibia'
      });
      result.should.have.property('provider', 'opencage');
      result.should.have.property('stats', ['opencage']);
      done();
    });
  });
});
