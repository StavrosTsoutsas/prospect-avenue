const { getCanalDues, ok } = require('../lib/dataSources');
module.exports = function handler(req, res) {
  const { canal = 'none', vesselType = 'supramax' } = req.query;
  ok(res, getCanalDues(canal, vesselType));
};
