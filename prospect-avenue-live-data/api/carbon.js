const { getCarbon, ok } = require('../lib/dataSources');
module.exports = function handler(req, res) {
  ok(res, getCarbon());
};
