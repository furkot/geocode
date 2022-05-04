const should = require('should');
const locationiq = require('../../../lib/service/locationiq');

describe('locationiq geocoding', function () {

  const { geocode } = locationiq({
    interval: 1,
    name: 'locationiq',
    locationiq_key: process.env.LOCATIONIQ_KEY || 'furkot'
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
        ll: [  -46.8359735, -23.5370962 ],
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
        ll: [ 18.658631239705393, 54.35145095 ],
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

    const query = {
      address: '30 West 26th Street, New York',
      bounds: [[-136.85324796095287,29.833181774137493],[-58.630591710944685,59.76129059655832]],
      partial: true
    };
    geocode('forward', 10, query, {}, function (err, value, id, query, result) {
      should.not.exist(err);
      value.should.equal(true);
      should.exist(result);
      result.should.have.property('places').with.length(8);
      result.places[0].should.deepEqual({
        place: 'Hill Country Barbecue Market',
        type: 'restaurant',
        ll: [ -73.9904326, 40.7442736 ],
        address: '30 West 26th Street, New York, NY, USA',
        street: '30 West 26th Street',
        town: 'New York',
        province: 'NY',
        country: 'USA'
      });
      result.places[1].should.deepEqual({
        place: 'Mapzen',
        type: 'disused',
        ll: [ -73.9903515, 40.7442363 ],
        address: '30 West 26th Street, New York, NY, USA',
        street: '30 West 26th Street',
        town: 'New York',
        province: 'NY',
        country: 'USA'
      });
      result.places[2].should.deepEqual({
        place: 'Samsung Accelerator',
        type: 'company',
        ll: [ -73.9903727, 40.7442104 ],
        address: '30 West 26th Street, New York, NY, USA',
        street: '30 West 26th Street',
        town: 'New York',
        province: 'NY',
        country: 'USA'
      });
      result.should.have.property('provider', 'locationiq');
      result.should.have.property('stats', ['locationiq']);
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

    const query = {
      address: '2200 S. Jason St, Denver, CO 80223',
      bounds: [[-106.24023437500165,41.84270596422118],[-93.75976562500192,38.10619124884522]],
      partial: true
    };
    geocode('forward', 10, query, {}, function (err, value, id, query, result) {
      should.not.exist(err);
      value.should.equal(true);
      should.exist(result);
      result.should.have.property('places').with.length(1);
      result.places[0].should.deepEqual({
        type: 'house_number',
        ll: [ -104.999354, 39.676536 ],
        address: '2200 South Jason Street, Denver, CO, USA',
        street: '2200 South Jason Street',
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
