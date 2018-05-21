var should = require('should');

describe('tilehosting geocoding', function () {

  var response;
  var geocode = require('../../../lib/service/tilehosting')({
    name: 'tilehosting',
    request: function (url, req, fn) {
      fn(undefined, response);
    }
  }).geocode;

  it('forward', function (done) {
    var query;

    response = require('./fixtures/forward');

    query = {
      address: '211 Lincoln St, Bost'
    };
    geocode('forward', 1, query, {}, function (err, value, id, query, result) {
      should.not.exist(err);
      value.should.equal(true);
      should.exist(result);
      result.should.have.property('places').with.length(20);
      result.places[0].should.deepEqual({
        ll: [ -71.059547, 42.299793 ],
        type: 'residential',
        place: 'Lincoln Street',
        address: 'Lincoln Street, Boston, MA, USA',
        street: 'Lincoln Street',
        town: 'Boston',
        province: 'MA',
        country: 'USA'
      });
      result.places[1].should.deepEqual({
        ll: [ 18.618427, -33.892246 ],
        type: 'residential',
        place: 'Upper Lincoln Street',
        address: 'Upper Lincoln Street, Boston, City of Cape Town, Western Cape, South Africa',
        street: 'Upper Lincoln Street',
        town: 'Boston',
        county: 'City of Cape Town',
        province: 'Western Cape',
        country: 'South Africa'
      });
      result.should.have.property('provider', 'tilehosting');
      result.should.have.property('stats', ['tilehosting']);
      done();
    });
  });

  it('place', function (done) {
    var query;

    response = require('./fixtures/place');

    query = {
      place: 'Golden Gate'
    };
    geocode('forward', 1, query, {}, function (err, value, id, query, result) {
      should.not.exist(err);
      value.should.equal(true);
      should.exist(result);
      result.should.have.property('places').with.length(20);
      result.places[0].should.deepEqual({
        ll: [ -122.477516, 37.809631 ],
        place: 'Golden Gate Bridge',
        type: 'cycleway,motorway',
        address: 'San Francisco, San Francisco City and County, CA, USA',
        town: 'San Francisco',
        county: 'San Francisco City and County',
        province: 'CA',
        country: 'USA'
      });
      result.should.have.property('provider', 'tilehosting');
      result.should.have.property('stats', ['tilehosting']);
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
        ll: [ 14.526695, -22.679302 ],
        place: 'Woermann St',
        type: 'residential',
        address: 'Woermann St, Erongo Region, Namibia',
        street: 'Woermann St',
        province: 'Erongo Region',
        country: 'Namibia'
      });
      result.should.have.property('provider', 'tilehosting');
      result.should.have.property('stats', ['tilehosting']);
      done();
    });
  });
});
