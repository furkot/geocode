var should = require('should');
var openroute = require('../../../lib/service/openroute');

describe('openroute geocoding', function () {

  var response;
  var urlPrefix;

  function request(url, req, fn) {
      url.should.startWith(urlPrefix);
      fn(undefined, response);
    }

  var geocode = openroute({
    interval: 1,
    name: 'openroute',
    request: request
  }).geocode;


  beforeEach(function() {
    response = undefined;
    urlPrefix = undefined;
  });

  it('forward', function (done) {
    response = require('./fixtures/forward');
    urlPrefix = 'https://api.openrouteservice.org/geocode/search?text=Rua%20Cafel%C3%A2ndia%2C%20Carapicu%C3%ADba%2C%20Brasil&api_key=';

    var query = {
      address: 'Rua Cafelândia, Carapicuíba, Brasil'
    };
    geocode('forward', 1, query, {}, function (err, value, id, query, result) {
      should.not.exist(err);
      value.should.equal(true);
      should.exist(result);
      result.should.have.property('places').with.length(10);
      result.places[0].should.deepEqual({
        ll: [ -46.836571, -23.53719 ],
        type: 'street',
        place: 'Rua Cafelândia',
        address: 'Rua Cafelândia, Carapicuíba, SÃO PAULO, Brazil',
        street: 'Rua Cafelândia',
        town: 'Carapicuíba',
        county: 'CARAPICUÃBA',
        province: 'SÃO PAULO',
        country: 'Brazil'
      });
      result.places[1].should.deepEqual({
        ll: [ -49.218992, -21.477898 ],
        type: 'street',
        place: 'Rua Cafelândia',
        address: 'Rua Cafelândia, Novo Horizonte, SÃO PAULO, Brazil',
        street: 'Rua Cafelândia',
        town: 'Novo Horizonte',
        county: 'Novo Horizonte',
        province: 'SÃO PAULO',
        country: 'Brazil'
      });
      result.should.have.property('provider', 'openroute');
      result.should.have.property('stats', ['openroute']);
      done();
    });
  });

  it('place', function (done) {
    response = require('./fixtures/place');
    urlPrefix = 'https://api.openrouteservice.org/geocode/search?text=So%C5%82dek&api_key=';

    var query = {
      place: 'Sołdek',
      lang: 'pl'
    };
    geocode('forward', 1, query, {}, function (err, value, id, query, result) {
      should.not.exist(err);
      value.should.equal(true);
      should.exist(result);
      result.should.have.property('places').with.length(10);
      result.places[0].should.deepEqual({
        ll: [ 18.658663, 54.351444 ],
        place: 'SS Sołdek',
        type: 'venue',
        address: 'Gdańsk, Pomorskie, Poland',
        county: "M. GdaÅsk", // this is wrong
        province: 'Pomorskie',
        town: 'Gdańsk',
        country: 'Poland'
      });
      result.should.have.property('provider', 'openroute');
      result.should.have.property('stats', ['openroute']);
      done();
    });
  });

  it('reverse', function (done) {
    response = require('./fixtures/reverse');
    urlPrefix = 'https://api.openrouteservice.org/geocode/reverse?point.lon=14.5272&point.lat=-22.6792&api_key=';

    var query = {
      ll: [ 14.5272, -22.6792 ]
    };
    geocode('reverse', 1, query, {}, function (err, value, id, query, result) {
      should.not.exist(err);
      value.should.equal(true);
      should.exist(result);
      result.should.have.property('places').with.length(10);
      result.places[0].should.deepEqual({
        ll: [ 14.526802, -22.679183 ],
        place: 'Beryl\'s Restaurant',
        type: 'venue',
        address: 'Namibia',
        country: 'Namibia'
      });
      result.should.have.property('provider', 'openroute');
      result.should.have.property('stats', ['openroute']);
      done();
    });
  });
});
