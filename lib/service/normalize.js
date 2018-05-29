var states = require('./states');
var stateCodes = Object.keys(states).reduce(function (codes, state) {
  codes[states[state]] = state;
  return codes;
}, {});

module.exports = {
  country: normalizeCountry,
  state: normalizeState,
  address: normalizeAddress
};

var countries = {
  'United States of America': 'USA',
  'United States': 'USA',
  'US': 'USA',
  'CA': 'Canada'
};

function normalizeCountry(country) {
  return countries[country] || country;
}

function normalizeAddress(address, province, country) {
  if (country === 'USA') {
    address = address.replace('United States of America', 'USA');
  }
  if ((country === 'USA' || country === 'Canada') && stateCodes[province]) {
    address = address.replace(stateCodes[province], province);
  }

  return address;
}

function normalizeState(state) {
  return states[state] || state;
}
