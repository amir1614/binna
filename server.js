import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const publicDir = join(root, "public");
const port = Number(process.env.PORT || 3000);
const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
const anthropicApi = "https://api.anthropic.com/v1/messages";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

const SAUDI_REGULATORY_KNOWLEDGE_BASE = `
SAUDI CONSTRUCTION REGULATORY KNOWLEDGE BASE (2024-2025)

PERMIT TIMELINES BY CITY:
- Riyadh: Building permit 45-90 days, Baladiya approval 30-60 days.
- Jeddah: Building permit 60-120 days due to stricter coastal and heritage rules.
- NEOM: Fast-tracked via NEOM Authority, 30-45 days, but requires NEOM-specific approvals.
- Dammam/Eastern Province: 45-75 days; ARAMCO proximity rules apply within 5km.
- Mecca/Medina: 90-180 days; Haram boundary restrictions and ownership/access restrictions can apply.
- Qiddiya/Red Sea Project: Giga-project authority approval required; standard Baladiya may be bypassed in some zones.

BUILDING CODE REGULATIONS (SBC - Saudi Building Code):
- Maximum height residential without elevator: 3 floors / 11.5m.
- Mandatory residential setbacks: front 5m, rear 3m, sides 2m.
- Commercial plots: FAR max 2.5 in most Riyadh districts.
- Parking requirement: minimum 1 space per 4 residential units.
- Fire safety: sprinkler systems mandatory above 4 floors.
- Earthquake zone: Western region including Jeddah and Mecca is seismic zone 2B and requires reinforced design.

REQUIRED APPROVALS BY PROJECT TYPE:
Residential villa:
- Baladiya building permit (رخصة بناء)
- Civil Defense approval (الدفاع المدني) if 3+ floors
- MOMRA zoning compliance certificate
- SEC (Saudi Electricity Company) connection approval
- Water authority (NWC) approval

Commercial building:
- All residential approvals plus municipality commercial license
- Civil Defense mandatory inspection
- GOSI registration for workers
- SASO compliance for materials

Mixed-use:
- MOMRA special permit
- Traffic impact assessment if GFA > 5000m²
- Environmental impact assessment via PME

COST BENCHMARKS (SAR per m², 2024):
- Basic residential construction: 1,200 - 1,800 SAR/m²
- Mid-range residential: 1,800 - 2,800 SAR/m²
- High-end residential: 2,800 - 5,000 SAR/m²
- Commercial standard: 2,000 - 3,500 SAR/m²
- Commercial premium: 3,500 - 6,000 SAR/m²
- Industrial/warehouse: 800 - 1,400 SAR/m²
- Hotel/hospitality: 4,000 - 9,000 SAR/m²

VISION 2030 ZONING CONTEXT:
- NEOM: 26,500 km² special economic zone with its own regulatory authority.
- Red Sea Project: tourism-first zoning, strict environmental rules, RSCPD authority.
- Qiddiya: entertainment zone, KSA Entertainment Authority oversight.
- ROSHN: residential mega-developer with pre-approved land banks in 10 cities.
- Diriyah: UNESCO heritage zone with strict aesthetic and height restrictions.

COMMON RISK FLAGS:
- Plot adjacent to mosque: 10m minimum setback required.
- Near water/coastal/wadi: Coastal Development Authority approval, 30-60 day add-on.
- Heritage district such as Diriyah or Al-Balad Jeddah: SCTH approval required, adds 60-90 days.
- Agricultural land conversion: Ministry of Environment approval, often denied.
- Airport proximity: GACA height restrictions and flight path clearance required.
- FAR exceeded: common cause of permit rejection in Riyadh.

DATA FRESHNESS:
Based on Saudi Building Code 2021 and Baladiya guidelines current as of 2024. Regulations change; critical items must be verified with the local municipality before proceeding.
`;

function sendJson(res, status, payload) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

async function readJson(req) {
  let body = "";
  for await (const chunk of req) {
    body += chunk;
    if (body.length > 24_000) throw new Error("Request body is too large.");
  }
  return JSON.parse(body || "{}");
}

function calculateDeterministicFlags(project) {
  const flags = [];
  const city = String(project.city || "");
  const details = String(project.details || "");
  const type = String(project.type || "");
  const plot = Number(project.plot || 0);
  const bua = Number(project.bua || 0);
  const floors = Number(project.floors || 0);
  const budget = parseBudgetRange(project.budget || "");

  if (plot > 0 && bua > 0 && floors > 0) {
    const far = (bua * floors) / plot;
    if (far > 2.5) {
      flags.push(`Calculated FAR of ${far.toFixed(2)} exceeds the standard 2.5 threshold used in many Saudi districts; zoning risk must be High.`);
    } else {
      flags.push(`Calculated FAR is ${far.toFixed(2)} based on BUA × floors / plot area.`);
    }
  }

  if (bua > 0 && budget) {
    const benchmark = getCostBenchmarkForType(type);
    const minimum = bua * benchmark.low;
    if (budget.high < minimum) {
      flags.push(`Budget may be insufficient. ${benchmark.label} in Saudi runs ${benchmark.low.toLocaleString()}-${benchmark.high.toLocaleString()} SAR/m², suggesting a minimum budget of ${minimum.toLocaleString()} SAR for this scope; cost risk must be High.`);
    } else if (budget.low < minimum && Number.isFinite(budget.high)) {
      flags.push(`Selected budget range overlaps the minimum expected cost. ${benchmark.label} suggests at least ${minimum.toLocaleString()} SAR for this scope; cost confidence should be Medium or Low unless verified.`);
    }
  }

  if (/jeddah/i.test(city)) flags.push("Jeddah selected: automatically account for coastal, drainage, and heritage review risk.");
  if (/neom|tabuk/i.test(city)) flags.push("NEOM/Tabuk selected: standard Baladiya workflow may not apply; NEOM Authority approvals are required.");
  if (/mecca|medina/i.test(city)) flags.push("Mecca/Medina selected: Haram boundary, access, and ownership restrictions may apply.");
  if (/mosque|مسجد/i.test(details)) flags.push("Context mentions mosque adjacency: apply 10m setback risk flag.");
  if (/coast|water|wadi|بحر|وادي/i.test(details)) flags.push("Context mentions water/coastal/wadi condition: add Coastal Development Authority or flood/drainage review risk.");
  if (/heritage|diriyah|al-balad|تراث|تاريخ/i.test(details)) flags.push("Context suggests heritage district: SCTH/heritage review can add 60-90 days.");
  if (/airport|مطار/i.test(details)) flags.push("Context mentions airport proximity: GACA height and flight path clearance may apply.");

  return flags;
}

function parseBudgetRange(value = "") {
  if (/Under 500K/i.test(value)) return { low: 0, high: 500_000 };
  if (/500K - 2M|500K – 2M/i.test(value)) return { low: 500_000, high: 2_000_000 };
  if (/2M - 10M|2M – 10M/i.test(value)) return { low: 2_000_000, high: 10_000_000 };
  if (/10M - 50M|10M – 50M/i.test(value)) return { low: 10_000_000, high: 50_000_000 };
  if (/50M - 200M|50M – 200M/i.test(value)) return { low: 50_000_000, high: 200_000_000 };
  if (/Over 200M/i.test(value)) return { low: 200_000_000, high: Number.POSITIVE_INFINITY };
  return null;
}

function getCostBenchmarkForType(type = "") {
  if (/warehouse|industrial/i.test(type)) return { label: "Industrial/warehouse", low: 800, high: 1400 };
  if (/hotel|hospitality/i.test(type)) return { label: "Hotel/hospitality", low: 4000, high: 9000 };
  if (/commercial|retail|mall|mixed-use/i.test(type)) return { label: "Commercial standard", low: 2000, high: 3500 };
  return { label: "Residential construction", low: 1200, high: 2800 };
}

function buildPrompt(project) {
  const field = (value, fallback = "not specified") => {
    if (value === undefined || value === null) return fallback;
    const text = String(value).trim();
    return text || fallback;
  };

  const deterministicFlags = calculateDeterministicFlags(project);

  return `You are a senior construction feasibility consultant specializing in Saudi Arabian regulations, Vision 2030 zoning requirements, and Baladiya (municipality) approval processes.

Analyze this project and respond ONLY with a valid JSON object. No markdown fences, no preamble, no explanation outside the JSON.

You MUST ground every timeline, approval, risk, and cost statement in this knowledge base. If the knowledge base does not contain enough information for a claim, mark the confidence as Low and tell the user to verify manually.

${SAUDI_REGULATORY_KNOWLEDGE_BASE}

Project details:
- City/Region: ${field(project.city)}
- Project type: ${field(project.type)}
- Plot area: ${project.plot ? `${field(project.plot)} m²` : "not specified"}
- Built-up area: ${project.bua ? `${field(project.bua)} m²` : "not specified"}
- Floors: ${field(project.floors)}
- Budget: ${field(project.budget)}
- Zoning: ${field(project.zone)}
- Additional context: ${field(project.details, "none")}

Deterministic validation flags from Binna's frontend/server rules engine:
${deterministicFlags.length ? deterministicFlags.map((flag) => `- ${flag}`).join("\n") : "- No deterministic flags triggered."}

Respond with this exact JSON structure:
{
  "feasibility_score": <integer 0-100>,
  "verdict": "<one of: Highly Feasible, Feasible, Proceed with Caution, High Risk, Not Recommended>",
  "summary": "<2-3 sentence plain English summary of the overall feasibility for this specific city and project type>",
  "estimated_permit_timeline": "<e.g. 3-6 months>",
  "risks": {
    "compliance": { "level": "<Low|Medium|High>", "confidence": "<Low|Medium|High>", "detail": "<1-2 sentences specific to Saudi building codes and this project type>" },
    "cost": { "level": "<Low|Medium|High>", "confidence": "<Low|Medium|High>", "detail": "<1-2 sentences about cost risks using the cost benchmarks above>" },
    "timeline": { "level": "<Low|Medium|High>", "confidence": "<Low|Medium|High>", "detail": "<1-2 sentences about timeline risks using the city permit timeline table>" },
    "zoning": { "level": "<Low|Medium|High>", "confidence": "<Low|Medium|High>", "detail": "<1-2 sentences about zoning compatibility and deterministic flags>" }
  },
  "required_approvals": [
    "<specific Saudi approval 1 with issuing authority>",
    "<specific Saudi approval 2>",
    "<specific Saudi approval 3>",
    "<specific Saudi approval 4>",
    "<specific Saudi approval 5>"
  ],
  "key_recommendations": [
    "<actionable recommendation 1 specific to this project>",
    "<actionable recommendation 2>",
    "<actionable recommendation 3>"
  ],
  "vision_2030_note": "<1 sentence on how this project relates to Vision 2030 goals or giga-projects nearby if relevant>",
  "data_freshness_note": "Based on Saudi Building Code 2021 and Baladiya guidelines current as of 2024. Regulations change — verify critical items with your local municipality before proceeding."
}`;
}

function validateProject(project) {
  const required = ["city", "type"];
  for (const key of required) {
    if (!project[key] || !String(project[key]).trim()) {
      return `${key} is required.`;
    }
  }
  return null;
}

async function handleAnalyze(req, res) {
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed." });
    return;
  }

  if (!anthropicApiKey) {
    sendJson(res, 503, {
      error: "Server is missing ANTHROPIC_API_KEY. Add it to your environment before launching publicly."
    });
    return;
  }

  try {
    const project = await readJson(req);
    const validationError = validateProject(project);
    if (validationError) {
      sendJson(res, 400, { error: validationError });
      return;
    }

    const upstream = await fetch(anthropicApi, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": anthropicApiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1800,
        system: `Use only the supplied Saudi regulatory knowledge base plus project facts. Do not invent regulations. Include confidence for every risk dimension. If Binna deterministic flags conflict with a softer qualitative assessment, the deterministic flag wins.`,
        messages: [{ role: "user", content: buildPrompt(project) }]
      })
    });

    if (!upstream.ok) {
      const detail = await upstream.text();
      sendJson(res, upstream.status, { error: "Anthropic request failed.", detail });
      return;
    }

    const data = await upstream.json();
    const text = data.content?.map((item) => item.text || "").join("") || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const result = JSON.parse(clean);
    sendJson(res, 200, { result });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Analysis failed." });
  }
}

async function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const requestedPath = url.pathname === "/" ? "/index.html" : url.pathname;
  const safePath = normalize(decodeURIComponent(requestedPath)).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(publicDir, safePath);

  if (!filePath.startsWith(publicDir) || !existsSync(filePath)) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  const ext = extname(filePath);
  const content = await readFile(filePath);
  res.writeHead(200, {
    "content-type": mimeTypes[ext] || "application/octet-stream",
    "cache-control": "no-store"
  });
  res.end(content);
}

const server = createServer(async (req, res) => {
  if (req.url?.startsWith("/api/analyze")) {
    await handleAnalyze(req, res);
    return;
  }

  await serveStatic(req, res);
});

server.listen(port, () => {
  console.log(`Binna running at http://localhost:${port}`);
});
