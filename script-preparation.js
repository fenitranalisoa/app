"use strict";

const ScriptPreparation = (() => {
  const settingMarkers = {"Intérieur": "INT.", "Extérieur": "EXT.", "Intérieur / Extérieur": "INT./EXT."};
  const numberedPlan = /^\d{1,4}[a-z]{0,2}(?:[.-]\d{1,3}[a-z]?)?$/i;
  const numberedScene = /^(?:\d{1,4}[a-z]{0,2}|[ivxlcdm]{1,7})$/i;

  function activeScript(project) {
    return (project.scriptMode === "technical" ? project.technicalScript : project.script) || "";
  }

  function formatScene(scene, index) {
    const number = numberedScene.test(scene.scriptNumber) ? scene.scriptNumber : index + 1;
    const place = [settingMarkers[scene.setting], scene.location].filter(Boolean).join(" ");
    const heading = ["SCÈNE " + number, place, place && scene.time].filter(Boolean).join(" — ");
    const context = ScriptAnalysis.formatFields(scene, "scene");
    return [heading, ...context].join("\n");
  }

  function proposal(shot) {
    const frame = [shot.scale, shot.angle && shot.angle.toLocaleLowerCase("fr")].filter(Boolean).join(", ");
    const camera = shot.movement && !/^(?:plan )?fixe$/i.test(shot.movement) ? "Caméra en " + shot.movement.toLocaleLowerCase("fr") + "." : "";
    return ["Proposition de réalisation.", frame && "Prévoir un " + frame.charAt(0).toLocaleLowerCase("fr") + frame.slice(1) + ".",
      camera, shot.keyframe || shot.detail || ""].filter(Boolean).join(" ");
  }

  function formatPlan(shot, plan, index) {
    const number = plan && numberedPlan.test(plan.scriptNumber) ? plan.scriptNumber : index + 1;
    const fields = {
      ...plan?.fields,
      title: plan?.fields.title || shot.title,
      scale: plan?.fields.scale || shot.scale,
      movement: plan?.fields.movement || shot.movement,
      angle: plan?.fields.angle || shot.angle,
      camera: plan?.fields.cameraNotes || "",
      notes: plan?.fields.notes || proposal(shot)
    };
    const body = plan?.text;
    if (!body) {
      fields.action = shot.action;
      fields.dialogue = shot.dialogue;
      fields.voiceOver = shot.voiceOver;
    }
    return ["PLAN " + number, ...ScriptAnalysis.formatFields(fields, "plan"), body && "\n" + body].filter(Boolean).join("\n");
  }

  function prepare(script) {
    const inspection = ScriptAnalysis.inspect(script);
    if (!inspection.scenes.length) return "";
    const draft = Storyboard.newProject("", script);
    const proposed = Storyboard.analyze(draft, inspection);
    let sequence = "";
    const scenes = inspection.scenes.map((scene, index) => {
      const newSequence = scene.sequence && scene.sequence !== sequence ? scene.sequence : "";
      sequence = scene.sequence;
      const shots = proposed[index].shots.map((shot, shotIndex) => formatPlan(shot, scene.plans[shotIndex], shotIndex));
      return [newSequence, formatScene(scene, index), scene.plans.length && scene.loose, ...shots].filter(Boolean).join("\n\n");
    });
    const header = ScriptAnalysis.formatFields(inspection.metadata, "project").join("\n");
    return [header, ...scenes].filter(Boolean).join("\n\n");
  }

  const turningPoint = /\b(?:découvre|apprend|révèle|comprend|avoue|décide|refuse|réussit|retrouve|s’échappe|finit|ouvre|disparaît|arrive|quitte)\b/iu;

  function sceneEvents(scene) {
    const passages = [scene.loose, ...scene.plans.map(plan => plan.text || plan.fields.description || plan.description)].filter(Boolean);
    const events = passages.flatMap(Storyboard.extractBeats).map(beat => ({
      text: beat.action || beat.dialogue, narrative: Boolean(beat.action)
    }));
    if (!events.length) return scene.synopsis ? [{text: scene.synopsis, narrative: true}] : [];
    const actions = events.filter(event => event.narrative);
    return actions.length ? actions : events;
  }

  function sentence(text) {
    const clean = text.replace(/\s+/g, " ").replace(/^(?:puis|ensuite),?\s+/iu, "").trim();
    const capped = clean.charAt(0).toLocaleUpperCase("fr") + clean.slice(1);
    return /[.!?…»”"]$/.test(capped) ? capped : capped + ".";
  }

  function synopsis(script) {
    const inspection = ScriptAnalysis.inspect(script);
    if (inspection.metadata.synopsis) return inspection.metadata.synopsis;
    const events = inspection.scenes.map(sceneEvents).filter(list => list.length);
    if (!events.length) return "";

    const selected = [];
    const seen = new Set();
    function include(event) {
      if (!event?.text) return;
      const normalized = ScriptAnalysis.key(event.text).replace(/[.!?…]+$/u, "");
      if (!seen.has(normalized)) {
        seen.add(normalized);
        selected.push(sentence(event.text));
      }
    }

    for (const [index, list] of events.entries()) {
      const first = index === 0;
      const last = index === events.length - 1;
      const middle = index === Math.floor(events.length / 2);
      const change = list.find(event => event.narrative && turningPoint.test(event.text));
      if (first) include(list[0]);
      if (middle || (events.length <= 3 && !first)) include(change || list[0]);
      if (events.length === 1 && list.length > 2) include(change || list[Math.floor(list.length / 2)]);
      if (last) include(list.at(-1));
    }
    return selected.join(" ");
  }

  return {activeScript, prepare, synopsis};
})();
