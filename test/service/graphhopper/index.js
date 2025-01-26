const { describe, it } = require('node:test');
const should = require('chai').should();
const graphhopper = require('../../../lib/service/graphhopper');

describe('graphhopper geocoding', function () {

  const { geocode } = graphhopper({
    interval: 1,
    name: 'graphhopper',
    graphhopper_key: process.env.GRAPHHOPPER_KEY || 'furkot'
  });

  it('forward', async function () {

    const query = {
      address: 'Rua Cafelândia, Carapicuíba, Brasil'
    };
    const result = await geocode('forward', 1, query);
    should.exist(result);
    result.should.have.property('places').with.length(1);
    result.places[0].should.deep.equal({
      ll: [-46.8359735, -23.5370962],
      type: 'residential',
      street: 'Rua Cafelândia',
      address: 'Rua Cafelândia, Carapicuíba, São Paulo, Brazil',
      normal: 'Rua Cafelândia,Carapicuíba,São Paulo,BR',
      town: 'Carapicuíba',
      province: 'São Paulo',
      country: 'Brazil'
    });
  });

  it('place', async function () {

    const query = {
      place: 'Sołdek',
      lang: 'pl'
    };
    const result = await geocode('forward', 1, query);
    should.exist(result);
    result.should.have.property('places').with.length(4);
    result.places[0].should.deep.equal({
      ll: [18.65868924925842, 54.351528200000004],
      place: 'SS Sołdek',
      type: 'museum',
      address: 'Długie Pobrzeże, Gdansk, Pomeranian Voivodeship, Poland',
      normal: 'Długie Pobrzeże,Gdansk,Pomeranian Voivodeship,PL',
      street: 'Długie Pobrzeże',
      province: 'Pomeranian Voivodeship',
      town: 'Gdansk',
      country: 'Poland'
    });
  });

  it('partial', async function () {

    const query = {
      place: 'main street',
      lang: 'en',
      partial: true
    };
    const result = await geocode('forward', 1, query);
    should.exist(result);
    result.should.have.property('places').with.length(5);
    result.places[0].should.deep.equal({
      ll: [-73.1745473, 42.4750847],
      type: 'peak',
      country: 'USA',
      place: 'Main Street Cemetery',
      address: 'United States',
      normal: 'US'
    });
    result.places[1].should.deep.equal({
      ll: [-69.2728254, 44.8350646],
      type: 'dam',
      country: 'USA',
      place: 'Main Street Dam',
      address: 'United States',
      normal: 'US'
    });
    result.places[2].should.deep.equal({
      ll: [-71.086670478147, 42.36274665],
      type: 'construction',
      house: '325',
      street: 'Main Street',
      town: 'Cambridge',
      province: 'MA',
      country: 'USA',
      place: '325 Main Street',
      address: '325 Main Street, Cambridge, MA',
      normal: '325 Main Street,Cambridge,MA,US'
    });
    result.places[3].should.deep.equal({
      ll: [-71.6192199, 42.5524712],
      type: 'dam',
      country: 'USA',
      place: 'West Main Street Dam',
      address: 'United States',
      normal: 'US'
    });
    result.places[4].should.deep.equal({
      ll: [-10.6756677, 6.5080848],
      type: 'hamlet',
      province: 'Montserrado County',
      country: 'Liberia',
      place: 'Main Street',
      address: 'Montserrado County, Liberia',
      normal: 'Montserrado County,LR'
    });
  });

  it('reverse', async function () {

    const query = {
      ll: [14.5272, -22.6792]
    };
    const result = await geocode('reverse', 1, query);
    should.exist(result);
    result.should.have.property('places').with.length(5);
    result.places[0].should.deep.equal({
      ll: [14.5268016, -22.6791826],
      place: 'Beryl\'s Restaurant',
      type: 'restaurant',
      address: 'Woermann St, Swakopmund, Erongo Region, Namibia',
      normal: 'Woermann St,Swakopmund,Erongo Region,NA',
      street: 'Woermann St',
      province: 'Erongo Region',
      town: "Swakopmund",
      country: 'Namibia'
    });
  });

  it('reverse usa', async function () {

    const query = {
      ll: [-111.400596, 45.284265]
    };
    const result = await geocode('reverse', 1, query);
    should.exist(result);
    result.should.have.property('places').with.length(5);
    result.places[0].should.deep.equal({
      ll: [-111.40065600201527, 45.284264],
      type: 'yes',
      street: 'Black Eagle',
      province: 'MT',
      country: 'USA',
      place: 'Mountain Mall',
      address: 'Black Eagle, MT',
      normal: 'Black Eagle,,MT,US'
    });
    result.places[1].should.deep.equal({
      ll: [-111.4011158, 45.2839783],
      type: 'sports_centre',
      house: '50',
      street: 'Big Sky Resort Road',
      town: 'Big Sky',
      province: 'MT',
      country: 'USA',
      place: 'Big Sky Resort',
      address: '50 Big Sky Resort Road, Big Sky, MT',
      normal: '50 Big Sky Resort Road,Big Sky,MT,US'
    });
    result.places[2].should.deep.equal({
      ll: [-111.40110501870444, 45.284622],
      type: 'yes',
      street: 'Black Eagle',
      province: 'MT',
      country: 'USA',
      place: 'Basecamp',
      address: 'Black Eagle, MT',
      normal: 'Black Eagle,,MT,US'
    });
    result.places[3].should.deep.equal({
      ll: [-111.4015212, 45.2842756],
      type: 'bicycle_rental',
      street: 'Mountain to Meadow',
      town: 'Big Sky',
      province: 'MT',
      country: 'USA',
      place: 'Different Spokes',
      address: 'Mountain to Meadow, Big Sky, MT',
      normal: 'Mountain to Meadow,Big Sky,MT,US'
    });
    result.places[4].should.deep.equal({
      ll: [-111.40158763890292, 45.284196300000005],
      type: 'yes',
      street: 'Mountain to Meadow',
      town: 'Big Sky',
      province: 'MT',
      country: 'USA',
      place: 'Snowcrest Lodge',
      address: 'Mountain to Meadow, Big Sky, MT',
      normal: 'Mountain to Meadow,Big Sky,MT,US'
    });
  });
});
