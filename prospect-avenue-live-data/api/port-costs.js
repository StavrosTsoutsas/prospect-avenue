const { getPortCosts, ok, bad } = require('../lib/dataSources');
module.exports = function handler(req, res) {
  const { port, vesselType = 'supramax' } = req.query;
  if (!port) return bad(res, 'Missing required query param: port');
  ok(res, getPortCosts(port, vesselType));
};
