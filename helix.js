/* The Strand: work items ride a DNA helix; each node opens a full case study with a movable proof board. */
(() => {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const P = "assets/proof/";

  /* ================= content ================= */
  const GROUPS = {
    exp: { label: "Experience", color: "76,245,200" },
    res: { label: "Research", color: "170,140,255" },
    bld: { label: "Builds", color: "90,190,255" },
    cred: { label: "Credentials", color: "242,207,138" },
  };

  const NODES = [
    {
      g: "exp", flag: true, title: "Mercor · Odin", sub: "Trusted QA reviewer",
      role: "Trusted QA Reviewer", where: "Mercor · Project Odin, Phase 3", period: "Oct 2026 – present",
      summary: "Project Odin produces computer-use training data: experts record themselves completing real software tasks while narrating every action. I work at the quality gate. Each submission is audited against a multi-item tolerance checklist before it reaches the client, and a single failing item sends it back.",
      results: [
        { v: "80+", l: "review units in the first three weeks" },
        { v: "<45 min", l: "average handling time, inside the 45-minute target" },
        { v: "6 in 10", l: "submissions returned with written corrections" },
        { v: "Trusted", l: "reviewer tier, plus the top-performer incentive" },
      ],
      did: [
        "Audit screen recordings, narration, deliverable files and metadata against the Phase 3 reviewer checklist (1 ideal · 2 within tolerance · 3 failing).",
        "Enforce measurable standards: window occlusion limits, narration that states what, where and why for each action, workflow completeness, PII exposure and audio quality.",
        "Fix metadata directly when it is the only defect, so that sound work is not delayed.",
        "Return failing tasks with item-referenced feedback that tells the writer exactly what to change.",
      ],
      proofs: [
        { src: "odin-performance.png", cap: "Reviewer performance dashboard: review volume, handling time against target, and approval rate." },
        { src: "odin-contract.png", cap: "Odin reviewer contract: identity verified, background check passed." },
      ],
      tags: ["Agent trajectory review", "QA checklists", "Contributor feedback", "PII review", "Computer-use data"],
    },
    {
      g: "exp", title: "Mercor · Feather", sub: "Expert design grader",
      role: "Expert Design Grader", where: "Mercor · enterprise design-evaluation project (Feather platform)", period: "Jul 2026",
      summary: "An enterprise client needed expert judgment on AI-generated slide decks. Each task paired a written brief with several generated decks. My job was to grade them against the brief and defend every score in writing, under a 45-minute clock.",
      results: [
        { v: "6", l: "task types graded" },
        { v: "1–7", l: "forced-spread scale, no unsupported ties" },
        { v: "45 min", l: "per task, under strict quality rules" },
        { v: "22k", l: "characters in my own grading manual" },
      ],
      did: [
        "Graded aesthetic ranking, design-instruction following, style matching, template following, deck completion and content quality.",
        "Built the checklist from the brief before opening any deck, so the specification set the bar rather than first impressions.",
        "Wrote a rationale for every instruction, marking it met or not met with slide-level evidence, then justified the overall score and ranking.",
        "Kept a personal grading manual and recalibrated it after reviewer feedback.",
      ],
      proofs: [{ src: "feather-contract.jpg", cap: "Mercor expert hourly contract, starting July 2026." }],
      note: "Task screens are covered by the client's confidentiality terms and are not shown.",
      tags: ["Rubric grading", "Preference ranking", "Written rationales", "Design evaluation"],
    },
    {
      g: "exp", title: "micro1 · Titan Proton", sub: "Robotics video data",
      role: "Expert Annotator, Robotics Video", where: "micro1 · Project Titan Proton", period: "Sep – Oct 2026",
      summary: "Training data for embodied AI. Robots learn from video, so the footage has to be labelled precisely: which motion advances the task, and which motion is wasted.",
      results: [
        { v: "100%", l: "on certification quiz 1" },
        { v: "100%", l: "on certification quiz 2" },
        { v: "2", l: "paid pay periods" },
      ],
      did: [
        "Annotated robotics task footage with interval-level tags.",
        "Flagged idleness and unproductive motion lasting longer than three seconds, and tracked task progress.",
        "Completed the project certification course before taking production work.",
      ],
      proofs: [{ src: "micro1-pay.png", cap: "micro1 pay history for Project Titan Proton, September–October 2026." }],
      tags: ["Video annotation", "Temporal tagging", "Embodied AI"],
    },
    {
      g: "exp", title: "Labelbox / Alignerr", sub: "Voice-agent red-teamer",
      role: "Voice-Agent & Function-Calling Evaluator", where: "Labelbox · AVA Front Desk, Human eval v2", period: "Oct 2026",
      summary: "Human evaluation of an AI receptionist for a medical clinic. Two questions: does it call the right tool at the right moment, and does it hold up when someone tries to misuse it?",
      results: [
        { v: "4", l: "function-call types timed and labelled" },
        { v: "2", l: "adversarial probes: safety refusal and prompt injection" },
        { v: "SME", l: "qualified as Biology Subject Matter Expert on Alignerr" },
      ],
      did: [
        "Ran scripted calls and labelled the ideal moment for each tool call: patient lookup, identity verification with two identifiers, appointment retrieval and slot search.",
        "Tested the agent's refusals with an unsafe request, and its boundaries with a prompt-injection attempt aimed at its system prompt.",
        "Corrected transcripts and classified each outcome.",
        "Separately qualified on Alignerr as a Biology Subject Matter Expert after ID verification.",
      ],
      proofs: [{ src: "alignerr-biology-sme.jpg", cap: "Alignerr: qualified as Biology Subject Matter Expert, AI Content Specialist." }],
      note: "Evaluation instructions are confidential and are not shown.",
      tags: ["Function calling", "Voice agents", "Red-teaming", "Prompt injection", "Clinical workflows"],
    },
    {
      g: "exp", title: "Outlier · Scale AI", sub: "Medical & multilingual",
      role: "AI Evaluator, Medical Expert & Italian Multilingual", where: "Outlier (Scale AI)", period: "Dec 2025 – Nov 2026",
      summary: "Outlier supplies human training data to frontier AI labs. I worked across medical-expert, generalist and multilingual projects under the Clinical Medicine skill, writing the prompts that expose model failures and judging the responses.",
      results: [
        { v: "8+", l: "projects across medical, generalist and multilingual work" },
        { v: "$31.85/h", l: "expert deliverable rate on medical projects" },
        { v: "Passed", l: "Clinical Medicine assessment" },
      ],
      did: [
        "White Coat: wrote natural STEM and clinical prompts, then rated and ranked model responses.",
        "Almanac: wrote research-based prompts with verifiable answers, designed to make advanced models fail.",
        "Galaxy Speech: tested models over long multi-turn conversations to document failure patterns.",
        "Aether and Multimango: Italian-language evaluation and speech-recognition test sets.",
        "Sixth Sense, Mime Orchard, Cribbage Tail: attempter and reviewer work, with access gated by quality score.",
      ],
      proofs: [
        { src: "outlier-projects.png", cap: "Project history: White Coat, Almanac and Galaxy Speech under the Clinical Medicine skill." },
        { src: "outlier-whitecoat.png", cap: "White Coat: STEM prompt writing and preference ranking." },
        { src: "outlier-task-submitted.png", cap: "A submitted medical-expert task: 2 h 56 min, paid at the expert rate." },
        { src: "outlier-almanac.png", cap: "Almanac: research-based prompts built to challenge advanced models." },
        { src: "outlier-almanac-rate.png", cap: "Almanac task at the expert rate." },
        { src: "outlier-skills.png", cap: "Skills profile, including Clinical Medicine." },
      ],
      note: "Task content is covered by Outlier's confidentiality terms; only dashboards and project pages are shown.",
      tags: ["RLHF", "Preference ranking", "Medical review", "Adversarial prompts", "Italian"],
    },
    {
      g: "exp", title: "Ermis", sub: "Audio transcription",
      role: "Audio Transcription & Labelling", where: "Ermis", period: "Aug 2026",
      summary: "Speech data for model training, transcribed to a strict house style.",
      results: [{ v: "4", l: "training modules completed before production" }],
      did: [
        "Applied spoken-form rules, backchannel and non-lexical tags, and clip-level labels.",
        "Handled overlapping speakers and recorded speaker metadata.",
      ],
      proofs: [],
      note: "Project materials are confidential. Verification is available on request.",
      tags: ["Transcription", "Audio labelling", "Style-guide compliance"],
    },

    {
      g: "res", flag: true, title: "Genesis", sub: "Artificial life",
      role: "Principal Investigator", where: "Independent research · private repository", period: "2026 – present",
      summary: "An artificial-life programme built around a single question: what behaviour emerges when an agent has something real to lose? Single-cell agents can die, and there is no fitness function telling them what to want. I run it the way a clinical trial is run: experiments are pre-registered, every effect is checked against a null baseline, and ablations are powered before anything is claimed.",
      results: [
        { v: "−33%", l: "divisions per life when fear is ablated (n = 60 per condition)" },
        { v: "88%", l: "of my own headline metric shown to be an artifact, and corrected" },
        { v: "455", l: "automated tests" },
        { v: "Pre-reg", l: "experiments committed before the runs" },
      ],
      did: [
        "Designed the simulation: metabolism, receptors, reflexes, reproduction and death, with no reward signal.",
        "Built null baselines (frozen, deaf, and deaf-and-still agents) to separate real behaviour from measurement artifacts.",
        "Reversed an early null result once the sample size was adequate, and kept both passes visible in the findings.",
        "Pre-registered each experiment, with arms, seeds and the decision rule fixed before launch.",
      ],
      proofs: [
        { src: "genesis-findings.png", cap: "FINDINGS.md: the null baseline that showed most of the raw chemotaxis score was an artifact." },
        { src: "genesis-prereg.png", cap: "A pre-registration, written and committed before the runs were launched." },
      ],
      verify: [{ label: "Private repository · access on request" }],
      note: "Unpublished. A framework paper is in preparation.",
      tags: ["Experimental design", "Ablation studies", "Null baselines", "Agent simulation", "Python"],
    },
    {
      g: "res", flag: true, title: "NeoResist-MD", sub: "Computational oncology",
      role: "Founder & Lead Researcher", where: "Independent computational oncology", period: "2026 – present",
      summary: "NeoResist-MD looks for better ways to rank tumour neoantigens, the targets of personalised cancer vaccines. Its discovery engine searched tens of thousands of interpretable ranking formulas, and a machine-enforced gate decides which results are allowed to become claims.",
      results: [
        { v: "27k+", l: "strategy evaluations by the discovery engine" },
        { v: "9", l: "cancer contexts searched" },
        { v: "0", l: "claims promoted without the evidence to support them" },
      ],
      did: [
        "Built the full pipeline: mutation upload, peptide generation, MHC presentation scoring, ranking and per-case provenance.",
        "Designed a claim-tiered evidence system (discovery, held-out, support-only) with an audit trail for every result.",
        "Built the dashboard used to inspect cohorts, module status and ranked candidates.",
        "Audited my own manuscript to an editor's standard and withdrew results that did not survive.",
      ],
      proofs: [
        { src: "neoresist-1.png", cap: "Pipeline run with the ranked candidate list." },
        { src: "neoresist-2.png", cap: "Module stack and strategy profile." },
        { src: "neoresist-3.png", cap: "Cohort overview: mutations versus mean priority per patient." },
        { src: "neoresist-4.png", cap: "Evidence panel (ResistanceLoop) for a ranked candidate." },
        { src: "neoresist-5.png", cap: "Pipeline waterfall and cohort module heatmap." },
        { src: "gh-neoresist-md.png", cap: "Public repository on GitHub." },
      ],
      verify: [{ label: "github.com/Adnan-shamim-dar/neoresist-md", href: "https://github.com/Adnan-shamim-dar/neoresist-md" }],
      tags: ["Python", "Immuno-oncology", "MHCflurry", "Evaluation design", "Reproducibility"],
    },

    {
      g: "bld", flag: true, title: "Tandem", sub: "Private AI runtime",
      role: "Creator & Sole Engineer", where: "Independent build", period: "Nov 2026",
      summary: "Tandem runs open language models on hardware you already own, behind an authenticated OpenAI-compatible API. It can pool the memory of a laptop, a phone and a tablet to run a model too large for any one of them. There is no cloud account, no hidden fallback and no telemetry.",
      results: [
        { v: "~50", l: "tokens per second on an integrated laptop GPU" },
        { v: "24 ms", l: "median time to first token" },
        { v: "18k+", l: "lines across Windows, Android and iOS" },
        { v: "90+", l: "automated checks, including a 47-step end-to-end suite" },
      ],
      did: [
        "Built the gateway, the OpenAI-compatible API (streaming chat completions) and the control-room UI.",
        "Designed encrypted pairing with single-use six-digit codes, X25519 and HKDF key exchange, mutual HMAC proofs and AES-256-GCM transport.",
        "Implemented pool mode: model layers are split across devices in proportion to their free memory, and devices never open a port.",
        "Wrote native Android (Kotlin) and iOS (Swift) workers and a measured router that explains every placement decision.",
      ],
      proofs: [
        { src: "tandem-home.png", cap: "Control room: local inference through the same API that external clients use." },
        { src: "tandem-devices.png", cap: "Device trust: pairing codes, signed challenges and encrypted transport." },
      ],
      verify: [{ label: "Source private · live demo on request" }],
      tags: ["TypeScript", "Kotlin", "Swift", "llama.cpp", "Applied cryptography"],
    },
    {
      g: "bld", title: "refusal-gate", sub: "AI safety · open source",
      role: "Creator", where: "Open source", period: "Nov 2026",
      summary: "No source, no claim. A small Python gate that makes a language model refuse a health question unless real PubMed papers that actually study the question support the answer.",
      results: [
        { v: "2", l: "relevant papers required by default before answering" },
        { v: "0", l: "citations allowed from outside the retrieved evidence" },
      ],
      did: [
        "Fetches abstracts through NCBI E-utilities, prioritising reviews, meta-analyses and trials.",
        "Uses an LLM judge to keep only the papers that genuinely study the question.",
        "Refuses with a stated reason when evidence is thin, and rejects drafts that cite papers outside the evidence.",
        "Works with any model through a single function interface; the CLI supports JSON output.",
      ],
      proofs: [{ src: "gh-refusal-gate.png", cap: "Public repository on GitHub." }],
      verify: [{ label: "github.com/Adnan-shamim-dar/refusal-gate", href: "https://github.com/Adnan-shamim-dar/refusal-gate" }],
      tags: ["Python", "Retrieval", "LLM-as-judge", "Medical AI safety"],
    },
    {
      g: "bld", title: "MedViva", sub: "AI oral examiner",
      role: "Product Designer & Builder", where: "Independent build", period: "2026",
      summary: "An AI oral-examination simulator for medical students, built around how European vivas actually feel: the examiner interrupts, pushes and scores.",
      results: [{ v: "2", l: "modes: practice and exam" }],
      did: [
        "Generates structured clinical questions by topic and difficulty.",
        "Interrupts long answers mid-explanation, the way real examiners do.",
        "Scores each answer against a rubric and explains what was missing.",
        "Ingests study material from PDFs.",
      ],
      proofs: [
        { src: "medviva-1.png", cap: "Practice and exam modes." },
        { src: "medviva-2.png", cap: "Question library with difficulty tags." },
        { src: "medviva-3.png", cap: "Uploading study material." },
      ],
      tags: ["LLM applications", "Rubric scoring", "Medical education"],
    },
    {
      g: "bld", title: "VivaMed Access", sub: "Hackathon",
      role: "Builder", where: "AccessED Hacks 2026", period: "Oct 2026",
      summary: "Health explainers designed for people on slow connections and in other languages.",
      results: [{ v: "Low-data", l: "pages built for slow connections" }],
      did: [
        "Multilingual health explainers that load on low bandwidth.",
        "Sources and an AI-assistance disclosure on every page.",
      ],
      proofs: [{ src: "gh-vivamed-access.png", cap: "Public repository on GitHub." }],
      verify: [{ label: "github.com/Adnan-shamim-dar/vivamed-access", href: "https://github.com/Adnan-shamim-dar/vivamed-access" }],
      tags: ["Accessibility", "Multilingual", "Health communication"],
    },
    {
      g: "bld", title: "Data & signals", sub: "CGM · ECG · radiology",
      role: "Analyst", where: "Coursework and independent projects", period: "2025 – 2026",
      summary: "Biomedical data work: glucose prediction, ECG signal processing and a review of clinical AI adoption.",
      results: [{ v: "3", l: "projects" }],
      did: [
        "CGM: glucose prediction from anonymised continuous-monitor data, with R scripts, metrics and confusion matrices.",
        "ECG: 6th-order Butterworth filtering at 200 Hz in MATLAB, comparing zero-phase and causal filters with spectra before and after.",
        "Radiology: a structured review of how far AI has actually been implemented in clinical practice.",
      ],
      proofs: [
        { src: "gh-cgm-_predictionmodels.png", cap: "CGM prediction models, public on GitHub." },
        { src: "matlab-ecg-lab.jpg", cap: "MATLAB lab brief: ECG denoising with Butterworth filters." },
      ],
      verify: [{ label: "github.com/Adnan-shamim-dar/cgm-_predictionmodels", href: "https://github.com/Adnan-shamim-dar/cgm-_predictionmodels" }],
      tags: ["MATLAB", "R", "Signal processing", "Statistics"],
    },

    {
      g: "cred", flag: true, title: "MD · UNIVPM", sub: "Medicine & Surgery",
      role: "MD Candidate, Medicine & Surgery (LM-41)", where: "Università Politecnica delle Marche, Ancona", period: "2023 – 2029",
      summary: "Medicine is the hardest domain to fake. Clinical training is why I can tell when a model's answer would hurt someone, not just when it is wrong.",
      results: [
        { v: "104th", l: "worldwide on the IMAT admission exam" },
        { v: "ERDIS", l: "fully funded merit scholarship" },
        { v: "Year 4", l: "of 6" },
      ],
      did: [
        "Coursework across anatomy, physiology, pathology, microbiology, immunology and clinical semeiotics.",
        "Biomedical physics, signal processing and statistics.",
        "Completed high-risk healthcare safety training for clinical settings.",
      ],
      proofs: [
        { src: "../portrait.jpg", cap: "At the Faculty of Medicine and Surgery, UNIVPM." },
        { src: "cert-univpm-safety.png", cap: "UNIVPM high-risk healthcare safety certificate (personal ID redacted)." },
      ],
      tags: ["Clinical medicine", "Pathology", "Immunology"],
    },
    {
      g: "cred", title: "Certifications", sub: "Verified",
      role: "Certifications & qualifications", where: "Verifiable records", period: "2023 – 2026",
      summary: "The paper trail behind the work.",
      results: [{ v: "4", l: "certifications and qualifications" }],
      did: [
        "Mercor · Introduction to Agents: AI agent evaluation (2026).",
        "Alignerr · Biology Subject Matter Expert (2026).",
        "UNIVPM · High-risk healthcare health and safety, 12 hours (2026).",
        "Google · Foundations of User Experience Design, Coursera (2023).",
      ],
      proofs: [
        { src: "alignerr-biology-sme.jpg", cap: "Alignerr: Biology Subject Matter Expert." },
        { src: "cert-univpm-safety.png", cap: "UNIVPM high-risk healthcare safety (personal ID redacted)." },
        { src: "cert-google-ux.png", cap: "Google: Foundations of UX Design." },
      ],
      verify: [
        { label: "Mercor certificate MRC-2026-H2D5H9QV", href: "https://work.mercor.com/learn/verify/MRC-2026-H2D5H9QV" },
        { label: "Coursera certificate AV5GNKGK3N6E", href: "https://coursera.org/verify/AV5GNKGK3N6E" },
      ],
      tags: ["AI agent evaluation", "Biology", "Clinical safety"],
    },
    {
      g: "cred", title: "Five languages", sub: "IELTS 8.5",
      role: "Languages", where: "Multilingual evaluation", period: "",
      summary: "I evaluate AI in more than one language, and I have done paid Italian-locale work.",
      results: [
        { v: "8.5", l: "IELTS Academic, English" },
        { v: "IT", l: "Italian, used on Italian-locale AI projects" },
        { v: "+3", l: "Arabic, Hindi, Urdu" },
      ],
      did: ["English: IELTS Academic 8.5.", "Italian: B2, and working language for my medical degree.", "Arabic, Hindi and Urdu: fluent."],
      proofs: [],
      note: "Italian-locale work appears in the Outlier case study.",
      tags: ["Multilingual evaluation", "Localisation"],
    },
    {
      g: "cred", flag: true, title: "Let's talk", sub: "Open to roles", contact: true,
      role: "Open to work", where: "Remote · CET", period: "",
      summary: "If your model gives medical answers, I'm the person you want reading them first. I'm open to reviewer-lead, QA, human-data and AI research roles.",
      results: [], did: [], proofs: [], tags: [],
    },
  ];

  /* ================= helix (outer view) ================= */
  const $ = (id) => document.getElementById(id);
  const back = $("back"), front = $("front"), bctx = back.getContext("2d"), fctx = front.getContext("2d");
  const layerBack = $("nodes-back"), layerFront = $("nodes-front"), space = $("space");
  const PERSP = 1600;
  let W, H, dpr, R, L, S, CX, RATE, LITE = false;
  let offset = 0, spin = 0, hoverSlow = 1, last = performance.now();
  const spinSpeed = 0.00028;
  const caseEl = $("case");

  const els = NODES.map((n, i) => {
    const mk = (layer) => {
      const b = document.createElement("button");
      b.className = `node g-${n.g}${n.flag ? " flag" : ""}`;
      b.innerHTML = `<span class="nd"></span><span class="nt"><b>${n.title}</b><small>${n.sub}</small></span>`;
      if (layer === layerBack) { b.tabIndex = -1; b.setAttribute("aria-hidden", "true"); }
      else {
        b.setAttribute("aria-label", `${n.title}: ${n.sub}. Open case study`);
        b.addEventListener("click", () => openCase(i, b));
        b.addEventListener("mouseenter", () => (hoverSlow = 0.08));
        b.addEventListener("mouseleave", () => (hoverSlow = 1));
        b.addEventListener("focus", () => scrollToNode(i));
      }
      layer.appendChild(b); return b;
    };
    return { f: mk(layerFront), b: mk(layerBack) };
  });

  const groupsNav = $("groups");
  const groupBtns = Object.entries(GROUPS).map(([key, g]) => {
    const first = NODES.findIndex((n) => n.g === key);
    const count = NODES.filter((n) => n.g === key).length;
    const b = document.createElement("button");
    b.style.setProperty("--c", `rgb(${g.color})`);
    b.innerHTML = `<i></i><span>${g.label}</span><em>${String(count).padStart(2, "0")}</em>`;
    b.addEventListener("click", () => scrollToNode(first));
    groupsNav.appendChild(b);
    return { key, b };
  });

  const layout = () => {
    W = window.innerWidth; H = window.innerHeight;
    const small = W < 760;
    LITE = small || (navigator.hardwareConcurrency || 8) <= 4;
    dpr = Math.min(window.devicePixelRatio || 1, LITE ? 1.25 : 2);
    for (const c of [back, front]) { c.width = W * dpr; c.height = H * dpr; c.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0); }
    R = small ? W * 0.27 : Math.min(W * 0.13, 220);
    L = R * 2 * 1.6;
    // consecutive nodes alternate strands; a 0.3-turn rise per node puts each next chip ~72° further round,
    // so chips spiral around both sides instead of stacking on one
    S = Math.max(small ? 96 : 120, L * 0.3);
    CX = small ? W * 0.5 : W * 0.34 + (W - W * 0.34) * 0.5 - 10;
    RATE = 0.75;
    space.style.height = ((NODES.length - 1) * S) / RATE + H + "px";
  };
  const nodeY = (i) => i * S;
  const scrollToNode = (i) => window.scrollTo({ top: nodeY(i) / RATE, behavior: reduce ? "auto" : "smooth" });

  const at = (y, s) => {
    const th = (2 * Math.PI * y) / L + spin + (s ? Math.PI : 0);
    const x = R * Math.sin(th), z = R * Math.cos(th), k = PERSP / (PERSP - z);
    return { sx: CX + x * k, sy: H / 2 + (y - offset) * k, z, side: Math.sin(th) };
  };

  const drawStrands = () => {
    bctx.clearRect(0, 0, W, H); fctx.clearRect(0, 0, W, H);
    const y0 = offset - H / 2 - 60, y1 = offset + H / 2 + 60;
    const rung = LITE ? 22 : 18;
    bctx.lineWidth = 1;
    for (let y = Math.floor(y0 / rung) * rung; y <= y1; y += rung) {
      const a = at(y, 0), b = at(y, 1);
      bctx.strokeStyle = `rgba(83,218,228,${(0.07 + 0.08 * (1 + Math.max(a.z, b.z) / R) / 2).toFixed(3)})`;
      bctx.beginPath(); bctx.moveTo(a.sx, a.sy); bctx.lineTo(b.sx, b.sy); bctx.stroke();
    }
    for (let s = 0; s < 2; s++) {
      const col = s ? "90,190,255" : "76,245,200";
      let prev = at(y0, s);
      const segs = LITE ? 9 : 5;
      for (let y = y0 + segs; y <= y1; y += segs) {
        const q = at(y, s), depth = (1 + (q.z + prev.z) / (2 * R)) / 2;
        const ctx = q.z >= 0 ? fctx : bctx;
        ctx.strokeStyle = `rgba(${col},${0.12 + 0.6 * depth})`;
        ctx.lineWidth = 0.8 + 2.4 * depth;
        ctx.beginPath(); ctx.moveTo(prev.sx, prev.sy); ctx.lineTo(q.sx, q.sy); ctx.stroke();
        prev = q;
      }
    }
  };

  let activeGroup = "";
  const placeNodes = () => {
    let nearest = 0, nd = 1e9;
    NODES.forEach((n, i) => {
      const p = at(nodeY(i), i % 2);
      const depth = (1 + p.z / R) / 2;
      const { f, b } = els[i];
      const isFront = p.z >= 0, show = isFront ? f : b, hide = isFront ? b : f;
      hide.style.visibility = "hidden";
      if (p.sy < -60 || p.sy > H + 60) { show.style.visibility = "hidden"; return; }
      show.style.visibility = "visible";
      const flip = p.side < 0;
      show.classList.toggle("flip", flip);
      const scale = (n.flag ? 0.92 : 0.82) + 0.3 * depth;
      const w = (show._w ||= show.offsetWidth || 150) * scale;
      let left = flip ? p.sx - w + 15 * scale : p.sx - 15 * scale;
      left = Math.max(8, Math.min(W - w - 8, left));            // never run off the screen edge
      show.style.transform = `translate(${left.toFixed(1)}px, ${p.sy.toFixed(1)}px) translateY(-50%) scale(${scale.toFixed(3)})`;
      show.style.opacity = (0.28 + 0.72 * depth).toFixed(3);
      if (!LITE) show.style.filter = depth < 0.4 ? `blur(${((0.4 - depth) * 4).toFixed(2)}px)` : "none";
      show.style.zIndex = String(Math.round(depth * 100));
      const dc = Math.abs(p.sy - H / 2);
      if (dc < nd) { nd = dc; nearest = i; }
    });
    const g = NODES[nearest].g;
    if (g !== activeGroup) { activeGroup = g; groupBtns.forEach(({ key, b }) => b.classList.toggle("on", key === g)); }
  };

  const hero = $("hero"), hint = $("hint");
  let lastDraw = 0;
  const tick = (now) => {
    if (LITE && now - lastDraw < 33) { requestAnimationFrame(tick); return; }
    lastDraw = now;
    const dt = Math.min(64, now - last); last = now;
    const target = window.scrollY * RATE;
    offset += (target - offset) * (reduce ? 1 : 0.14);
    if (caseEl.hidden) {
      if (!reduce) spin += spinSpeed * hoverSlow * dt + (target - offset) * 0.0006;
      drawStrands(); placeNodes();
    }
    hero.classList.toggle("dim", window.scrollY > 120);
    hint.style.opacity = window.scrollY > 60 ? "0" : "1";
    requestAnimationFrame(tick);
  };

  /* ================= case study ================= */
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  let current = -1, lastFocus = null;
  const board = $("board");

  const openCase = (i, from) => {
    current = (i + NODES.length) % NODES.length;
    const n = NODES[current], g = GROUPS[n.g];
    if (from) lastFocus = from;
    caseEl.style.setProperty("--c", `rgb(${g.color})`);
    viewer.style.setProperty("--c", `rgb(${g.color})`);
    $("cs-crumb").innerHTML = `${g.label} / <b>${esc(n.title)}</b>`;
    $("cs-kicker").textContent = g.label + (n.flag && n.g !== "cred" ? " · Flagship" : "");
    $("cs-title").textContent = n.title;
    $("cs-meta").innerHTML = `${esc(n.role)}${n.where ? ` <span>· ${esc(n.where)}</span>` : ""}${n.period ? ` <span>· ${esc(n.period)}</span>` : ""}`;
    $("cs-summary").textContent = n.summary;
    $("cs-results").innerHTML = n.results.map((r) => `<li><b>${esc(r.v)}</b><span>${esc(r.l)}</span></li>`).join("");
    $("cs-results").hidden = !n.results.length;

    const text = caseEl.querySelector(".cs-text");
    if (n.contact) {
      text.innerHTML = `<h3>Get in touch</h3><div class="cs-contact">
        <a class="primary" href="mailto:dar.adnan.54@gmail.com">dar.adnan.54@gmail.com</a>
        <a href="cv/Adnan_Shamim_Dar_CV.pdf">Download CV (PDF)</a>
        <a href="https://www.linkedin.com/in/adnan-shamim-dar-85664b230/" target="_blank" rel="noreferrer">LinkedIn ↗</a>
        <a href="https://github.com/Adnan-shamim-dar" target="_blank" rel="noreferrer">GitHub ↗</a>
        <a href="classic.html">Classic portfolio</a></div>`;
    } else {
      text.innerHTML = `<h3>What I did</h3><ul class="cs-did">${n.did.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>`
        + (n.verify ? `<h3>Verify</h3><ul class="cs-verify">${n.verify.map((v) => v.href
          ? `<li><a href="${v.href}" target="_blank" rel="noreferrer">${esc(v.label)}</a></li>`
          : `<li><span>${esc(v.label)}</span></li>`).join("")}</ul>` : "")
        + (n.tags.length ? `<h3>Skills</h3><ul class="cs-tags">${n.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : "");
    }
    caseEl.querySelector(".cs-proof").hidden = !!n.contact;

    const prev = NODES[(current - 1 + NODES.length) % NODES.length], next = NODES[(current + 1) % NODES.length];
    $("cs-prev-l").textContent = prev.title; $("cs-next-l").textContent = next.title;

    caseEl.hidden = false;
    document.body.style.overflow = "hidden";
    $("cs-scroll").scrollTop = 0;
    buildBoard(n);
    history.replaceState(null, "", "#" + slug(n.title));
    $("cs-close").focus({ preventScroll: true });
  };

  const closeCase = () => {
    caseEl.hidden = true; document.body.style.overflow = "";
    history.replaceState(null, "", location.pathname);
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  };
  const step = (d) => { openCase(current + d); scrollToNode(current); };
  $("cs-close").addEventListener("click", closeCase);
  $("cs-prev").addEventListener("click", () => step(-1));
  $("cs-next").addEventListener("click", () => step(1));

  /* ---------- proof board: free-drag cards ---------- */
  let cards = [], zTop = 10;
  const isMobile = () => window.innerWidth < 760;

  const buildBoard = (n) => {
    board.innerHTML = ""; cards = [];
    $("pb-count").textContent = n.proofs.length ? `· ${n.proofs.length}` : "";
    $("pb-note").textContent = n.note || "";
    board.classList.toggle("empty", !n.proofs.length);
    caseEl.querySelector(".pb-tools").style.display = n.proofs.length > 1 ? "" : "none";
    if (!n.proofs.length) { board.innerHTML = `<p>${esc(n.note || "No public artefacts for this item.")}</p>`; $("pb-note").textContent = ""; return; }
    n.proofs.forEach((pf, k) => {
      const fig = document.createElement("figure");
      fig.className = "pc"; fig.tabIndex = 0;
      fig.setAttribute("role", "button");
      fig.setAttribute("aria-label", `Inspect proof: ${pf.cap}`);
      fig.innerHTML = `<span class="pin"></span><img src="${P + pf.src}" alt="${esc(pf.cap)}" loading="lazy" draggable="false" /><figcaption>${esc(pf.cap)}</figcaption>`;
      board.appendChild(fig);
      const card = { el: fig, x: 0, y: 0, r: 0, k };
      cards.push(card);
      attachDrag(card, n);
      fig.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openViewer(n, k); } });
    });
    requestAnimationFrame(() => scatter(false));
  };

  const apply = (c) => { c.el.style.transform = `translate(${c.x}px, ${c.y}px) rotate(${c.r}deg)`; };

  const scatter = (animate = true) => {
    if (isMobile()) return;
    const bw = board.clientWidth, bh = board.clientHeight, cw = Math.min(300, bw * 0.55);
    const n = cards.length;
    cards.forEach((c, k) => {
      c.el.style.width = cw + "px";
      const ch = c.el.offsetHeight || 240;
      // fan the cards across the board, slightly overlapping, like evidence pinned to a desk
      const t = n === 1 ? 0.5 : k / (n - 1);
      const cols = n <= 2 ? n : Math.ceil(n / 2), row = n <= 2 ? 0 : Math.floor(k / cols), col = n <= 2 ? k : k % cols;
      const usableX = bw - cw - 24, usableY = bh - ch - 24;
      c.x = 12 + (cols === 1 ? usableX / 2 : (col / (cols - 1)) * usableX) + (Math.random() - 0.5) * 24;
      c.y = 12 + (n <= 2 ? usableY * (0.2 + 0.4 * t) : row === 0 ? usableY * 0.08 : usableY * 0.92) + (Math.random() - 0.5) * 20;
      c.r = (Math.random() - 0.5) * 9;
      c.el.style.zIndex = String(++zTop);
      c.el.classList.toggle("anim", animate);
      apply(c);
    });
    if (animate) setTimeout(() => cards.forEach((c) => c.el.classList.remove("anim")), 600);
  };

  const tidy = () => {
    if (isMobile()) return;
    const bw = board.clientWidth, n = cards.length;
    const cols = n <= 2 ? n : n <= 4 ? 2 : 3, gap = 14;
    const cw = Math.floor((bw - gap * (cols + 1)) / cols);
    cards.forEach((c, k) => {
      c.el.style.width = cw + "px";
      c.x = gap + (k % cols) * (cw + gap);
      c.y = gap + Math.floor(k / cols) * (Math.min(260, c.el.offsetHeight) + gap);
      c.r = 0; c.el.classList.add("anim"); apply(c);
    });
    setTimeout(() => cards.forEach((c) => c.el.classList.remove("anim")), 600);
  };
  $("pb-tidy").addEventListener("click", tidy);
  $("pb-scatter").addEventListener("click", () => scatter(true));

  const attachDrag = (c, n) => {
    let sx = 0, sy = 0, ox = 0, oy = 0, moved = false, id = null;
    c.el.addEventListener("pointerdown", (e) => {
      if (isMobile()) return;
      id = e.pointerId; c.el.setPointerCapture(id);
      sx = e.clientX; sy = e.clientY; ox = c.x; oy = c.y; moved = false;
      c.el.style.zIndex = String(++zTop); c.el.classList.add("drag");
    });
    c.el.addEventListener("pointermove", (e) => {
      if (e.pointerId !== id) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (!moved && Math.hypot(dx, dy) < 4) return;
      moved = true;
      const bw = board.clientWidth, bh = board.clientHeight, w = c.el.offsetWidth, h = c.el.offsetHeight;
      c.x = Math.max(-w * 0.6, Math.min(bw - w * 0.4, ox + dx));
      c.y = Math.max(-h * 0.5, Math.min(bh - h * 0.3, oy + dy));
      c.r = Math.max(-8, Math.min(8, c.r * 0.9 + dx * 0.002));
      apply(c);
    });
    const end = (e) => {
      if (e.pointerId !== id) return;
      id = null; c.el.classList.remove("drag");
      if (!moved) openViewer(n, c.k);
    };
    c.el.addEventListener("pointerup", end);
    c.el.addEventListener("pointercancel", end);
    c.el.addEventListener("click", () => { if (isMobile()) openViewer(n, c.k); });
  };

  /* ---------- proof viewer: zoom + pan ---------- */
  const viewer = $("viewer"), vImg = $("vw-img"), vStage = $("vw-stage");
  let vNode = null, vIdx = 0, zoom = 1, px = 0, py = 0;
  const vApply = () => { vImg.style.transform = `translate(${px}px, ${py}px) scale(${zoom})`; $("vw-zoom").textContent = Math.round(zoom * 100) + "%"; };
  const setZoom = (z) => { zoom = Math.max(1, Math.min(5, z)); if (zoom === 1) { px = 0; py = 0; } vApply(); };
  const showProof = () => {
    const pf = vNode.proofs[vIdx];
    vImg.src = P + pf.src; vImg.alt = pf.cap; $("vw-cap").textContent = `${vIdx + 1} / ${vNode.proofs.length} · ${pf.cap}`;
    zoom = 1; px = 0; py = 0; vApply();
    const multi = vNode.proofs.length > 1;
    $("vw-prev").hidden = !multi; $("vw-next").hidden = !multi;
  };
  const openViewer = (n, k) => { vNode = n; vIdx = k; viewer.hidden = false; showProof(); $("vw-close").focus({ preventScroll: true }); };
  const closeViewer = () => { viewer.hidden = true; const c = cards[vIdx]; if (c) c.el.focus({ preventScroll: true }); };
  const vStep = (d) => { vIdx = (vIdx + d + vNode.proofs.length) % vNode.proofs.length; showProof(); };
  $("vw-close").addEventListener("click", closeViewer);
  $("vw-prev").addEventListener("click", () => vStep(-1));
  $("vw-next").addEventListener("click", () => vStep(1));
  $("vw-in").addEventListener("click", () => setZoom(zoom * 1.4));
  $("vw-out").addEventListener("click", () => setZoom(zoom / 1.4));
  $("vw-fit").addEventListener("click", () => setZoom(1));
  vStage.addEventListener("wheel", (e) => { e.preventDefault(); setZoom(zoom * (e.deltaY < 0 ? 1.15 : 1 / 1.15)); }, { passive: false });
  vStage.addEventListener("dblclick", () => setZoom(zoom > 1 ? 1 : 2.2));
  let pan = null;
  vStage.addEventListener("pointerdown", (e) => { if (zoom <= 1) return; pan = { id: e.pointerId, x: e.clientX - px, y: e.clientY - py }; vStage.setPointerCapture(e.pointerId); vStage.classList.add("drag"); });
  vStage.addEventListener("pointermove", (e) => { if (!pan || e.pointerId !== pan.id) return; px = e.clientX - pan.x; py = e.clientY - pan.y; vApply(); });
  const endPan = () => { pan = null; vStage.classList.remove("drag"); };
  vStage.addEventListener("pointerup", endPan); vStage.addEventListener("pointercancel", endPan);
  viewer.addEventListener("click", (e) => { if (e.target === viewer || e.target === vStage) { if (zoom === 1) closeViewer(); } });

  /* ---------- keyboard ---------- */
  window.addEventListener("keydown", (e) => {
    if (!viewer.hidden) {
      if (e.key === "Escape") closeViewer();
      else if (e.key === "ArrowRight") vStep(1);
      else if (e.key === "ArrowLeft") vStep(-1);
      else if (e.key === "+" || e.key === "=") setZoom(zoom * 1.4);
      else if (e.key === "-") setZoom(zoom / 1.4);
      return;
    }
    if (!caseEl.hidden) {
      if (e.key === "Escape") closeCase();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    }
  });
  window.addEventListener("resize", () => { layout(); if (!caseEl.hidden) scatter(false); });

  /* ---------- boot ---------- */
  layout();
  offset = window.scrollY * RATE;
  requestAnimationFrame(tick);

  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  window.addEventListener("hashchange", () => {
    const i = NODES.findIndex((n) => slug(n.title) === location.hash.slice(1));
    if (i >= 0 && (caseEl.hidden || i !== current)) { scrollToNode(i); openCase(i, els[i].f); }
  });
  const hash = location.hash.slice(1);
  if (hash) { const i = NODES.findIndex((n) => slug(n.title) === hash); if (i >= 0) { scrollToNode(i); setTimeout(() => openCase(i, els[i].f), 250); } }
})();
