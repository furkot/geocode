const should = require('should');
const opencage = require('../../../lib/service/opencage');

describe('opencage geocoding', function () {

  const { geocode } = opencage({
    interval: 1,
    name: 'opencage',
    opencage_key: process.env.OPENCAGE_KEY || 'furkot'
  });

  it('forward', function (done) {

    const query = {
      address: 'Rua Cafelândia, Carapicuíba, Brasil'
    };
    geocode('forward', 1, query, {}, function (err, value, id, query, result) {
      should.not.exist(err);
      value.should.equal(true);
      should.exist(result);
      result.should.have.property('places').with.length(2);
      result.places[0].should.deepEqual({
        ll: [-46.8359735, -23.5370962],
        type: 'road',
        place: 'Rua Cafelândia',
        address: 'Rua Cafelândia, Parque José Alexandre, Carapicuíba - SP, 06321-665, Brazil',
        street: 'Rua Cafelândia',
        town: 'Carapicuíba',
        county: 'Região Metropolitana de São Paulo',
        province: 'SP',
        country: 'Brazil'
      });
      result.places[1].should.deepEqual({
        ll: [-46.835, -23.52272],
        type: 'city',
        address: 'Carapicuíba, Brazil',
        town: 'Carapicuíba',
        county: 'Carapicuíba',
        province: 'SP',
        country: 'Brazil'
      });
      result.should.have.property('provider', 'opencage');
      result.should.have.property('stats', ['opencage']);
      done();
    });
  });

  it('place', function (done) {

    const query = {
      place: 'Sołdek',
      lang: 'pl'
    };
    geocode('forward', 1, query, {}, function (err, value, id, query, result) {
      should.not.exist(err);
      value.should.equal(true);
      should.exist(result);
      result.should.have.property('places').with.length(1);
      result.places[0].should.deepEqual({
        ll: [18.6586312, 54.351451],
        place: 'SS Sołdek',
        type: 'museum',
        address: 'Długie Pobrzeże, 80-838 Gdańsk, Polska',
        street: 'Długie Pobrzeże',
        community: 'Wyspa Spichrzów',
        town: 'Gdańsk',
        province: '22',
        country: 'Polska'
      });
      result.should.have.property('provider', 'opencage');
      result.should.have.property('stats', ['opencage']);
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
      result.should.have.property('places').with.length(1);
      result.places[0].should.deepEqual({
        ll: [14.5268016, -22.6791826],
        place: 'Beryl\'s Restaurant',
        type: 'restaurant',
        address: 'Woermann St, Swakopmund 22001, Namibia',
        street: 'Woermann St',
        town: 'Swakopmund',
        country: 'Namibia'
      });
      result.should.have.property('provider', 'opencage');
      result.should.have.property('stats', ['opencage']);
      done();
    });
  });
});
