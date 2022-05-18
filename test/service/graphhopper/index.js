const should = require('should');
const graphhopper = require('../../../lib/service/graphhopper');

describe('graphhopper geocoding', function () {

  const { geocode } = graphhopper({
    interval: 1,
    name: 'graphhopper',
    graphhopper_key: process.env.GRAPHHOPPER_KEY || 'furkot'
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
        ll: [ -46.8359735, -23.5370962 ],
        type: 'street',
        street: 'Rua Cafelândia',
        city: 'Carapicuíba',
        state: 'São Paulo',
        country: 'Brazil',
        place: 'Rua Cafelândia'
      });
      result.should.have.property('provider', 'graphhopper');
      result.should.have.property('stats', ['graphhopper']);
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
      result.should.have.property('places').with.length(4);
      result.places[0].should.deepEqual({
        ll: [ 18.65868924925842, 54.351528200000004 ],
        place: 'SS Sołdek',
        type: 'museum',
        street: 'Długie Pobrzeże',
        state: 'Pomeranian Voivodeship',
        city: 'Gdansk',
        country: 'Poland'
      });
      result.should.have.property('provider', 'graphhopper');
      result.should.have.property('stats', ['graphhopper']);
      done();
    });
  });

  it('partial', function (done) {

    const query = {
      place: 'main street',
      lang: 'en',
      partial: true
    };
    geocode('forward', 1, query, {}, function (err, value, id, query, result) {
      should.not.exist(err);
      value.should.equal(true);
      should.exist(result);
      result.should.have.property('places').with.length(5);
      result.places[0].should.deepEqual({
        ll: [ -73.1745473, 42.4750847 ],
        type: 'peak',
        country: 'United States',
        place: 'Main Street Cemetery'
      });
      result.places[1].should.deepEqual({
        ll: [ -69.2728254, 44.8350646 ],
        type: 'dam',
        country: 'United States',
        place: 'Main Street Dam'
      });
      result.places[2].should.deepEqual({
        ll: [ -71.086670478147, 42.36274665 ],
        type: 'address',
        house: '325',
        street: 'Main Street',
        city: 'Cambridge',
        state: 'MA',
        country: 'United States'
      });
      result.places[3].should.deepEqual({
        ll: [ -71.6192199, 42.5524712 ],
        type: 'dam',
        country: 'United States',
        place: 'West Main Street Dam'
      });
      result.places[4].should.deepEqual({
        ll: [ -10.6756677, 6.5080848 ],
        type: 'hamlet',
        state: 'Montserrado County',
        country: 'Liberia',
        place: 'Main Street'
      });
      result.should.have.property('provider', 'graphhopper');
      result.should.have.property('stats', ['graphhopper']);
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
      result.should.have.property('places').with.length(5);
      result.places[0].should.deepEqual({
        ll: [ 14.5268016, -22.6791826 ],
        place: 'Beryl\'s Restaurant',
        type: 'restaurant',
        street: 'Woermann St',
        state: 'Erongo Region',
        city: "Swakopmund",
        country: 'Namibia'
      });
      result.should.have.property('provider', 'graphhopper');
      result.should.have.property('stats', ['graphhopper']);
      done();
    });
  });

  it('reverse usa', function (done) {

    const query = {
      ll: [ -111.400596, 45.284265 ]
    };
    geocode('reverse', 1, query, {}, function (err, value, id, query, result) {
      should.not.exist(err);
      value.should.equal(true);
      should.exist(result);
      result.should.have.property('places').with.length(5);
      result.places[0].should.deepEqual({
        ll: [ -111.40065600201527, 45.284264 ],
        type: 'venue',
        street: 'Black Eagle',
        state: 'MT',
        country: 'United States',
        place: 'Mountain Mall'
      });
      result.places[1].should.deepEqual({
        ll: [ -111.4011158, 45.2839783 ],
        type: 'sports_centre',
        house: '50',
        street: 'Big Sky Resort Road',
        city: 'Big Sky',
        state: 'MT',
        country: 'United States',
        place: 'Big Sky Resort'
      });
      result.places[2].should.deepEqual({
        ll: [ -111.40110501870444, 45.284622 ],
        type: 'venue',
        street: 'Black Eagle',
        state: 'MT',
        country: 'United States',
        place: 'Basecamp'
      });
      result.places[3].should.deepEqual({
        ll: [ -111.4015212, 45.2842756 ],
        type: 'bicycle_rental',
        street: 'Mountain to Meadow',
        city: 'Big Sky',
        state: 'MT',
        country: 'United States',
        place: 'Different Spokes'
      });
      result.places[4].should.deepEqual({
        ll: [ -111.40158763890292, 45.284196300000005 ],
        type: 'venue',
        street: 'Mountain to Meadow',
        city: 'Big Sky',
        state: 'MT',
        country: 'United States',
        place: 'Snowcrest Lodge'
      });
      result.should.have.property('provider', 'graphhopper');
      result.should.have.property('stats', ['graphhopper']);
      done();
    });
  });
});
