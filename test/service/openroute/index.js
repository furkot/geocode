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
    urlPrefix = 'https://api.openrouteservice.org/geocode/search?text=So%C5%82dek&lang=pl&api_key=';

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

  it('partial', function (done) {
    response = require('./fixtures/partial');
    urlPrefix = 'https://api.openrouteservice.org/geocode/search?text=arches%20national&api_key=';

    var query = {
      place: 'arches national',
      partial: true
    };
    geocode('forward', 1, query, {}, function (err, value, id, query, result) {
      should.not.exist(err);
      value.should.equal(true);
      should.exist(result);
      result.should.have.property('places').with.length(10);
      result.places[0].should.deepEqual({
        ll:  [ -109.620009, 38.616587 ],
        place: 'Arches National Park Visitor Center',
        type: 'venue',
        county: 'Grand County',
        province: 'UT',
        country: 'USA',
        address: 'Grand County, UT, USA'
      });
      result.places[1].should.deepEqual({
        ll:  [ 121.069168, 14.204155 ],
        type: 'street',
        street: 'Arches',
        county: 'Calamba',
        province: 'Laguna',
        country: 'Philippines',
        address: 'Arches, Calamba, Laguna, Philippines'
      });
      result.places[2].should.deepEqual({
        ll:  [ -121.080957, 38.660073 ],
        type: 'street',
        street: 'Arches Avenue',
        town: 'El Dorado Hills',
        county: 'El Dorado County',
        province: 'CA',
        country: 'USA',
        address: 'Arches Avenue, El Dorado Hills, CA, USA'
      });
      result.places[3].should.deepEqual({
        ll:  [ 2.324163, 45.308017 ],
        type: 'localadmin',
        county: 'Mauriac',
        province: 'Cantal',
        country: 'France',
        address: 'Mauriac, Cantal, France'
      });
      result.places[4].should.deepEqual({
        ll:  [ 6.534363, 48.120469 ],
        type: 'locality',
        town: 'Arches',
        province: 'Vosges',
        country: 'France',
        address: 'Arches, Vosges, France'
      });
      result.places[5].should.deepEqual({
        ll:  [ -3.417781, 14.901704 ],
        place: 'Arches Africaine',
        type: 'venue',
        county: 'Bandiagara',
        province: 'Mopti',
        country: 'Mali',
        address: 'Bandiagara, Mopti, Mali'
      });
      result.places[6].should.deepEqual({
        ll:  [ 6.528311, 48.119893 ],
        place: 'Arches',
        type: 'venue',
        town: 'Arches',
        province: 'Vosges',
        country: 'France',
        address: 'Arches, Vosges, France'
      });
      result.places[7].should.deepEqual({
        ll:  [ -4.099854, 52.913393 ],
        place: 'Arches',
        type: 'venue',
        province: 'Gwynedd',
        country: 'United Kingdom',
        address: 'Gwynedd, United Kingdom'
      });
      result.places[8].should.deepEqual({
        ll:  [ 2.328083, 45.305905 ],
        place: 'Arches',
        type: 'venue',
        county: 'Mauriac',
        province: 'Cantal',
        country: 'France',
        address: 'Mauriac, Cantal, France'
      });
      result.places[9].should.deepEqual({
        ll:  [ 5.150096, 50.474564 ],
        type: 'street',
        street: 'Aux Arches',
        county: 'Namur',
        province: 'Namur',
        country: 'Belgium',
        address: 'Aux Arches, Namur, Namur, Belgium'
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

  it('address', function (done) {
    response = require('./fixtures/address');
    urlPrefix = 'https://api.openrouteservice.org/geocode/reverse?point.lon=-118.9844711296318&point.lat=37.63593851131688&api_key=';
    
    var query = {
      ll: [ -118.9844711296318, 37.63593851131688 ]
    };
    geocode('reverse', 1, query, {}, function (err, value, id, query, result) {
      should.not.exist(err);
      value.should.equal(true);
      should.exist(result);
      result.should.have.property('places').with.length(4);
      result.places[0].should.deepEqual({
        ll: [ -118.984484, 37.635683 ],
        type: 'address',
        address: '240 Holiday Vista Drive, Mammoth Lakes, CA, USA',
        street: '240 Holiday Vista Drive',
        town: 'Mammoth Lakes',
        county: 'Mono County',
        province: 'CA',
        country: 'USA'
      });
      result.should.have.property('provider', 'openroute');
      result.should.have.property('stats', ['openroute']);
      done();
    });
  });
});
