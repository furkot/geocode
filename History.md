
3.2.1 / 2025-01-26
==================

 * add test-cov target
 * replace `should` with `chai`
 * replace mocha with `node:test`

3.2.0 / 2025-01-26
==================

 * update tilehosting service to maptiler
 * add support for hogfish forward geocoder

3.1.3 / 2024-03-08
==================

 * @furkot/address 0.0.5

3.1.2 / 2024-02-22
==================

 * @furkot/address 0.0.4

3.1.1 / 2024-02-18
==================

 * return uniformly formatted address field
 * return normalized address in addition to human-readable one
 * separate house and street
 * use @furkot/address to produce uniform addresses
 * @furkot/address 0.0.3

3.1.0 / 2023-07-08
==================

 * return place source URL from Pelias
 * favor venues over addresses when querying for places

3.0.1 / 2022-10-09
==================

 * fix error raised on aborting request

3.0.0 / 2022-09-03
==================

 * rewrite to work as promised based API
 * bump compatibility to ES2020

2.0.3 / 2022-09-03
==================

 * modernize and format code
 * fix hogfish tests
 * fix tests for node 18
 * upgrade mocha to ~10
 * replace Travis CI with github actions
 * rename to @furkot/geocode

2.0.2 / 2022-05-12
==================

 * additional config parameter to enable partial geocoding by Pelias

2.0.1 / 2022-05-06
==================

 * minor fix of positionstack geocoder

2.0.0 / 2022-05-04
==================

 * support positionstack geocoding service
 * add support for partial, address, and place in demo
 * add hogfish to geocoder demo
 * add demo services only if key is defined
 * change tests to use replay
 * upgrade to geocodio version 1.7
 * remove support for Algolia Places
 * openroute service is based on Pelias geocoder
 * support configuring services under different names
 * implement partial geocoding for openroute

1.5.5 / 2022-04-23
==================

 * update LocationIQ endpoint

1.5.4 / 2019-07-25
==================

 * upgrade mocha, jshit, should
 * allow for using debug ~4
 * upgrade fetchagent to ~2

1.5.3 / 2019-06-25
==================

 * discontinue service that has 3 timeouts in a row
 * unit test for generic service code

1.5.2 / 2019-04-26
==================

 * return empty result when no service found the result

1.5.1 / 2019-04-25
==================

 * don't try again when GraphHopper returns no result

1.5.0 / 2019-04-22
==================

 * externalize hogfish query parameters

1.4.12 / 2018-12-15
===================

 * replace strategy with run-waterfall-until

1.4.11 / 2018-10-14
===================

 * switch off OpenRouteService eocoder only when it returns error without response

1.4.10 / 2018-08-30
===================

 * add house number if available to address returned by OpenRouteService
 * reserve place field for genuine place names, not street name, in LocationIQ service

1.4.9 / 2018-08-30
==================

 * improve LocationIQ geocoding for autocomplete

1.4.8 / 2018-08-19
==================

 * fix disabling services for specific query parameters
 * handle errors returned by LocationIQ
 * use LocationIQ autocomplete endpoint to geocode partial strings
 * better distinguish places and addresses returned by openrouteservice
 * fix boundary parameter in openrouteservice
 * add language parameter to openrouteservice
 * synchronous service - handled by the client

1.4.7 / 2018-08-10
==================

 * hogfish as reverse geocoder

1.4.6 / 2018-08-09
==================

 * make service parameters caching less agressive

1.4.5 / 2018-07-29
==================

 * disable only reverse or forward capabilities for a service

1.4.4 / 2018-07-29
==================

 * fail and disable locationIQ at any error

1.4.3 / 2018-07-29
==================

 * fail and disable openrouteservice at any error

1.4.2 / 2018-06-05
==================

 * limit results to places or addresses only

1.4.1 / 2018-06-04
==================

 * administrative names (street, town, county) should not be repeated as place

1.4.0 / 2018-06-01
==================

 * limit number of returned places per query parameter max

1.3.1 / 2018-05-29
==================

 * normalize returned addresses
 * reorganize displaying services in demo

1.3.0 / 2018-05-28
==================

 * geocoding services: geocodio, locationiq, graphhopper, openroute service
 * demo forward and reverse geocoding
 * speed up unit test by reducing limiter interval
 * cut off Algolia after error

1.2.1 / 2018-05-22
==================

 * list dependency on debug

1.2.0 / 2018-05-21
==================

 * expose method to abort outstanding requests by the client

1.1.0 / 2018-05-20
==================

 * geocoder from MapTiler TileHosting / OSMNames
 * fix processing of OpenCage types other than 'road'
 * force language passed to Algolia to English if not provided
 * fix passing Algolia key and app id

1.0.1 / 2018-05-20
==================

 * Algolia Places reverse geocoder
 * support post requests
 * describe parameters
 * support bounded and partial queries by address and place name
 * fix aborting

1.0.0 / 2018-05-16
==================

 * OpenCage Data geocoder
 * implement geocoder framework
 * limiter-component 1.0.1
 * fetchagent 1.1.3
 * run-waterfall 1.1.6
 * Initial commit
