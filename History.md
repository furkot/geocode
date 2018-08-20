
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
