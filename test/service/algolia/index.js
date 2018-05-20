var should = require('should');

describe('algolia geocoding', function () {

  var response;
  var geocode = require('../../../lib/service/algolia')({
    name: 'algolia',
    request: function (url, req, fn) {
      fn(undefined, response);
    }
  }).geocode;

  it('autocomplete address', function (done) {
    var query;

    response = require('./fixtures/address');

    query = {
      address: '201 Lincoln St, bos',
      partial: true
    };
    geocode('forward', 1, query, {}, function (err, value, id, query, result) {
      should.not.exist(err);
      value.should.equal(true);
      should.exist(result);
      result.should.have.property('places').with.length(5);
      result.places[0].should.deepEqual({
        ll: [ -71.1281, 42.3574 ],
        type: 'road',
        address: '201 Lincoln Street, Boston, MA, USA',
        street: '201 Lincoln Street',
        town: 'Boston',
        county: 'Suffolk County',
        province: 'MA',
        country: 'USA'
      });
      result.places[1].should.deepEqual({
        ll: [ -71.0593, 42.3492 ],
        type: 'road',
        address: '201 Lincoln Street Connector, Boston, MA, USA',
        street: '201 Lincoln Street Connector',
        town: 'Boston',
        county: 'Suffolk County',
        province: 'MA',
        country: 'USA'
      });
      result.should.have.property('provider', 'algolia');
      result.should.have.property('stats', ['algolia']);
      done();
    });
  });

  it('autocomplete place', function (done) {
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
      result.should.have.property('places').with.length(9);
      result.places[0].should.deepEqual({
        ll: [ 18.6587, 54.3515 ],
        place: 'SS Sołdek',
        type: 'tourism',
        address: 'Gdańsk, województwo pomorskie, Polska',
        town: 'Gdańsk',
        county: 'Gdańsk',
        province: 'województwo pomorskie',
        country: 'Polska'
      });
      result.should.have.property('provider', 'algolia');
      result.should.have.property('stats', ['algolia']);
      done();
    });
  });

});
