var should = require('should');
var geocodio = require('../../../lib/service/geocodio');

describe('geocodio geocoding', function () {

  var response;
  var urlPrefix;

  function request(url, req, fn) {
    url.should.startWith(urlPrefix);
    fn(undefined, response);
  }

  var geocode = geocodio({
    interval: 1,
    name: 'geocodio',
    request: request
  }).geocode;


  afterEach(function() {
    response = undefined;
    urlPrefix = undefined;
  });


  it('forward', function (done) {
    response = require('./fixtures/forward');
    urlPrefix = 'https://api.geocod.io/v1.3/geocode?q=Rua%20Cafel%C3%A2ndia%2C%20Carapicu%C3%ADba%2C%20Brasil&api_key=';

    var query = {
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
        country: 'US'
      });
      result.should.have.property('provider', 'geocodio');
      result.should.have.property('stats', ['geocodio']);
      done();
    });
  });

  it('place', function (done) {
    response = require('./fixtures/place');
    urlPrefix = 'https://api.geocod.io/v1.3/geocode?q=So%C5%82dek&api_key=';

    var query = {
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
    response = require('./fixtures/reverse');
    urlPrefix = 'https://api.geocod.io/v1.3/reverse?q=45.283333,-111.401389&api_key=';

    var query = {
      ll: [ -111.401389, 45.283333 ]
    };
    geocode('reverse', 1, query, {}, function (err, value, id, query, result) {
      should.not.exist(err);
      value.should.equal(true);
      should.exist(result);
      result.should.have.property('places').with.length(1);
      result.places[0].should.deepEqual({
        ll: [ -111.400596, 45.284265 ],
        address: '50 Big Sky Resort Rd, Big Sky, MT 59716',
        housenumber: '50',
        street: 'Big Sky Resort',
        county: 'Madison County',
        province: 'MT',
        town: "Big Sky",
        country: 'US'
      });
      result.should.have.property('provider', 'geocodio');
      result.should.have.property('stats', ['geocodio']);
      done();
    });
  });
});
