module.exports = function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=3600');
  res.status(200).json({
    weatherRisk: 'not_integrated',
    suggestedBufferDays: null,
    source: 'not_enabled_in_mvp',
    updatedAt: new Date().toISOString(),
    confidence: 'none',
    status: 'manual',
    note: 'Weather routing is intentionally left as a later integration. Keep weather buffer manual for this MVP.'
  });
};
