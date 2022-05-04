const should = require('should');
const positionstack = require('../../../lib/service/positionstack');

describe('positionstack geocoding', function () {

  const { geocode } = positionstack({
    interval: 1,
    name: 'positionstack',
    positionstack_key: process.env.POSITIONSTACK_KEY || 'furkot'
  });

  it('forward', function (done) {

    const query = {
      address: 'Rua Cafelândia, Carapicuíba, Brasil'
    };
    geocode('forward', 1, query, {}, function (err, value, id, query, result) {
      should.not.exist(err);
      value.should.equal(true);
      should.exist(result);
      result.should.have.property('places').with.length(1);
      result.places[0].should.deepEqual({
        ll: [ -46.830942, -23.532918 ],
        type: 'locality',
        town: 'Carapicuíba',
        province: 'SP',
        country: 'Brazil',
        place: 'Carapicuíba',
        address: 'Carapicuíba, SP, Brazil'
      });
      result.should.have.property('provider', 'positionstack');
      result.should.have.property('stats', ['positionstack']);
      done();
    });
  });

  it('place', function (done) {

    const query = {
      place: 'Golden Gate Bridge'
    };
    geocode('forward', 1, query, {}, function (err, value, id, query, result) {
      should.not.exist(err);
      value.should.equal(true);
      should.exist(result);
      result.should.have.property('places').with.length(10);
      result.places[0].should.deepEqual({
        ll: [ -122.478861, 37.822118 ],
        type: 'venue',
        town: 'San Francisco',
        province: 'CA',
        country: 'USA',
        place: 'Golden Gate Bridge',
        address: 'San Francisco, CA, USA'
      });
      result.should.have.property('provider', 'positionstack');
      result.should.have.property('stats', ['positionstack']);
      done();
    });
  });

  it('reverse', function (done) {

    const query = {
      ll: [ 14.5272, -22.6792 ]
    };
    geocode('reverse', 1, query, {}, function (err, value, id, query, result) {
      should.not.exist(err);
      value.should.equal(true);
      should.exist(result);
      result.should.have.property('places').with.length(10);
      result.places[0].should.deepEqual({
        ll: [ 14.526802, -22.679183 ],
        type: 'venue',
        province: 'ER',
        country: 'Namibia',
        place: 'Beryl\'s Restaurant',
        address: 'ER, Namibia'
      });
      result.should.have.property('provider', 'positionstack');
      result.should.have.property('stats', ['positionstack']);
      done();
    });
  });
});
