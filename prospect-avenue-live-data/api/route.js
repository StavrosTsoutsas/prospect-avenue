const { estimateDistance, ok, bad } = require('../lib/dataSources');
module.exports = function handler(req, res) {
  const { from, to, canal = 'auto' } = req.query;
  if (!from || !to) return bad(res, 'Missing required query params: from and to');
  ok(res, estimateDistance(from, to, canal));
};
