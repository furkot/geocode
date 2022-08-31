const should = require('should');
const tilehosting = require('../../../lib/service/tilehosting');

describe('tilehosting geocoding', function () {

  const { geocode } = tilehosting({
    interval: 1,
    name: 'tilehosting',
    tilehosting_key: process.env.TILEHOSTING_KEY || 'furkot'
  });

  it('forward', function (done) {

    const query = {
      address: 'Rua Cafelândia, Carapicuíba, Brasil'
    };
    geocode('forward', 1, query, {}, function (err, value, id, query, result) {
      should.not.exist(err);
      value.should.equal(true);
      should.exist(result);
      result.should.have.property('places').with.length(9);
      result.places[0].should.deepEqual({
        ll: [-46.8365592, -23.5372062],
        type: 'street',
        place: 'Rua Cafelândia',
        address: 'Carapicuíba, Região Metropolitana de São Paulo, São Paulo'
      });
      result.places[1].should.deepEqual({
        ll: [-46.8900124, -23.4851747],
        type: 'street',
        place: 'Rua Cafelândia',
        address: 'Barueri, Região Metropolitana de São Paulo, São Paulo'
      });
      result.should.have.property('provider', 'tilehosting');
      result.should.have.property('stats', ['tilehosting']);
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
      result.should.have.property('places').with.length(17);
      result.places[0].should.deepEqual({
        ll: [-122.4773342, 37.8096796],
        type: 'street',
        place: 'Golden Gate Bridge',
        address: 'San Francisco, San Francisco City and County, California'
      });
      result.should.have.property('provider', 'tilehosting');
      result.should.have.property('stats', ['tilehosting']);
      done();
    });
  });

  it('reverse', function (done) {

    const query = {
      ll: [14.5272, -22.6792]
    };
    geocode('reverse', 1, query, {}, function (err, value, id, query, result) {
      should.not.exist(err);
      value.should.equal(true);
      should.exist(result);
      result.should.have.property('places').with.length(3);
      result.places[0].should.deepEqual({
        ll: [14.526695, -22.6793015],
        type: 'street',
        place: 'Woermann St',
        address: 'Erongo Region'
      });
      result.should.have.property('provider', 'tilehosting');
      result.should.have.property('stats', ['tilehosting']);
      done();
    });
  });
});
