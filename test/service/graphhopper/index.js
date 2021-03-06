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
        street: 'Rua Cafelândia',
        address: 'Rua Cafelândia, Carapicuíba, São Paulo, Brazil',
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
        address: 'Długie Pobrzeże, Gdansk, Pomeranian Voivodeship, Poland',
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

  it('partial', function (done) {
    response = require('./fixtures/partial');
    urlPrefix = 'https://graphhopper.com/api/1/geocode?q=main%20street&autocomplete=true&locale=en&key=';

    var query = {
      place: 'main street',
      lang: 'en',
      partial: true
    };
    geocode('forward', 1, query, {}, function (err, value, id, query, result) {
      should.not.exist(err);
      value.should.equal(true);
      should.exist(result);
      result.should.have.property('places').with.length(6);
      result.places[0].should.deepEqual({
        ll:  [ -117.91884953319028, 33.8111284 ],
        type: 'locality',
        place: 'Main Street',
        town: 'Anaheim',
        province: 'CA',
        country: 'USA',
        address: 'Anaheim, CA, USA'
      });
      result.places[1].should.deepEqual({
        ll:  [ -81.58111014981344, 28.41769265 ],
        type: 'locality',
        place: 'Main Street, U.S.A.',
        town: 'Bay Lake',
        province: 'FL',
        country: 'USA',
        address: 'Bay Lake, FL, USA'
      });
      result.places[2].should.deepEqual({
        ll:  [ -5.353107, 36.1360903 ],
        type: 'tertiary',
        street: 'Main Street',
        town: 'Gibraltar',
        province: 'Gibraltar',
        country: 'Gibraltar',
        address: 'Main Street, Gibraltar, Gibraltar, Gibraltar'
      });
      result.places[3].should.deepEqual({
        ll:  [ -122.96360111945452, 45.52141375 ],
        type: 'bridge',
        place: 'Main Street Bridge',
        street: 'East Main Street',
        town: 'Hillsboro',
        province: 'OR',
        country: 'USA',
        address: 'East Main Street, Hillsboro, OR, USA'
      });
      result.places[4].should.deepEqual({
        ll:  [ 2.7777104437086084, 48.8718797 ],
        type: 'living_street',
        street: 'Main Street',
        town: 'Chessy',
        province: 'Ile-de-France',
        country: 'France',
        address: 'Main Street, Chessy, Ile-de-France, France'
      });
      result.places[5].should.deepEqual({
        ll:  [ -105.2653362, 40.2227082 ],
        type: 'primary',
        street: 'Main Street',
        town: 'Lyons',
        province: 'CO',
        country: 'USA',
        address: 'Main Street, Lyons, CO, USA'
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
        address: 'Woermann St, Swakopmund, Erongo Region, Namibia',
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

  it('reverse', function (done) {
    response = require('./fixtures/reverse-usa');
    urlPrefix = 'https://graphhopper.com/api/1/geocode?reverse=true&point=48.41449636239881,-122.15166091920605&key=';

    var query = {
      ll: [ -122.15166091920605, 48.41449636239881 ]
    };
    geocode('reverse', 1, query, {}, function (err, value, id, query, result) {
      should.not.exist(err);
      value.should.equal(true);
      should.exist(result);
      result.should.have.property('places').with.length(5);
      result.places[0].should.deepEqual({
        ll: [ -122.142095, 48.4251065 ],
        place: 'Cultus Mountain',
        type: 'peak',
        address: 'WA, USA',
        province: 'WA',
        country: 'USA'
      });
      result.places[1].should.deepEqual({
        ll: [ -122.17509247364865, 48.39710575 ],
        place: 'Devil\'s Rock Garden',
        type: 'bare_rock',
        address: 'Waterfall Trail, Montborne, WA, USA',
        street: 'Waterfall Trail',
        town: 'Montborne',
        province: 'WA',
        country: 'USA'
      });
      result.places[2].should.deepEqual({
        ll: [ -122.1852829, 48.3995692 ],
        type: 'track',
        address: 'Snohomish Lane, Montborne, WA, USA',
        street: 'Snohomish Lane',
        town: 'Montborne',
        province: 'WA',
        country: 'USA'
      });
      result.places[3].should.deepEqual({
        ll: [ -122.18286687388566, 48.397359550000004 ],
        place: 'Fire Mountain Scout Reservation',
        type: 'park',
        address: 'Montborne, WA, USA',
        town: 'Montborne',
        province: 'WA',
        country: 'USA'
      });
      result.places[4].should.deepEqual({
        ll: [ -122.183105, 48.3962283 ],
        place: 'Miners\' Cave',
        type: 'cave_entrance',
        address: 'Klahowya Road, Montborne, WA, USA',
        street: 'Klahowya Road',
        town: 'Montborne',
        province: 'WA',
        country: 'USA'
      });
      result.should.have.property('provider', 'graphhopper');
      result.should.have.property('stats', ['graphhopper']);
      done();
    });
  });
});
