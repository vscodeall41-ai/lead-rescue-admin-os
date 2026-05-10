const CONTACT = {
  whatsapp: "27655554433",
  officeWhatsapp: "27612959755",
  email: "owner@example.com",
  area: "the service area",
  businessName: "the business",
  ownerName: "the owner",
};

const STORAGE_KEY = "ras-metal-leads-v1";

const serviceChecklists = {
  "Security gate or fence": [
    "Photos of the opening, existing gate, fence line, or damaged section",
    "Width and height measurements",
    "Wall/post condition and available fixing points",
    "Security priority: access control, spikes, visibility, child/pet safety",
    "Preferred finish: raw steel, painted, galvanized, or powder-coated",
    "Site access, parking, and electricity availability",
  ],
  "Welding repair": [
    "Clear photos of the broken joint or cracked area",
    "What failed and when it failed",
    "Material type if known",
    "Whether the item can be brought to the workshop",
    "Safety risk or business downtime if not repaired quickly",
  ],
  "Custom fabrication": [
    "Sketch, reference photo, or rough idea",
    "Approximate dimensions",
    "Indoor or outdoor use",
    "Load-bearing or decorative requirement",
    "Preferred style and finish",
    "Budget range and deadline",
  ],
  "Staircase / railing": [
    "Photos of the space from multiple angles",
    "Floor-to-floor height and available footprint",
    "Safety requirements and handrail preference",
    "Indoor or outdoor exposure",
    "Finish and style reference",
  ],
  "Pergola / outdoor steelwork": [
    "Photos of the outdoor area",
    "Approximate length, width, and height",
    "Wall-mounted or freestanding structure",
    "Shade, roof, or decorative purpose",
    "Exposure to wind and rain",
  ],
  "Industrial equipment welding": [
    "Equipment type and failure point",
    "Downtime impact",
    "Material and thickness if known",
    "Access for welding and power availability",
    "Safety or compliance constraints",
  ],
  "Premium home steel feature": [
    "Room or outdoor photos",
    "Inspiration images",
    "Function: storage, divider, entertainment, fireplace, mezzanine, or feature piece",
    "Measurements and surrounding finishes",
    "Budget range and installation deadline",
  ],
  "Manual review item": [
    "Do not auto-quote or promote",
    "Check legality, platform policy, and safety risk",
    "Keep all messaging factual and route sensitive requests to owner review",
    "Owner must approve before reply",
  ],
};

const leadForm = document.querySelector("#leadForm");
const resultTitle = document.querySelector("#resultTitle");
const resultMeta = document.querySelector("#resultMeta");
const replyBox = document.querySelector("#replyBox");
const quoteChecklist = document.querySelector("#quoteChecklist");
const followupPlan = document.querySelector("#followupPlan");
const pipelineList = document.querySelector("#pipelineList");
const todayValue = document.querySelector("#todayValue");
const whatsappLink = document.querySelector("#whatsappLink");
const summaryBox = document.querySelector("#summaryBox");

function loadLeads() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveLeads(leads) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
}

function currency(value) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(value);
}

function localDateStamp(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function estimateValue(jobType, budget) {
  const base = {
    "Security gate or fence": 9500,
    "Welding repair": 2500,
    "Custom fabrication": 12000,
    "Staircase / railing": 22000,
    "Pergola / outdoor steelwork": 18000,
    "Industrial equipment welding": 8500,
    "Premium home steel feature": 26000,
    "Manual review item": 0,
  }[jobType] || 5000;

  const budgetBoost = {
    "Under R2,500": 0.45,
    "R2,500 - R7,500": 0.75,
    "R7,500 - R20,000": 1,
    "R20,000+": 1.6,
    Unknown: 0.85,
  }[budget] || 0.85;

  return Math.round(base * budgetBoost);
}

function scoreLead(data) {
  let score = 35;
  if (data.urgency === "Emergency / today") score += 25;
  if (data.urgency === "This week") score += 18;
  if (data.budget === "R20,000+") score += 18;
  if (data.budget === "R7,500 - R20,000") score += 12;
  if (data.hasPhotos) score += 10;
  if (data.hasMeasurements) score += 8;
  if (data.hasLocation) score += 6;
  if (["Security gate or fence", "Welding repair", "Industrial equipment welding"].includes(data.jobType)) score += 8;
  if (data.jobType === "Manual review item") score = 10;
  return Math.max(0, Math.min(100, score));
}

function priority(score, jobType) {
  if (jobType === "Manual review item") return "Manual review";
  if (score >= 78) return "Hot";
  if (score >= 58) return "Warm";
  return "Needs nurture";
}

function followups(lead) {
  if (lead.priority === "Manual review") {
    return [
      "Do not send an automated quote.",
      "Owner reviews legality, safety, and platform risk.",
    "If accepted, keep the reply factual and avoid automated claims until the owner approves.",
    ];
  }

  const fast = lead.urgency === "Emergency / today" || lead.urgency === "This week";
  return [
    fast ? "Reply now and ask for photos, measurements, and pin location." : "Reply within 30 minutes and confirm project scope.",
    "If no response in 3 hours, send a short follow-up with one clear question.",
    "If photos arrive, classify as repair, install, or custom quote and estimate material/site visit need.",
    "Within 24 hours, push for a site visit time or workshop drop-off arrangement.",
  ];
}

function makeReply(lead) {
  if (lead.priority === "Manual review") {
    return `Hi ${lead.name}, thanks for the enquiry. I need to review this one directly before confirming whether we can assist. Please send clear photos, your intended use, and your location. I will come back to you once I have checked the details.`;
  }

  const missing = [];
  if (!lead.hasPhotos) missing.push("clear photos");
  if (!lead.hasMeasurements) missing.push("rough measurements");
  if (!lead.hasLocation) missing.push("your suburb or pin location");

  const missingText = missing.length
    ? `Please send ${missing.join(", ")} so I can guide you properly.`
    : "I have enough to start checking the best next step.";

  const urgencyText = lead.urgency === "Emergency / today"
    ? "Because this sounds urgent, I will treat it as a priority."
    : "I can help you work out the practical next step.";

  return `Hi ${lead.name}, thanks for contacting us. We help with ${lead.jobType.toLowerCase()} in ${CONTACT.area}. ${urgencyText} ${missingText}\n\nTo quote properly, I need to confirm the size, fixing points/material, finish, and access to the site. Once I have that, I can advise whether we should quote from photos or arrange a site visit.\n\n${CONTACT.ownerName}\nWhatsApp: ${CONTACT.whatsapp}`;
}

function normalizeZaPhone(rawPhone) {
  const digits = String(rawPhone || "").replace(/[^0-9]/g, "");
  if (!digits) return CONTACT.whatsapp;
  if (digits.startsWith("27")) return digits;
  if (digits.startsWith("0") && digits.length >= 10) return `27${digits.slice(1)}`;
  return digits;
}

function leadFromForm(formData) {
  const data = Object.fromEntries(formData.entries());
  data.hasPhotos = formData.get("hasPhotos") === "on";
  data.hasMeasurements = formData.get("hasMeasurements") === "on";
  data.hasLocation = formData.get("hasLocation") === "on";
  const score = scoreLead(data);
  return {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    score,
    priority: priority(score, data.jobType),
    estimate: estimateValue(data.jobType, data.budget),
  };
}

function renderSelectedLead(lead) {
  resultTitle.textContent = `${lead.priority}: ${lead.name} - ${lead.jobType}`;
  resultMeta.textContent = `${lead.source} lead from ${lead.area || "area not captured"} | Score ${lead.score}/100 | Estimated job value ${currency(lead.estimate)}`;
  const reply = makeReply(lead);
  replyBox.value = reply;
  whatsappLink.href = `https://wa.me/${normalizeZaPhone(lead.phone)}?text=${encodeURIComponent(reply)}`;

  quoteChecklist.innerHTML = "";
  (serviceChecklists[lead.jobType] || serviceChecklists["Custom fabrication"]).forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    quoteChecklist.appendChild(li);
  });

  followupPlan.innerHTML = "";
  followups(lead).forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    followupPlan.appendChild(li);
  });
}

function renderPipeline() {
  const leads = loadLeads().sort((a, b) => b.score - a.score);
  const total = leads.reduce((sum, lead) => sum + (lead.priority === "Manual review" ? 0 : lead.estimate), 0);
  todayValue.textContent = currency(total);
  renderOwnerSummary(leads, total);

  if (!leads.length) {
    pipelineList.innerHTML = `<div class="pipeline-card"><div><h3>No saved leads yet</h3><p>Capture a new enquiry, enter an old WhatsApp/Facebook lead, or load sample leads to see the workflow.</p></div></div>`;
    return;
  }

  pipelineList.innerHTML = "";
  leads.forEach((lead) => {
    const card = document.createElement("article");
    card.className = "pipeline-card";
    const tagClass = lead.priority === "Hot" ? "hot" : lead.priority === "Warm" ? "good" : lead.priority === "Manual review" ? "warn" : "";
    card.innerHTML = `
      <div>
        <h3>${lead.name} - ${lead.jobType}</h3>
        <p>${lead.message || "No message captured yet."}</p>
        <div class="pipeline-meta">
          <span class="tag ${tagClass}">${lead.priority}</span>
          <span class="tag">${lead.source}</span>
          <span class="tag">${lead.urgency}</span>
          <span class="tag">${lead.area || "No area"}</span>
          <span class="tag">${currency(lead.estimate)}</span>
        </div>
      </div>
      <button class="score" type="button" aria-label="Open ${lead.name} lead">${lead.score}</button>
    `;
    card.querySelector("button").addEventListener("click", () => renderSelectedLead(lead));
    pipelineList.appendChild(card);
  });
}

function renderOwnerSummary(leads = loadLeads(), total = leads.reduce((sum, lead) => sum + lead.estimate, 0)) {
  const hot = leads.filter((lead) => lead.priority === "Hot");
  const warm = leads.filter((lead) => lead.priority === "Warm");
  const needsPhotos = leads.filter((lead) => !lead.hasPhotos && lead.priority !== "Manual review");
  const needsMeasurements = leads.filter((lead) => !lead.hasMeasurements && lead.priority !== "Manual review");
  const manual = leads.filter((lead) => lead.priority === "Manual review");
  const top = hot[0] || warm[0] || leads[0];

  summaryBox.value = [
    `Small business admin summary - ${localDateStamp()}`,
    ``,
    `Open lead value: ${currency(total)}`,
    `Hot leads: ${hot.length}`,
    `Warm leads: ${warm.length}`,
    `Need photos: ${needsPhotos.length}`,
    `Need measurements: ${needsMeasurements.length}`,
    `Manual review: ${manual.length}`,
    ``,
    top
      ? `Top action: Follow up ${top.name} about ${top.jobType.toLowerCase()} in ${top.area || "area not captured"}.`
      : `Top action: Capture or import old WhatsApp/Facebook enquiries.`,
    ``,
    `Admin package modules: capture, triage, quote draft, follow-up reminder, invoice chase, review request.`,
  ].join("\n");
}

function exportCsv() {
  const leads = loadLeads();
  const headers = ["createdAt", "name", "phone", "source", "jobType", "area", "urgency", "propertyType", "budget", "score", "priority", "estimate", "message"];
  const rows = [headers.join(",")].concat(
    leads.map((lead) => headers.map((key) => `"${String(lead[key] || "").replace(/"/g, '""')}"`).join(","))
  );
  const blob = new Blob([rows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `ras-metal-leads-${localDateStamp()}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function sampleLeads() {
  const samples = [
    {
      name: "Nadia",
      phone: "082 111 1111",
      source: "Facebook",
      jobType: "Security gate or fence",
      area: "Northside",
      urgency: "This week",
      propertyType: "Residential",
      budget: "R7,500 - R20,000",
      message: "Need a sliding gate repaired and maybe a new pedestrian gate. We have photos.",
      hasPhotos: true,
      hasMeasurements: false,
      hasLocation: true,
    },
    {
      name: "Andre",
      phone: "083 222 2222",
      source: "Referral",
      jobType: "Welding repair",
      area: "West End",
      urgency: "Emergency / today",
      propertyType: "Commercial",
      budget: "R2,500 - R7,500",
      message: "Shop security gate hinge broke this morning. Need urgent welding.",
      hasPhotos: true,
      hasMeasurements: true,
      hasLocation: true,
    },
    {
      name: "Lize",
      phone: "084 333 3333",
      source: "LinkedIn",
      jobType: "Premium home steel feature",
      area: "Central",
      urgency: "This month",
      propertyType: "Residential",
      budget: "R20,000+",
      message: "Looking for a custom wine storage and steel/glass divider concept.",
      hasPhotos: false,
      hasMeasurements: false,
      hasLocation: true,
    },
  ].map((data) => {
    const score = scoreLead(data);
    return {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      score,
      priority: priority(score, data.jobType),
      estimate: estimateValue(data.jobType, data.budget),
    };
  });

  saveLeads(samples);
  renderPipeline();
  renderSelectedLead(samples[0]);
}

function makePosts(service) {
  const base = {
    "Security gates and fencing": {
      pain: "a gate that sticks, a weak fence line, or an entrance that no longer feels secure",
      proof: "proper steelwork, strong fixing points, and a clean finish",
      cta: "Send photos of the opening or damaged section for a no-obligation estimate.",
    },
    "Welding repair and restoration": {
      pain: "a cracked frame, broken hinge, loose bracket, or failed weld",
      proof: "practical repair work that restores strength instead of hiding the problem",
      cta: "Send a close-up photo and your suburb so we can advise the next step.",
    },
    "Custom steel fabrication": {
      pain: "a custom steel idea that needs proper fabrication, not off-the-shelf parts",
      proof: "made-to-fit metalwork for homes, businesses, workshops, and outdoor spaces",
      cta: "Send a sketch, reference photo, and rough size for an estimate.",
    },
    "Staircases, railings, and pergolas": {
      pain: "a staircase, railing, or outdoor structure that must be strong and look good",
      proof: "steel work built around safety, durability, and the style of the space",
      cta: "Send photos of the area and approximate measurements.",
    },
    "Premium home and business steelwork": {
      pain: "a home or business space that needs a premium industrial feature",
      proof: "custom steel details for storage, dividers, entertainment areas, pergolas, and statement pieces",
      cta: "Send inspiration photos and the space dimensions to start the estimate.",
    },
  }[service];

  return [
    {
      channel: "WhatsApp Status",
      text: `Dealing with ${base.pain}? We can help with ${base.proof}. ${base.cta} WhatsApp us to start the quote process.`,
    },
    {
      channel: "Facebook post",
      text: `Need reliable service work in your area?\n\nWe handle ${service.toLowerCase()} with a focus on clear communication, practical quoting, and reliable follow-through.\n\n${base.cta}\n\nWhatsApp us to start the estimate.`,
    },
    {
      channel: "LinkedIn post",
      text: `We support residential, commercial, and industrial clients with ${service.toLowerCase()}.\n\nThe goal is simple: clear scope, practical quoting, and work completed around the real site conditions.\n\n${base.cta}`,
    },
    {
      channel: "Google Business update",
      text: `We offer ${service.toLowerCase()} for local customers. For a faster estimate, send photos, rough measurements, and your suburb by WhatsApp.`,
    },
  ];
}

function renderPosts() {
  const service = document.querySelector("#contentService").value;
  const postGrid = document.querySelector("#postGrid");
  postGrid.innerHTML = "";
  makePosts(service).forEach((post) => {
    const card = document.createElement("article");
    card.className = "post-card";
    card.innerHTML = `<h3>${post.channel}</h3><p>${post.text}</p><button class="secondary" type="button">Copy</button>`;
    card.querySelector("button").addEventListener("click", async () => {
      await navigator.clipboard.writeText(post.text);
      card.querySelector("button").textContent = "Copied";
      setTimeout(() => (card.querySelector("button").textContent = "Copy"), 1200);
    });
    postGrid.appendChild(card);
  });
}

leadForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const lead = leadFromForm(new FormData(leadForm));
  const leads = loadLeads();
  leads.unshift(lead);
  saveLeads(leads);
  renderSelectedLead(lead);
  renderPipeline();
  leadForm.reset();
});

document.querySelector("#copyReplyBtn").addEventListener("click", async () => {
  if (!replyBox.value) return;
  await navigator.clipboard.writeText(replyBox.value);
});

document.querySelector("#copySummaryBtn").addEventListener("click", async () => {
  if (!summaryBox.value) return;
  await navigator.clipboard.writeText(summaryBox.value);
});

document.querySelector("#exportBtn").addEventListener("click", exportCsv);
document.querySelector("#loadSampleBtn").addEventListener("click", sampleLeads);
document.querySelector("#generateContentBtn").addEventListener("click", renderPosts);
document.querySelector("#clearBtn").addEventListener("click", () => {
  if (confirm("Clear all saved leads in this browser?")) {
    saveLeads([]);
    renderPipeline();
  }
});

renderPipeline();
renderPosts();
