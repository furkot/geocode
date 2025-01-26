require('chai').should();

const legacyFetch = require('node-fetch');

globalThis.fetch = legacyFetch;
globalThis.Response = legacyFetch.Response;
globalThis.Headers = legacyFetch.Headers;
globalThis.Request = legacyFetch.Request;

const Replay = require('@pirxpilot/replay');
Replay.fixtures = __dirname;

// default replay mode is 'replay'
// change it by setting REPLAY environment variable:
// REPLAY=record make
