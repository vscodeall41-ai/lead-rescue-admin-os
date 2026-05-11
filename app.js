const CONTACT = {
  whatsapp: "27000000000",
  officeWhatsapp: "27000000001",
  email: "owner@example.com",
  area: "the service area",
  businessName: "the business",
  ownerName: "the owner",
};

const STORAGE_KEY = "lead-rescue-admin-os-leads-v1";

const serviceChecklists = {
  "Home service quote": [
    "Photos or a short video showing the problem or requested work area",
    "Rough measurements if size affects the quote",
    "Property access notes and parking constraints",
    "Preferred timing and whether anyone needs to be on site",
    "Any matching references, finish preferences, or must-have requirements",
    "Budget range and decision timeline",
  ],
  "Repair or call-out": [
    "Clear photos of the fault, damage, or failed part",
    "What happened and when it became urgent",
    "Whether the business or household is blocked until it is fixed",
    "Access notes, preferred call-out window, and location pin",
    "Any previous repair attempts or warranty concerns",
  ],
  "Installation project": [
    "Photos of the site from multiple angles",
    "Approximate dimensions and existing services or obstacles",
    "New installation, replacement, or upgrade",
    "Material, finish, or product preferences",
    "Target install date and approval process",
  ],
  "Event or rental booking": [
    "Event date, setup time, and collection time",
    "Venue address, access notes, and contact person on site",
    "Guest count or quantity needed",
    "Delivery, setup, staffing, and backup requirements",
    "Deposit status and decision deadline",
  ],
  "Cleaning or restoration": [
    "Photos of the item, room, or surface condition",
    "Material type and known damage or stains",
    "Desired result: refresh, deep clean, repair, or full restoration",
    "Pickup/delivery or on-site service requirement",
    "Deadline and budget sensitivity",
  ],
  "Maintenance contract": [
    "Sites, assets, or recurring tasks to cover",
    "Current pain: downtime, missed checks, complaints, or admin load",
    "Required response times and service frequency",
    "Existing supplier or maintenance history",
    "Reporting, invoice, and owner-summary requirements",
  ],
  "Custom project": [
    "Short description of the desired outcome",
    "Reference photos, sketches, links, or examples",
    "Approximate size, quantity, or scope",
    "Where the work must happen and who approves it",
    "Budget range, deadline, and any non-negotiables",
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
const briefBox = document.querySelector("#briefBox");
const quoteDraftBox = document.querySelector("#quoteDraftBox");
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
    "Home service quote": 6500,
    "Repair or call-out": 2500,
    "Installation project": 14500,
    "Event or rental booking": 9000,
    "Cleaning or restoration": 5500,
    "Maintenance contract": 18000,
    "Custom project": 12000,
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

const serviceProfiles = {
  "Home service quote": {
    scope: "Assess the requested home-service work, confirm the site conditions, and prepare a practical quote based on photos, measurements, and access details.",
    prep: "Confirm photos, measurements, property access, preferred timing, materials or finish expectations, and whether a site visit is needed.",
    exclusions: "Hidden damage, extra work discovered on site, specialist permits, municipal approvals, and material changes after approval.",
  },
  "Repair or call-out": {
    scope: "Diagnose the fault, restore safe working condition where possible, and advise whether replacement parts or a follow-up visit are needed.",
    prep: "Confirm urgency, downtime impact, access window, close-up photos, prior repair attempts, and whether the item can be safely worked on.",
    exclusions: "Parts not visible in the photos, unrelated faults, emergency after-hours surcharge, and replacement components not approved by the customer.",
  },
  "Installation project": {
    scope: "Plan and complete an installation or replacement based on site photos, dimensions, product/material choice, and agreed installation timing.",
    prep: "Confirm site dimensions, services or obstacles, access, delivery needs, finish choice, target date, and decision maker.",
    exclusions: "Electrical/plumbing alterations, structural changes, hidden substrate issues, and scope changes after the quote is accepted.",
  },
  "Event or rental booking": {
    scope: "Prepare a booking estimate for the requested event/rental items, including quantities, date, setup window, venue access, and collection needs.",
    prep: "Confirm event date, venue address, setup and collection times, quantities, delivery access, deposit status, and onsite contact.",
    exclusions: "Weather-related changes, venue restrictions not disclosed, extra delivery trips, late collection, damages, and add-ons after confirmation.",
  },
  "Cleaning or restoration": {
    scope: "Assess the item, room, or surface condition and prepare a service estimate based on material, damage level, desired result, and access.",
    prep: "Confirm photos, material type, stains or damage, pickup/delivery or onsite work, expected outcome, and deadline.",
    exclusions: "Pre-existing damage, guaranteed perfect restoration where material is compromised, undisclosed stains, and extra areas added on site.",
  },
  "Maintenance contract": {
    scope: "Scope recurring service coverage, response times, reporting expectations, and pricing for the sites/assets that need ongoing maintenance.",
    prep: "Confirm sites, recurring tasks, response time, service frequency, current pain points, reporting needs, and billing process.",
    exclusions: "Emergency work outside agreed response terms, parts/materials not included in the contract, and additional sites not listed.",
  },
  "Custom project": {
    scope: "Translate the custom request into a clear scope, assumptions, estimate band, and next-step checklist before the owner commits to a final quote.",
    prep: "Confirm reference photos, dimensions, desired outcome, budget range, deadline, approval process, and any non-negotiables.",
    exclusions: "Design revisions beyond the agreed concept, material changes, engineering/sign-off requirements, and work outside the approved brief.",
  },
  "Manual review item": {
    scope: "Hold the request for owner review before quoting, promotion, or commitment.",
    prep: "Confirm legality, safety risk, platform policy, intended use, and whether the business should accept the enquiry at all.",
    exclusions: "Automated quote, automated promotion, or any commitment before owner approval.",
  },
};

function profileFor(jobType) {
  return serviceProfiles[jobType] || serviceProfiles["Custom project"];
}

function missingEvidence(lead) {
  const missing = [];
  if (!lead.hasPhotos) missing.push("photos or video");
  if (!lead.hasMeasurements) missing.push("rough measurements");
  if (!lead.hasLocation) missing.push("exact suburb or location pin");
  if (!lead.message || !lead.message.trim()) missing.push("customer message or call summary");
  if (!lead.accessNotes || !lead.accessNotes.trim()) missing.push("site, access, or special notes");
  if (!lead.targetDate || !lead.targetDate.trim()) missing.push("target date or timing expectation");
  if (lead.budget === "Unknown") missing.push("budget range or decision threshold");
  return missing;
}

function quoteReadiness(lead) {
  if (lead.priority === "Manual review") {
    return {
      label: "Manual review",
      score: 0,
      reason: "This enquiry should not be quoted automatically.",
    };
  }

  let score = 25;
  if (lead.hasPhotos) score += 20;
  if (lead.hasMeasurements) score += 18;
  if (lead.hasLocation) score += 15;
  if (lead.message && lead.message.trim()) score += 12;
  if (lead.accessNotes && lead.accessNotes.trim()) score += 8;
  if (lead.targetDate && lead.targetDate.trim()) score += 7;
  if (lead.budget !== "Unknown") score += 10;

  const label = score >= 80 ? "Quote-ready" : score >= 58 ? "Needs owner check" : "Needs more info";
  const reason = {
    "Quote-ready": "Enough detail exists for a provisional owner-reviewed quote.",
    "Needs owner check": "The owner can draft a reply, but the final quote should wait for missing details.",
    "Needs more info": "The enquiry needs more evidence before price or timing can be trusted.",
  }[label];

  return { label, score: Math.min(score, 100), reason };
}

function estimateBand(lead) {
  if (lead.priority === "Manual review" || lead.estimate <= 0) return "Owner review required before any price guidance.";
  const readiness = quoteReadiness(lead);
  const lowMultiplier = readiness.label === "Quote-ready" ? 0.85 : 0.7;
  const highMultiplier = readiness.label === "Quote-ready" ? 1.2 : 1.45;
  const low = Math.max(500, Math.round((lead.estimate * lowMultiplier) / 100) * 100);
  const high = Math.max(low + 500, Math.round((lead.estimate * highMultiplier) / 100) * 100);
  return `${currency(low)} - ${currency(high)} subject to final scope and owner approval`;
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
  if (["Repair or call-out", "Installation project", "Maintenance contract"].includes(data.jobType)) score += 8;
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

function nextAction(lead) {
  if (lead.priority === "Manual review") return "Owner review before any quote or reply commitment.";
  const missing = missingEvidence(lead);
  if (lead.urgency === "Emergency / today") return "Call or WhatsApp now, confirm location/access, and decide if same-day service is possible.";
  if (missing.length) return `Request ${missing.slice(0, 3).join(", ")} before final quote.`;
  if (quoteReadiness(lead).label === "Quote-ready") return "Owner reviews the quote draft and sends a firm next step.";
  return "Send the reply, confirm scope, and schedule a quote follow-up.";
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

function makeIntakeBrief(lead) {
  const readiness = quoteReadiness(lead);
  const missing = missingEvidence(lead);
  const profile = profileFor(lead.jobType);

  return [
    `LEAD RESCUE INTAKE BRIEF`,
    `Captured: ${localDateStamp(new Date(lead.createdAt || Date.now()))}`,
    ``,
    `Customer`,
    `- Name: ${lead.name || "Not captured"}`,
    `- Phone/WhatsApp: ${lead.phone || "Not captured"}`,
    `- Source: ${lead.source || "Not captured"}`,
    `- Area: ${lead.area || "Not captured"}`,
    `- Property type: ${lead.propertyType || "Not captured"}`,
    ``,
    `Request`,
    `- Service type: ${lead.jobType}`,
    `- Urgency: ${lead.urgency}`,
    `- Decision stage: ${lead.decisionStage || "Not captured"}`,
    `- Target date: ${lead.targetDate || "Not captured"}`,
    `- Budget: ${lead.budget || "Unknown"}`,
    `- Estimated value: ${currency(lead.estimate)}`,
    `- Lead priority: ${lead.priority} (${lead.score}/100)`,
    `- Quote readiness: ${readiness.label} (${readiness.score}/100)`,
    ``,
    `Customer message`,
    `${lead.message || "No customer message captured."}`,
    ``,
    `Site/access notes`,
    `${lead.accessNotes || "No site/access notes captured."}`,
    ``,
    `Evidence received`,
    `- Photos/video: ${lead.hasPhotos ? "Yes" : "No"}`,
    `- Measurements: ${lead.hasMeasurements ? "Yes" : "No"}`,
    `- Exact location: ${lead.hasLocation ? "Yes" : "No"}`,
    ``,
    `Missing before final quote`,
    ...(missing.length ? missing.map((item) => `- ${item}`) : ["- Nothing obvious from the intake; owner should still verify assumptions."]),
    ``,
    `Service prep focus`,
    `- ${profile.prep}`,
    ``,
    `Recommended next action`,
    `- ${nextAction(lead)}`,
  ].join("\n");
}

function makeQuoteDraft(lead) {
  const readiness = quoteReadiness(lead);
  const missing = missingEvidence(lead);
  const profile = profileFor(lead.jobType);

  if (lead.priority === "Manual review") {
    return [
      `QUOTE DRAFT - HOLD FOR OWNER REVIEW`,
      ``,
      `This enquiry is marked for manual review. Do not send a price or promise service until the owner has checked legality, safety, and fit with the business offer.`,
      ``,
      `Owner review checklist`,
      `- Confirm the requested work is legal, safe, and within the normal service offer.`,
      `- Confirm whether the business wants to accept the enquiry.`,
      `- If accepted, request photos, intended use, location, and timing before quoting.`,
    ].join("\n");
  }

  return [
    `QUOTE DRAFT - OWNER APPROVAL REQUIRED`,
    ``,
    `Customer: ${lead.name || "Customer"}`,
    `Service: ${lead.jobType}`,
    `Area: ${lead.area || "Not captured"}`,
    `Urgency: ${lead.urgency}`,
    `Quote readiness: ${readiness.label} - ${readiness.reason}`,
    `Estimate guide: ${estimateBand(lead)}`,
    ``,
    `Customer-facing draft`,
    `Hi ${lead.name || "there"}, thanks for the details. Based on what you sent, this looks like a ${lead.jobType.toLowerCase()} request in ${lead.area || "your area"}.`,
    ``,
    `Provisional scope: ${profile.scope}`,
    ``,
    `At this stage, the estimate guide is ${estimateBand(lead)}. I still need to confirm the final details before this becomes a firm quote.`,
    ``,
    missing.length
      ? `Before I finalize it, please send: ${missing.join(", ")}.`
      : `I have the key details for an owner-reviewed quote. The next step is to confirm timing, access, and approval to proceed.`,
    ``,
    `Assumptions`,
    `- The request stays within the service type captured above.`,
    `- Site access is reasonable during the agreed time window.`,
    `- Photos, measurements, and customer notes are accurate enough for first-pass quoting.`,
    `- Any material/product choices are still subject to owner confirmation.`,
    ``,
    `Exclusions`,
    `- ${profile.exclusions}`,
    `- Extra work discovered after arrival or after final approval.`,
    `- Customer-requested changes after the quote is accepted.`,
    ``,
    `Owner approval checklist`,
    `- Confirm the estimate band is commercially sensible.`,
    `- Confirm whether this needs a site visit, call-out, pickup, or photo-based quote.`,
    `- Confirm deposit/payment terms before booking work.`,
    `- Confirm the next message can be sent to the customer.`,
  ].join("\n");
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
  const readiness = quoteReadiness(lead);
  resultMeta.textContent = `${lead.source} lead from ${lead.area || "area not captured"} | Score ${lead.score}/100 | ${readiness.label} | Estimated job value ${currency(lead.estimate)}`;
  const reply = makeReply(lead);
  replyBox.value = reply;
  briefBox.value = makeIntakeBrief(lead);
  quoteDraftBox.value = makeQuoteDraft(lead);
  whatsappLink.href = `https://wa.me/${normalizeZaPhone(lead.phone)}?text=${encodeURIComponent(reply)}`;

  quoteChecklist.innerHTML = "";
  (serviceChecklists[lead.jobType] || serviceChecklists["Custom project"]).forEach((item) => {
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
    const readiness = quoteReadiness(lead);
    card.innerHTML = `
      <div>
        <h3>${lead.name} - ${lead.jobType}</h3>
        <p>${lead.message || "No message captured yet."}</p>
        <div class="pipeline-meta">
          <span class="tag ${tagClass}">${lead.priority}</span>
          <span class="tag">${readiness.label}</span>
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
  const headers = [
    "createdAt",
    "name",
    "phone",
    "source",
    "jobType",
    "area",
    "urgency",
    "propertyType",
    "budget",
    "decisionStage",
    "targetDate",
    "score",
    "priority",
    "quoteReadiness",
    "estimate",
    "hasPhotos",
    "hasMeasurements",
    "hasLocation",
    "message",
    "accessNotes",
  ];
  const rows = [headers.join(",")].concat(
    leads.map((lead) =>
      headers
        .map((key) => {
          const value = key === "quoteReadiness" ? quoteReadiness(lead).label : lead[key];
          return `"${String(value || "").replace(/"/g, '""')}"`;
        })
        .join(",")
    )
  );
  const blob = new Blob([rows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `lead-rescue-leads-${localDateStamp()}.csv`;
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
      jobType: "Home service quote",
      area: "Northside",
      urgency: "This week",
      propertyType: "Residential",
      budget: "R7,500 - R20,000",
      decisionStage: "Waiting for quote",
      targetDate: "This week",
      message: "Need a quote for a home service job this week. We have photos and rough measurements.",
      accessNotes: "Residential driveway access. Customer is available after 16:00.",
      hasPhotos: true,
      hasMeasurements: false,
      hasLocation: true,
    },
    {
      name: "Andre",
      phone: "083 222 2222",
      source: "Referral",
      jobType: "Repair or call-out",
      area: "West End",
      urgency: "Emergency / today",
      propertyType: "Commercial",
      budget: "R2,500 - R7,500",
      decisionStage: "Ready to book",
      targetDate: "Today",
      message: "A key item failed this morning and the shop needs a same-day call-out.",
      accessNotes: "Commercial premises. Staff are onsite until 18:00 and can provide access.",
      hasPhotos: true,
      hasMeasurements: true,
      hasLocation: true,
    },
    {
      name: "Lize",
      phone: "084 333 3333",
      source: "LinkedIn",
      jobType: "Custom project",
      area: "Central",
      urgency: "This month",
      propertyType: "Residential",
      budget: "R20,000+",
      decisionStage: "Comparing options",
      targetDate: "This month",
      message: "Looking for a custom project estimate with reference photos and a flexible deadline.",
      accessNotes: "Customer wants a polished quote before booking a site visit.",
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
    "Home service quotes": {
      pain: "a job that needs a clear price before you commit",
      proof: "fast intake, the right questions, and a quote based on real site details",
      cta: "Send photos, rough measurements, and your area for a no-obligation estimate.",
    },
    "Repairs and call-outs": {
      pain: "a repair that is holding up your home or business",
      proof: "quick triage, clear next steps, and practical call-out planning",
      cta: "Send a close-up photo, your location, and how urgent it is.",
    },
    "Installation projects": {
      pain: "an installation that needs proper scoping before the team arrives",
      proof: "site details, materials, dates, and responsibilities captured up front",
      cta: "Send site photos, rough dimensions, and your target install date.",
    },
    "Event and rental bookings": {
      pain: "an event booking where missing details cause last-minute stress",
      proof: "dates, quantities, venue access, delivery, and deposit notes captured early",
      cta: "Send your event date, venue, quantity needed, and setup window.",
    },
    "Cleaning and restoration": {
      pain: "a worn, stained, or damaged item that needs the right treatment",
      proof: "condition photos, material notes, and realistic outcome expectations",
      cta: "Send photos, material details, and whether pickup or on-site service is needed.",
    },
    "Maintenance contracts": {
      pain: "recurring work that gets forgotten until it becomes expensive",
      proof: "scheduled checks, reminders, summaries, and invoice follow-through",
      cta: "Send the sites or assets to maintain and the response time you need.",
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

document.querySelector("#copyBriefBtn").addEventListener("click", async () => {
  if (!briefBox.value) return;
  await navigator.clipboard.writeText(briefBox.value);
});

document.querySelector("#copyQuoteDraftBtn").addEventListener("click", async () => {
  if (!quoteDraftBox.value) return;
  await navigator.clipboard.writeText(quoteDraftBox.value);
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
