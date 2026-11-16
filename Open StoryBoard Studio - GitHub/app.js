"use strict";

(() => {
  const engine = Storyboard;
  const icons = {
    logo: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M7 5v14M17 5v14M3 10h4m-4 4h4m10-4h4m-4 4h4"/><path d="m10.5 9 4.5 3-4.5 3z" fill="currentColor" stroke="none"/>',
    home: '<path d="m3 10 9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 21v-7h6v7"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 12h8m-8 4h6"/>',
    grid: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 10v10"/>',
    sparkle: '<path d="M10 2l1.9 5.1L17 9l-5.1 1.9L10 16l-1.9-5.1L3 9l5.1-1.9L10 2Zm8 12 1.1 2.9L22 18l-2.9 1.1L18 22l-1.1-2.9L14 18l2.9-1.1L18 14Z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
    back: '<path d="M20 12H5m6 6-6-6 6-6"/>',
    up: '<path d="M12 19V5m-5 5 5-5 5 5"/>',
    moveDown: '<path d="M12 5v14m-5-5 5 5 5-5"/>',
    play: '<path d="m8 5 11 7-11 7z"/>',
    film: '<path d="M4 10h16v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-9Zm0 0L3 6l16-4 1 4-16 4ZM7 5l3 3m4-5 3 3"/>',
    folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2.5-3 4m.1 3h.01"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    download: '<path d="M12 3v12m-4-4 4 4 4-4M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>',
    upload: '<path d="M12 16V4M8 8l4-4 4 4M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    sliders: '<path d="M4 7h16M4 17h16M9 4v6m6 4v6"/>',
    map: '<path d="M20 10c0 5-8 10-8 10S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    camera: '<path d="M4 7h4l2-3h4l2 3h4a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z"/><circle cx="12" cy="13.5" r="3.4"/>',
    users: '<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2m2-15a3 3 0 0 1 0 6m1 3a4 4 0 0 1 3 4v2"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19m0-14-1.5 1.5m-11 11L5 19"/>',
    edit: '<path d="m13 6 5 5M4 20l4.5-1L20 7.5a2 2 0 0 0-3.5-3.5L5 15.5 4 20Z"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3m3 0-1 13H7L6 7m4 4v5m4-5v5"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8" cy="9" r="1.3"/><path d="m3 17 5-4 4 3 4-5 5 5"/>',
    frame: '<path d="M8 4H4v4m12-4h4v4m0 8v4h-4M4 16v4h4"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/>',
    message: '<path d="M20 11a7 7 0 0 1-7 7H8l-4 3v-5a7 7 0 0 1 5-12h4a7 7 0 0 1 7 7Z"/><path d="M8 11h8"/>',
    lock: '<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v2"/>',
    terminal: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 9 3 3-3 3m6 0h4"/>'
  };
  const pages = {
    accueil: ["Accueil", "home"],
    scenario: ["Scénario", "file"],
    decoupage: ["Découpage", "grid"],
    rendu: ["Prompts & rendu", "sparkle"],
    projets: ["Projets", "folder"]
  };
  const steps = [
    {page: "scenario", icon: "file", title: "Importez votre scénario", text: "Collez votre texte validé ou importez un fichier de scénario."},
    {page: "decoupage", icon: "grid", title: "Affinez le découpage", text: "Ajustez les plans proposés, du cadrage à la lumière."},
    {page: "rendu", icon: "sparkle", title: "Exportez vos prompts", text: "Choisissez un style et récupérez un prompt par plan."}
  ];
  const storageKey = "plan-sequence-v1";
  const guideKey = "open-storyboard-studio-guide";
  const sidebar = document.getElementById("sidebar");
  const topbar = document.getElementById("topbar");
  const view = document.getElementById("view");
  const dialog = document.getElementById("dialog");
  const confirmDialog = document.getElementById("confirm-dialog");
  let storageIssue = false;
  let state = load();
  let page = readPage();
  let sceneId = "";
  let promptShotId = "";
  let promptMode = "plan";
  let boardIndex = 0;
  let boardConfigOpen = true;
  let activeDialog = "";
  let activeShotGroup = 0;
  let dialogReturnFocus = null;
  let confirmAction = null;
  let dragDepth = 0;
  let importRequest = 0;
  let scriptStatsTimer;

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (saved?.projects?.length) {
        for (const item of saved.projects) {
          for (const scene of item.scenes) scene.shots = scene.shots.map(engine.normalizeShot);
        }
        return saved;
      }
    } catch {
      storageIssue = true;
    }
    return {active: "exemple", projects: [Demo.createProject()]};
  }

  function save({touch = true} = {}) {
    if (touch) project().updated = Date.now();
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
      storageIssue = false;
    } catch {
      if (!storageIssue) toast("La sauvegarde locale est indisponible.", "info");
      storageIssue = true;
    }
    const status = topbar.querySelector(".save-status");
    if (status) {
      status.classList.toggle("unsaved", storageIssue);
      status.innerHTML = storageIssue ? icon("info") + " Sauvegarde indisponible" : icon("check") + " Sauvegardé";
    }
  }

  function project() {
    return state.projects.find(item => item.id === state.active) || state.projects[0];
  }

  function selectedScene() {
    const scenes = project().scenes;
    return scenes.find(scene => scene.id === sceneId) || scenes[0];
  }

  function promptSelection() {
    const scene = selectedScene();
    const shot = scene?.shots.find(item => item.id === promptShotId) || scene?.shots[0];
    return {scene, shot};
  }

  function readPage() {
    const name = location.hash.slice(1);
    return Object.hasOwn(pages, name) ? name : "accueil";
  }

  function go(next) {
    setSidebar(false);
    if (page === next) {
      render();
    } else {
      location.hash = next;
    }
  }

  function useProject(id, next, firstSceneId = "") {
    const previous = project().id;
    if (!state.projects.some(item => item.id === id)) return;
    state.active = id;
    if (previous !== id || firstSceneId) {
      sceneId = firstSceneId;
      promptShotId = "";
      boardIndex = 0;
      boardConfigOpen = true;
    }
    save({touch: false});
    go(next || (project().scenes.length ? "decoupage" : "scenario"));
  }

  function escape(value = "") {
    return String(value ?? "").replace(/[&<>"']/g, char => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[char]);
  }

  function icon(name, extra = "") {
    return `<svg class="icon ${extra}" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || ""}</svg>`;
  }

  function button(label, options = {}) {
    const {kind = "secondary", action, nav, symbol, trailing, attrs = "", type = "button", iconOnly = false} = options;
    return `<button type="${type}" class="button ${kind}${iconOnly ? " icon-button" : ""}" ${action ? `data-action="${action}"` : ""} ${nav ? `data-nav="${nav}"` : ""} ${iconOnly ? `aria-label="${escape(label)}" title="${escape(label)}"` : ""} ${attrs}>${symbol ? icon(symbol) : ""}${iconOnly ? "" : escape(label)}${trailing ? icon(trailing) : ""}</button>`;
  }

  function number(value) {
    return String(value).padStart(2, "0");
  }

  function plural(count, single, many = single + "s") {
    return `${count} ${count === 1 ? single : many}`;
  }

  function titleOf(item) {
    return item.name?.trim() || "Projet sans titre";
  }

  function setSidebar(open) {
    document.querySelector(".shell").classList.toggle("sidebar-open", open);
    document.querySelector(".sidebar-scrim").hidden = !open;
    topbar.querySelector('[data-action="open-sidebar"]')?.setAttribute("aria-expanded", String(open));
  }

  function renderSidebar() {
    sidebar.innerHTML = `
      <a class="brand" href="#accueil" aria-label="Open StoryBoard Studio, accueil">
        <span class="brand-icon">${icon("logo")}</span>
        <span class="brand-type"><strong>Open StoryBoard Studio</strong><small>Par Fenitra Rabefaritra</small></span>
      </a>
      <div class="sidebar-body">
        <div class="sidebar-section">
          <div class="sidebar-label">Espace de travail</div>
          <nav class="nav-list" aria-label="Espace de travail">
            ${Object.entries(pages).map(([key, [label, symbol]]) =>
              `<a class="nav-link${key === page ? " active" : ""}" href="#${key}" data-nav="${key}" ${key === page ? 'aria-current="page"' : ""}>${icon(symbol)}<span>${label}</span>${key === page ? '<span class="nav-marker"></span>' : ""}</a>`
            ).join("")}
          </nav>
        </div>
        <div class="sidebar-section sidebar-projects">
          <div class="sidebar-label"><span>Projets</span>${button("Nouveau projet", {action: "new-project", symbol: "plus", kind: "quiet", iconOnly: true})}</div>
          <div class="project-list">
            ${[...state.projects].sort((a, b) => b.updated - a.updated).map(item => `
              <button class="project-link${item.id === state.active ? " selected" : ""}" type="button" data-action="open-project" data-id="${escape(item.id)}" title="${escape(titleOf(item))}">
                <span class="project-icon">${icon(item.id === "exemple" ? "film" : "folder")}</span>
                <span class="project-text"><strong>${escape(titleOf(item))}</strong><small>${item.id === "exemple" ? "Projet d’exemple" : plural(item.scenes.length, "scène")}</small></span>
              </button>`
            ).join("")}
          </div>
        </div>
      </div>
      <div class="sidebar-footer">
        <span class="local-icon">${icon("lock")}</span>
        <div><strong>Espace local</strong><small>Sur cet appareil</small></div>
      </div>`;
  }

  function renderTopbar() {
    topbar.innerHTML = `
      <div class="breadcrumb">
        ${button("Ouvrir la navigation", {action: "open-sidebar", symbol: "menu", kind: "quiet mobile-menu", iconOnly: true, attrs: 'aria-expanded="false" aria-controls="sidebar"'})}
        ${["accueil", "projets"].includes(page) ? `<span class="crumb-icon">${icon(pages[page][1])}</span><strong>${pages[page][0]}</strong>`
          : `<span class="crumb-project">${escape(titleOf(project()))}</span>${icon("chevron")}<strong>${pages[page][0]}</strong>`}
      </div>
      <div class="topbar-actions">
        ${page === "accueil" ? "" : `<span class="save-status${storageIssue ? " unsaved" : ""}">${icon(storageIssue ? "info" : "check")} ${storageIssue ? "Sauvegarde indisponible" : "Sauvegardé"}</span>`}
        ${button("Guide", {action: "guide", symbol: "help", kind: "quiet guide-button"})}
        ${page === "accueil" ? button("Nouveau projet", {action: "new-project", symbol: "plus", kind: "outline top-create"}) : page === "projets" ? ""
          : button("Exporter", {nav: "rendu", symbol: "download", kind: "outline top-create"})}
      </div>`;
  }

  function stepCards() {
    return steps.map((step, index) => `
      <button type="button" class="step-card" data-nav="${step.page}">
        <span class="step-top"><span class="step-icon ${step.page}">${icon(step.icon)}</span><span class="step-number">${number(index + 1)}</span></span>
        <span class="step-content"><span class="step-title">${step.title}</span><span class="step-description">${step.text}</span></span>
        ${icon("arrow", "step-arrow")}
      </button>`).join("");
  }

  function renderHome() {
    return `
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-content">
          <h1 id="hero-title">Du scénario<br><span>au storyboard.</span></h1>
          <p>Découpez votre scénario, préparez chaque plan et exportez les prompts pour votre storyboard.</p>
          <div class="hero-actions">
            ${button("Créer un projet", {action: "new-project", symbol: "plus", kind: "primary"})}
            ${button("Ouvrir l’exemple", {action: "open-demo", symbol: "play", kind: "glass"})}
          </div>
        </div>
        <button type="button" class="hero-credit" data-action="open-demo" data-id="exemple-quai" aria-label="Voir le premier plan du Dernier Métro">${icon("frame")} <span>LE DERNIER MÉTRO <i></i> SC. 01 / PL. 01</span></button>
      </section>
      <section class="home-section" aria-labelledby="start-title">
        <div class="section-heading">
          <div><h2 id="start-title">Comment ça marche</h2></div>
          ${button("Guide de démarrage", {action: "guide", trailing: "arrow", kind: "text-button"})}
        </div>
        <div class="step-grid">${stepCards()}</div>
      </section>
      <section class="home-section example-section" aria-labelledby="example-title">
        <div class="section-heading">
          <div>
            <h2 id="example-title">Le Dernier Métro</h2>
            <p>Projet de démonstration <span class="dot-separator"></span> 3 scènes <span class="dot-separator"></span> 9 plans</p>
          </div>
          ${button("Voir le storyboard", {action: "open-demo", trailing: "arrow", kind: "text-button"})}
        </div>
        <div class="example-grid">
          ${Demo.scenes.map((scene, index) => `
            <button class="example-card" type="button" data-action="open-demo" data-id="${scene.id}">
              <span class="example-image"><img src="${scene.image}" alt="${escape(scene.imageAlt)}"><span class="example-number">SCÈNE ${number(index + 1)}</span></span>
              <span class="example-card-info"><span><strong>${escape(scene.name)}</strong><small>${escape(scene.setting)} <span class="dot-separator"></span> ${escape(scene.time)} <span class="dot-separator"></span> 3 plans</small></span>${icon("arrow")}</span>
            </button>`
          ).join("")}
        </div>
      </section>`;
  }

  function heading(title, description, action = "", step = "") {
    return `<div class="page-heading">
      <div>${step ? `<span class="page-step">${escape(step)}</span>` : ""}<h1>${escape(title)}</h1><p>${escape(description)}</p></div>
      ${action ? `<div class="page-actions">${action}</div>` : ""}
    </div>`;
  }

  function field(label, input, extra = "") {
    return `<label class="field ${extra}"><span>${escape(label)}</span>${input}</label>`;
  }

  function optionList(list, current) {
    return list.map(([key, label]) => `<option value="${escape(key)}" ${current === key ? "selected" : ""}>${escape(label)}</option>`).join("");
  }

  function renderScenario() {
    const current = project();
    const isTechnical = current.scriptMode === "technical";
    const script = ScriptPreparation.activeScript(current);
    return `
      ${heading("Scénario", "Importez le scénario validé et préparez-le pour le découpage.", "", "01 / SCÉNARIO")}
      <div class="scenario-grid">
        <section class="panel script-panel" aria-labelledby="script-title">
          <div class="panel-header"><div class="panel-title"><span class="panel-icon">${icon("file")}</span><div><h2 id="script-title">Texte du scénario</h2><p>PDF, Word (.doc et .docx), texte, Markdown ou Fountain</p></div></div>
            ${button("Importer un fichier", {action: "choose-file", symbol: "upload", kind: "outline"})}
            <input type="file" id="script-file" accept=".pdf,.doc,.docx,.txt,.fountain,.md,.markdown,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown" hidden>
          </div>
          <div class="script-body">
            ${field("Nom du projet", `<input id="project-name" data-project-field="name" value="${escape(current.name)}" placeholder="Donnez un nom à votre projet" maxlength="120">`)}
            ${current.technicalScript !== undefined && (current.technicalScript || isTechnical) ? `<div class="script-versions" role="group" aria-label="Version utilisée pour le découpage">
              ${button("Script validé", {action: "show-source-script", kind: isTechnical ? "quiet" : "active", attrs: `aria-pressed="${!isTechnical}"`})}
              ${button("Version technique", {action: "show-technical-script", kind: isTechnical ? "active" : "quiet", attrs: `aria-pressed="${isTechnical}"`})}
            </div>` : ""}
            ${field(isTechnical ? "Version technique modifiable" : "Script validé", `<textarea id="script-input" data-project-field="${isTechnical ? "technicalScript" : "script"}" placeholder="INT. CUISINE — MATIN&#10;&#10;Léa ouvre la fenêtre. Le bruit de la rue envahit la pièce.">${escape(script)}</textarea>`, "script-field")}
            <div class="script-meta"><span id="script-stats"></span><span>Glissez un fichier dans cette zone</span></div>
            <p class="import-status" id="import-status" role="status"${current.importNote ? "" : " hidden"}>${escape(current.importNote)}</p>
          </div>
        </section>
        <div class="scenario-aside">
          <section class="panel options-panel" aria-labelledby="prep-title">
            <div class="panel-title"><span class="panel-icon">${icon("sparkle")}</span><div><h2 id="prep-title">Préparation du script</h2><p>Scènes, plans et notes de réalisation</p></div></div>
            ${button(current.technicalScript ? "Repréparer le script" : "Préparer une version technique", {action: "prepare-script", symbol: "file", kind: "outline", attrs: current.script.trim() ? "" : "disabled"})}
            <p class="panel-hint" id="prep-status">${preparationHint(current)}</p>
          </section>
          <section class="panel options-panel" aria-labelledby="analysis-title">
            <div class="panel-title"><span class="panel-icon">${icon("sliders")}</span><div><h2 id="analysis-title">Plans par scène</h2><p>Mode de découpage</p></div></div>
            <div class="radio-cards">
              <label class="radio-card"><input type="radio" name="count-mode" value="auto" ${current.countMode === "auto" ? "checked" : ""}><span><strong>Nombre proposé</strong><small>Plans écrits dans le script ou actions et dialogues détectés.</small></span></label>
              <label class="radio-card"><input type="radio" name="count-mode" value="fixed" ${current.countMode === "fixed" ? "checked" : ""}><span><strong>Nombre prédéfini</strong><small>Même nombre pour chaque scène.</small></span></label>
            </div>
            <div id="fixed-field" ${current.countMode !== "fixed" ? "hidden" : ""}>${field("Nombre de plans", `<input type="number" id="fixed-count" data-project-field="fixedCount" min="1" max="${engine.MAX_SHOTS}" step="1" value="${current.fixedCount || ""}" required>`)}</div>
            ${button("Indications du projet", {action: "project-settings", symbol: "file", kind: "outline"})}
            ${button("Générer le découpage", {action: "analyze", symbol: "sparkle", kind: "primary", attrs: script.trim() ? "" : "disabled"})}
            <p class="panel-hint">${icon("info")} Les cadrages, mouvements et lumières proposés sont éditables.</p>
          </section>
          <div id="script-detections" hidden></div>
          <section class="panel syntax-panel">
            <h3>Repères reconnus</h3>
            <p><code>SCÈNE 2 — INT. CUISINE — NUIT</code> ouvre une nouvelle scène. <code>PLAN 1 — Gros plan</code> ou <code>00:04–00:07</code> peut introduire un plan. Placez <code>Titre :</code>, <code>Intention :</code>, <code>DA :</code> et <code>Chrono :</code> en tête de script pour renseigner le projet.</p>
          </section>
        </div>
      </div>`;
  }

  function preparationHint(current) {
    if (current.technicalStale && current.technicalScript) return "Le script validé a changé. Repréparez la version technique pour y reprendre vos changements.";
    if (current.scriptMode === "technical") return "Le découpage utilisera cette version technique. Vous pouvez la modifier ou revenir au script validé.";
    if (current.technicalScript) return "Le découpage utilisera le script validé. Sélectionnez « Version technique » pour changer de version.";
    return "Créez une version modifiable qui organise les scènes et les plans et propose des notes.";
  }

  function showScriptMode(mode) {
    const current = project();
    current.scriptMode = mode;
    save({touch: false});
    render();
    view.querySelector(`[data-action="show-${mode}-script"]`)?.focus();
  }

  function prepareScript() {
    const current = project();
    const technical = ScriptPreparation.prepare(current.script);
    if (!technical) return toast("Ajoutez un scénario à préparer.", "info");
    const apply = () => {
      current.technicalScript = technical;
      current.technicalStale = false;
      current.technicalEdited = false;
      showScriptMode("technical");
      toast("La version technique est prête à relire.");
    };
    if (current.technicalEdited && current.technicalScript !== technical) {
      return confirmChange({
        title: "Repréparer la version technique",
        description: "La nouvelle version sera générée à partir du scénario validé et remplacera la version technique que vous avez modifiée.",
        label: "Repréparer", action: apply
      });
    }
    apply();
  }

  function emptyState(symbol, title, description, action) {
    return `<div class="panel empty-state"><span class="empty-icon">${icon(symbol)}</span><h2>${escape(title)}</h2><p>${escape(description)}</p>${action}</div>`;
  }

  function sceneQualifier(scene) {
    return [scene.scriptNumber && "Script " + scene.scriptNumber, scene.sequence, scene.time, scene.chrono].filter(Boolean).join(" · ");
  }

  function sceneTeaser(scene, repeatedNames) {
    if (!repeatedNames.has(ScriptAnalysis.key(scene.name))) return "";
    return (scene.intention || scene.synopsis || scene.shots.find(shot => shot.action)?.action || "").replace(/\s+/g, " ").trim();
  }

  function repeatedSceneNames(scenes) {
    const seen = new Set();
    const repeated = new Set();
    for (const scene of scenes) {
      const name = ScriptAnalysis.key(scene.name);
      if (seen.has(name)) repeated.add(name);
      seen.add(name);
    }
    return repeated;
  }

  function briefList(fields, source, className) {
    const entries = fields.filter(([field]) => source[field]);
    return entries.length ? `<dl class="${className}">${entries.map(([key, label]) =>
      `<div><dt>${escape(label)}</dt><dd>${escape(source[key])}</dd></div>`).join("")}</dl>` : "";
  }

  function sceneNavigation(current, selected) {
    const repeated = repeatedSceneNames(current.scenes);
    return `<aside class="panel scene-navigation" aria-label="Scènes">
      <div class="scene-nav-heading"><strong>${plural(current.scenes.length, "scène")}</strong>${button("Ajouter une scène", {action: "add-scene", symbol: "plus", kind: "quiet", iconOnly: true})}</div>
      <div class="scene-list">
        ${current.scenes.map((scene, index) => {
          const teaser = sceneTeaser(scene, repeated);
          return `<button class="scene-link${scene.id === selected?.id ? " active" : ""}" type="button" data-action="select-scene" data-id="${escape(scene.id)}" ${scene.id === selected?.id ? 'aria-current="true"' : ""}>
            <span class="scene-index">${number(index + 1)}</span><span><strong>${escape(scene.name || "Sans titre")}</strong>
              <small>${escape(sceneQualifier(scene) || plural(scene.shots.length, "plan"))}</small>
              ${teaser ? `<small class="scene-teaser" title="${escape(teaser)}">${escape(teaser)}</small>` : ""}</span>
          </button>`;
        }).join("")}
      </div>
    </aside>`;
  }

  function renderShotTable(scene) {
    if (!scene.shots.length) {
      return emptyState("camera", "Aucun plan dans cette scène", "Ajoutez un plan ou demandez un nombre de plans proposé.", button("Ajouter un plan", {action: "add-shot", symbol: "plus", kind: "primary"}));
    }
    return `<div class="panel table-panel"><div class="table-scroll"><table class="shot-table">
      <thead><tr><th scope="col">Plan / description</th><th scope="col">Cadrage</th><th scope="col">Caméra</th><th scope="col">Chrono</th><th scope="col"><span class="visually-hidden">Actions</span></th></tr></thead>
      <tbody>${scene.shots.map((shot, index) => `
        <tr>
          <td><button class="shot-title-button" type="button" data-action="edit-shot" data-id="${escape(shot.id)}">
            <span class="shot-index">${number(index + 1)}</span><span><strong>${escape(shot.title || "Plan sans titre")}</strong><small>${escape(shot.description || shot.action || shot.detail || "Description à préciser")}</small>
              ${shot.voiceOver ? `<small class="script-reference">Voix off · ${escape(shot.voiceOver)}</small>` : ""}
              ${shot.explicit && shot.scriptNumber ? `<small class="script-reference">Plan ${escape(shot.scriptNumber)} du script</small>` : ""}</span>
          </button></td>
          <td>${shot.scale ? `<span class="tag">${escape(shot.scale)}</span>` : "—"}${shot.angle ? `<small>${escape(shot.angle)}</small>` : ""}</td>
          <td>${escape(shot.movement || "—")}${shot.lens ? `<small>${escape(shot.lens)}</small>` : ""}</td>
          <td class="duration-cell">${shot.chrono ? escape(shot.chrono) : ""}${shot.duration ? (shot.chrono ? `<small>${escape(shot.duration)} s</small>` : `${escape(shot.duration)} s`) : shot.chrono ? "" : "—"}</td>
          <td><div class="table-actions">
            ${button("Voir le prompt du plan " + number(index + 1), {action: "open-prompt", symbol: "sparkle", kind: "quiet", iconOnly: true, attrs: `data-id="${escape(shot.id)}"`})}
            ${button("Éditer le plan " + number(index + 1), {action: "edit-shot", symbol: "edit", kind: "quiet", iconOnly: true, attrs: `data-id="${escape(shot.id)}"`})}
          </div></td>
        </tr>`
      ).join("")}</tbody>
    </table></div></div>`;
  }

  function renderBreakdown() {
    const current = project();
    const script = ScriptPreparation.activeScript(current).trim();
    const scene = selectedScene();
    const headingActions = button("Prompts & rendu", {nav: "rendu", kind: "primary", trailing: "arrow"});
    const pageHeading = heading("Découpage", "Affinez la mise en scène, la caméra et la direction artistique de chaque plan.", headingActions, "02 / DÉCOUPAGE");
    if (!scene) {
      return pageHeading + emptyState("grid", "Votre découpage commence ici", "Importez le script validé pour générer vos premières scènes.", `<div class="inline-actions">${button("Aller au scénario", {nav: "scenario", symbol: "file", kind: "primary"})}${button("Ajouter une scène", {action: "add-scene", symbol: "plus"})}</div>`);
    }
    const totalSeconds = scene.shots.reduce((total, shot) => total + (Number(shot.duration) || 0), 0);
    return `${pageHeading}
      ${script && (script !== current.analyzedScript || current.analysisVersion !== engine.ANALYSIS_VERSION) ? `<div class="inline-notice">${icon("info")}<span>${script !== current.analyzedScript ? "Le texte sélectionné a changé depuis le dernier découpage." : "Une nouvelle analyse peut retrouver les numéros, les plans et le chrono du script."}</span>${button("Revenir au scénario", {nav: "scenario", kind: "text-button", trailing: "arrow"})}</div>` : ""}
      <div class="breakdown-grid">
        ${sceneNavigation(current, scene)}
        <section class="scene-content" aria-labelledby="scene-title">
          <div class="panel scene-summary${scene.image ? " with-image" : ""}">
            <div class="scene-info">
              <span class="scene-label">Scène ${number(current.scenes.indexOf(scene) + 1)}${scene.scriptNumber ? " · Script " + escape(scene.scriptNumber) : ""}${scene.sequence ? " · " + escape(scene.sequence) : ""}</span>
              <h2 id="scene-title">${escape(scene.name || "Scène sans titre")}</h2>
              <div class="scene-metadata">
                ${scene.setting || scene.location ? `<span>${icon("map")} ${[scene.setting, scene.location].filter(Boolean).map(escape).join(" · ")}</span>` : ""}
                ${scene.time ? `<span>${icon("clock")} ${escape(scene.time)}</span>` : ""}
                ${scene.chrono ? `<span>${icon("film")} ${escape(scene.chrono)}</span>` : ""}
              </div>
              <div class="inline-actions">
                ${button("Paramètres de scène", {action: "edit-scene", symbol: "edit", kind: "outline"})}
                ${button("Ajuster les plans", {action: "shot-count", symbol: "sliders", kind: "outline"})}
              </div>
            </div>
            ${scene.image ? `<img src="${scene.image}" alt="${escape(scene.imageAlt)}">` : ""}
          </div>
          ${scene.source || scene.sourceHeading || engine.sceneBriefFields.some(([key]) => scene[key]) ? `<details class="source-details"><summary>${icon("file")} Passage et indications du scénario ${icon("down")}</summary>
            ${briefList(engine.sceneBriefFields, scene, "scene-brief")}${scene.sourceHeading ? `<p><strong>${escape(scene.sourceHeading)}</strong></p>` : ""}${scene.source ? `<p>${escape(scene.source)}</p>` : ""}</details>` : ""}
          <div class="shot-heading"><div><h3>Plans de la scène</h3><p>${plural(scene.shots.length, "plan")}${totalSeconds ? ` <span class="dot-separator"></span> ${totalSeconds.toLocaleString("fr-FR")} s estimées` : ""}</p></div>
            ${button("Ajouter un plan", {action: "add-shot", symbol: "plus", kind: "outline"})}</div>
          ${renderShotTable(scene)}
        </section>
      </div>`;
  }

  function textControl(name, value, scope, {placeholder = "", choices = [], type = "text", attrs = ""} = {}) {
    const id = `${scope}-${name}`;
    const input = `<input id="${id}" name="${name}" type="${type}" value="${escape(value)}" placeholder="${escape(placeholder)}" ${choices.length ? `list="${id}-choices"` : ""} ${attrs}>`;
    return input + (choices.length ? `<datalist id="${id}-choices">${choices.map(choice => `<option value="${escape(choice)}"></option>`).join("")}</datalist>` : "");
  }

  function areaControl(name, value, {label = "", placeholder = "", rows = 3, attrs = ""} = {}) {
    return `<textarea name="${name}" rows="${rows}" placeholder="${escape(placeholder)}" ${label ? `aria-label="${escape(label)}"` : ""} ${attrs}>${escape(value)}</textarea>`;
  }

  function styleChoices(inherit = false) {
    const list = Object.entries(engine.styles).map(([key, [label]]) => [key, label]);
    return inherit ? [["", "Utiliser le style du projet"], ...list] : list;
  }

  function renderBoardControls(boards) {
    return `<details class="board-config" ${boardConfigOpen ? "open" : ""}>
      <summary>Répartition des plans ${icon("down")}</summary>
      <div class="board-config-body">
        <p>Choisissez le nombre de plans par planche. Les plans restants passent à la suivante.</p>
        <div class="board-size-list">
          ${boards.map((board, index) => {
            const next = boards[index + 1];
            const available = boards.at(-1).cells.at(-1).ordinal - board.cells[0].ordinal + 1;
            return `<div class="board-size-row">
              <label for="board-size-${index}">Planche ${board.number}<small>Plans ${board.cells[0].ordinal} à ${board.cells.at(-1).ordinal}</small></label>
              <input id="board-size-${index}" type="number" min="1" max="${available}" step="1" value="${board.cells.length}"
                aria-label="Nombre de plans sur la planche ${board.number}" data-board-size="${index}" required>
              ${next ? button("Fusionner la planche " + board.number + " avec la suivante",
                {action: "merge-board", symbol: "close", kind: "quiet", iconOnly: true, attrs: `data-index="${index}"`}) : ""}
            </div>`;
          }).join("")}
        </div>
        ${button("Ajouter une planche", {action: "add-board", symbol: "plus", kind: "outline", attrs: boards.at(-1).cells.length < 2 ? "disabled" : ""})}
      </div>
    </details>`;
  }

  function renderBoardPreview(current, boards) {
    if (!boards.length) return "";
    const board = boards[Math.min(boardIndex, boards.length - 1)];
    const columns = board.columns;
    const cells = board.cells.map(({scene, shot, sceneNumber, shotNumber}, index) => `
      <li class="board-cell" title="${escape(shot.title || shot.action || "")}">
        <div class="board-frame">
          ${shot.image ? `<img src="${escape(shot.image)}" alt="">` : '<span class="board-frame-empty">Image à illustrer</span>'}
          <span class="board-cell-number">${number(index + 1)}</span>
          <div class="board-arrows">${engine.movementArrows(shot).map(({label, direction, kind}) => {
            const name = engine.arrowDirections[direction];
            return `<span class="board-arrow ${kind}" title="${escape(label + " · " + name)}"><b aria-hidden="true">${name.slice(-1)}</b> ${label}<span class="visually-hidden">${escape(name.slice(0, -2))}</span></span>`;
          }).join("")}</div>
        </div>
        <div class="board-cell-info"><small>Sc. ${number(sceneNumber)} · Pl. ${number(shotNumber)}</small>
          <strong>${escape(shot.title || scene.name || "Plan sans titre")}</strong>
          ${shot.description || shot.action ? `<p>${escape(shot.description || shot.action)}</p>` : ""}
          ${shot.voiceOver ? `<p class="board-voice"><span>Voix off</span> ${escape(shot.voiceOver)}</p>` : ""}</div>
      </li>`).join("");
    return `
      ${renderBoardControls(boards)}
      <div class="board-preview">
        ${field("Planche à prévisualiser", `<select id="prompt-board">${optionList(boards.map(item =>
          [String(item.number - 1), `Planche ${item.number} · ${plural(item.cells.length, "plan")}`]), String(board.number - 1))}</select>`)}
        <div class="board-grid-scroll"><ol class="board-grid" aria-label="Cases de la planche" style="--board-columns:${columns}">${cells}</ol></div>
      </div>
      <div class="prompt-output"><pre id="prompt-text" tabindex="0" aria-label="Texte du prompt">${escape(engine.buildBoardPrompt(current, board, boards.length))}</pre></div>
      <div class="prompt-footer">${button("Copier le prompt de la planche", {action: "copy-prompt", symbol: "copy", kind: "primary"})}
        ${button("Télécharger le prompt", {action: "download-prompt", symbol: "download", kind: "outline"})}
        ${button("Exporter la planche en PNG", {action: "download-board-image", symbol: "image", kind: "outline"})}</div>`;
  }

  function renderPrompts() {
    const current = project();
    const {scene, shot} = promptSelection();
    const entries = engine.listShots(current);
    const boards = promptMode === "board" ? engine.layoutBoards(entries, current.boardSizes) : [];
    const count = entries.length;
    const download = button(promptMode === "board" ? "Exporter toutes les planches" : "Exporter tous les prompts",
      {action: "download-prompts", symbol: "download", kind: "primary", attrs: count ? "" : "disabled"});
    const preview = shot ? engine.buildPrompt(current, scene, shot, current.scenes.indexOf(scene) + 1, scene.shots.indexOf(shot) + 1) : "";
    return `
      ${heading("Prompts & rendu", "Préparez des prompts pour des plans individuels ou des planches de storyboard.", download, "03 / RENDU")}
      <div class="render-grid">
        <section class="panel render-settings" aria-labelledby="style-title">
          <div class="panel-title"><span class="panel-icon">${icon("sparkle")}</span><div><h2 id="style-title">Style de rendu</h2><p>Réglages par défaut du projet</p></div></div>
          <div class="style-options" aria-label="Style de rendu">
            ${styleChoices().map(([key, label]) => `
              <label class="style-option ${key}"><input type="radio" name="render-style" value="${key}" ${current.style === key ? "checked" : ""}><span class="style-content"><span class="style-icon">${icon(key === "realiste" ? "camera" : key === "crayon" ? "edit" : key === "libre" ? "sliders" : key === "animation" ? "frame" : "image")}</span><span>${escape(label)}</span></span></label>
            `).join("")}
          </div>
          ${field("Format d’image", textControl("ratio", current.ratio, "render", {placeholder: "16:9", choices: engine.ratios, attrs: 'data-project-field="ratio"'}))}
          ${field("Précisions sur le style", areaControl("customStyle", current.customStyle, {label: "Précisions sur le style", placeholder: "Grain, technique, époque, références…", attrs: 'data-project-field="customStyle"'}))}
          ${button("Indications du projet", {action: "project-settings", symbol: "sliders", kind: "outline"})}
        </section>
        <section class="panel prompt-panel" aria-labelledby="prompt-title">
          <div class="panel-header prompt-header"><div class="panel-title"><span class="panel-icon">${icon("terminal")}</span><div><h2 id="prompt-title">Aperçu du prompt</h2><p id="prompt-count">${plural(count, "plan exportable", "plans exportables")}${boards.length ? " · " + plural(boards.length, "planche") : ""}</p></div></div>
            <div class="prompt-mode" role="group" aria-label="Mode d’export">
              ${button("Par plan", {action: "prompt-plan", kind: promptMode === "plan" ? "active" : "quiet", attrs: `aria-pressed="${promptMode === "plan"}"`})}
              ${button("Par planche", {action: "prompt-board", kind: promptMode === "board" ? "active" : "quiet", attrs: `aria-pressed="${promptMode === "board"}"`})}
            </div>
          </div>
          ${promptMode === "plan" && scene ? `<div class="prompt-selectors">
            ${field("Scène", `<select id="prompt-scene">${optionList(current.scenes.map((item, index) => [item.id, `Sc. ${number(index + 1)} — ${item.name || "Sans titre"}${sceneQualifier(item) ? " · " + sceneQualifier(item) : ""}`]), scene.id)}</select>`)}
            ${field("Plan", `<select id="prompt-shot" ${shot ? "" : "disabled"}>${shot ? optionList(scene.shots.map((item, index) => [item.id, `Pl. ${number(index + 1)} — ${item.title || "Sans titre"}`]), shot.id) : '<option>Aucun plan</option>'}</select>`)}
          </div>` : ""}
          ${promptMode === "board" && count ? `<div id="board-preview-content">${renderBoardPreview(current, boards)}</div>` : promptMode === "plan" && shot ? `<div class="prompt-output"><pre id="prompt-text" tabindex="0" aria-label="Texte du prompt">${escape(preview)}</pre></div>
            <div class="prompt-footer">${button("Copier le prompt", {action: "copy-prompt", symbol: "copy", kind: "primary"})}
              ${button("Télécharger ce plan", {action: "download-prompt", symbol: "download", kind: "outline"})}
              ${button("Éditer le plan", {action: "edit-shot", symbol: "edit", kind: "quiet", attrs: `data-id="${escape(shot.id)}"`})}
            </div>`
            : `<div class="prompt-empty"><span class="empty-icon">${icon("sparkle")}</span><h3>Aucun prompt pour l’instant</h3><p>Ajoutez un plan à une scène pour préparer son rendu.</p>${button("Aller au découpage", {nav: "decoupage", kind: "outline", trailing: "arrow"})}</div>`}
        </section>
      </div>`;
  }

  function refreshPrompt() {
    const pre = document.getElementById("prompt-text");
    if (!pre) return;
    const current = project();
    if (promptMode === "board") {
      const boards = engine.layoutBoards(engine.listShots(current), current.boardSizes);
      const board = boards[Math.min(boardIndex, boards.length - 1)];
      if (board) pre.textContent = engine.buildBoardPrompt(current, board, boards.length);
    } else {
      const {scene, shot} = promptSelection();
      if (!shot) return;
      pre.textContent = engine.buildPrompt(current, scene, shot, current.scenes.indexOf(scene) + 1, scene.shots.indexOf(shot) + 1);
    }
  }

  function render() {
    renderSidebar();
    renderTopbar();
    const views = {accueil: renderHome, scenario: renderScenario, decoupage: renderBreakdown, rendu: renderPrompts, projets: renderProjects};
    view.innerHTML = views[page]();
    if (page === "scenario") refreshScriptStats();
    document.title = page === "accueil" ? "Open StoryBoard Studio - Par Fenitra Rabefaritra" : `${pages[page][0]} — Open StoryBoard Studio`;
  }

  function refreshScriptStats() {
    const target = document.getElementById("script-stats");
    if (!target) return;
    const current = project();
    const script = ScriptPreparation.activeScript(current).trim();
    const words = script.match(/\S+/g)?.length || 0;
    const {metadata, scenes} = ScriptAnalysis.inspect(script);
    const explicitPlans = scenes.reduce((total, scene) => total + scene.plans.length, 0);
    target.textContent = [plural(words, "mot"), script && plural(scenes.length, "scène détectée", "scènes détectées"),
      explicitPlans && plural(explicitPlans, "plan écrit", "plans écrits")].filter(Boolean).join(" · ");
    const detected = document.getElementById("script-detections");
    const brief = briefList(engine.projectBriefFields, metadata, "detected-brief");
    detected.hidden = !brief;
    detected.innerHTML = brief ? `<section class="panel syntax-panel"><h3>Indications détectées</h3>${brief}</section>` : "";
    view.querySelector('[data-action="analyze"]').disabled = !scenes.length;
    view.querySelector('[data-action="prepare-script"]').disabled = !current.script.trim();
    document.getElementById("prep-status").textContent = preparationHint(current);
  }

  function openDialog(kind, {title, kicker = "", description = "", symbol = "", body, footer, wide = false}) {
    activeDialog = kind;
    if (!dialog.open) dialogReturnFocus = document.activeElement;
    dialog.classList.toggle("wide-dialog", wide);
    dialog.setAttribute("aria-labelledby", "dialog-title");
    dialog.innerHTML = `
      <form class="dialog-form" id="dialog-form">
        <div class="dialog-header">
          <div class="dialog-heading">
            ${symbol ? `<span class="panel-icon">${icon(symbol)}</span>` : ""}
            <div>${kicker ? `<span class="dialog-kicker">${escape(kicker)}</span>` : ""}<h2 id="dialog-title">${escape(title)}</h2>${description ? `<p>${escape(description)}</p>` : ""}</div>
          </div>
          ${button("Fermer", {action: "close-dialog", symbol: "close", kind: "quiet", iconOnly: true})}
        </div>
        <div class="dialog-body">${body}</div>
        ${footer ? `<div class="dialog-footer">${footer}</div>` : ""}
      </form>`;
    if (!dialog.open) dialog.showModal();
    dialog.querySelector("[data-initial-focus]")?.focus();
  }

  function cancelButton() {
    return button("Annuler", {action: "close-dialog", kind: "quiet"});
  }

  function openGuide() {
    try { localStorage.setItem(guideKey, "1"); } catch {}
    openDialog("guide", {
      title: "Bienvenue dans Open StoryBoard Studio", symbol: "help", description: "Par Fenitra Rabefaritra",
      body: `<div class="guide-intro"><p>Open StoryBoard Studio transforme un scénario en découpage, plan par plan. Il aide la réalisation, la direction artistique et l’équipe de production à préparer le tournage en partageant les cadrages, les mouvements, les intentions visuelles et les voix off.</p>
        <p>Le storyboarder garde la responsabilité de l’interprétation visuelle et de la mise en scène. Les planches générées peuvent servir à préparer un tournage, à briefer l’équipe et à valider les intentions avec la production.</p></div>
      <ol class="guide-steps">
        <li><span class="step-icon scenario">${icon("file")}</span><div><h3>Importez votre scénario</h3><p>Collez le texte ou ouvrez un fichier PDF, Word ou texte. Préparez une version technique et relisez les plans et les notes proposés.</p></div></li>
        <li><span class="step-icon decoupage">${icon("grid")}</span><div><h3>Affinez les plans</h3><p>Ouvrez un plan pour modifier sa description visuelle, sa voix off et ses flèches de caméra ou de sujet.</p></div></li>
        <li><span class="step-icon rendu">${icon("sparkle")}</span><div><h3>Préparez le rendu</h3><p>Répartissez les plans sur des planches. Téléchargez le PNG annoté ou copiez le prompt pour illustrer les cases avec votre générateur d’images.</p></div></li>
      </ol>`,
      footer: button("Ouvrir l’exemple", {action: "open-demo", kind: "outline", symbol: "play"}) + button("Créer un projet", {action: "new-project", kind: "primary", symbol: "plus"})
    });
  }

  function openNewProject() {
    openDialog("new-project", {
      title: "Nouveau projet", symbol: "folder", description: "Donnez un nom au projet avant d’ajouter son scénario.",
      body: field("Nom du projet", textControl("name", "", "new", {placeholder: "Ex. Les lumières de la ville", attrs: 'maxlength="120" data-initial-focus'})),
      footer: cancelButton() + button("Créer le projet", {type: "submit", kind: "primary", trailing: "arrow"})
    });
  }

  function renderProjects() {
    const projects = [...state.projects].sort((a, b) => b.updated - a.updated);
    return heading("Projets", "Ouvrez, renommez ou supprimez les projets de cet espace.", button("Nouveau projet", {action: "new-project", symbol: "plus", kind: "primary"}))
      + `<div class="project-library">${projects.map(item => {
        const demo = item.id === "exemple";
        const id = `data-id="${escape(item.id)}"`;
        const name = titleOf(item);
        return `<article class="panel project-card">
          <div class="panel-title"><span class="panel-icon">${icon(demo ? "film" : "folder")}</span><div><h2>${escape(name)}</h2><p>${demo ? "Projet d’exemple" : plural(item.scenes.length, "scène") + " · " + plural(engine.listShots(item).length, "plan")}</p></div></div>
          <div class="inline-actions">
            ${button("Ouvrir", {action: "open-project", symbol: "arrow", kind: "outline", attrs: id})}
            ${demo ? "" : button("Modifier " + name, {action: "edit-project", symbol: "edit", kind: "quiet", iconOnly: true, attrs: id}) +
              button("Supprimer " + name, {action: "delete-project", symbol: "trash", kind: "quiet danger-text", iconOnly: true, attrs: id})}
          </div>
        </article>`;
      }).join("")}</div>`;
  }

  function editProject(id) {
    const item = state.projects.find(project => project.id === id && id !== "exemple");
    if (!item) return;
    openDialog("edit-project", {
      title: "Modifier le projet", symbol: "folder",
      body: `<input type="hidden" name="projectId" value="${escape(id)}">` +
        field("Nom du projet", textControl("name", item.name, "edit-project", {attrs: 'maxlength="120" required data-initial-focus'})),
      footer: cancelButton() + button("Enregistrer", {type: "submit", kind: "primary", symbol: "check"})
    });
  }

  function deleteProject(id) {
    const item = state.projects.find(project => project.id === id && id !== "exemple");
    if (!item) return;
    confirmChange({
      title: "Supprimer le projet",
      description: `Le projet « ${titleOf(item)} », son scénario et son découpage seront supprimés de ce navigateur.`,
      label: "Supprimer le projet",
      action: () => {
        state.projects = state.projects.filter(project => project.id !== id);
        if (!state.projects.length) state.projects.push(Demo.createProject());
        if (state.active === id) {
          state.active = state.projects[0].id;
          sceneId = "";
          promptShotId = "";
          boardIndex = 0;
        }
        save({touch: false});
        render();
        toast("Projet supprimé");
      }
    });
  }

  function openSceneEditor(add = false) {
    const scene = add ? engine.newScene() : selectedScene();
    const descriptors = [
      ["name", "Titre de la scène", "text", "Ex. Le quai"],
      ["location", "Lieu", "text", "Ex. Quai du métro"],
      ["scriptNumber", "Numéro dans le script", "text", "Ex. 2A"],
      ["sequence", "Séquence", "text", "Ex. Le retour"],
      ["setting", "Intérieur / extérieur", "text", ""],
      ["time", "Moment", "text", "Ex. Heure bleue"],
      ["chrono", "Chrono / durée", "text", "Ex. 00:10–00:22"],
      ["source", "Passage du scénario", "area", "Actions et dialogues de la scène"],
      ...engine.sceneBriefFields.map(([name, label]) => [name, label, ["atmosphere", "palette", "transition"].includes(name) ? "text" : "area", ""])
    ];
    const fields = descriptors.map(([name, label, type, placeholder]) => {
      const control = type === "area" ? areaControl(name, scene[name], {label, placeholder}) : textControl(name, scene[name], "scene", {
        placeholder, choices: engine.values[name], attrs: name === "name" ? 'required maxlength="140" data-initial-focus' : ""
      });
      return field(label, control, type === "area" ? "field-wide" : "");
    }).join("");
    openDialog(add ? "add-scene" : "edit-scene", {
      title: add ? "Ajouter une scène" : "Paramètres de scène",
      description: add ? "Décrivez la scène et son passage de scénario." : scene.name, symbol: "film",
      body: `<div class="field-grid">${fields}</div>`,
      footer: `${add ? "" : `<div class="scene-dialog-tools">
        ${button("Monter la scène", {action: "move-scene-up", symbol: "up", kind: "quiet", iconOnly: true, attrs: project().scenes.indexOf(scene) === 0 ? "disabled" : ""})}
        ${button("Descendre la scène", {action: "move-scene-down", symbol: "moveDown", kind: "quiet", iconOnly: true, attrs: project().scenes.indexOf(scene) === project().scenes.length - 1 ? "disabled" : ""})}
        ${button("Supprimer la scène", {action: "delete-scene", symbol: "trash", kind: "quiet danger-text", iconOnly: true})}
      </div>`}<div class="footer-spacer"></div>${cancelButton()}${button(add ? "Ajouter la scène" : "Enregistrer", {type: "submit", kind: "primary", symbol: "check"})}`
    });
  }

  function openCountEditor() {
    const scene = selectedScene();
    const recommended = engine.suggestedCount(scene);
    const limit = Math.max(engine.MAX_SHOTS, recommended, scene.shots.length);
    openDialog("shot-count", {
      title: "Ajuster les plans", symbol: "sliders", description: scene.name || "Nombre de plans pour cette scène",
      body: `<div class="count-suggestion"><span>${icon("sparkle")} ${plural(recommended, "plan proposé", "plans proposés")}</span>${button("Utiliser cette proposition", {action: "use-count", kind: "text-button", attrs: `data-count="${recommended}"`})}</div>
        ${field("Nombre de plans pour cette scène", textControl("count", String(scene.shots.length || recommended), "count", {
          type: "number", attrs: `min="1" max="${limit}" step="1" required data-initial-focus`
        }))}
        <p class="field-hint">Les plans ajoutés reçoivent une proposition de cadrage, de mouvement et de lumière. Si vous réduisez le nombre, les plans en fin de scène seront retirés.</p>`,
      footer: cancelButton() + button("Appliquer", {type: "submit", kind: "primary", symbol: "check"})
    });
  }

  function openProjectSettings() {
    const current = project();
    const metadata = ScriptAnalysis.inspect(ScriptPreparation.activeScript(current)).metadata;
    const detected = {...current, ...engine.metadataUpdates(current, metadata)};
    const [title, synopsis, intention, artDirection, chrono, ...remaining] = engine.projectBriefFields;
    const fields = [title, chrono, synopsis, intention, artDirection, ...remaining, ["negative", "Éléments à exclure"]];
    openDialog("project-settings", {
      title: "Indications du projet", symbol: "sun", wide: true,
      description: "Choisissez des pistes de réalisation, puis adaptez les textes repris dans vos prompts.",
      body: `<div class="brief-fields">${fields.map(([key, label], index) => renderBriefField(detected, key, label, index)).join("")}</div>`,
      footer: cancelButton() + button("Enregistrer", {type: "submit", kind: "primary", symbol: "check"})
    });
  }

  function renderBriefField(current, key, label, index) {
    const choices = ProjectIdeas.forField(key);
    const input = ["scriptTitle", "chrono"].includes(key)
      ? textControl(key, current[key], "brief", {attrs: index === 0 ? "data-initial-focus" : ""})
      : areaControl(key, current[key], {label, rows: key === "synopsis" ? 4 : 3});
    const select = choices.length ? field("Choisir une suggestion", `<select aria-label="Suggestions pour ${escape(label.toLocaleLowerCase("fr"))}" data-brief-suggestions="${key}">
      <option value="">Choisissez un point de départ</option>${optionList(choices.map(({label}, index) => [String(index), label]), "")}
    </select>`) + `<div class="brief-suggestion" data-brief-preview="${key}" aria-live="polite" hidden></div>` : "";
    const synopsis = key === "synopsis" ? `<div class="synopsis-tools">${button("Proposer un synopsis", {
      action: "generate-synopsis", symbol: "sparkle", kind: "outline", attrs: current.script.trim() ? "" : "disabled"
    })}<p class="field-hint">À partir du script validé.</p></div><div class="brief-suggestion" data-brief-preview="synopsis" aria-live="polite" hidden></div>` : "";
    return `<div class="brief-field${key === "synopsis" ? " brief-wide" : ""}">${field(label, input)}${select}${synopsis}</div>`;
  }

  function showBriefSuggestion(key, suggestion) {
    const preview = dialog.querySelector(`[data-brief-preview="${key}"]`);
    preview.hidden = !suggestion;
    if (!suggestion) {
      preview.replaceChildren();
      return;
    }
    const {text, colors, link} = suggestion;
    const swatches = colors?.map(([color, code]) => `<span class="palette-chip" title="${escape(color + " " + code)}">
      <span style="--swatch: ${code}" aria-hidden="true"></span><small>${escape(code)}</small></span>`).join("");
    preview.innerHTML = `
      ${swatches ? `<div class="palette-preview" aria-label="Nuancier">${swatches}</div>` : ""}
      <p>${escape(text)}</p>
      <div class="inline-actions brief-suggestion-actions">
        ${button("Utiliser cette suggestion", {action: "apply-brief-suggestion", kind: "secondary", attrs: `data-field="${key}"`})}
        ${link ? `<a href="${link}" target="_blank" rel="noopener noreferrer">Voir la référence ${icon("arrow")}</a>` : ""}
      </div>`;
  }

  function proposeSynopsis() {
    const text = ScriptPreparation.synopsis(project().script);
    if (!text) return toast("Ajoutez des actions ou des dialogues au script validé pour proposer un synopsis.", "info");
    showBriefSuggestion("synopsis", {text});
  }

  function applyBriefSuggestion(fieldName) {
    const text = dialog.querySelector(`[data-brief-preview="${fieldName}"] > p`).textContent;
    const field = dialog.querySelector("form").elements.namedItem(fieldName);
    field.value = text;
    showBriefSuggestion(fieldName, null);
    const select = dialog.querySelector(`[data-brief-suggestions="${fieldName}"]`);
    if (select) select.value = "";
    field.focus();
  }

  function shotControl(name, label, type, shot, suggested) {
    const value = shot[name];
    let control;
    if (type === "area") {
      control = areaControl(name, value, {label, placeholder: suggested || "", rows: 3});
    } else if (type === "style") {
      control = `<select name="${name}">${optionList(styleChoices(true), value)}</select>`;
    } else {
      control = textControl(name, value, "shot", {
        placeholder: name === "ratio" ? "Format du projet" : suggested || "",
        choices: name === "ratio" ? engine.ratios : engine.values[name], type: type === "number" ? "number" : "text",
        attrs: type === "number" ? 'min="0" step="0.1"' : name === "title" ? 'maxlength="160" data-initial-focus' : ""
      });
    }
    return field(label, control, type === "area" ? "field-wide" : "");
  }

  function openShotEditor(shotId) {
    const scene = selectedScene();
    const index = scene.shots.findIndex(item => item.id === shotId);
    const shot = scene.shots[index] || engine.newShot();
    const adding = index < 0;
    const recommendation = engine.suggestShot(scene, adding ? scene.shots.length : index, scene.shots.length + Number(adding));
    activeShotGroup = 0;
    openDialog("shot", {
      title: adding ? "Ajouter un plan" : shot.title || "Éditer le plan",
      kicker: `${scene.name || "Scène sans titre"} / Plan ${number(adding ? scene.shots.length + 1 : index + 1)}`,
      symbol: "camera", wide: true,
      body: `
        <input type="hidden" name="shotId" value="${escape(adding ? "" : shot.id)}">
        ${shot.image ? `<div class="shot-reference"><img src="${escape(shot.image)}" alt="Image de référence du plan"></div>` : ""}
        <div class="shot-editor-toolbar">
          <div class="tabs" role="tablist" aria-label="Paramètres du plan">
            ${engine.shotGroups.map((group, groupIndex) => `<button type="button" class="tab${groupIndex === 0 ? " active" : ""}" role="tab" id="shot-tab-${groupIndex}" aria-controls="shot-group-${groupIndex}" aria-selected="${groupIndex === 0}" tabindex="${groupIndex === 0 ? 0 : -1}" data-action="shot-tab" data-index="${groupIndex}">${icon(group.icon)}${group.name}</button>`).join("")}
          </div>
          ${button("Suggestions", {action: "toggle-suggestions", symbol: "sparkle", kind: "outline", attrs: 'aria-expanded="false" aria-controls="suggestion-panel"'})}
        </div>
        <div id="suggestion-panel" class="suggestion-panel" hidden></div>
        ${engine.shotGroups.map((group, groupIndex) => `
          <section id="shot-group-${groupIndex}" class="field-grid shot-group" role="tabpanel" aria-labelledby="shot-tab-${groupIndex}" ${groupIndex ? "hidden" : ""}>
            ${group.fields.map(([name, label, type]) => shotControl(name, label, type, shot, recommendation[name])).join("")}
            ${group.icon === "camera" ? [["cameraArrow", "Flèche de mouvement caméra"], ["subjectArrow", "Flèche de mouvement sujet"]].map(([name, label]) =>
              field(label, `<select name="${name}">${optionList(Object.entries(engine.arrowDirections), shot[name] || "")}</select>`)).join("") : ""}
            ${group.icon === "film" ? `<div class="field field-wide"><span>Image de la case</span>
              <div class="inline-actions">${button("Importer une image", {action: "choose-shot-image", symbol: "upload", kind: "outline"})}
                ${button("Retirer l’image", {action: "clear-shot-image", symbol: "trash", kind: "quiet", attrs: shot.image ? "" : "hidden"})}</div>
              <input type="file" id="shot-image-file" accept="image/jpeg,image/png,image/webp" aria-label="Image de la case" hidden>
              <input type="hidden" name="image" value="${escape(shot.image || "")}"><small class="field-hint" id="shot-image-status">${shot.image ? "Image ajoutée" : "JPEG, PNG ou WebP"}</small>
            </div>` : ""}
          </section>`
        ).join("")}`,
      footer: `${adding ? "" : `<div class="scene-dialog-tools">
        ${button("Monter le plan", {action: "move-shot-up", symbol: "up", kind: "quiet", iconOnly: true, attrs: index === 0 ? "disabled" : ""})}
        ${button("Descendre le plan", {action: "move-shot-down", symbol: "moveDown", kind: "quiet", iconOnly: true, attrs: index === scene.shots.length - 1 ? "disabled" : ""})}
        ${button("Dupliquer le plan", {action: "duplicate-shot", symbol: "copy", kind: "quiet", iconOnly: true})}
        ${button("Supprimer le plan", {action: "delete-shot", symbol: "trash", kind: "quiet danger-text", iconOnly: true})}
      </div>`}<div class="footer-spacer"></div>${cancelButton()}${button(adding ? "Ajouter le plan" : "Enregistrer le plan", {type: "submit", kind: "primary", symbol: "check"})}`
    });
  }

  function chooseShotGroup(index, focus = false) {
    activeShotGroup = index;
    dialog.querySelectorAll('[role="tab"]').forEach((tab, i) => {
      const active = i === index;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && focus) tab.focus();
    });
    dialog.querySelectorAll('[role="tabpanel"]').forEach((panel, i) => { panel.hidden = i !== index; });
    if (!dialog.querySelector("#suggestion-panel").hidden) renderSuggestions();
  }

  function suggestions() {
    const scene = selectedScene();
    const shotId = dialog.querySelector('[name="shotId"]').value;
    const index = scene.shots.findIndex(item => item.id === shotId);
    return engine.suggestShot(scene, index < 0 ? scene.shots.length : index, scene.shots.length + Number(index < 0));
  }

  function renderSuggestions() {
    const proposed = suggestions();
    const panel = dialog.querySelector("#suggestion-panel");
    const group = engine.shotGroups[activeShotGroup];
    const available = group.fields.filter(([key]) => proposed[key]);
    panel.innerHTML = `<div class="suggestion-header"><strong>${icon("sparkle")} Suggestions · ${group.name}</strong>
      ${available.length ? button("Compléter les champs vides", {action: "fill-suggestions", kind: "text-button"}) : ""}</div>
      ${available.length ? `<div class="suggestion-list">${available.map(([key, label]) =>
        `<button type="button" class="suggestion-chip" data-action="apply-suggestion" data-field="${key}" title="${escape(proposed[key])}"><span>${label}</span><strong>${escape(proposed[key])}</strong>${icon("plus")}</button>`
      ).join("")}</div>` : "<p>Aucune suggestion pour ces paramètres.</p>"}`;
  }

  function toggleSuggestions(buttonElement) {
    const panel = dialog.querySelector("#suggestion-panel");
    panel.hidden = !panel.hidden;
    buttonElement.setAttribute("aria-expanded", String(!panel.hidden));
    if (!panel.hidden) renderSuggestions();
  }

  function applySuggestions(fieldName) {
    const form = dialog.querySelector("form");
    const proposed = suggestions();
    const fields = fieldName ? [fieldName] : engine.shotGroups[activeShotGroup].fields.map(([name]) => name);
    let applied = 0;
    for (const key of fields) {
      const input = form.elements.namedItem(key);
      if (input && proposed[key] && (fieldName || !input.value.trim())) {
        input.value = proposed[key];
        applied += 1;
        if (fieldName) input.focus();
      }
    }
    if (applied) toast(plural(applied, "suggestion appliquée", "suggestions appliquées"));
  }

  function confirmChange({title, description, label, action, destructive = true}) {
    confirmAction = action;
    confirmDialog.setAttribute("aria-labelledby", "confirm-title");
    confirmDialog.innerHTML = `<form method="dialog" class="dialog-form">
      <div class="dialog-header"><div class="dialog-heading"><span class="panel-icon">${icon("info")}</span><div><h2 id="confirm-title">${escape(title)}</h2><p>${escape(description)}</p></div></div></div>
      <div class="dialog-footer">
        <button class="button quiet" value="cancel" autofocus>Annuler</button>
        <button class="button ${destructive ? "danger" : "primary"}" value="confirm">${escape(label)}</button>
      </div>
    </form>`;
    confirmDialog.showModal();
  }

  function analyzeScript() {
    const current = project();
    const script = ScriptPreparation.activeScript(current).trim();
    if (!script) return;
    const fixedInput = document.getElementById("fixed-count");
    if (current.countMode === "fixed" && !fixedInput.reportValidity()) return;
    const inspection = ScriptAnalysis.inspect(script);
    const scenes = engine.analyze({...current, script}, inspection);
    if (!scenes.length) {
      toast("Ajoutez une scène ou une action au scénario.", "info");
      return;
    }
    const retainedShots = new Set(scenes.flatMap(scene => scene.shots.map(shot => shot.id)));
    const removed = current.scenes.flatMap(scene => scene.shots)
      .filter(shot => !retainedShots.has(shot.id) && shot.edited !== false).length;
    const apply = () => {
      current.scenes = scenes;
      Object.assign(current, engine.metadataUpdates(current, inspection.metadata));
      current.analyzedScript = script;
      current.analyzedCount = engine.countSignature(current);
      current.analysisVersion = engine.ANALYSIS_VERSION;
      promptShotId = "";
      save();
      go("decoupage");
      toast(`${plural(scenes.length, "scène")} · ${plural(retainedShots.size, "plan")}`);
    };
    if (removed) {
      confirmChange({title: "Mettre à jour le découpage", description: `La nouvelle analyse remplace ou retire ${plural(removed, "plan existant", "plans existants")} dont les réglages peuvent avoir été personnalisés.`, label: "Mettre à jour", action: apply});
    } else {
      apply();
    }
  }

  function fileNameFor(current, tail = "") {
    const safe = titleOf(current).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    return `${safe || "storyboard"}${tail}.txt`;
  }

  function downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = Object.assign(document.createElement("a"), {href: url, download: filename});
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  }

  function downloadText(content, filename) {
    downloadFile(new Blob([content], {type: "text/plain;charset=utf-8"}), filename);
  }

  async function downloadBoardImage(buttonElement) {
    const current = project();
    const boards = engine.layoutBoards(engine.listShots(current), current.boardSizes);
    const board = boards[Math.min(boardIndex, boards.length - 1)];
    if (!board) return;
    buttonElement.disabled = true;
    try {
      const image = await BoardImage.render(current, board);
      if (!image) throw new Error("PNG indisponible");
      downloadFile(image, fileNameFor(current, "-planche-" + number(board.number)).replace(/\.txt$/, ".png"));
      toast("Planche PNG exportée");
    } catch {
      toast("Impossible d’exporter cette planche en PNG.", "info");
    } finally {
      buttonElement.disabled = false;
    }
  }

  function downloadPrompts(all) {
    const current = project();
    if (promptMode === "board") {
      const boards = engine.layoutBoards(engine.listShots(current), current.boardSizes);
      if (!boards.length) return;
      const selected = boards[Math.min(boardIndex, boards.length - 1)];
      const prompts = (all ? boards : [selected]).map(board => engine.buildBoardPrompt(current, board, boards.length));
      const suffix = all ? "-planches" : "-planche-" + number(selected.number);
      downloadText(prompts.join("\n\n" + "─".repeat(52) + "\n\n"), fileNameFor(current, suffix));
      toast(all ? "Prompts des planches exportés" : "Prompt de la planche exporté");
      return;
    }
    if (all) {
      const prompts = current.scenes.flatMap((scene, index) => scene.shots.map((shot, shotIndex) => engine.buildPrompt(current, scene, shot, index + 1, shotIndex + 1)));
      if (!prompts.length) return;
      downloadText(prompts.join("\n\n" + "─".repeat(52) + "\n\n"), fileNameFor(current, "-prompts"));
      toast("Prompts exportés");
    } else {
      const {scene, shot} = promptSelection();
      if (!shot) return;
      const sceneNumber = current.scenes.indexOf(scene) + 1;
      const shotNumber = scene.shots.indexOf(shot) + 1;
      downloadText(engine.buildPrompt(current, scene, shot, sceneNumber, shotNumber), fileNameFor(current, `-scene-${number(sceneNumber)}-plan-${number(shotNumber)}`));
      toast("Prompt exporté");
    }
  }

  function updateBoardLayout(action, index, count) {
    const current = project();
    const sizes = engine.layoutBoards(engine.listShots(current), current.boardSizes).map(board => board.cells.length);
    if (!sizes.length) return;
    const restoreFocus = action !== "resize" || document.activeElement === document.getElementById("board-size-" + index);
    if (action === "split") {
      index = sizes.length - 1;
      if (sizes[index] < 2) return;
      sizes.splice(index, 1, sizes[index] - 1, 1);
      boardIndex = index;
    } else if (action === "merge") {
      sizes.splice(index, 2, sizes[index] + sizes[index + 1]);
      boardIndex = Math.min(boardIndex, sizes.length - 1);
    } else {
      if (count === sizes[index]) return;
      const delta = count - sizes[index];
      sizes[index] = count;
      if (delta < 0) {
        if (index + 1 === sizes.length) sizes.push(-delta);
        else sizes[index + 1] -= delta;
      } else {
        let remaining = delta;
        for (let next = index + 1; remaining > 0 && next < sizes.length;) {
          if (sizes[next] > remaining) {
            sizes[next] -= remaining;
            remaining = 0;
          } else {
            remaining -= sizes[next];
            sizes.splice(next, 1);
          }
        }
      }
      boardIndex = index;
    }
    current.boardSizes = sizes.slice(0, -1);
    save();
    boardConfigOpen = true;
    const entries = engine.listShots(current);
    const boards = engine.layoutBoards(entries, current.boardSizes);
    document.getElementById("board-preview-content").innerHTML = renderBoardPreview(current, boards);
    document.getElementById("prompt-count").textContent = plural(entries.length, "plan exportable", "plans exportables") + " · " + plural(boards.length, "planche");
    const input = document.getElementById("board-size-" + index);
    if (restoreFocus) input?.focus({preventScroll: true});
  }

  async function copyPrompt() {
    const pre = document.getElementById("prompt-text");
    if (!pre) return;
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(pre.textContent);
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(pre);
      selection.removeAllRanges();
      selection.addRange(range);
      try {
        if (!document.execCommand("copy")) throw new Error("Clipboard unavailable");
        selection.removeAllRanges();
      } catch {
        toast("Prompt sélectionné. Utilisez la commande Copier de votre navigateur.", "info");
        return;
      }
    }
    toast("Prompt copié");
  }

  function toast(message, symbol = "check") {
    const item = document.createElement("div");
    item.className = "toast";
    item.innerHTML = `<span>${icon(symbol)}</span><p>${escape(message)}</p>`;
    document.getElementById("toasts").append(item);
    setTimeout(() => item.remove(), 3400);
  }

  async function importScript(file) {
    if (!file) return;
    const current = project();
    const request = ++importRequest;
    const isCurrent = () => page === "scenario" && project().id === current.id && request === importRequest;
    const status = message => {
      if (!isCurrent()) return;
      const target = document.getElementById("import-status");
      target.textContent = message;
      target.hidden = !message;
    };
    status("Lecture de " + file.name + "…");
    let extracted;
    try {
      extracted = await ScriptImport.read(file, (number, total) => status("Lecture du PDF · page " + number + " / " + total));
    } catch (error) {
      status(error.message);
      return;
    }
    if (!isCurrent()) return;
    status(current.importNote || "");
    const {text: imported, emptyPages} = extracted;
    const apply = () => {
      if (!isCurrent()) return;
      if (current.script.trim() !== imported.trim() && current.technicalScript) current.technicalStale = true;
      current.script = imported;
      current.scriptMode = "source";
      current.importNote = emptyPages.length
        ? "Pages sans texte sélectionnable ignorées · " + emptyPages.slice(0, 10).join(", ") + (emptyPages.length > 10 ? "…" : "") + ". Vérifiez le PDF si elles contiennent du texte scanné."
        : "";
      if (!current.name.trim()) current.name = (engine.nameFromScript(imported) || file.name.replace(/\.[^.]+$/, "")).slice(0, 120);
      save();
      render();
      document.getElementById("script-input")?.focus();
      toast("Scénario importé");
    };
    if (current.script.trim() && current.script.trim() !== imported.trim()) {
      confirmChange({title: "Importer ce scénario", description: "Le contenu du fichier remplacera le texte du script validé.", label: "Importer", action: apply, destructive: false});
    } else {
      apply();
    }
  }

  function changeShotCount(count) {
    const scene = selectedScene();
    const apply = () => {
      scene.shots = engine.fillShots(scene, count);
      dialog.close();
      save();
      render();
      toast(plural(count, "plan") + " dans la scène");
    };
    if (count < scene.shots.length) {
      confirmChange({title: "Réduire le nombre de plans", description: `${plural(scene.shots.length - count, "plan")} en fin de scène seront retirés.`, label: "Retirer les plans", action: apply});
    } else {
      apply();
    }
  }

  function setShotImage(value) {
    const input = dialog.querySelector('[name="image"]');
    if (!input) return;
    input.value = value;
    dialog.querySelector("#shot-image-status").textContent = value ? "Image ajoutée" : "JPEG, PNG ou WebP";
    dialog.querySelector('[data-action="clear-shot-image"]').hidden = !value;
  }

  async function importShotImage(file) {
    if (!file || !["image/jpeg", "image/png", "image/webp"].includes(file.type)) return;
    const form = dialog.querySelector("form");
    const url = URL.createObjectURL(file);
    try {
      const image = new Image();
      image.src = url;
      await image.decode();
      const scale = Math.min(1, 720 / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext("2d");
      context.fillStyle = "#221a2d";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      if (dialog.open && form?.isConnected) setShotImage(canvas.toDataURL("image/jpeg", .78));
    } catch {
      toast("Impossible de lire cette image.", "info");
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  function formValues(form) {
    return Object.fromEntries([...new FormData(form)].map(([key, value]) => [key, String(value).trim()]));
  }

  function editExistingShot(shotId, values) {
    const shot = selectedScene().shots.find(item => item.id === shotId);
    if (shot) {
      const editedFields = new Set(shot.editedFields || (shot.edited === undefined ? Object.keys(values).filter(field => shot[field]) : []));
      for (const [field, value] of Object.entries(values)) {
        if (String(shot[field] ?? "") !== value) editedFields.add(field);
      }
      Object.assign(shot, values, {edited: Boolean(editedFields.size) || shot.manual === true, editedFields: [...editedFields]});
    }
    return shot;
  }

  function manageShot(action) {
    const scene = selectedScene();
    const {shotId, ...values} = formValues(dialog.querySelector("form"));
    const index = scene.shots.findIndex(shot => shot.id === shotId);
    const existing = scene.shots[index];
    if (!existing) return;
    if (action === "delete-shot") {
      confirmChange({
        title: "Supprimer le plan",
        description: `« ${existing.title || "Plan sans titre"} » sera retiré de la scène.`,
        label: "Supprimer",
        action: () => {
          scene.shots.splice(index, 1);
          if (promptShotId === shotId) promptShotId = "";
          dialog.close();
          save();
          render();
          toast("Plan supprimé");
        }
      });
      return;
    }
    if (action === "duplicate-shot" && scene.shots.length >= engine.MAX_SHOTS) {
      toast(`Une scène peut contenir jusqu’à ${engine.MAX_SHOTS} plans.`, "info");
      return;
    }
    if (!dialog.querySelector("form").reportValidity()) return;
    const shot = editExistingShot(shotId, values);
    if (action === "duplicate-shot") {
      const duplicate = {...shot, id: engine.newShot().id, title: `${shot.title || "Plan"} — copie`, sourceKey: "", manual: true, edited: true};
      scene.shots.splice(index + 1, 0, duplicate);
      promptShotId = duplicate.id;
      dialog.close();
      save();
      render();
      toast("Plan dupliqué");
      return;
    }
    const next = index + (action === "move-shot-up" ? -1 : 1);
    if (next < 0 || next >= scene.shots.length) return;
    scene.shots.splice(index, 1);
    scene.shots.splice(next, 0, shot);
    dialog.close();
    save();
    render();
    toast("Ordre des plans mis à jour");
  }

  function manageScene(action) {
    const current = project();
    const scene = selectedScene();
    const index = current.scenes.indexOf(scene);
    if (action === "delete-scene") {
      confirmChange({
        title: "Supprimer la scène",
        description: `« ${scene.name || "Scène sans titre"} » et ses plans seront retirés du découpage.`,
        label: "Supprimer",
        action: () => {
          current.scenes.splice(index, 1);
          sceneId = current.scenes[Math.max(0, index - 1)]?.id || "";
          promptShotId = "";
          dialog.close();
          save();
          render();
          toast("Scène supprimée");
        }
      });
      return;
    }
    if (!dialog.querySelector("form").reportValidity()) return;
    const next = index + (action === "move-scene-up" ? -1 : 1);
    if (next < 0 || next >= current.scenes.length) return;
    Object.assign(scene, formValues(dialog.querySelector("form")));
    current.scenes.splice(index, 1);
    current.scenes.splice(next, 0, scene);
    dialog.close();
    save();
    render();
    toast("Ordre des scènes mis à jour");
  }

  const actions = {
    "new-project": openNewProject,
    "edit-project": element => editProject(element.dataset.id),
    "delete-project": element => deleteProject(element.dataset.id),
    "open-project": element => useProject(element.dataset.id),
    "open-demo": element => {
      if (!state.projects.some(item => item.id === "exemple")) state.projects.push(Demo.createProject());
      if (dialog.open) dialog.close();
      useProject("exemple", "decoupage", element.dataset.id);
    },
    guide: openGuide,
    "open-sidebar": () => setSidebar(true),
    "close-sidebar": () => setSidebar(false),
    "close-dialog": () => dialog.close(),
    "choose-file": () => document.getElementById("script-file").click(),
    "prepare-script": prepareScript,
    "show-source-script": () => showScriptMode("source"),
    "show-technical-script": () => showScriptMode("technical"),
    analyze: analyzeScript,
    "select-scene": element => {
      sceneId = element.dataset.id;
      promptShotId = "";
      render();
      view.querySelector('.scene-link.active')?.focus();
    },
    "add-scene": () => openSceneEditor(true),
    "edit-scene": () => openSceneEditor(false),
    "delete-scene": () => manageScene("delete-scene"),
    "move-scene-up": () => manageScene("move-scene-up"),
    "move-scene-down": () => manageScene("move-scene-down"),
    "shot-count": openCountEditor,
    "use-count": element => { dialog.querySelector("#count-count").value = element.dataset.count; },
    "add-shot": () => {
      if (selectedScene().shots.length >= engine.MAX_SHOTS) {
        toast(`Une scène peut contenir jusqu’à ${engine.MAX_SHOTS} plans.`, "info");
        return;
      }
      openShotEditor("");
    },
    "edit-shot": element => openShotEditor(element.dataset.id),
    "choose-shot-image": () => document.getElementById("shot-image-file").click(),
    "clear-shot-image": () => setShotImage(""),
    "duplicate-shot": () => manageShot("duplicate-shot"),
    "delete-shot": () => manageShot("delete-shot"),
    "move-shot-up": () => manageShot("move-shot-up"),
    "move-shot-down": () => manageShot("move-shot-down"),
    "shot-tab": element => chooseShotGroup(Number(element.dataset.index)),
    "toggle-suggestions": toggleSuggestions,
    "apply-suggestion": element => applySuggestions(element.dataset.field),
    "fill-suggestions": () => applySuggestions(),
    "open-prompt": element => {
      promptMode = "plan";
      sceneId = selectedScene().id;
      promptShotId = element.dataset.id;
      go("rendu");
    },
    "project-settings": openProjectSettings,
    "generate-synopsis": proposeSynopsis,
    "apply-brief-suggestion": element => applyBriefSuggestion(element.dataset.field),
    "prompt-plan": () => { promptMode = "plan"; render(); view.querySelector('[data-action="prompt-plan"]')?.focus(); },
    "prompt-board": () => { promptMode = "board"; boardConfigOpen = true; render(); view.querySelector('[data-action="prompt-board"]')?.focus(); },
    "add-board": () => updateBoardLayout("split"),
    "merge-board": element => updateBoardLayout("merge", Number(element.dataset.index)),
    "download-prompts": () => downloadPrompts(true),
    "download-prompt": () => downloadPrompts(false),
    "download-board-image": downloadBoardImage,
    "copy-prompt": copyPrompt
  };

  document.addEventListener("click", event => {
    const target = event.target.closest("[data-action], [data-nav]");
    if (!target || target.disabled) return;
    if (target.dataset.nav) {
      event.preventDefault();
      go(target.dataset.nav);
    } else {
      actions[target.dataset.action]?.(target);
    }
  });

  view.addEventListener("input", event => {
    const input = event.target;
    const key = input.dataset.projectField;
    if (!key) return;
    const current = project();
    current[key] = key === "fixedCount" ? Number(input.value) : input.value;
    if (key === "script") {
      current.technicalStale = Boolean(current.technicalScript);
      current.importNote = "";
      document.getElementById("import-status").hidden = true;
    }
    if (key === "technicalScript") current.technicalEdited = true;
    save();
    if (key === "script" || key === "technicalScript") {
      clearTimeout(scriptStatsTimer);
      scriptStatsTimer = setTimeout(refreshScriptStats, 150);
    }
    if (key === "name") {
      const crumb = topbar.querySelector(".crumb-project");
      if (crumb) crumb.textContent = titleOf(project());
      renderSidebar();
    }
    if (page === "rendu") refreshPrompt();
  });

  view.addEventListener("change", event => {
    const input = event.target;
    if (input.name === "count-mode") {
      project().countMode = input.value;
      document.getElementById("fixed-field").hidden = input.value !== "fixed";
      save();
    }
    if (input.name === "render-style") {
      project().style = input.value;
      save();
      refreshPrompt();
    }
    if (input.id === "script-file") {
      importScript(input.files[0]);
      input.value = "";
    }
    if (input.id === "prompt-scene") {
      sceneId = input.value;
      promptShotId = "";
      view.innerHTML = renderPrompts();
      document.getElementById("prompt-scene")?.focus();
    }
    if (input.id === "prompt-shot") {
      promptShotId = input.value;
      view.innerHTML = renderPrompts();
      document.getElementById("prompt-shot")?.focus();
    }
    if (input.id === "prompt-board") {
      boardConfigOpen = view.querySelector(".board-config")?.open;
      boardIndex = Number(input.value);
      view.innerHTML = renderPrompts();
      document.getElementById("prompt-board")?.focus();
    }
    if (input.dataset.boardSize !== undefined && input.checkValidity()) {
      updateBoardLayout("resize", Number(input.dataset.boardSize), input.valueAsNumber);
    }
  });

  view.addEventListener("focusout", event => {
    const input = event.target;
    if (input.dataset.boardSize === undefined || !input.isConnected || input.value === input.defaultValue) return;
    if (!input.checkValidity()) {
      input.value = input.defaultValue;
      toast("Entrez un nombre de plans compris entre 1 et " + input.max + ".", "info");
      return;
    }
    updateBoardLayout("resize", Number(input.dataset.boardSize), input.valueAsNumber);
  });

  view.addEventListener("keydown", event => {
    if (event.key === "Enter" && event.target.dataset.boardSize !== undefined) {
      event.preventDefault();
      event.target.blur();
    }
  });

  dialog.addEventListener("submit", event => {
    event.preventDefault();
    const values = formValues(event.target);
    const current = project();
    const scene = selectedScene();
    const kind = activeDialog;
    if (kind === "edit-project") {
      const item = state.projects.find(project => project.id === values.projectId);
      if (!item || !values.name) return;
      item.name = values.name;
      item.updated = Date.now();
      dialog.close();
      save({touch: false});
      render();
      toast("Projet modifié");
      return;
    }
    if (kind === "new-project") {
      const created = engine.newProject(values.name);
      state.projects.push(created);
      dialog.close();
      useProject(created.id, "scenario");
      requestAnimationFrame(() => document.getElementById(values.name ? "script-input" : "project-name")?.focus());
      return;
    }
    if (kind === "shot-count") {
      changeShotCount(engine.boundedCount(values.count));
      return;
    }
    if (kind === "add-scene") {
      const added = engine.newScene({...values, manual: true});
      current.scenes.push(added);
      sceneId = added.id;
      promptShotId = "";
    } else if (kind === "edit-scene") {
      Object.assign(scene, values);
    } else if (kind === "shot") {
      const {shotId, ...fields} = values;
      if (shotId) {
        editExistingShot(shotId, fields);
      } else {
        const added = engine.newShot({...fields, manual: true, edited: true});
        scene.shots.push(added);
        promptShotId = added.id;
      }
    } else if (kind === "project-settings") {
      const overrides = new Set(current.briefOverrides || []);
      for (const [key, value] of Object.entries(values)) {
        if (value !== (event.target.elements.namedItem(key).defaultValue || "").trim()) overrides.add(key);
      }
      Object.assign(current, values);
      current.briefOverrides = [...overrides];
      current.detectedMetadata = ScriptAnalysis.inspect(ScriptPreparation.activeScript(current)).metadata;
    } else {
      return;
    }
    dialog.close();
    save();
    render();
    toast(kind === "shot" ? "Plan enregistré" : kind === "add-scene" ? "Scène ajoutée" : "Modifications enregistrées");
  });

  dialog.addEventListener("change", event => {
    const input = event.target;
    if (input.id === "shot-image-file") importShotImage(input.files[0]);
    const key = input.dataset.briefSuggestions;
    if (key) showBriefSuggestion(key, input.value === "" ? null : ProjectIdeas.forField(key)[Number(input.value)]);
  });

  dialog.addEventListener("keydown", event => {
    const tab = event.target.closest('[role="tab"]');
    if (!tab) return;
    const count = engine.shotGroups.length;
    const target = {ArrowRight: (activeShotGroup + 1) % count, ArrowLeft: (activeShotGroup + count - 1) % count, Home: 0, End: count - 1}[event.key];
    if (target === undefined) return;
    event.preventDefault();
    chooseShotGroup(target, true);
  });

  dialog.addEventListener("close", () => {
    if (dialog.open) return;
    activeDialog = "";
    dialog.replaceChildren();
    if (dialogReturnFocus?.isConnected) dialogReturnFocus.focus();
    dialogReturnFocus = null;
  });

  confirmDialog.addEventListener("close", () => {
    const action = confirmAction;
    confirmAction = null;
    if (confirmDialog.returnValue === "confirm") action?.();
    confirmDialog.returnValue = "";
  });

  view.addEventListener("dragenter", event => {
    const panel = event.target.closest(".script-panel");
    if (!panel || !event.dataTransfer.types.includes("Files")) return;
    event.preventDefault();
    dragDepth += 1;
    panel.classList.add("dragging");
  });

  view.addEventListener("dragover", event => {
    if (event.target.closest(".script-panel") && event.dataTransfer.types.includes("Files")) event.preventDefault();
  });

  view.addEventListener("dragleave", event => {
    const panel = event.target.closest(".script-panel");
    if (!panel || !dragDepth) return;
    dragDepth -= 1;
    if (!dragDepth) panel.classList.remove("dragging");
  });

  view.addEventListener("drop", event => {
    const panel = event.target.closest(".script-panel");
    if (!panel || !event.dataTransfer.files.length) return;
    event.preventDefault();
    dragDepth = 0;
    panel.classList.remove("dragging");
    importScript(event.dataTransfer.files[0]);
  });

  window.addEventListener("hashchange", () => {
    page = readPage();
    setSidebar(false);
    render();
    window.scrollTo(0, 0);
    view.focus({preventScroll: true});
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && document.querySelector(".shell").classList.contains("sidebar-open")) {
      setSidebar(false);
      topbar.querySelector('[data-action="open-sidebar"]')?.focus();
    }
  });

  render();
  if (page === "accueil") {
    try { if (!localStorage.getItem(guideKey)) openGuide(); } catch {}
  }
})();
