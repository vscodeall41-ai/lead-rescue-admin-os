window.LEAD_RESCUE_PROFILES = {
  generic: {
    id: "generic",
    label: "Generic demo",
    brandMark: "LR",
    appName: "Lead Rescue Admin OS",
    subline: "Small Business Admin OS",
    heroLabel: "AI admin automation package",
    heroHeadline: "Stop losing small-business leads to slow replies and admin drift.",
    heroLead:
      "A sellable admin automation system for trades and local service businesses: capture enquiries, triage WhatsApp and email, draft quotes, chase follow-ups, recover unpaid invoices, request reviews, and send the owner a daily summary.",
    bestFit: "Local service businesses with quoting, follow-ups, invoices, and WhatsApp admin",
    configuredExample: "Local trades and service businesses with quote-heavy admin",
    packageNote:
      "The repeatable package works for welders, restorers, cleaners, landscapers, security installers, builders, venues, repair shops, and other owner-led service businesses that lose money through slow admin.",
    intakeLabel: "Configured proof case",
    contact: {
      whatsapp: "",
      officeWhatsapp: "",
      whatsappLabel: "your business WhatsApp",
      email: "owner@example.com",
      area: "the service area",
      businessName: "the business",
      ownerName: "the owner",
    },
  },
  "ras-metal-dynamics": {
    id: "ras-metal-dynamics",
    label: "Ras Metal Dynamics",
    brandMark: "RMD",
    appName: "Ras Metal Dynamics Lead Rescue",
    subline: "Steelwork Quote Admin",
    heroLabel: "Configured for Ras Metal Dynamics",
    heroHeadline: "Turn steelwork enquiries into clean quote briefs and fast WhatsApp follow-ups.",
    heroLead:
      "A tailored lead rescue workflow for welding, fabrication, gates, repairs, and premium steel feature enquiries. It captures the site details, photos, measurements, urgency, assumptions, and next message before the lead gets lost in WhatsApp.",
    bestFit: "Welding, fabrication, gate, repair, and custom steel enquiries",
    configuredExample: "Ras Metal Dynamics quote intake and follow-up workflow",
    packageNote:
      "This profile keeps the generic Lead Rescue engine, but swaps in Ras Metal Dynamics services, quote assumptions, WhatsApp contact details, and content prompts.",
    intakeLabel: "Ras Metal Dynamics proof case",
    contact: {
      whatsapp: "27612959755",
      officeWhatsapp: "27612959755",
      whatsappLabel: "+27 61 295 9755",
      email: "",
      area: "the service area",
      businessName: "Ras Metal Dynamics",
      ownerName: "Janu",
    },
    serviceOrder: [
      "Welding and fabrication",
      "Fence and gate service",
      "Premium steel features",
      "Metal repair and restoration",
      "Structural welding",
      "Custom steel project",
      "Manual review item",
    ],
    highIntentServices: [
      "Welding and fabrication",
      "Fence and gate service",
      "Premium steel features",
      "Structural welding",
    ],
    estimateBase: {
      "Welding and fabrication": 9500,
      "Fence and gate service": 14000,
      "Premium steel features": 22000,
      "Metal repair and restoration": 6500,
      "Structural welding": 18000,
      "Custom steel project": 15000,
      "Manual review item": 0,
    },
    serviceChecklists: {
      "Welding and fabrication": [
        "Clear photos or video of the part, site, break, or required fabrication",
        "Approximate dimensions, material thickness, and quantity",
        "Whether it is new work, a repair, or modification to existing steelwork",
        "Access notes, power availability, and whether work is onsite or workshop-based",
        "Finish expectation: raw, painted, powder-coated, galvanized, or premium feature finish",
        "Target date and whether the job blocks a home, site, or business",
      ],
      "Fence and gate service": [
        "Photos of the fence, gate opening, posts, hinges, track, motor area, or damage",
        "Opening width, height, slope, and rough ground condition",
        "Repair, replacement, new installation, or security upgrade",
        "Access notes for vehicles, welding equipment, and material delivery",
        "Finish, style, privacy, and security requirements",
      ],
      "Premium steel features": [
        "Reference images or style examples for the desired feature",
        "Site photos from multiple angles",
        "Approximate dimensions and where the steel feature will be fixed",
        "Finish preference and whether it must match existing interior or exterior design",
        "Decision maker, budget range, and deadline",
      ],
      "Metal repair and restoration": [
        "Close-up photos of the failed, rusted, cracked, or damaged steelwork",
        "What happened and whether the item is still safe to use",
        "Whether repair can happen onsite or must be removed",
        "Urgency, access, and operating hours",
        "Any previous repairs, coatings, or known weak points",
      ],
      "Structural welding": [
        "Photos and description of the structural member or bracket",
        "Measurements, load context, and where the work sits on the property/site",
        "Whether an engineer, builder, landlord, or body corporate must approve",
        "Access, safety constraints, and whether hot work permits are required",
        "Target date and whether the work is blocking other contractors",
      ],
      "Custom steel project": [
        "Short description of the desired item or outcome",
        "Reference photos, sketches, links, or examples",
        "Approximate dimensions, quantity, and material preference",
        "Where the work must happen and who approves it",
        "Budget range, deadline, and non-negotiables",
      ],
      "Manual review item": [
        "Do not auto-quote or promote weapons, sharpened items, unsafe novelty blades, or questionable requests",
        "Check legality, safety risk, intended use, and whether Ras Metal Dynamics should accept the enquiry",
        "Keep messaging factual and route the request to owner review",
        "Owner must approve before reply",
      ],
    },
    serviceProfiles: {
      "Welding and fabrication": {
        scope:
          "Assess and scope practical welding or fabrication work based on photos, dimensions, material, finish, site access, and whether the job is onsite or workshop-based.",
        prep:
          "Confirm material, dimensions, finish, access, power, onsite/workshop split, deadline, and whether a site visit is required before final pricing.",
        exclusions:
          "Engineering sign-off, hidden rust or fatigue, inaccessible fixing points, additional coating requirements, and scope changes after approval.",
      },
      "Fence and gate service": {
        scope:
          "Scope fence and gate repair, installation, or upgrade work from photos, opening measurements, access conditions, finish expectations, and security needs.",
        prep:
          "Confirm opening width and height, slope, posts or fixing points, motor/track issues, access, finish, and security requirements.",
        exclusions:
          "Electrical motor work unless explicitly included, hidden foundation issues, civil works, automation parts, and extra security upgrades not approved.",
      },
      "Premium steel features": {
        scope:
          "Translate the feature request into a practical design brief with site constraints, dimensions, finish, references, and owner-approved estimate assumptions.",
        prep:
          "Confirm reference images, site photos, fixing method, dimensions, finish, design approval, budget range, and deadline.",
        exclusions:
          "Architectural or engineering sign-off, major design revisions, specialist finishes not approved, and changes after final concept approval.",
      },
      "Metal repair and restoration": {
        scope:
          "Assess damaged or worn steelwork and prepare a repair path based on safety, condition photos, access, prior repairs, and finish expectations.",
        prep:
          "Confirm close-up photos, safety status, rust/crack location, onsite access, operating hours, and whether replacement is more sensible than repair.",
        exclusions:
          "Unseen internal damage, unrelated faults, replacement parts not approved, and finish matching beyond the agreed repair scope.",
      },
      "Structural welding": {
        scope:
          "Capture structural welding details for owner review before any quote, including load context, approval requirements, access, and safety constraints.",
        prep:
          "Confirm photos, measurements, load context, approval authority, access, hot-work constraints, and whether engineer or contractor sign-off is needed.",
        exclusions:
          "Engineering design, certification, permits, hidden structural issues, and any work outside owner-approved safety limits.",
      },
      "Custom steel project": {
        scope:
          "Convert a custom steel idea into a clear quote brief with reference images, dimensions, material, finish, deadline, and approval assumptions.",
        prep:
          "Confirm references, dimensions, quantity, material, finish, budget, deadline, approval process, and non-negotiables.",
        exclusions:
          "Design revisions beyond the agreed concept, engineering/sign-off requirements, unsafe items, and scope changes after approval.",
      },
    },
    contentServices: {
      "Welding and fabrication": {
        pain: "steelwork that needs a practical repair, bracket, frame, or custom fabrication",
        proof: "clear scoping, measurements, material notes, and finish expectations before work starts",
        cta: "Send photos, rough dimensions, your area, and what the steelwork must do.",
      },
      "Fence and gate service": {
        pain: "a gate or fence that needs repair, replacement, or a security upgrade",
        proof: "photos, opening measurements, access notes, and finish requirements captured before quoting",
        cta: "Send gate/fence photos, rough measurements, and your suburb for the first estimate.",
      },
      "Premium steel features": {
        pain: "a steel feature that must look good and fit the site properly",
        proof: "reference images, dimensions, site photos, and finish decisions captured up front",
        cta: "Send your reference image, site photo, rough size, and target finish.",
      },
      "Metal repair and restoration": {
        pain: "damaged, rusted, or cracked metalwork that needs a realistic repair plan",
        proof: "condition photos, safety notes, access details, and owner-reviewed repair assumptions",
        cta: "Send close-up photos, your location, and how urgent the repair is.",
      },
      "Structural welding": {
        pain: "structural welding that needs careful owner review before commitment",
        proof: "photos, measurements, approval notes, and access constraints captured before quoting",
        cta: "Send photos, measurements, and who needs to approve the work.",
      },
    },
    samples: [
      {
        name: "Marius",
        phone: "082 111 1111",
        source: "WhatsApp",
        jobType: "Fence and gate service",
        area: "Northside",
        urgency: "This week",
        propertyType: "Residential",
        budget: "R7,500 - R20,000",
        decisionStage: "Waiting for quote",
        targetDate: "This week",
        message: "Need a sliding gate repair and possible security upgrade. Photos and rough opening size available.",
        accessNotes: "Driveway access is clear. Customer is available after 16:00.",
        hasPhotos: true,
        hasMeasurements: true,
        hasLocation: true,
      },
      {
        name: "Lerato",
        phone: "082 222 2222",
        source: "Google Business",
        jobType: "Metal repair and restoration",
        area: "Westside",
        urgency: "Emergency / today",
        propertyType: "Commercial",
        budget: "R2,500 - R7,500",
        decisionStage: "Ready to book",
        targetDate: "Today",
        message: "A shop security bracket failed this morning and needs urgent repair.",
        accessNotes: "Commercial premises. Staff are onsite until 18:00 and can provide access.",
        hasPhotos: true,
        hasMeasurements: false,
        hasLocation: true,
      },
      {
        name: "Jade",
        phone: "082 333 3333",
        source: "Referral",
        jobType: "Premium steel features",
        area: "Southside",
        urgency: "This month",
        propertyType: "Residential",
        budget: "R20,000+",
        decisionStage: "Comparing options",
        targetDate: "This month",
        message: "Wants a premium steel feature for a home renovation and has reference images.",
        accessNotes: "Customer wants a polished quote before booking a site visit.",
        hasPhotos: true,
        hasMeasurements: false,
        hasLocation: true,
      },
    ],
  },
};
