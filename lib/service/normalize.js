const {
  abbr2country,
  abbr2state,
  country2abbr,
  state2abbr
} = require('@furkot/address');

module.exports = {
  address: normalizeAddress,
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

function normalizeAddress(address, province, country) {
  if (country === 'USA') {
    address = address.replace('United States of America', 'USA');
  }
  if ((country === 'USA' || country === 'Canada') && abbr2state[province]) {
    address = address.replace(abbr2state[province], province);
  }

  return address;
}

function normalizeState(state) {
  return state2abbr[state] || state;
}
