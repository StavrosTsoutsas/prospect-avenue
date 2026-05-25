const { getBunkers, ok } = require('../lib/dataSources');
module.exports = function handler(req, res) {
  ok(res, getBunkers(req.query.port || 'Singapore'));
};
