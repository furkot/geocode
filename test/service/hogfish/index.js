const should = require('should');
const hogfish = require('../../../lib/service/hogfish');

describe('hogfish geocoding', function () {

  const { geocode } = hogfish({
    hogfish_url: process.env.HOGFISH_URL || 'https://HOGFISH/api/poi',
    hogfish_parameters: {
      types: {
        hotel: [
          'provider=hotels'
        ],
        fillingstation: [
          'provider=fuel'
        ]
      }
    },
    interval: 1,
    name: 'hogfish'
  });

  it('fuel stations', function (done) {

    const query = {
      place: 'Murphy',
      type: 'fillingstation',
      ll: [ -104.86063, 39.59278 ]
    };
    geocode('reverse', 1, query, {}, function (err, value, id, query, result) {
      should.not.exist(err);
      value.should.equal(true);
      should.exist(result);
      result.should.have.property('places').with.length(1);
      result.places[0].should.deepEqual({
        ll: [ -104.86063, 39.59278 ],
        place: 'Murphy Express',
        url: 'https://www.pure-gas.org/station?station_id=40499',
        street: '11005 E Briarwood Ave',
        town: 'Centennial',
        province: 'CO',
        country: undefined,
        type: 'fillingstation',
        service: {
          pure_gas: {
            id: '40499',
            name: 'Murphy Express',
            address: '11005 E Briarwood Ave',
            url: 'https://www.pure-gas.org/station?station_id=40499'
          },
          osm: { id: '0000000041fc198163200000' }
        },
        address: '11005 E Briarwood Ave, Centennial, CO'
      });
      result.should.have.property('provider', 'hogfish');
      result.should.have.property('stats', ['hogfish']);
      done();
    });
  });

  it('hotels', function (done) {

    const query = {
      place: 'Hyatt House Denver - Tech Center',
      type: 'hotel',
      ll: [ -104.879164, 39.591416 ]
    };
    geocode('reverse', 1, query, {}, function (err, value, id, query, result) {
      should.not.exist(err);
      value.should.equal(true);
      should.exist(result);
      result.should.have.property('places').with.length(1);
      result.places[0].should.deepEqual({
        ll: [ -104.879164, 39.591416 ],
        place: 'Hyatt House Denver Tech Center',
        url: undefined,
        street: '9280 E Costilla Ave',
        town: 'Englewood',
        province: 'CO',
        country: 'United States',
        type: 'hotel',
        service: {
          hcom: {
            id: '249621:41715',
            rating: 4.4,
            rate: 92.65,
            currency: 'USD',
            city_id: '1458415'
          },
          bookingdotcom: {
            id: 520190,
            rating: 82,
            rate: 89,
            currency: 'USD',
            url: 'https://www.booking.com/hotel/us/hyatt-house-denver-tech-center.html'
          }
        },
        address: '9280 E Costilla Ave, Englewood, CO, United States'
      });
      result.should.have.property('provider', 'hogfish');
      result.should.have.property('stats', ['hogfish']);
      done();
    });
  });
});
