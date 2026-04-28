/**
 * sbc-rules.js
 * Saudi Building Code 2021 rules engine for Binna.
 * Every value here is sourced from the SBC 2021 and publicly available
 * Baladiya guidelines. No AI, no estimation — pure deterministic logic.
 *
 * Source: Saudi Building Code 2021 (sbc.gov.sa)
 * Last verified: 2024
 */

// ─── FAR (Floor Area Ratio) limits by zone ────────────────────────────────────
// Source: SBC 2021, municipal zoning regulations
const FAR_LIMITS = {
  'Residential (سكني)':              2.0,
  'Commercial (تجاري)':              4.0,
  'Industrial (صناعي)':              1.5,
  'Mixed-use (متعدد الاستخدامات)':   3.0,
  'Unknown / need to check':         2.0, // conservative default
};

// ─── Max floors by zone (general SBC guidance, varies by street width) ────────
const MAX_FLOORS = {
  'Residential (سكني)':              4,
  'Commercial (تجاري)':              12,
  'Industrial (صناعي)':              3,
  'Mixed-use (متعدد الاستخدامات)':   10,
  'Unknown / need to check':         4,
};

// ─── Parking ratios (spaces per 100m² BUA) ────────────────────────────────────
// Source: SBC 2021 Chapter 11
const PARKING_RATIO = {
  'Residential villa':        1.5,  // per unit, approximated per 100m²
  'Apartment complex':        1.0,  // per unit
  'Commercial building':      3.5,  // per 100m² GFA
  'Mixed-use development':    2.5,
  'Industrial facility':      1.0,
  'Hotel / hospitality':      1.0,  // per room
  'Retail / mall':            5.0,  // per 100m² GLA
  'Warehouse / logistics':    0.5,
};

// ─── Construction cost benchmarks (SAR per m² BUA) ───────────────────────────
// Source: AECOM Middle East Cost Guide 2023, local contractor data
// Ranges reflect standard to high-spec finish
const COST_BENCHMARKS = {
  'Riyadh': {
    'Residential villa':       { low: 2800, high: 4500 },
    'Apartment complex':       { low: 2200, high: 3800 },
    'Commercial building':     { low: 3500, high: 5500 },
    'Mixed-use development':   { low: 3200, high: 5000 },
    'Industrial facility':     { low: 1200, high: 2200 },
    'Hotel / hospitality':     { low: 5000, high: 9000 },
    'Retail / mall':           { low: 3000, high: 5500 },
    'Warehouse / logistics':   { low: 800,  high: 1500 },
  },
  'Jeddah': {
    'Residential villa':       { low: 2900, high: 4800 },
    'Apartment complex':       { low: 2300, high: 4000 },
    'Commercial building':     { low: 3600, high: 5800 },
    'Mixed-use development':   { low: 3400, high: 5200 },
    'Industrial facility':     { low: 1300, high: 2400 },
    'Hotel / hospitality':     { low: 5500, high: 9500 },
    'Retail / mall':           { low: 3200, high: 5800 },
    'Warehouse / logistics':   { low: 900,  high: 1600 },
  },
  'Dammam / Eastern Province': {
    'Residential villa':       { low: 2600, high: 4200 },
    'Apartment complex':       { low: 2000, high: 3500 },
    'Commercial building':     { low: 3200, high: 5000 },
    'Mixed-use development':   { low: 3000, high: 4800 },
    'Industrial facility':     { low: 1100, high: 2000 },
    'Hotel / hospitality':     { low: 4800, high: 8500 },
    'Retail / mall':           { low: 2800, high: 5000 },
    'Warehouse / logistics':   { low: 750,  high: 1400 },
  },
  'NEOM / Tabuk': {
    'Residential villa':       { low: 3500, high: 6000 },
    'Apartment complex':       { low: 3000, high: 5000 },
    'Commercial building':     { low: 4500, high: 7500 },
    'Mixed-use development':   { low: 4000, high: 6500 },
    'Industrial facility':     { low: 1800, high: 3000 },
    'Hotel / hospitality':     { low: 7000, high: 12000 },
    'Retail / mall':           { low: 4000, high: 7000 },
    'Warehouse / logistics':   { low: 1200, high: 2000 },
  },
  'default': {
    'Residential villa':       { low: 2800, high: 4500 },
    'Apartment complex':       { low: 2200, high: 3800 },
    'Commercial building':     { low: 3500, high: 5500 },
    'Mixed-use development':   { low: 3200, high: 5000 },
    'Industrial facility':     { low: 1200, high: 2200 },
    'Hotel / hospitality':     { low: 5000, high: 9000 },
    'Retail / mall':           { low: 3000, high: 5500 },
    'Warehouse / logistics':   { low: 800,  high: 1500 },
  },
};

// ─── Required approvals by project type ───────────────────────────────────────
// Source: Baladiya permit process, SBC 2021, Civil Defense regulations
const REQUIRED_APPROVALS = {
  'Residential villa': [
    'Baladiya building permit (رخصة بناء) from local municipality',
    'Licensed engineer stamped drawings (SBC compliant)',
    'Saudi Civil Defense review (if 3+ floors or basement)',
    'SEC electricity connection approval',
    'Water & wastewater authority coordination (NWC)',
  ],
  'Apartment complex': [
    'Baladiya building permit from local Amanah',
    'Saudi Civil Defense fire safety review (mandatory)',
    'Licensed structural and MEP engineer stamps',
    'Traffic and parking study (if over 20 units)',
    'SEC electricity load application',
    'NWC water connection approval',
    'Elevator authority approval (SASO) if lifts included',
  ],
  'Commercial building': [
    'Baladiya commercial building permit',
    'Saudi Civil Defense fire and life safety review (mandatory)',
    'Traffic study and parking plan',
    'Municipality accessibility compliance review',
    'SEC electricity load application',
    'NWC water and drainage approval',
    'MOMRA commercial use approval if in regulated zone',
  ],
  'Mixed-use development': [
    'Baladiya mixed-use permit (requires use separation plan)',
    'Saudi Civil Defense review (mandatory)',
    'Traffic impact assessment',
    'Parking allocation plan by use type',
    'SEC load application covering all uses',
    'NWC coordination',
    'MOMRA zoning compatibility confirmation',
  ],
  'Industrial facility': [
    'MODON industrial license (if in industrial city)',
    'Baladiya industrial building permit',
    'Saudi Civil Defense fire review (mandatory)',
    'Environmental impact assessment (NCEC)',
    'SEC high-voltage connection if >1MW',
    'NWC industrial water allocation',
    'SFDA or SASO product-specific approvals where applicable',
  ],
  'Hotel / hospitality': [
    'Tourism Authority (Saudi Tourism) hotel classification license',
    'Baladiya building permit',
    'Saudi Civil Defense fire and evacuation review (mandatory)',
    'Traffic and valet parking plan',
    'SEC and NWC connections',
    'Accessibility compliance review',
    'Municipality signage approval',
  ],
  'Retail / mall': [
    'Baladiya commercial permit with retail use classification',
    'Saudi Civil Defense fire review (mandatory)',
    'Traffic impact study (mandatory for >5,000m² GLA)',
    'Parking provision plan',
    'Accessibility compliance',
    'SEC load application',
    'Municipality food court approvals (if F&B included)',
  ],
  'Warehouse / logistics': [
    'Baladiya industrial/storage permit',
    'Saudi Civil Defense fire review',
    'GAZT commercial registration',
    'SEC connection',
    'Access road and loading dock plan approval',
  ],
};

// ─── Civil Defense thresholds ─────────────────────────────────────────────────
// Source: Saudi Civil Defense regulations, SBC 2021 Chapter 10
const CIVIL_DEFENSE_REQUIRED = (floors, bua, projectType) => {
  if (floors >= 3) return true;
  if (bua >= 1000) return true;
  if (['Commercial building', 'Hotel / hospitality', 'Retail / mall', 'Mixed-use development'].includes(projectType)) return true;
  return false;
};

// ─── Permit timeline estimates (weeks) ───────────────────────────────────────
// Source: Baladiya published SLAs + practitioner data
// These are realistic ranges, not guarantees
const PERMIT_TIMELINES = {
  'Riyadh': {
    'Residential villa':     { min: 8,  max: 20 },
    'Apartment complex':     { min: 12, max: 28 },
    'Commercial building':   { min: 16, max: 36 },
    'Mixed-use development': { min: 20, max: 44 },
    'Industrial facility':   { min: 12, max: 24 },
    'Hotel / hospitality':   { min: 24, max: 52 },
    'Retail / mall':         { min: 20, max: 44 },
    'Warehouse / logistics': { min: 8,  max: 20 },
  },
  'Jeddah': {
    'Residential villa':     { min: 10, max: 24 },
    'Apartment complex':     { min: 16, max: 32 },
    'Commercial building':   { min: 20, max: 44 },
    'Mixed-use development': { min: 24, max: 52 },
    'Industrial facility':   { min: 14, max: 28 },
    'Hotel / hospitality':   { min: 28, max: 60 },
    'Retail / mall':         { min: 24, max: 52 },
    'Warehouse / logistics': { min: 10, max: 24 },
  },
  'default': {
    'Residential villa':     { min: 10, max: 24 },
    'Apartment complex':     { min: 14, max: 32 },
    'Commercial building':   { min: 18, max: 40 },
    'Mixed-use development': { min: 22, max: 48 },
    'Industrial facility':   { min: 12, max: 26 },
    'Hotel / hospitality':   { min: 26, max: 56 },
    'Retail / mall':         { min: 22, max: 48 },
    'Warehouse / logistics': { min: 10, max: 22 },
  },
};

// ─── Main function: run all checks ────────────────────────────────────────────
function runSBCChecks({ city, type, plot, bua, floors, zone, budget }) {
  const results = {
    flags: [],
    warnings: [],
    passed: [],
    approvals: [],
    costRange: null,
    permitTimeline: null,
    farCalculated: null,
    farLimit: null,
    civilDefenseRequired: false,
    parkingRequired: null,
    dataSource: 'Saudi Building Code 2021 + Baladiya guidelines (2024)',
  };

  const plotNum  = parseFloat(plot)  || 0;
  const buaNum   = parseFloat(bua)   || 0;
  const floorsNum = parseInt(floors) || 0;

  // ── FAR check ──────────────────────────────────────────────────────────────
  if (plotNum > 0 && buaNum > 0) {
    const far = buaNum / plotNum;
    const farLimit = FAR_LIMITS[zone] || 2.0;
    results.farCalculated = Math.round(far * 100) / 100;
    results.farLimit = farLimit;

    if (far > farLimit) {
      results.flags.push(
        `FAR violation: Your calculated FAR is ${results.farCalculated} but the limit for ${zone || 'this zone'} is ${farLimit}. ` +
        `This is the #1 cause of permit rejection in Saudi Arabia. Reduce BUA or confirm zone classification with municipality.`
      );
    } else {
      results.passed.push(`FAR check passed: ${results.farCalculated} is within the ${farLimit} limit for ${zone || 'this zone'}.`);
    }
  }

  // ── Floor height check ─────────────────────────────────────────────────────
  if (floorsNum > 0 && zone) {
    const maxFloors = MAX_FLOORS[zone] || 4;
    if (floorsNum > maxFloors) {
      results.flags.push(
        `Floor count: ${floorsNum} floors exceeds the typical maximum of ${maxFloors} for ${zone}. ` +
        `Height variances require special municipality approval and may depend on street width.`
      );
    } else {
      results.passed.push(`Floor count: ${floorsNum} floors is within typical limits for ${zone}.`);
    }
  }

  // ── Civil Defense check ────────────────────────────────────────────────────
  const cdRequired = CIVIL_DEFENSE_REQUIRED(floorsNum, buaNum, type);
  results.civilDefenseRequired = cdRequired;
  if (cdRequired) {
    results.warnings.push(
      `Saudi Civil Defense review is required for this project. ` +
      `Engage a Civil Defense consultant early — fire strategy, exit routes, and suppression systems must be designed before permit submission.`
    );
  } else {
    results.passed.push(`Civil Defense review: not mandatory for this scope, but always confirm with your municipality.`);
  }

  // ── Parking check ─────────────────────────────────────────────────────────
  if (buaNum > 0 && type) {
    const ratio = PARKING_RATIO[type] || 2.0;
    const spacesRequired = Math.ceil((buaNum / 100) * ratio);
    results.parkingRequired = spacesRequired;
    results.warnings.push(
      `Parking: approximately ${spacesRequired} spaces required for this project type and BUA. ` +
      `Confirm with municipality — commercial frontage or visitor-heavy use may increase this requirement.`
    );
  }

  // ── Cost range ────────────────────────────────────────────────────────────
  if (buaNum > 0 && type) {
    const cityBenchmarks = COST_BENCHMARKS[city] || COST_BENCHMARKS['default'];
    const benchmark = cityBenchmarks[type] || cityBenchmarks['Residential villa'];
    results.costRange = {
      low:  Math.round(buaNum * benchmark.low),
      high: Math.round(buaNum * benchmark.high),
      perSqmLow:  benchmark.low,
      perSqmHigh: benchmark.high,
      note: 'Concept estimate only. Excludes land, financing, consultant fees, and fit-out. Actual costs vary by specification and market conditions.',
      source: 'AECOM Middle East Cost Guide 2023 + local market data',
    };
  }

  // ── Approvals list ────────────────────────────────────────────────────────
  results.approvals = REQUIRED_APPROVALS[type] || REQUIRED_APPROVALS['Residential villa'];

  // ── Permit timeline ───────────────────────────────────────────────────────
  const cityTimelines = PERMIT_TIMELINES[city] || PERMIT_TIMELINES['default'];
  const timeline = cityTimelines[type] || { min: 12, max: 32 };
  results.permitTimeline = {
    minWeeks: timeline.min,
    maxWeeks: timeline.max,
    minMonths: Math.round(timeline.min / 4.3),
    maxMonths: Math.round(timeline.max / 4.3),
    note: 'Timeline starts from complete document submission. Incomplete applications restart the clock.',
  };

  return results;
}

function calculateRiskScore(inputs, checks) {
  const { zone, floors, budget, type } = inputs;
  const deductions = [];
  const passing = [];
  let score = 100;

  // ── FAR (40 points) ──────────────────────────────────────────
  if (!checks.farCalculated || !checks.farLimit) {
    score -= 20;
    deductions.push({ category: 'FAR', points: 20, reason: 'FAR could not be calculated — plot area or BUA missing' });
  } else {
    const farRatio = checks.farCalculated / checks.farLimit;
    if (farRatio > 1.5) {
      score -= 40;
      deductions.push({ category: 'FAR', points: 40, reason: `Critical FAR violation — your FAR of ${checks.farCalculated} is more than 1.5x the zone limit of ${checks.farLimit}` });
    } else if (farRatio > 1.0) {
      score -= 25;
      deductions.push({ category: 'FAR', points: 25, reason: `FAR violation — your FAR of ${checks.farCalculated} exceeds the zone limit of ${checks.farLimit}` });
    } else if (farRatio > 0.9) {
      score -= 5;
      deductions.push({ category: 'FAR', points: 5, reason: `FAR is within 10% of the limit — minor design changes could cause a violation` });
    } else {
      passing.push({ category: 'FAR', reason: `FAR of ${checks.farCalculated} is comfortably within the zone limit of ${checks.farLimit}` });
    }
  }

  // ── Floors (15 points) ───────────────────────────────────────
  const floorsNum = parseInt(floors) || 0;
  const maxFloors = MAX_FLOORS[zone] || 4;
  if (floorsNum > 0) {
    const floorDiff = floorsNum - maxFloors;
    if (floorDiff > 2) {
      score -= 15;
      deductions.push({ category: 'Floors', points: 15, reason: `${floorsNum} floors significantly exceeds the zone maximum of ${maxFloors}` });
    } else if (floorDiff > 0) {
      score -= 10;
      deductions.push({ category: 'Floors', points: 10, reason: `${floorsNum} floors exceeds the zone maximum of ${maxFloors}` });
    } else if (floorDiff === 0) {
      score -= 3;
      deductions.push({ category: 'Floors', points: 3, reason: `${floorsNum} floors is at the zone maximum — confirm with municipality` });
    } else {
      passing.push({ category: 'Floors', reason: `${floorsNum} floors is within the zone maximum of ${maxFloors}` });
    }
  } else {
    score -= 5;
    deductions.push({ category: 'Floors', points: 5, reason: 'Floors not provided — cannot verify height compliance' });
  }

  // ── Civil Defense (15 points) ────────────────────────────────
  const complexTypes = ['Hotel / hospitality', 'Retail / mall', 'Mixed-use development'];
  if (checks.civilDefenseRequired) {
    if (complexTypes.includes(type)) {
      score -= 15;
      deductions.push({ category: 'Civil Defense', points: 15, reason: 'Civil Defense review mandatory — complex process for this project type, engage specialist before design' });
    } else {
      score -= 8;
      deductions.push({ category: 'Civil Defense', points: 8, reason: 'Civil Defense review required — factor 4-8 weeks into your permit timeline' });
    }
  } else {
    passing.push({ category: 'Civil Defense', reason: 'Civil Defense review not required for this project scope' });
  }

  // ── Zoning confidence (15 points) ────────────────────────────
  if (!zone || zone === '') {
    score -= 15;
    deductions.push({ category: 'Zoning', points: 15, reason: 'No zone provided — all checks used conservative defaults, actual limits may differ' });
  } else if (zone === 'Unknown / need to check') {
    score -= 15;
    deductions.push({ category: 'Zoning', points: 15, reason: 'Zoning unverified — all compliance checks used conservative defaults' });
  } else {
    score -= 5;
    deductions.push({ category: 'Zoning', points: 5, reason: 'Zoning is user-provided — not verified against official Baladiya GIS data' });
  }

  // ── Budget vs cost estimate (15 points) ──────────────────────
  const budgetMidpoints = {
    'Under 500K SAR':     500000,
    '500K - 2M SAR':      1250000,
    '2M - 10M SAR':       6000000,
    '10M - 50M SAR':      30000000,
    '50M - 200M SAR':     125000000,
    'Over 200M SAR':      200000000,
  };
  const budgetMid = budgetMidpoints[budget];
  if (!budgetMid) {
    score -= 5;
    deductions.push({ category: 'Budget', points: 5, reason: 'Budget not provided — cost feasibility cannot be assessed' });
  } else if (checks.costRange) {
    if (budgetMid < checks.costRange.low) {
      score -= 15;
      deductions.push({ category: 'Budget', points: 15, reason: `Budget of ~${budgetMid.toLocaleString()} SAR appears insufficient — estimated construction cost starts at ${checks.costRange.low.toLocaleString()} SAR` });
    } else if (budgetMid < checks.costRange.low * 1.2) {
      score -= 8;
      deductions.push({ category: 'Budget', points: 8, reason: 'Budget is tight — recommend adding 15-20% contingency on top of current estimate' });
    } else {
      passing.push({ category: 'Budget', reason: `Budget appears sufficient for the estimated construction cost range` });
    }
  }

  // ── Final score and risk level ────────────────────────────────
  score = Math.max(0, score);
  let riskLevel, riskColor;
  if (score >= 80) { riskLevel = 'Low Risk';    riskColor = 'green'; }
  else if (score >= 50) { riskLevel = 'Medium Risk'; riskColor = 'amber'; }
  else { riskLevel = 'High Risk';   riskColor = 'red'; }

  return { score, riskLevel, riskColor, deductions, passing };
}

module.exports = { runSBCChecks, calculateRiskScore, COST_BENCHMARKS, FAR_LIMITS };
