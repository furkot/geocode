import legacyFetch from 'node-fetch';

globalThis.fetch = legacyFetch;
globalThis.Response = legacyFetch.Response;
globalThis.Headers = legacyFetch.Headers;
globalThis.Request = legacyFetch.Request;

import Replay from '@pirxpilot/replay';

Replay.fixtures = import.meta.dirname;

// default replay mode is 'replay'
// change it by setting REPLAY environment variable:
// REPLAY=record make
