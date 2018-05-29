var should = require('should');
var locationiq = require('../../../lib/service/locationiq');

describe('locationiq geocoding', function () {

  var response;
  var urlPrefix;

  function request(url, req, fn) {
      url.should.startWith(urlPrefix);
      fn(undefined, response);
    }

  var geocode = locationiq({
    interval: 1,
    name: 'locationiq',
    request: request
  }).geocode;


  beforeEach(function() {
    response = undefined;
    urlPrefix = undefined;
  });

  it('forward', function (done) {
    response = require('./fixtures/forward');
    urlPrefix = 'https://us1.locationiq.org/v1/search.php?q=Rua%20Cafel%C3%A2ndia%2C%20Carapicu%C3%ADba%2C%20Brasil&addressdetails=1&format=json&key=';

    var query = {
      address: 'Rua Cafelândia, Carapicuíba, Brasil'
    };
    geocode('forward', 1, query, {}, function (err, value, id, query, result) {
      should.not.exist(err);
      value.should.equal(true);
      should.exist(result);
      result.should.have.property('places').with.length(1);
      result.places[0].should.deepEqual({
        ll: [ -46.8356555, -23.5370391 ],
        type: 'road',
        place: 'Rua Cafelândia',
        address: 'Rua Cafelândia, Parque José Alexandre, Carapicuíba, Microrregião de Osasco, RMSP, Mesorregião Metropolitana de São Paulo, São Paulo, Southeast Region, 06321-665, Brazil',
        street: 'Rua Cafelândia',
        town: 'Carapicuíba',
        province: 'São Paulo',
        country: 'Brazil'
      });
      result.should.have.property('provider', 'locationiq');
      result.should.have.property('stats', ['locationiq']);
      done();
    });
  });

  it('place', function (done) {
    response = require('./fixtures/place');
    urlPrefix = 'https://us1.locationiq.org/v1/search.php?q=So%C5%82dek&accept-language=pl&addressdetails=1&format=json&key=';

    var query = {
      place: 'Sołdek',
      lang: 'pl'
    };
    geocode('forward', 1, query, {}, function (err, value, id, query, result) {
      should.not.exist(err);
      value.should.equal(true);
      should.exist(result);
      result.should.have.property('places').with.length(1);
      result.places[0].should.deepEqual({
        ll: [ 18.6586892492584, 54.3515282 ],
        place: 'SS Sołdek',
        type: 'museum',
        address: 'Długie Pobrzeże, Ołowianka, Śródmieście, Gdańsk, województwo pomorskie, 80-751, Polska',
        street: 'Długie Pobrzeże',
        province: 'województwo pomorskie',
        town: 'Gdańsk',
        country: 'Polska'
      });
      result.should.have.property('provider', 'locationiq');
      result.should.have.property('stats', ['locationiq']);
      done();
    });
  });

  it('reverse', function (done) {
    response = require('./fixtures/reverse');
    urlPrefix = 'https://us1.locationiq.org/v1/reverse.php?lon=14.5272&lat=-22.6792&addressdetails=1&format=json&key=';

    var query = {
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
        address: 'Woermann St, Central, Swakopmund, Erongo Region, Namibia',
        street: 'Woermann St',
        province: 'Erongo Region',
        town: "Swakopmund",
        country: 'Namibia'
      });
      result.should.have.property('provider', 'locationiq');
      result.should.have.property('stats', ['locationiq']);
      done();
    });
  });
});
