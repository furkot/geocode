const should = require('should');
const hogfish = require('../../../lib/service/hogfish');

describe('hogfish geocoding', function () {

  let response;
  let urlPrefix;

  function request(url, req, fn) {
      url.should.startWith(urlPrefix);
      fn(undefined, response);
    }

  const geocode = hogfish({
    hogfish_url: '',
    hogfish_parameters: {
      types: {
        hotel: [
          'provider=hotels'
        ],
        fillingstation: [
          'provider=mygasfeed'
        ]
      }
    },
    interval: 1,
    name: 'hogfish',
    request
  }).geocode;


  beforeEach(function() {
    response = undefined;
    urlPrefix = undefined;
  });

  it('fuel stations', function (done) {
    response = require('./fixtures/mygasfeed');
    urlPrefix = '?ll=-104.84865254181491,39.59469541023748&radius=100&provider=mygasfeed';

    const query = {
      place: 'Bradley',
      type: 'fillingstation',
      ll: [ -104.84865254181491, 39.59469541023748 ]
    };
    geocode('reverse', 1, query, {}, function (err, value, id, query, result) {
      should.not.exist(err);
      value.should.equal(true);
      should.exist(result);
      result.should.have.property('places').with.length(1);
      result.places[0].should.deepEqual({
        ll: [ -104.848663, 39.594959 ],
        place: 'Bradley Food',
        url: '89082',
        address: '12022 E Arapahoe Rd, Englewood, CO, United States',
        street: '12022 E Arapahoe Rd',
        town: "Englewood",
        province: 'CO',
        country: 'United States',
        type: 'fillingstation',
        service: undefined
      });
      result.should.have.property('provider', 'hogfish');
      result.should.have.property('stats', ['hogfish']);
      done();
    });
  });

  it('hotels', function (done) {
    response = require('./fixtures/hotels');
    urlPrefix = '?ll=-104.86893004223975,39.591537212725285&radius=100&provider=hotels';

    const query = {
      place: 'Embassy Suites Denver - Tech Center',
      type: 'hotel',
      ll: [ -104.86893004223975, 39.591537212725285 ]
    };
    geocode('reverse', 1, query, {}, function (err, value, id, query, result) {
      should.not.exist(err);
      value.should.equal(true);
      should.exist(result);
      result.should.have.property('places').with.length(1);
      result.places[0].should.deepEqual({
        ll: [ -104.86901, 39.59155 ],
        place: 'Embassy Suites By Hilton Denver Tech Center',
        url: undefined,
        address: '10250 East Costilla Avenue, Centennial, CO, USA',
        street: '10250 East Costilla Avenue',
        town: "Centennial",
        province: 'CO',
        country: 'USA',
        type: 'hotel',
        service: {
          hilton: {
            id: 'DENTCES',
            rating: null
          },
          hcom: {
            id: '113857:10005',
            rating: 4.5,
            rate: 124,
            currency: 'USD',
            city_id: '1640831'
          },
          bookingdotcom: {
            id: 49323,
            rating: 88,
            rate: 98.1,
            currency: 'USD',
            url: 'https://www.booking.com/hotel/us/embassy-suites-denver-tech-center.html'
          }
        },
      });
      result.should.have.property('provider', 'hogfish');
      result.should.have.property('stats', ['hogfish']);
      done();
    });
  });
});
