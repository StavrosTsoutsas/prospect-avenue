const nowIso = () => new Date().toISOString();

function normalizePort(port = '') {
  return String(port || '').trim().toLowerCase();
}

function hashString(str = '') {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function dailyNoise(key, span = 1) {
  const day = new Date().toISOString().slice(0, 10);
  const h = hashString(`${day}:${key}`);
  return ((h % 1000) / 1000 - 0.5) * 2 * span;
}

const HUB_PRICES = {
  singapore: { vlsfo: 610, mgo: 812 },
  rotterdam: { vlsfo: 585, mgo: 785 },
  fujairah: { vlsfo: 602, mgo: 798 },
  houston: { vlsfo: 575, mgo: 770 },
  gibraltar: { vlsfo: 595, mgo: 805 },
  piraeus: { vlsfo: 612, mgo: 822 },
  santos: { vlsfo: 625, mgo: 835 },
  shanghai: { vlsfo: 606, mgo: 810 },
  antwerp: { vlsfo: 588, mgo: 790 },
  newcastle: { vlsfo: 618, mgo: 826 }
};

function nearestBunkerHub(port) {
  const p = normalizePort(port);
  if (p.includes('rotterdam') || p.includes('antwerp') || p.includes('hamburg')) return 'rotterdam';
  if (p.includes('piraeus') || p.includes('istanbul') || p.includes('constanta')) return 'piraeus';
  if (p.includes('santos') || p.includes('tubarao') || p.includes('paranagua')) return 'santos';
  if (p.includes('houston') || p.includes('new orleans') || p.includes('corpus')) return 'houston';
  if (p.includes('shanghai') || p.includes('qingdao') || p.includes('tianjin') || p.includes('ningbo')) return 'shanghai';
  if (p.includes('singapore') || p.includes('jakarta') || p.includes('port klang')) return 'singapore';
  if (p.includes('fujairah') || p.includes('dubai') || p.includes('kandla') || p.includes('mumbai')) return 'fujairah';
  if (p.includes('gibraltar') || p.includes('valencia') || p.includes('barcelona')) return 'gibraltar';
  if (p.includes('newcastle')) return 'newcastle';
  return 'singapore';
}

function getBunkers(port = 'Singapore') {
  const hub = nearestBunkerHub(port);
  const base = HUB_PRICES[hub] || HUB_PRICES.singapore;
  const vlsfo = Math.round(base.vlsfo + dailyNoise(`vlsfo:${hub}`, 18));
  const mgo = Math.round(base.mgo + dailyNoise(`mgo:${hub}`, 24));
  return {
    requestedPort: port || null,
    pricingPort: hub[0].toUpperCase() + hub.slice(1),
    vlsfo,
    mgo,
    currency: 'USD',
    unit: 'MT',
    source: 'mock_bunker_feed',
    updatedAt: nowIso(),
    confidence: 'medium',
    status: 'mock',
    note: 'Mock daily bunker prices. Replace this provider with a licensed bunker feed before commercial use.'
  };
}

const ROUTES = {
  "amsterdam|rotterdam": { distanceNm: 30, ballastDistanceNm: 6, ecaDistanceNm: 150, canal: "none" },
  "antwerp|hamburg": { distanceNm: 460, ballastDistanceNm: 85, ecaDistanceNm: 150, canal: "none" },
  "antwerp|new orleans": { distanceNm: 4560, ballastDistanceNm: 850, ecaDistanceNm: 300, canal: "none" },
  "antwerp|piraeus": { distanceNm: 1860, ballastDistanceNm: 340, ecaDistanceNm: 150, canal: "none" },
  "antwerp|richards bay": { distanceNm: 5760, ballastDistanceNm: 1250, ecaDistanceNm: 300, canal: "none" },
  "antwerp|rotterdam": { distanceNm: 80, ballastDistanceNm: 15, ecaDistanceNm: 150, canal: "none" },
  "antwerp|santos": { distanceNm: 5280, ballastDistanceNm: 1100, ecaDistanceNm: 300, canal: "none" },
  "antwerp|southampton": { distanceNm: 310, ballastDistanceNm: 55, ecaDistanceNm: 150, canal: "none" },
  "antwerp|tubarao": { distanceNm: 5340, ballastDistanceNm: 1100, ecaDistanceNm: 300, canal: "none" },
  "aqaba|piraeus": { distanceNm: 2100, ballastDistanceNm: 420, ecaDistanceNm: 150, canal: "none" },
  "aqaba|rotterdam": { distanceNm: 4100, ballastDistanceNm: 850, ecaDistanceNm: 300, canal: "none" },
  "bahia blanca|rotterdam": { distanceNm: 6050, ballastDistanceNm: 1350, ecaDistanceNm: 300, canal: "none" },
  "bahia blanca|shanghai": { distanceNm: 13400, ballastDistanceNm: 3400, ecaDistanceNm: 300, canal: "none" },
  "baltimore|rotterdam": { distanceNm: 3700, ballastDistanceNm: 750, ecaDistanceNm: 300, canal: "none" },
  "baltimore|shanghai": { distanceNm: 11300, ballastDistanceNm: 2600, ecaDistanceNm: 300, canal: "none" },
  "bangkok|rotterdam": { distanceNm: 9400, ballastDistanceNm: 2170, ecaDistanceNm: 300, canal: "none" },
  "bangkok|shanghai": { distanceNm: 2700, ballastDistanceNm: 610, ecaDistanceNm: 150, canal: "none" },
  "barcelona|rotterdam": { distanceNm: 1400, ballastDistanceNm: 260, ecaDistanceNm: 150, canal: "none" },
  "baton rouge|rotterdam": { distanceNm: 4750, ballastDistanceNm: 950, ecaDistanceNm: 300, canal: "none" },
  "bremen|rotterdam": { distanceNm: 250, ballastDistanceNm: 45, ecaDistanceNm: 150, canal: "none" },
  "busan|hay point": { distanceNm: 4700, ballastDistanceNm: 1050, ecaDistanceNm: 300, canal: "none" },
  "busan|newcastle nsw": { distanceNm: 4500, ballastDistanceNm: 1000, ecaDistanceNm: 300, canal: "none" },
  "busan|piraeus": { distanceNm: 8200, ballastDistanceNm: 1900, ecaDistanceNm: 450, canal: "suez" },
  "busan|rotterdam": { distanceNm: 10200, ballastDistanceNm: 2350, ecaDistanceNm: 450, canal: "suez" },
  "busan|santos": { distanceNm: 12400, ballastDistanceNm: 3000, ecaDistanceNm: 300, canal: "none" },
  "busan|tubarao": { distanceNm: 12500, ballastDistanceNm: 3000, ecaDistanceNm: 300, canal: "none" },
  "busan|vancouver": { distanceNm: 4200, ballastDistanceNm: 850, ecaDistanceNm: 300, canal: "none" },
  "chittagong|rotterdam": { distanceNm: 7200, ballastDistanceNm: 1660, ecaDistanceNm: 300, canal: "none" },
  "chittagong|shanghai": { distanceNm: 3200, ballastDistanceNm: 720, ecaDistanceNm: 300, canal: "none" },
  "colombo|rotterdam": { distanceNm: 6900, ballastDistanceNm: 1590, ecaDistanceNm: 300, canal: "none" },
  "colombo|shanghai": { distanceNm: 4600, ballastDistanceNm: 1050, ecaDistanceNm: 300, canal: "none" },
  "constanta|genoa": { distanceNm: 2100, ballastDistanceNm: 380, ecaDistanceNm: 150, canal: "none" },
  "constanta|novorossiysk": { distanceNm: 550, ballastDistanceNm: 100, ecaDistanceNm: 150, canal: "none" },
  "constanta|piraeus": { distanceNm: 1350, ballastDistanceNm: 260, ecaDistanceNm: 150, canal: "none" },
  "constanta|rotterdam": { distanceNm: 3650, ballastDistanceNm: 750, ecaDistanceNm: 300, canal: "none" },
  "constanta|santos": { distanceNm: 7100, ballastDistanceNm: 1700, ecaDistanceNm: 300, canal: "none" },
  "corpus christi|rotterdam": { distanceNm: 5300, ballastDistanceNm: 1060, ecaDistanceNm: 300, canal: "none" },
  "dalian|rotterdam": { distanceNm: 10600, ballastDistanceNm: 2450, ecaDistanceNm: 300, canal: "none" },
  "dalian|shanghai": { distanceNm: 1000, ballastDistanceNm: 230, ecaDistanceNm: 150, canal: "none" },
  "damietta|piraeus": { distanceNm: 980, ballastDistanceNm: 180, ecaDistanceNm: 150, canal: "none" },
  "damietta|rotterdam": { distanceNm: 2400, ballastDistanceNm: 460, ecaDistanceNm: 150, canal: "none" },
  "dampier|rotterdam": { distanceNm: 10100, ballastDistanceNm: 2330, ecaDistanceNm: 300, canal: "none" },
  "dampier|shanghai": { distanceNm: 5100, ballastDistanceNm: 1160, ecaDistanceNm: 300, canal: "none" },
  "durban|rotterdam": { distanceNm: 6100, ballastDistanceNm: 1380, ecaDistanceNm: 300, canal: "none" },
  "durban|shanghai": { distanceNm: 7800, ballastDistanceNm: 1800, ecaDistanceNm: 300, canal: "none" },
  "fremantle|rotterdam": { distanceNm: 10200, ballastDistanceNm: 2350, ecaDistanceNm: 300, canal: "none" },
  "fremantle|shanghai": { distanceNm: 5600, ballastDistanceNm: 1280, ecaDistanceNm: 300, canal: "none" },
  "gdansk|rotterdam": { distanceNm: 1300, ballastDistanceNm: 240, ecaDistanceNm: 150, canal: "none" },
  "genoa|rotterdam": { distanceNm: 2050, ballastDistanceNm: 390, ecaDistanceNm: 150, canal: "none" },
  "genoa|santos": { distanceNm: 6400, ballastDistanceNm: 1450, ecaDistanceNm: 300, canal: "none" },
  "gladstone|rotterdam": { distanceNm: 11200, ballastDistanceNm: 2600, ecaDistanceNm: 300, canal: "none" },
  "gladstone|shanghai": { distanceNm: 5300, ballastDistanceNm: 1200, ecaDistanceNm: 300, canal: "none" },
  "guangzhou|shanghai": { distanceNm: 1600, ballastDistanceNm: 360, ecaDistanceNm: 150, canal: "none" },
  "gwangyang|rotterdam": { distanceNm: 10100, ballastDistanceNm: 2330, ecaDistanceNm: 300, canal: "none" },
  "gwangyang|shanghai": { distanceNm: 800, ballastDistanceNm: 180, ecaDistanceNm: 150, canal: "none" },
  "hai phong|rotterdam": { distanceNm: 9300, ballastDistanceNm: 2150, ecaDistanceNm: 300, canal: "none" },
  "hai phong|shanghai": { distanceNm: 1900, ballastDistanceNm: 430, ecaDistanceNm: 150, canal: "none" },
  "haldia|shanghai": { distanceNm: 4000, ballastDistanceNm: 900, ecaDistanceNm: 300, canal: "none" },
  "hamburg|rotterdam": { distanceNm: 380, ballastDistanceNm: 70, ecaDistanceNm: 150, canal: "none" },
  "hamburg|santos": { distanceNm: 5680, ballastDistanceNm: 1300, ecaDistanceNm: 300, canal: "none" },
  "hamburg|southampton": { distanceNm: 650, ballastDistanceNm: 120, ecaDistanceNm: 150, canal: "none" },
  "hampton roads|piraeus": { distanceNm: 4600, ballastDistanceNm: 900, ecaDistanceNm: 300, canal: "none" },
  "hampton roads|rotterdam": { distanceNm: 3500, ballastDistanceNm: 700, ecaDistanceNm: 300, canal: "none" },
  "hampton roads|shanghai": { distanceNm: 11100, ballastDistanceNm: 2600, ecaDistanceNm: 300, canal: "none" },
  "hay point|qingdao": { distanceNm: 4900, ballastDistanceNm: 1100, ecaDistanceNm: 300, canal: "none" },
  "hay point|rotterdam": { distanceNm: 10800, ballastDistanceNm: 2500, ecaDistanceNm: 300, canal: "none" },
  "hay point|shanghai": { distanceNm: 5100, ballastDistanceNm: 1150, ecaDistanceNm: 300, canal: "none" },
  "ho chi minh|rotterdam": { distanceNm: 9100, ballastDistanceNm: 2100, ecaDistanceNm: 300, canal: "none" },
  "ho chi minh|shanghai": { distanceNm: 2300, ballastDistanceNm: 520, ecaDistanceNm: 150, canal: "none" },
  "houston|rotterdam": { distanceNm: 5100, ballastDistanceNm: 1000, ecaDistanceNm: 300, canal: "none" },
  "houston|shanghai": { distanceNm: 11200, ballastDistanceNm: 2600, ecaDistanceNm: 300, canal: "none" },
  "immingham|rotterdam": { distanceNm: 420, ballastDistanceNm: 75, ecaDistanceNm: 150, canal: "none" },
  "incheon|shanghai": { distanceNm: 900, ballastDistanceNm: 200, ecaDistanceNm: 150, canal: "none" },
  "iskenderun|piraeus": { distanceNm: 1200, ballastDistanceNm: 230, ecaDistanceNm: 150, canal: "none" },
  "iskenderun|rotterdam": { distanceNm: 2600, ballastDistanceNm: 500, ecaDistanceNm: 150, canal: "none" },
  "istanbul|novorossiysk": { distanceNm: 950, ballastDistanceNm: 180, ecaDistanceNm: 150, canal: "none" },
  "istanbul|piraeus": { distanceNm: 800, ballastDistanceNm: 150, ecaDistanceNm: 150, canal: "none" },
  "istanbul|rotterdam": { distanceNm: 2300, ballastDistanceNm: 440, ecaDistanceNm: 150, canal: "none" },
  "istanbul|santos": { distanceNm: 6900, ballastDistanceNm: 1600, ecaDistanceNm: 300, canal: "none" },
  "istanbul|yuzhne": { distanceNm: 1000, ballastDistanceNm: 180, ecaDistanceNm: 150, canal: "none" },
  "jakarta|rotterdam": { distanceNm: 8600, ballastDistanceNm: 1990, ecaDistanceNm: 300, canal: "none" },
  "jakarta|shanghai": { distanceNm: 3100, ballastDistanceNm: 700, ecaDistanceNm: 300, canal: "none" },
  "jeddah|piraeus": { distanceNm: 2500, ballastDistanceNm: 500, ecaDistanceNm: 150, canal: "none" },
  "jeddah|rotterdam": { distanceNm: 4500, ballastDistanceNm: 950, ecaDistanceNm: 300, canal: "none" },
  "jingtang|shanghai": { distanceNm: 1200, ballastDistanceNm: 270, ecaDistanceNm: 150, canal: "none" },
  "kandla|rotterdam": { distanceNm: 6600, ballastDistanceNm: 1520, ecaDistanceNm: 300, canal: "none" },
  "kandla|shanghai": { distanceNm: 5700, ballastDistanceNm: 1300, ecaDistanceNm: 300, canal: "none" },
  "karachi|rotterdam": { distanceNm: 6500, ballastDistanceNm: 1500, ecaDistanceNm: 300, canal: "none" },
  "karachi|shanghai": { distanceNm: 5400, ballastDistanceNm: 1240, ecaDistanceNm: 300, canal: "none" },
  "kashima|shanghai": { distanceNm: 1300, ballastDistanceNm: 290, ecaDistanceNm: 150, canal: "none" },
  "kobe|shanghai": { distanceNm: 1000, ballastDistanceNm: 230, ecaDistanceNm: 150, canal: "none" },
  "le havre|rotterdam": { distanceNm: 360, ballastDistanceNm: 65, ecaDistanceNm: 150, canal: "none" },
  "manila|rotterdam": { distanceNm: 9800, ballastDistanceNm: 2250, ecaDistanceNm: 300, canal: "none" },
  "manila|shanghai": { distanceNm: 2000, ballastDistanceNm: 450, ecaDistanceNm: 150, canal: "none" },
  "marseille|rotterdam": { distanceNm: 1700, ballastDistanceNm: 320, ecaDistanceNm: 150, canal: "none" },
  "mobile|rotterdam": { distanceNm: 4800, ballastDistanceNm: 960, ecaDistanceNm: 300, canal: "none" },
  "mormugao|rotterdam": { distanceNm: 6700, ballastDistanceNm: 1550, ecaDistanceNm: 300, canal: "none" },
  "mormugao|shanghai": { distanceNm: 5800, ballastDistanceNm: 1330, ecaDistanceNm: 300, canal: "none" },
  "mumbai|newcastle nsw": { distanceNm: 6400, ballastDistanceNm: 1500, ecaDistanceNm: 300, canal: "none" },
  "mumbai|piraeus": { distanceNm: 4000, ballastDistanceNm: 900, ecaDistanceNm: 300, canal: "none" },
  "mumbai|port hedland": { distanceNm: 3800, ballastDistanceNm: 850, ecaDistanceNm: 300, canal: "none" },
  "mumbai|richards bay": { distanceNm: 4200, ballastDistanceNm: 950, ecaDistanceNm: 300, canal: "none" },
  "mumbai|rotterdam": { distanceNm: 6800, ballastDistanceNm: 1580, ecaDistanceNm: 300, canal: "none" },
  "mumbai|santos": { distanceNm: 8900, ballastDistanceNm: 2000, ecaDistanceNm: 300, canal: "none" },
  "mumbai|shanghai": { distanceNm: 5900, ballastDistanceNm: 1350, ecaDistanceNm: 300, canal: "none" },
  "mumbai|singapore": { distanceNm: 2400, ballastDistanceNm: 540, ecaDistanceNm: 150, canal: "none" },
  "nagoya|newcastle nsw": { distanceNm: 4300, ballastDistanceNm: 950, ecaDistanceNm: 300, canal: "none" },
  "nagoya|rotterdam": { distanceNm: 10900, ballastDistanceNm: 2520, ecaDistanceNm: 450, canal: "suez" },
  "nagoya|santos": { distanceNm: 12200, ballastDistanceNm: 2900, ecaDistanceNm: 300, canal: "none" },
  "nagoya|shanghai": { distanceNm: 1100, ballastDistanceNm: 250, ecaDistanceNm: 150, canal: "none" },
  "new orleans|piraeus": { distanceNm: 5800, ballastDistanceNm: 1300, ecaDistanceNm: 300, canal: "none" },
  "new orleans|rotterdam": { distanceNm: 4700, ballastDistanceNm: 900, ecaDistanceNm: 300, canal: "none" },
  "new orleans|shanghai": { distanceNm: 10800, ballastDistanceNm: 2500, ecaDistanceNm: 300, canal: "none" },
  "newcastle nsw|piraeus": { distanceNm: 9200, ballastDistanceNm: 2100, ecaDistanceNm: 300, canal: "none" },
  "newcastle nsw|qingdao": { distanceNm: 4700, ballastDistanceNm: 1050, ecaDistanceNm: 300, canal: "none" },
  "newcastle nsw|rotterdam": { distanceNm: 11600, ballastDistanceNm: 2700, ecaDistanceNm: 300, canal: "none" },
  "newcastle nsw|santos": { distanceNm: 11200, ballastDistanceNm: 2600, ecaDistanceNm: 300, canal: "none" },
  "newcastle nsw|shanghai": { distanceNm: 4900, ballastDistanceNm: 1100, ecaDistanceNm: 300, canal: "none" },
  "newcastle nsw|singapore": { distanceNm: 4200, ballastDistanceNm: 950, ecaDistanceNm: 300, canal: "none" },
  "newcastle nsw|tianjin": { distanceNm: 5000, ballastDistanceNm: 1100, ecaDistanceNm: 300, canal: "none" },
  "newcastle nsw|yokohama": { distanceNm: 4400, ballastDistanceNm: 980, ecaDistanceNm: 300, canal: "none" },
  "ningbo|rotterdam": { distanceNm: 10400, ballastDistanceNm: 2400, ecaDistanceNm: 450, canal: "suez" },
  "novorossiysk|piraeus": { distanceNm: 1550, ballastDistanceNm: 300, ecaDistanceNm: 150, canal: "none" },
  "novorossiysk|rotterdam": { distanceNm: 3900, ballastDistanceNm: 800, ecaDistanceNm: 300, canal: "none" },
  "odessa|piraeus": { distanceNm: 1580, ballastDistanceNm: 300, ecaDistanceNm: 150, canal: "none" },
  "odessa|rotterdam": { distanceNm: 3900, ballastDistanceNm: 800, ecaDistanceNm: 300, canal: "none" },
  "osaka|shanghai": { distanceNm: 1050, ballastDistanceNm: 240, ecaDistanceNm: 150, canal: "none" },
  "paiton|shanghai": { distanceNm: 3000, ballastDistanceNm: 680, ecaDistanceNm: 150, canal: "none" },
  "paradip|shanghai": { distanceNm: 4100, ballastDistanceNm: 930, ecaDistanceNm: 300, canal: "none" },
  "paranagua|rotterdam": { distanceNm: 5800, ballastDistanceNm: 1300, ecaDistanceNm: 300, canal: "none" },
  "paranagua|shanghai": { distanceNm: 13100, ballastDistanceNm: 3300, ecaDistanceNm: 300, canal: "none" },
  "philadelphia|rotterdam": { distanceNm: 3600, ballastDistanceNm: 720, ecaDistanceNm: 300, canal: "none" },
  "piraeus|ploce": { distanceNm: 1100, ballastDistanceNm: 210, ecaDistanceNm: 150, canal: "none" },
  "piraeus|qingdao": { distanceNm: 8400, ballastDistanceNm: 1950, ecaDistanceNm: 450, canal: "suez" },
  "piraeus|richards bay": { distanceNm: 4800, ballastDistanceNm: 1050, ecaDistanceNm: 300, canal: "none" },
  "piraeus|rotterdam": { distanceNm: 2000, ballastDistanceNm: 380, ecaDistanceNm: 150, canal: "none" },
  "piraeus|santos": { distanceNm: 6180, ballastDistanceNm: 1400, ecaDistanceNm: 300, canal: "none" },
  "piraeus|shanghai": { distanceNm: 8600, ballastDistanceNm: 2000, ecaDistanceNm: 450, canal: "suez" },
  "piraeus|singapore": { distanceNm: 6600, ballastDistanceNm: 1500, ecaDistanceNm: 450, canal: "suez" },
  "piraeus|southampton": { distanceNm: 2400, ballastDistanceNm: 430, ecaDistanceNm: 150, canal: "none" },
  "piraeus|taranto": { distanceNm: 900, ballastDistanceNm: 170, ecaDistanceNm: 150, canal: "none" },
  "piraeus|thessaloniki": { distanceNm: 350, ballastDistanceNm: 65, ecaDistanceNm: 150, canal: "none" },
  "piraeus|yuzhne": { distanceNm: 1600, ballastDistanceNm: 300, ecaDistanceNm: 150, canal: "none" },
  "ploce|rotterdam": { distanceNm: 2300, ballastDistanceNm: 440, ecaDistanceNm: 150, canal: "none" },
  "pohang|shanghai": { distanceNm: 700, ballastDistanceNm: 160, ecaDistanceNm: 150, canal: "none" },
  "port hedland|qingdao": { distanceNm: 5000, ballastDistanceNm: 1150, ecaDistanceNm: 300, canal: "none" },
  "port hedland|rotterdam": { distanceNm: 10500, ballastDistanceNm: 2400, ecaDistanceNm: 300, canal: "none" },
  "port hedland|shanghai": { distanceNm: 5200, ballastDistanceNm: 1200, ecaDistanceNm: 300, canal: "none" },
  "port hedland|tianjin": { distanceNm: 5300, ballastDistanceNm: 1250, ecaDistanceNm: 300, canal: "none" },
  "port klang|rotterdam": { distanceNm: 8500, ballastDistanceNm: 1970, ecaDistanceNm: 450, canal: "suez" },
  "port klang|shanghai": { distanceNm: 3200, ballastDistanceNm: 720, ecaDistanceNm: 300, canal: "none" },
  "puerto bolivar|rotterdam": { distanceNm: 4900, ballastDistanceNm: 1050, ecaDistanceNm: 300, canal: "none" },
  "qingdao|rotterdam": { distanceNm: 10300, ballastDistanceNm: 2350, ecaDistanceNm: 450, canal: "suez" },
  "qingdao|santos": { distanceNm: 12600, ballastDistanceNm: 3100, ecaDistanceNm: 300, canal: "none" },
  "qingdao|tubarao": { distanceNm: 12700, ballastDistanceNm: 3100, ecaDistanceNm: 300, canal: "none" },
  "qingdao|vancouver": { distanceNm: 4600, ballastDistanceNm: 950, ecaDistanceNm: 300, canal: "none" },
  "recalada|rotterdam": { distanceNm: 6100, ballastDistanceNm: 1400, ecaDistanceNm: 300, canal: "none" },
  "recalada|shanghai": { distanceNm: 13600, ballastDistanceNm: 3500, ecaDistanceNm: 300, canal: "none" },
  "richards bay|rotterdam": { distanceNm: 5900, ballastDistanceNm: 1300, ecaDistanceNm: 300, canal: "none" },
  "richards bay|santos": { distanceNm: 3700, ballastDistanceNm: 800, ecaDistanceNm: 300, canal: "none" },
  "richards bay|shanghai": { distanceNm: 8200, ballastDistanceNm: 1900, ecaDistanceNm: 300, canal: "none" },
  "riga|rotterdam": { distanceNm: 1400, ballastDistanceNm: 260, ecaDistanceNm: 150, canal: "none" },
  "rizhao|rotterdam": { distanceNm: 10200, ballastDistanceNm: 2350, ecaDistanceNm: 300, canal: "none" },
  "rosario|rotterdam": { distanceNm: 6200, ballastDistanceNm: 1400, ecaDistanceNm: 300, canal: "none" },
  "rosario|shanghai": { distanceNm: 13700, ballastDistanceNm: 3500, ecaDistanceNm: 300, canal: "none" },
  "rotterdam|saldanha bay": { distanceNm: 5600, ballastDistanceNm: 1260, ecaDistanceNm: 300, canal: "none" },
  "rotterdam|santos": { distanceNm: 5420, ballastDistanceNm: 1200, ecaDistanceNm: 300, canal: "none" },
  "rotterdam|shanghai": { distanceNm: 10500, ballastDistanceNm: 2400, ecaDistanceNm: 450, canal: "suez" },
  "rotterdam|singapore": { distanceNm: 8400, ballastDistanceNm: 1950, ecaDistanceNm: 450, canal: "suez" },
  "rotterdam|southampton": { distanceNm: 520, ballastDistanceNm: 95, ecaDistanceNm: 150, canal: "none" },
  "rotterdam|tallinn": { distanceNm: 1350, ballastDistanceNm: 250, ecaDistanceNm: 150, canal: "none" },
  "rotterdam|taranto": { distanceNm: 2100, ballastDistanceNm: 400, ecaDistanceNm: 150, canal: "none" },
  "rotterdam|thessaloniki": { distanceNm: 2350, ballastDistanceNm: 445, ecaDistanceNm: 150, canal: "none" },
  "rotterdam|tianjin": { distanceNm: 10600, ballastDistanceNm: 2450, ecaDistanceNm: 450, canal: "suez" },
  "rotterdam|tubarao": { distanceNm: 5480, ballastDistanceNm: 1200, ecaDistanceNm: 300, canal: "none" },
  "rotterdam|ust-luga": { distanceNm: 1200, ballastDistanceNm: 220, ecaDistanceNm: 150, canal: "none" },
  "rotterdam|valencia": { distanceNm: 1550, ballastDistanceNm: 290, ecaDistanceNm: 150, canal: "none" },
  "rotterdam|vancouver": { distanceNm: 8200, ballastDistanceNm: 1900, ecaDistanceNm: 300, canal: "none" },
  "rotterdam|vizag": { distanceNm: 6500, ballastDistanceNm: 1500, ecaDistanceNm: 300, canal: "none" },
  "rotterdam|walvis bay": { distanceNm: 5200, ballastDistanceNm: 1170, ecaDistanceNm: 300, canal: "none" },
  "rotterdam|yokohama": { distanceNm: 11000, ballastDistanceNm: 2540, ecaDistanceNm: 450, canal: "suez" },
  "rotterdam|yuzhne": { distanceNm: 3950, ballastDistanceNm: 800, ecaDistanceNm: 300, canal: "none" },
  "saldanha bay|shanghai": { distanceNm: 9100, ballastDistanceNm: 2100, ecaDistanceNm: 300, canal: "none" },
  "santos|shanghai": { distanceNm: 12800, ballastDistanceNm: 3200, ecaDistanceNm: 300, canal: "none" },
  "santos|singapore": { distanceNm: 11800, ballastDistanceNm: 2800, ecaDistanceNm: 300, canal: "none" },
  "santos|tianjin": { distanceNm: 13100, ballastDistanceNm: 3300, ecaDistanceNm: 300, canal: "none" },
  "santos|yokohama": { distanceNm: 12300, ballastDistanceNm: 3000, ecaDistanceNm: 300, canal: "none" },
  "santos|yuzhne": { distanceNm: 7200, ballastDistanceNm: 1800, ecaDistanceNm: 300, canal: "none" },
  "shanghai|southampton": { distanceNm: 11200, ballastDistanceNm: 2600, ecaDistanceNm: 450, canal: "suez" },
  "shanghai|tubarao": { distanceNm: 12900, ballastDistanceNm: 3200, ecaDistanceNm: 300, canal: "none" },
  "shanghai|vancouver": { distanceNm: 4700, ballastDistanceNm: 1000, ecaDistanceNm: 300, canal: "none" },
  "shanghai|vizag": { distanceNm: 4200, ballastDistanceNm: 950, ecaDistanceNm: 300, canal: "none" },
  "shanghai|walvis bay": { distanceNm: 9600, ballastDistanceNm: 2220, ecaDistanceNm: 300, canal: "none" },
  "shanghai|yokohama": { distanceNm: 1150, ballastDistanceNm: 260, ecaDistanceNm: 150, canal: "none" },
  "shanghai|zhoushan": { distanceNm: 200, ballastDistanceNm: 45, ecaDistanceNm: 150, canal: "none" },
  "singapore|southampton": { distanceNm: 8700, ballastDistanceNm: 2000, ecaDistanceNm: 450, canal: "suez" },
  "tianjin|tubarao": { distanceNm: 13200, ballastDistanceNm: 3300, ecaDistanceNm: 300, canal: "none" },
  "tianjin|vancouver": { distanceNm: 4800, ballastDistanceNm: 1000, ecaDistanceNm: 300, canal: "none" },
};

function routeKey(from, to) {
  return [normalizePort(from), normalizePort(to)].sort().join('|');
}

function estimateDistance(from, to, canal = 'auto') {
  const key = routeKey(from, to);
  const known = ROUTES[key];
  if (known) {
    return {
      from,
      to,
      requestedCanal: canal,
      distanceNm: known.distanceNm,
      ballastDistanceNm: known.ballastDistanceNm,
      ecaDistanceNm: known.ecaDistanceNm,
      suggestedCanal: canal && canal !== 'auto' ? canal : known.canal,
      source: 'mock_route_table',
      updatedAt: nowIso(),
      confidence: 'medium',
      status: 'mock',
      note: 'Mock route table. Replace with Searoutes/Aquaplot/other licensed routing API for production.'
    };
  }
  const h = hashString(key || 'default');
  const distanceNm = Math.round((1800 + (h % 9800)) / 50) * 50;
  return {
    from,
    to,
    requestedCanal: canal,
    distanceNm,
    ballastDistanceNm: Math.round(distanceNm * 0.22 / 50) * 50,
    ecaDistanceNm: Math.min(600, Math.round(distanceNm * 0.04 / 50) * 50),
    suggestedCanal: canal && canal !== 'auto' ? canal : 'none',
    source: 'mock_coordinate_estimator',
    updatedAt: nowIso(),
    confidence: 'low',
    status: 'estimated',
    note: 'Fallback estimate. Verify routing before fixture decisions.'
  };
}

function getCarbon() {
  const euaPriceEur = Number((72 + dailyNoise('eua', 4)).toFixed(2));
  return {
    euaPriceEur,
    currency: 'EUR',
    unit: 'tCO2',
    source: 'mock_carbon_feed',
    updatedAt: nowIso(),
    confidence: 'medium',
    status: 'mock',
    note: 'Mock EUA price. Replace with licensed market-data feed before commercial use.'
  };
}

const DWT = { handysize: 28000, handymax: 38000, supramax: 58000, ultramax: 64000, panamax: 75000, kamsarmax: 82000, capesize: 180000 };

function getPortCosts(port = '', vesselType = 'supramax') {
  const vt = normalizePort(vesselType) || 'supramax';
  const dwt = DWT[vt] || DWT.supramax;
  const base = 18000 + dwt * 0.42;
  const regionalAdj = dailyNoise(`da:${normalizePort(port)}`, 0.18);
  const mid = Math.round((base * (1 + regionalAdj)) / 1000) * 1000;
  return {
    port,
    vesselType: vt,
    daLow: Math.max(8000, Math.round(mid * 0.78 / 1000) * 1000),
    daMid: mid,
    daHigh: Math.round(mid * 1.28 / 1000) * 1000,
    currency: 'USD',
    source: 'mock_port_da_model',
    updatedAt: nowIso(),
    confidence: 'low',
    status: 'estimated',
    note: 'Estimated DA range only. Always verify with local agent.'
  };
}

const CANAL_BASE = {
  none: { estimatedDues: 0, rangeLow: 0, rangeHigh: 0 },
  suez: { estimatedDues: 420000, rangeLow: 350000, rangeHigh: 520000 },
  panama: { estimatedDues: 280000, rangeLow: 220000, rangeHigh: 380000 }
};

function getCanalDues(canal = 'none', vesselType = 'supramax') {
  const c = normalizePort(canal) || 'none';
  const vt = normalizePort(vesselType) || 'supramax';
  const base = CANAL_BASE[c] || CANAL_BASE.none;
  const dwt = DWT[vt] || DWT.supramax;
  const factor = Math.max(0.65, Math.min(2.7, dwt / DWT.supramax));
  return {
    canal: c,
    vesselType: vt,
    estimatedDues: Math.round(base.estimatedDues * factor / 1000) * 1000,
    rangeLow: Math.round(base.rangeLow * factor / 1000) * 1000,
    rangeHigh: Math.round(base.rangeHigh * factor / 1000) * 1000,
    currency: 'USD',
    source: 'mock_canal_dues_model',
    updatedAt: nowIso(),
    confidence: c === 'none' ? 'high' : 'low',
    status: c === 'none' ? 'manual' : 'estimated',
    note: c === 'none' ? 'No canal selected.' : 'Estimated range only. Actual dues depend on vessel particulars and canal authority rules.'
  };
}

function ok(res, payload) {
  res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=3600');
  res.status(200).json(payload);
}

function bad(res, message, statusCode = 400) {
  res.status(statusCode).json({ error: message, updatedAt: nowIso(), status: 'error' });
}

module.exports = { getBunkers, estimateDistance, getCarbon, getPortCosts, getCanalDues, ok, bad };
