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
    urlPrefix = 'https://api.locationiq.com/v1/search.php?q=Rua%20Cafel%C3%A2ndia%2C%20Carapicu%C3%ADba%2C%20Brasil&addressdetails=1&normalizecity=1&format=json&key=';

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
        address: 'Rua Cafelândia, Carapicuíba, São Paulo, Brazil',
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
    urlPrefix = 'https://api.locationiq.com/v1/search.php?q=So%C5%82dek&accept-language=pl&addressdetails=1&normalizecity=1&format=json&key=';

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
        address: 'Długie Pobrzeże, Gdańsk, województwo pomorskie, Polska',
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

  it('partial', function (done) {
    response = require('./fixtures/partial');
    urlPrefix = 'https://api.locationiq.com/v1/search.php?q=30%20West%2026th%20Street%2C%20New%20York&viewbox=-136.85324796095287,29.833181774137493,-58.630591710944685,59.76129059655832&bounded=1&addressdetails=1&normalizecity=1&format=json&key=';

    var query = {
      address: '30 West 26th Street, New York',
      bounds: [[-136.85324796095287,29.833181774137493],[-58.630591710944685,59.76129059655832]],
      partial: true
    };
    geocode('forward', 10, query, {}, function (err, value, id, query, result) {
      should.not.exist(err);
      value.should.equal(true);
      should.exist(result);
      result.should.have.property('places').with.length(7);
      result.places[0].should.deepEqual({
        place: 'Hill Country Barbecue Market',
        type: 'restaurant',
        ll: [ -73.9904326, 40.7442736 ],
        address: '30 West 26th Street, New York City, NY, USA',
        street: '30 West 26th Street',
        town: 'New York City',
        province: 'NY',
        country: 'USA'
      });
      result.places[1].should.deepEqual({
        place: 'Samsung Accelerator',
        type: 'address29',
        ll: [ -73.9903727, 40.7442104 ],
        address: '30 West 26th Street, New York City, NY, USA',
        street: '30 West 26th Street',
        town: 'New York City',
        province: 'NY',
        country: 'USA'
      });
      result.should.have.property('provider', 'locationiq');
      result.should.have.property('stats', ['locationiq']);
      done();
    });
  });

  it('reverse', function (done) {
    response = require('./fixtures/reverse');
    urlPrefix = 'https://api.locationiq.com/v1/reverse.php?lon=14.5272&lat=-22.6792&addressdetails=1&normalizecity=1&format=json&key=';

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
        address: 'Woermann St, Swakopmund, Erongo Region, Namibia',
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

  it('address', function (done) {
    response = require('./fixtures/address');
    urlPrefix = 'https://api.locationiq.com/v1/search.php?q=2200%20S.%20Jason%20St%2C%20Denver%2C%20CO%2080223&viewbox=-106.24023437500165,41.84270596422118,-93.75976562500192,38.10619124884522&bounded=1&addressdetails=1&normalizecity=1&format=json&key=';

    var query = {
      address: '2200 S. Jason St, Denver, CO 80223',
      bounds: [[-106.24023437500165,41.84270596422118],[-93.75976562500192,38.10619124884522]],
      partial: true
    };
    geocode('forward', 10, query, {}, function (err, value, id, query, result) {
      should.not.exist(err);
      value.should.equal(true);
      should.exist(result);
      result.should.have.property('places').with.length(4);
      result.places[0].should.deepEqual({
        type: 'house_number',
        ll: [ -104.999354, 39.676536 ],
        address: '2200 South Jason Street, Denver, CO, USA',
        street: '2200 South Jason Street',
        town: 'Denver',
        province: 'CO',
        country: 'USA'
      });
      result.places[1].should.deepEqual({
        type: 'road',
        ll: [ -104.9994264, 39.7669524 ],
        address: 'Jason Street, Denver, CO, USA',
        street: 'Jason Street',
        town: 'Denver',
        province: 'CO',
        country: 'USA'
      });
      result.should.have.property('provider', 'locationiq');
      result.should.have.property('stats', ['locationiq']);
      done();
    });
  });
});
