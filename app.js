async function loadData() {
  const response = await fetch("data/projects.json");
  if (!response.ok) {
    throw new Error(`Failed to load projects.json (${response.status})`);
  }
  return response.json();
}

function renderSummary(summary) {
  const root = document.getElementById("summary");
  root.innerHTML = summary.map((item) => `<p>${item}</p>`).join("");
}

function renderHighlights(highlights) {
  const root = document.getElementById("highlights");
  root.innerHTML = highlights.map((item) => `<li>${item}</li>`).join("");
}

function inferSkillTags(project) {
  const name = project.name.toLowerCase();
  const type = (project.type || "").toLowerCase();

  if (name.includes("neoresist") || name.includes("neovax")) {
    return ["Neoantigen ranking", "Translational oncology", "Validation", "Research"];
  }
  if (name.includes("medviva")) {
    return ["Product design", "Medical education", "AI workflow", "Demo"];
  }
  if (name.includes("aether")) {
    return ["Generalist QA", "Instruction following", "Cross-domain review", "Outlier"];
  }
  if (name.includes("white coat")) {
    return ["Medical review", "Clinical judgment", "Safety", "Outlier"];
  }
  if (name.includes("almanac")) {
    return ["Medical review", "Consistency checking", "Rewrite", "Outlier"];
  }
  if (name.includes("autoresearch")) {
    return ["AI for science", "Research methods", "Provenance", "In progress"];
  }
  if (name.includes("genesis")) {
    return ["Artificial life", "Simulation", "Null controls", "In progress"];
  }
  if (name.includes("reel logger")) {
    return ["Agentic pipeline", "Automation", "Safety design", "Python"];
  }
  if (name.includes("ai evaluation")) {
    return ["Agent evaluation", "Function calling", "Red-teaming", "Certificate"];
  }
  if (name.includes("outlier health work")) {
    return ["Health QA", "Review notes", "Proof of work"];
  }
  if (type.includes("medical")) {
    return ["Medical review", "Clinical judgment", "QA"];
  }
  return ["Review", "Documentation"];
}

function normalizeLink(url, prefix) {
  if (!url) {
    return "";
  }
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("mailto:")) {
    return url;
  }
  return prefix + url.replace(/^\/+/, "");
}

function renderProfileLinks(contact) {
  const root = document.getElementById("profile-links");
  const links = [
    { label: "Email", href: `mailto:${contact.email}`, target: "" },
    { label: "GitHub", href: normalizeLink(contact.github, "https://"), target: "_blank" },
    { label: "LinkedIn", href: normalizeLink(contact.linkedin, "https://www.linkedin.com/"), target: "_blank" },
    { label: "ORCID", href: normalizeLink(contact.orcid, "https://orcid.org/"), target: "_blank" },
    { label: "Scholar", href: normalizeLink(contact.scholar, "https://scholar.google.com/citations?user="), target: "_blank" },
  ].filter((item) => item.href && !item.href.endsWith("undefined"));

  root.innerHTML = links.map((item) => `
    <a class="profile-link" href="${item.href}"${item.target ? ` target="${item.target}" rel="noreferrer"` : ""}>${item.label}</a>
  `).join("");
}

function renderMedia(project) {
  const images = Array.isArray(project.featured_images) ? project.featured_images : [];
  const cover = project.cover_image || images[0]?.src;

  if (!cover) {
    return "";
  }

  const coverAlt = project.cover_alt || images[0]?.alt || project.name;
  const gallery = project.cover_image ? images : images.slice(1);
  const galleryHtml = gallery.length
    ? `
      <div class="project-thumb-grid">
        ${gallery.map((item) => `
          <figure class="project-thumb">
            <img src="${item.src}" alt="${item.alt}" loading="lazy" />
          </figure>
        `).join("")}
      </div>
    `
    : "";

  return `
    <div class="project-media">
      <figure class="project-cover">
        <img src="${cover}" alt="${coverAlt}" loading="lazy" />
      </figure>
      ${galleryHtml}
    </div>
  `;
}

function renderProject(project, index) {
  const reverse = index % 2 === 1;
  const featured = project.name.includes("NeoResist-MD");
  const parent = project.parent ? `<span class="project-parent">${project.parent}</span>` : "";
  const featuredChip = featured ? `<span class="project-feature">Flagship project</span>` : "";
  const skillTags = inferSkillTags(project);
  const skillTagsHtml = skillTags.length
    ? `<div class="skill-tags">${skillTags.map((tag) => `<span class="skill-tag">${tag}</span>`).join("")}</div>`
    : "";
  const subprojects = Array.isArray(project.subprojects)
    ? `<div class="subproject-pills">${project.subprojects.map((item) => `<span class="subproject-pill">${item}</span>`).join("")}</div>`
    : "";
  const evidence = Array.isArray(project.evidence)
    ? `
      <ul class="feature-list compact">
        ${project.evidence.map((item) => `<li>${item}</li>`).join("")}
      </ul>
    `
    : "";
  const captions = Array.isArray(project.captions)
    ? `
      <div class="caption-grid">
        ${project.captions.map((item) => `
          <div class="caption-card">
            <div class="caption-label">${item.title}</div>
            <p>${item.caption}</p>
            ${item.why_it_matters ? `<small><strong>Why it matters:</strong> ${item.why_it_matters}</small>` : ""}
          </div>
        `).join("")}
      </div>
    `
    : "";

  return `
    <article class="project-card ${featured ? "project-card--featured" : ""} ${reverse ? "project-card--reverse" : ""}">
      <div class="project-card__layout">
        <div class="project-card__copy">
          ${parent}
          ${featuredChip}
          <span class="project-type">${project.type}</span>
          <h3>${project.name}</h3>
          ${skillTagsHtml}
          ${subprojects}
          ${project.story ? `<p class="project-story">${project.story}</p>` : ""}
          <p class="project-proof"><strong>A quick note:</strong> ${project.what_it_proves}</p>
          ${evidence}
        </div>
        ${renderMedia(project)}
      </div>
      ${captions}
    </article>
  `;
}

function renderProjects(projects) {
  const root = document.getElementById("projects");
  const visibleProjects = [...projects]
    .sort((a, b) => Number(b.name.includes("NeoResist-MD")) - Number(a.name.includes("NeoResist-MD")));
  root.innerHTML = visibleProjects.map((project, index) => renderProject(project, index)).join("");
}

(async function main() {
  try {
    const data = await loadData();
    renderSummary(data.summary);
    renderHighlights(data.highlights);
    renderProfileLinks(data.contact);
    renderProjects(data.projects);
  } catch (error) {
    // The static fallback in index.html stays in place if the data fails to load.
    console.error("Could not load portfolio data:", error);
    const root = document.getElementById("projects");
    if (root) {
      root.innerHTML = `<p class="prose">Project details could not be loaded. Please refresh, or email dar.adnan.54@gmail.com.</p>`;
    }
  }
})();
