const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
for (const [i, script] of scripts.entries()) {
  try {
    new Function(script);
    console.log(`script ${i + 1}: syntax OK`);
  } catch (err) {
    console.error(`script ${i + 1}: syntax FAILED`);
    console.error(err.stack || err.message);
    process.exit(1);
  }
}
const endpoints = ['bunkers', 'route', 'carbon', 'port-costs', 'canal-dues', 'weather-risk'];
function mockRes(name) {
  return {
    headers: {},
    statusCode: 200,
    payload: null,
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(obj) { this.payload = obj; console.log(`${name}: ${this.statusCode} OK`); return this; }
  };
}
for (const ep of endpoints) {
  const handler = require(path.join(__dirname, '..', 'api', `${ep}.js`));
  const req = { query: { port: 'Rotterdam', from: 'Santos', to: 'Rotterdam', canal: 'suez', vesselType: 'supramax' } };
  const res = mockRes(ep);
  handler(req, res);
  if (!res.payload || !res.payload.updatedAt || !res.payload.status || (!res.payload.source && ep !== 'weather-risk')) {
    throw new Error(`${ep}: missing required metadata`);
  }
  if (ep === 'route' && res.payload.distanceNm !== 5420) {
    throw new Error(`route: expected Santos → Rotterdam to remain 5420nm, got ${res.payload.distanceNm}`);
  }
}
console.log('All checks passed.');
