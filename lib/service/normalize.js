const {
  abbr2country,
  country2abbr,
  state2abbr
} = require('@furkot/address');

module.exports = {
  country: normalizeCountry,
  state: normalizeState
};

const countries = {
  'United States': 'USA'
};

function normalizeCountry(country) {
  country = country2abbr[country] || country;
  country = abbr2country[country] || country;
  return countries[country] || country;
}

function normalizeState(state) {
  return state2abbr[state] || state;
}
