var should = require('should');
var graphhopper = require('../../../lib/service/graphhopper');

describe('graphhopper geocoding', function () {

  var response;
  var urlPrefix;

  function request(url, req, fn) {
      url.should.startWith(urlPrefix);
      fn(undefined, response);
    }

  var geocode = graphhopper({
    interval: 1,
    name: 'graphhopper',
    request: request
  }).geocode;


  beforeEach(function() {
    response = undefined;
    urlPrefix = undefined;
  });

  it('forward', function (done) {
    response = require('./fixtures/forward');
    urlPrefix = 'https://graphhopper.com/api/1/geocode?q=Rua%20Cafel%C3%A2ndia%2C%20Carapicu%C3%ADba%2C%20Brasil&key=';

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
        type: 'residential',
        place: 'Rua Cafelândia',
        address: 'Carapicuíba, Brazil',
        town: 'Carapicuíba',
        province: 'São Paulo',
        country: 'Brazil'
      });
      result.should.have.property('provider', 'graphhopper');
      result.should.have.property('stats', ['graphhopper']);
      done();
    });
  });

  it('place', function (done) {
    response = require('./fixtures/place');
    urlPrefix = 'https://graphhopper.com/api/1/geocode?q=So%C5%82dek&locale=pl&key=';

    var query = {
      place: 'Sołdek',
      lang: 'pl'
    };
    geocode('forward', 1, query, {}, function (err, value, id, query, result) {
      should.not.exist(err);
      value.should.equal(true);
      should.exist(result);
      result.should.have.property('places').with.length(2);
      result.places[0].should.deepEqual({
        ll: [ 18.65868924925842, 54.351528200000004 ],
        place: 'SS Sołdek',
        type: 'museum',
        address: 'Długie Pobrzeże, Gdansk, Poland',
        street: 'Długie Pobrzeże',
        province: 'Pomeranian Voivodeship',
        town: 'Gdansk',
        country: 'Poland'
      });
      result.should.have.property('provider', 'graphhopper');
      result.should.have.property('stats', ['graphhopper']);
      done();
    });
  });

  it('reverse', function (done) {
    response = require('./fixtures/reverse');
    urlPrefix = 'https://graphhopper.com/api/1/geocode?reverse=true&point=-22.6792,14.5272&key=';

    var query = {
      ll: [ 14.5272, -22.6792 ]
    };
    geocode('reverse', 1, query, {}, function (err, value, id, query, result) {
      should.not.exist(err);
      value.should.equal(true);
      should.exist(result);
      result.should.have.property('places').with.length(5);
      result.places[0].should.deepEqual({
        ll: [ 14.5268016, -22.6791826 ],
        place: 'Beryl\'s Restaurant',
        type: 'restaurant',
        address: 'Woermann St, Swakopmund, Namibia',
        street: 'Woermann St',
        province: 'Erongo Region',
        town: "Swakopmund",
        country: 'Namibia'
      });
      result.should.have.property('provider', 'graphhopper');
      result.should.have.property('stats', ['graphhopper']);
      done();
    });
  });
});
