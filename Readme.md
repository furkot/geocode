[![NPM version][npm-image]][npm-url]
[![Build Status][build-image]][build-url]
[![Dependency Status][deps-image]][deps-url]

# @furkot/geocode

Geocoding service for Furkot

## Install

```sh
$ npm install --save @furkot/geocode
```

## Usage

````js
const furkotGeocode = require('@furkot/geocode');
const options = {}; // options activating geocoding services

const geocode = furkotGeocode(options);

const query = {}; // geocoding query

const { places } = await geocode(query)
// process result
````

### Configuration options

Geocoding component expects a configuration options object with following fields:

- `max` - maximum number of places to return
- `order` - list of names of geocoding services in the order they will be tried
- `XXX_key` - API key for service `XXX` (if service `XXX` requires a key)
- `XXX_enable` - function that takes query and returns `true` when service `XXX` is expected to handle that query; if the function is absent, the service `XXX` won't be used even if listed in the `order`
- `XXX_parameters` - object with additional parameters specific to service `XXX`

### Query parameters

Common parameters:

- `max` - maximum number of places to return (overrides configuration option)
- `lang` - language code, defaults to `en`

Reverse geocoding:

- `ll` - array of coordinates `[ longitude, latitude ]`

Forward geocoding:

- `address` - string representing an address
- `place` - string representing place name; either `addess` or `place` is expected
- `partial` - a boolean flag set when geocoding is done as part of autocomplete
- `bounds` - a hint to the region place resides in as array of south west and north east `[[SW longitude, SW latitude], [NE longitude, NE latitude]]`

### Results format

If successful, geocoding service will return object with field `places` - an array of objects, each describing one place with following fields (not all fields are always set):

- `place` - place name (may be absent if address doesn't correspond to a named place)
- `type` - place type
- `address` - formated address
- `house` - building number
- `street` - street name
- `community` - neighborhood or village
- `town` - town or city
- `county` - administrative area more general than town
- `province` - state or province (usually abbreviated)
- `country` - country (short form but not abbreviated)

## License

MIT © [Natalia Kowalczyk](https://melitele.me)

[npm-image]: https://img.shields.io/npm/v/@furkot/geocode
[npm-url]: https://npmjs.org/package/@furkot/geocode

[build-url]: https://github.com/furkot/geocode/actions/workflows/check.yaml
[build-image]: https://img.shields.io/github/workflow/status/furkot/geocode/check

[deps-image]: https://img.shields.io/librariesio/release/npm/@furkot/geocode
[deps-url]: https://libraries.io/npm/@furkot%2Fgeocode
