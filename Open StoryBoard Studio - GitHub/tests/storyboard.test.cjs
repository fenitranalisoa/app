"use strict";

const assert = require("node:assert/strict");
const {readFileSync} = require("node:fs");
const {resolve} = require("node:path");
const {test} = require("node:test");
const vm = require("node:vm");

const scope = vm.createContext({});
for (const file of ["script.js", "storyboard.js", "script-preparation.js"]) {
  vm.runInContext(readFileSync(resolve(__dirname, "..", file), "utf8"), scope, {filename: file});
}
const Script = vm.runInContext("ScriptAnalysis", scope);
const Storyboard = vm.runInContext("Storyboard", scope);
const Preparation = vm.runInContext("ScriptPreparation", scope);

function generate(script, count) {
  const project = Storyboard.newProject("", script);
  if (count) Object.assign(project, {countMode: "fixed", fixedCount: count});
  return update(project);
}

function update(project) {
  const inspection = Script.inspect(project.script);
  Object.assign(project, Storyboard.metadataUpdates(project, inspection.metadata), {
    scenes: Storyboard.analyze(project, inspection),
    analyzedScript: project.script.trim(),
    analyzedCount: Storyboard.countSignature(project),
    analysisVersion: Storyboard.ANALYSIS_VERSION
  });
  return project;
}

const technicalScript = [
  "# Traversées",
  "",
  "Note d’intention : Faire sentir l’hésitation.",
  "D.A. : Éclairage ambré et noir mat.",
  "Format : 2.39:1",
  "",
  "## Séquence 1 — La lettre",
  "### Scène 7 — INT. CUISINE — NUIT",
  "Intention : Cacher la lettre.",
  "DA : Ombres portées.",
  "PLAN 1 — L’entrée (00:00–00:04)",
  "Action : Léa entre dans la cuisine.",
  "Caméra : Plan large, travelling avant lent, 35 mm.",
  "Son : Le frigo bourdonne.",
  "PLAN 2 — INSERT SUR L’ENVELOPPE",
  "00:04 à 00:07 : Léa glisse la lettre sous une tasse.",
  "",
  "### Scène 8 — INT. CUISINE — NUIT",
  "Intention : Découvrir la lettre.",
  "PLAN 1 — Le doute — Chrono : 00:07–00:11 — Action : Noé soulève la tasse.",
  "Cadrage : Gros plan",
  "PLAN 2",
  "Action : Il déplie la lettre.",
  "Chrono : 00:11–00:18"
].join("\n");

test("récupère les intentions, la DA, le chrono et les plans de deux scènes au même endroit", () => {
  const project = generate(technicalScript);
  assert.equal(project.name, "Traversées");
  assert.equal(project.intention, "Faire sentir l’hésitation.");
  assert.equal(project.artDirection, "Éclairage ambré et noir mat.");
  assert.equal(project.ratio, "2.39:1");
  assert.equal(project.chrono, "00:00–00:18");
  assert.equal(project.scenes.length, 2);
  const [first, second] = project.scenes;
  assert.notEqual(first.id, second.id);
  assert.equal(first.location, second.location);
  assert.equal(first.time, second.time);
  assert.equal(first.scriptNumber, "7");
  assert.equal(second.scriptNumber, "8");
  assert.equal(first.sequence, "Séquence 1 — La lettre");
  assert.equal(first.intention, "Cacher la lettre.");
  assert.equal(second.intention, "Découvrir la lettre.");
  assert.equal(first.artDirection, "Ombres portées.");
  assert.equal(first.chrono, "00:00–00:07");
  assert.equal(second.chrono, "00:07–00:18");
  assert.equal(first.shots.length, 2);
  assert.equal(second.shots.length, 2);
  assert.equal(first.shots[0].title, "L’entrée");
  assert.equal(first.shots[0].scale, "Plan large");
  assert.equal(first.shots[0].movement, "Travelling avant lent");
  assert.equal(first.shots[0].lens, "35 mm");
  assert.equal(first.shots[0].sound, "Le frigo bourdonne.");
  assert.equal(first.shots[1].scale, "Insert");
  assert.equal(first.shots[1].action, "Léa glisse la lettre sous une tasse.");
  assert.equal(first.shots[1].duration, "3");
  assert.equal(second.shots[0].chrono, "00:07–00:11");
  assert.equal(second.shots[1].action, "Il déplie la lettre.");
});

test("distingue les en-têtes identiques, les ruptures temporelles et les répliques", () => {
  const project = generate([
    "INT. SALON — NUIT",
    "Ana ferme la porte, puis elle pose son sac.",
    "",
    "Plus tard, Ana cherche son sac.",
    "",
    "INT. SALON — NUIT",
    "ANA",
    "On y va ?",
    "NOÉ",
    "J’arrive.",
    "",
    "INT. SALON — NUIT",
    "Le salon est vide."
  ].join("\n"));
  assert.equal(project.scenes.length, 4);
  assert.equal(new Set(project.scenes.map(scene => scene.id)).size, 4);
  assert.equal(project.scenes[0].shots.length, 2);
  assert.equal(project.scenes[1].location, "Salon");
  assert.equal(project.scenes[1].time, "Plus tard");
  assert.equal(project.scenes[2].shots[0].dialogue, "ANA — On y va ?");
  assert.equal(project.scenes[2].shots[1].dialogue, "NOÉ — J’arrive.");
  assert.equal(project.scenes[3].shots[0].action, "Le salon est vide.");
});

test("lit un tableau et des chronos en secondes, y compris les décimales", () => {
  const project = generate([
    "| Scène | Plan | Chrono | Image | Son |",
    "|---|---|---|---|---|",
    "| 01 – Quai | 01 | 0–4 s | Nina marche. | Roulement |",
    "| | 02 | 4–8,5 s | Nina se retourne. | Silence |",
    "| 02 – Quai | 01 | 8,5–12 s | Le quai est vide. | Vent |"
  ].join("\n"));
  assert.equal(project.scenes.length, 2);
  assert.equal(project.scenes[0].shots[1].sound, "Silence");
  assert.equal(project.scenes[0].shots[1].duration, "4.5");
  assert.equal(project.scenes[1].shots[0].duration, "3.5");
  assert.equal(project.chrono, "0–12 s");
  assert.equal(Script.timeRange("0’04” à 0’10”").end, 10);
  assert.equal(Script.timeRange("00:00:00:00–00:00:04:00").label, "00:00:00:00–00:00:04:00");
});

test("reconnaît des plans listés par numéro et conserve les termes caméra accentués", () => {
  const project = generate([
    "SCÈNE 1 — INT. CUISINE (NUIT)",
    "## Liste des plans",
    "### 1. L’entrée",
    "Action : Ana ouvre la porte.",
    "Cadrage : Plan rapproché",
    "Caméra : Suivi stabilisé, 50 mm",
    "2. Le carnet",
    "Action : Ana pose le carnet.",
    "Chrono : 00:04–00:08",
    "SCÈNE 2 — MÊME LIEU — JOUR",
    "Ana entre, pose le carnet et ouvre la fenêtre."
  ].join("\n"));
  const [first, second] = project.scenes;
  assert.equal(project.scenes.length, 2);
  assert.equal(first.shots.length, 2);
  assert.equal(first.shots[0].scriptNumber, "1");
  assert.equal(first.shots[0].scale, "Plan rapproché");
  assert.equal(first.shots[0].movement, "Suivi stabilisé");
  assert.equal(first.shots[1].title, "Le carnet");
  assert.equal(second.location, "Cuisine");
  assert.equal(second.time, "Jour");
  assert.equal(second.shots.length, 3);
});

test("conserve les champs édités quand une scène numérotée change", () => {
  const project = generate(technicalScript);
  const [first, second] = project.scenes;
  const shot = first.shots[0];
  Object.assign(shot, {edited: true, editedFields: ["lens"], lens: "42 mm"});
  project.artDirection = "Choix du chef déco.";
  project.script = project.script.replace("Léa entre dans la cuisine.", "Léa ouvre la porte.").replace("noir mat", "noir brillant");
  update(project);
  assert.equal(project.scenes[0].id, first.id);
  assert.equal(project.scenes[1].id, second.id);
  assert.equal(project.scenes[0].shots[0].id, shot.id);
  assert.equal(project.scenes[0].shots[0].lens, "42 mm");
  assert.equal(project.scenes[0].shots[0].action, "Léa ouvre la porte.");
  assert.equal(project.artDirection, "Choix du chef déco.");
});

test("réanalyse un projet sauvegardé avec le moteur précédent et conserve un plan correspondant", () => {
  const script = "INT. ATELIER — JOUR\n\nAna ouvre le carnet. Elle tourne la page.";
  const project = Storyboard.newProject("Mon film", script);
  delete project.analysisVersion;
  project.analyzedScript = script;
  project.analyzedCount = "auto";
  const shot = Storyboard.newShot({action: "Ana ouvre le carnet.", lens: "42 mm"});
  project.scenes = [Storyboard.newScene({
    name: "Atelier", location: "Atelier", sourceKey: "INT. ATELIER — JOUR\nAna ouvre le carnet. Elle tourne la page.",
    source: "Ana ouvre le carnet. Elle tourne la page.", shots: [shot]
  })];
  update(project);
  assert.equal(project.scenes[0].shots.length, 2);
  assert.equal(project.scenes[0].shots[0].id, shot.id);
  assert.equal(project.scenes[0].shots[0].lens, "42 mm");
});

test("le mode automatique importe chaque plan écrit, même au-delà de cinquante", () => {
  const plans = Array.from({length: 54}, (_, index) => "PLAN " + (index + 1) + "\nAction : Ana tourne une page.");
  const project = generate(["INT. SALON — JOUR", ...plans].join("\n"));
  assert.equal(project.scenes[0].shots.length, 54);
  assert.equal(project.scenes[0].shots[53].scriptNumber, "54");
});

test("répartit les 18 plans sur 12 et 6 cases dans l’ordre et exporte un prompt par planche", () => {
  const project = generate(technicalScript, 9);
  const entries = Storyboard.listShots(project);
  assert.equal(entries.length, 18);
  assert.equal(Storyboard.layoutBoards(entries).length, 1);
  const [first, second] = Storyboard.layoutBoards(entries, [12]);
  assert.equal(first.cells.length, 12);
  assert.equal(first.columns, 4);
  assert.equal(first.rows, 3);
  assert.equal(second.cells.length, 6);
  assert.equal(second.columns, 3);
  assert.equal(second.rows, 2);
  assert.equal(second.cells[0].ordinal, 13);
  assert.equal(second.cells.at(-1).ordinal, 18);
  const firstPrompt = Storyboard.buildBoardPrompt(project, first, 2);
  const secondPrompt = Storyboard.buildBoardPrompt(project, second, 2);
  assert.equal((firstPrompt.match(/^CASE /gm) || []).length, 12);
  assert.equal((secondPrompt.match(/^CASE /gm) || []).length, 6);
  assert.match(firstPrompt, /exactement 12 cases/);
  assert.match(firstPrompt, /Faire sentir l’hésitation/);
  assert.match(firstPrompt, /Ombres portées/);
  assert.match(firstPrompt, /00:07–00:11/);
  assert.match(secondPrompt, /CASE 1 · ligne 1, colonne 1 · plan global 13/);
  assert.equal(Storyboard.layoutBoards(entries, [12, 99])[1].cells.length, 6);
});

test("sépare la description, la voix off et les flèches dans les prompts", () => {
  const project = generate([
    "+ INT. JOUR — GARGOTE RAZILY",
    "PLAN 1 — L’arrivée",
    "Action : Jao entre de droite à gauche.",
    "Description visuelle : Jao derrière le comptoir, lumière latérale.",
    "Voix off : Je me souviens de ce jour.",
    "Caméra : Travelling avant lent, 35 mm.",
    "KAREN : Tu es en retard.",
    "0:36 ✓ TOURNER Contrechamp de Razily",
    "RAZILY : Ça arrive.",
    "MAMA (V.O.) : Jao, écoute-moi."
  ].join("\n"));
  const [scene] = project.scenes;
  assert.equal(scene.setting, "Intérieur");
  assert.equal(scene.time, "Jour");
  assert.equal(scene.shots.length, 2);
  const [first, second] = scene.shots;
  assert.equal(first.description, "Jao derrière le comptoir, lumière latérale.");
  assert.equal(first.voiceOver, "Je me souviens de ce jour.");
  assert.equal(first.dialogue, "KAREN — Tu es en retard.");
  assert.equal(second.chrono, "0:36");
  assert.equal(second.dialogue, "RAZILY — Ça arrive.");
  assert.match(second.voiceOver, /écoute-moi/);
  assert.ok(!second.subjects.includes("Mama"));
  assert.deepEqual(Array.from(Storyboard.movementArrows(first), item => item.direction), ["forward", "left"]);
  first.subjectArrow = "none";
  first.cameraArrow = "up";
  const [board] = Storyboard.layoutBoards(Storyboard.listShots(project));
  const prompt = Storyboard.buildBoardPrompt(project, board, 1);
  assert.match(prompt, /Description visuelle du plan : Jao derrière le comptoir/);
  assert.match(prompt, /Voix off : Je me souviens/);
  assert.match(prompt, /Caméra : Haut ↑/);
  assert.equal(Storyboard.movementArrows(first).length, 1);
});

test("récupère les voix off dans les projets enregistrés avant l’ajout du champ", () => {
  const shot = Storyboard.normalizeShot({
    scale: "Plan large", action: "Jao traverse la rue.", dialogue: "KAREN — Bonjour.\nVOIX DE MAMA — Jao !"
  });
  assert.equal(shot.dialogue, "KAREN — Bonjour.");
  assert.equal(shot.voiceOver, "VOIX DE MAMA — Jao !");
  assert.match(shot.description, /Jao traverse/);
});

test("la version technique préserve les repères des plans et reste distincte du script validé", () => {
  const source = technicalScript + "\nVoix off : Rien n’est fini.";
  const project = Storyboard.newProject("Traversées", source);
  project.technicalScript = Preparation.prepare(source);
  project.scriptMode = "technical";
  assert.equal(project.script, source);
  const version = Preparation.activeScript(project);
  assert.match(version, /Notes de réalisation : Proposition de réalisation/);
  const prepared = generate(version);
  const [first, second] = prepared.scenes;
  assert.equal(first.scriptNumber, "7");
  assert.equal(first.shots[0].title, "L’entrée");
  assert.equal(first.shots[0].chrono, "00:00–00:04");
  assert.equal(first.shots[0].lens, "35 mm");
  assert.equal(first.shots[0].sound, "Le frigo bourdonne.");
  assert.equal(first.shots[1].action, "Léa glisse la lettre sous une tasse.");
  assert.equal(second.shots[1].voiceOver, "Rien n’est fini.");
  project.scriptMode = "source";
  assert.equal(Preparation.activeScript(project), source);
});

test("le synopsis reprend le début et la fin de l’action dans le scénario validé", () => {
  const source = [
    "Titre : La lettre", "",
    "INT. CUISINE — JOUR", "Léa trouve une lettre sur la table.", "",
    "INT. TRAIN — NUIT", "Noé décide de chercher Léa.", "",
    "EXT. PORT — MATIN", "Noé remet la lettre à Léa."
  ].join("\n");
  const synopsis = Preparation.synopsis(source);
  assert.match(synopsis, /^Léa trouve une lettre/);
  assert.match(synopsis, /Noé décide de chercher Léa/);
  assert.match(synopsis, /Noé remet la lettre à Léa\.$/);
  assert.equal(Preparation.synopsis("Synopsis : Un voyage inattendu.\n\n" + source), "Un voyage inattendu.");
});
