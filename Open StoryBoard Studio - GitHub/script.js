"use strict";

const ScriptAnalysis = (() => {
  const sceneFields = {
    name: ["titre", "titre de scène", "titre de la scène"],
    intention: ["intention", "intention de réalisation", "note d’intention", "intention narrative", "intention de la scène", "réalisation"],
    artDirection: ["da", "d.a.", "direction artistique", "traitement visuel", "univers visuel", "note de da"],
    chrono: ["chrono", "chronologie", "timecode", "timing", "durée", "durée totale", "durée estimée", "temps", "tc"],
    synopsis: ["synopsis", "pitch", "résumé", "logline", "concept", "résumé de la scène"],
    location: ["lieu", "lieu de tournage", "localisation", "location"], setting: ["int/ext", "intérieur / extérieur"],
    time: ["moment", "heure", "moment de la journée"],
    environment: ["décor", "environnement", "arrière-plan"], atmosphere: ["ambiance", "ton", "tonalité"],
    palette: ["palette", "couleurs", "palette de couleurs"], references: ["références", "références visuelles", "référence", "moodboard"],
    continuity: ["continuité", "raccord", "raccords"],
    sound: ["son", "audio", "son / musique", "son / bruitage", "musique", "bruitage", "ambiance sonore", "bande-son"],
    transition: ["transition", "montage"], notes: ["notes de réalisation", "note", "notes", "commentaires"]
  };
  const projectFields = {
    scriptTitle: ["titre", "title", "titre du film", "nom du film", "film", "titre du scénario", "nom du projet", "titre du projet"],
    intention: [...sceneFields.intention, "note de réalisation"],
    artDirection: sceneFields.artDirection, chrono: [...sceneFields.chrono, "durée du film", "chronométrage"],
    synopsis: sceneFields.synopsis, palette: sceneFields.palette, references: sceneFields.references,
    continuity: sceneFields.continuity, atmosphere: sceneFields.atmosphere, sound: sceneFields.sound, notes: sceneFields.notes,
    ratio: ["format d’image", "ratio", "aspect ratio", "format"],
    ignore: ["auteur", "auteurs", "author", "authors", "crédit", "credit", "contact", "date", "draft date", "copyright", "source", "version", "écrit par"]
  };
  const planFields = {
    title: ["titre", "intitulé", "titre du plan"],
    action: ["action", "image / action", "visuel / action", "mise en scène"],
    description: ["description", "description visuelle", "description du plan", "image", "visuel", "ce qu’on voit"],
    subjects: ["personnages", "personnage", "sujet", "sujets", "casting"],
    dialogue: ["dialogue", "dialogues", "texte", "voix", "voix / dialogue"],
    voiceOver: ["voix off", "voix-off", "vo", "v.o.", "voix hors champ", "narration", "commentaire off"],
    blocking: ["mouvement du sujet", "déplacement", "placement", "mouvement des sujets"],
    performance: ["jeu", "émotion", "direction d’acteur"], eyeline: ["regard", "direction des regards"],
    detail: ["détail", "détail à mettre en valeur"], wardrobe: ["costume", "costumes", "maquillage"], props: ["accessoire", "accessoires"],
    camera: ["caméra", "caméra / cadrage", "caméra / cadre", "prise de vue"],
    scale: ["cadrage", "cadre", "échelle", "échelle de plan", "type de plan", "plan"], angle: ["angle", "angle de prise de vue"],
    movement: ["mouvement", "mvt", "mouvement caméra", "mouvement de caméra"], lens: ["focale", "objectif"],
    support: ["support", "support caméra", "machinerie"], aperture: ["ouverture"], focus: ["point", "point de netteté"],
    depth: ["profondeur de champ"], composition: ["composition", "axe", "axe caméra"], keyframe: ["instant", "instant à représenter", "image clé"],
    light: ["lumière", "éclairage", "lumière et contraste"], lightDirection: ["direction de lumière", "sources de lumière"],
    temperature: ["température", "température de couleur"], foreground: ["avant-plan"], weather: ["météo"], textures: ["matières", "textures"],
    reference: sceneFields.references, ratio: projectFields.ratio, negative: ["à exclure", "éléments à exclure", "contraintes"],
    duration: ["durée", "durée estimée", "durée du plan"], chrono: ["chrono", "timecode", "timing", "tc"],
    sound: sceneFields.sound, environment: sceneFields.environment, atmosphere: sceneFields.atmosphere,
    artDirection: sceneFields.artDirection, intention: sceneFields.intention, palette: sceneFields.palette,
    continuity: sceneFields.continuity, transition: sceneFields.transition, notes: sceneFields.notes
  };

  function key(text = "") {
    return text.toLocaleLowerCase("fr").normalize("NFD").replace(/\p{M}+/gu, "")
      .replace(/[’‘]/g, "'").replace(/\s*\/\s*/g, "/").replace(/\s+/g, " ").trim();
  }

  function fieldMap(fields) {
    return new Map(Object.entries(fields).flatMap(([field, aliases]) => aliases.map(alias => [key(alias), field])));
  }

  const projectLabels = fieldMap(projectFields);
  const sceneLabels = fieldMap(sceneFields);
  const planLabels = fieldMap(planFields);
  const tableLabels = new Map([
    ...planLabels, ...["scène", "n° de scène", "numéro de scène", "séquence"].map(label => [key(label), "scene"]),
    ["image", "action"],
    ...["plan", "n°", "n° de plan", "numéro de plan", "shot"].map(label => [key(label), "plan"]),
    ["image/description", "action"], ["time", "chrono"], ["video", "action"]
  ]);

  function clean(line) {
    return line.trim().replace(/^#{1,6}\s+/, "").replace(/^[-*•+]\s+(?=\S)/, "")
      .replace(/\*{1,2}([^*]+)\*{1,2}/g, "$1").replace(/^\[\[(.*)\]\]$/, "$1")
      .replace(/^\[(?!\d)(.*)\]$/, "$1").trim();
  }

  function stripProductionCue(text) {
    return text.replace(/^(?:(?:[✓✔☑+\uFFFD]+\uFE0F?[\s:–—-]*)?(?:[àa] +tourner|tourner|tourn[eé\uFFFD])(?=$|[\s:–—-])[\s:–—-]+|[✓✔☑]+\uFE0F?\s+)+/iu, "");
  }

  function sentenceCase(text) {
    if (text !== text.toLocaleUpperCase("fr")) return text;
    return text.charAt(0) + text.slice(1).toLocaleLowerCase("fr");
  }

  const separator = /\s*[–—|]\s*|\s+\uFFFD\s+|\s+-\s+/u;
  const clock = "(?:\\d{1,3}:\\d{2}(?::\\d{2}){0,2}(?:[.,]\\d+)?|\\d{1,3}[’']\\d{2}(?:[″”\"]|''|’’)?|\\d+(?:[.,]\\d+)?(?:\\s*(?:secondes?|sec\\.?|s|[″”\"]))?)(?![\\p{L}\\d])";
  const rangePattern = new RegExp("(?<![\\p{L}\\d:])(" + clock + ")\\s*(?:[-–—→]|à(?=\\s|\\d)|\\bto\\b)\\s*(" + clock + ")(?![:\\d])", "iu");

  function seconds(text = "") {
    const value = text.trim().replace(/(?:secondes?|sec\.?|s|["″”]|''|’’)\s*$/iu, "").trim().replace(/[’']/g, ":").replace(",", ".");
    if (!/^\d+(?::\d{2}){0,2}(?:\.\d+)?$/.test(value)) return null;
    return value.split(":").reduce((total, part) => total * 60 + Number(part), 0);
  }

  function timeRange(text) {
    const match = rangePattern.exec(text || "");
    if (!match) return null;
    const start = seconds(match[1]);
    const end = seconds(match[2]);
    const frames = [match[1], match[2]].every(value => /^\d+:\d{2}:\d{2}:\d{2}$/.test(value));
    if (frames ? match[1] === match[2] : start === null || end === null || end <= start) return null;
    const from = match[1].trim();
    const to = match[2].trim();
    return {label: from + "–" + to, start, end, from, to, index: match.index, length: match[0].length};
  }

  function combinedChrono(values) {
    const ranges = values.map(timeRange);
    if (!ranges.length || ranges.some((range, i) => !range || range.start === null || (i > 0 && range.start < ranges[i - 1].end))) return "";
    return ranges[0].from + "–" + ranges.at(-1).to;
  }

  function leadingTime(line) {
    const range = timeRange(line);
    if (range && /^[\[(]?\s*$/.test(line.slice(0, range.index))) {
      return {chrono: range.label, text: line.slice(range.index + range.length).replace(/^[\s\])|:–—-]+/, "")};
    }
    const stamp = /^\[?(\d{1,3}:\d{2}(?::\d{2}){0,2}(?:[.,]\d+)?|\d{1,3}[’']\d{2}(?:[″”"])?)(?:\]\s*(?:[:|–—-]\s*)?|\s*[:|–—-]\s*|[ \t]+)(\S.*)$/u.exec(line);
    return stamp ? {chrono: stamp[1], text: stamp[2]} : {text: line, chrono: ""};
  }

  function getField(line, labels) {
    const text = clean(line);
    const match = /^([^:–—]{1,58}?)(?:\s*:\s*|\s+[–—-]\s+)(.*)$/u.exec(text);
    const field = labels.get(key(match ? match[1] : text));
    return field ? {field, value: match?.[2]?.trim() || "", hasSeparator: Boolean(match)} : null;
  }

  function append(target, field, text) {
    if (text) target[field] = target[field] ? target[field] + "\n" + text : text;
  }

  function formatFields(values, scope) {
    const fields = {project: projectFields, scene: sceneFields, plan: planFields}[scope];
    return Object.entries(fields).flatMap(([field, aliases]) => {
      const value = String(values[field] ?? "").trim();
      if (field === "ignore" || !value) return [];
      const label = aliases[0].charAt(0).toLocaleUpperCase("fr") + aliases[0].slice(1);
      if (field === "dialogue" || field === "voiceOver") {
        return value.split(/\n+/).filter(line => line.trim()).map(line => label + " : " + line.trim());
      }
      return [label + " : " + value.replace(/\s*\n+\s*/g, " ")];
    });
  }

  const numberToken = "(?:\\d{1,4}[a-z]{0,2}|[ivxlcdm]{1,7})";
  const sceneMarker = new RegExp("^(sc[eè]ne|s[eé]quence|tableau)(?:\\s*(?:(?:n[°ºo]\\.?|#)\\s*)?(" + numberToken + ")(?=$|[\\s.:#)–—-]))?(?=$|[\\s.:–—-])", "iu");
  const scenePrefix = new RegExp("^(?:(" + numberToken + ")[.)]?|#(" + numberToken + ")#)\\s+", "iu");
  const locationMarker = /^((?:INT(?:ÉRIEUR|ERIOR)?\.?\s*[/.-]\s*EXT(?:ÉRIEUR|ERIOR)?\.?|EXT(?:ÉRIEUR|ERIOR)?\.?\s*[/.-]\s*INT(?:ÉRIEUR|ERIOR)?\.?|I\/E\.?|INT(?:ÉRIEUR|ERIOR)?\.?|EXT(?:ÉRIEUR|ERIOR)?\.?))(?=\s|[.\-–—:]|$)[\s.\-–—:]*/iu;
  const dayMarker = /^(?:jour(?:née)?|nuit|soir(?:ée)?|aube|matin(?:ée)?|midi|apr[eè]s-midi|cr[eé]puscule|heure (?:bleue|dorée)|coucher du soleil|lever du soleil|en continu|plus tard|lendemain|day|night|dawn|dusk|morning|evening|sunset|sunrise|continuous|later|afternoon)(?:\s+.*)?$/iu;
  const temporalHeading = /^(?:plus tard|le lendemain(?: matin| soir)?|quelques (?:minutes|heures|jours|années) plus tard|en continu|flash[- ]?back|retour au pr[eé]sent|m[eê]me lieu|m[eê]me d[eé]cor|m[eê]me endroit)(?=$|[\s.:,–—-])/iu;
  const repeatedLocation = /^(?:m[eê]me (?:lieu|d[eé]cor|endroit|pi[eè]ce))$/iu;
  const breakdownHeading = /^(?:d[eé]coupage(?: technique)?|liste des plans|plans(?: de la sc[eè]ne)?|shot list)\s*[:.]?$/iu;
  const sectionHeading = /^(?:sc[eé]nario(?: valid[eé])?|d[eé]coupage(?: technique)?|script|screenplay|storyboard|d[eé]roul[eé]|fiche technique|g[eé]n[eé]ralit[eé]s)\s*[:.]?$/iu;
  const transitionHeading = /^(?:fondu(?: au noir| encha[iî]n[eé]| d’ouverture)?|coupe(?: franche)?|cut to|fade (?:in|out)|fin|[eé]cran noir)\s*[:.]?$/iu;

  function sceneHeading(line, next = "", allowNumbered = true) {
    const heading = clean(line);
    if (!heading || /^(?:plan|pl\.?|shot|p\.?)\s*\d|^(?:plan|shot)\s*[:–—-]/iu.test(heading)) return null;
    const {text, chrono} = leadingTime(heading);
    const fountain = /\s*#([\w.-]+)#\s*$/.exec(text);
    let rest = stripProductionCue(fountain ? text.slice(0, fountain.index).trim() : text);
    const section = sceneMarker.exec(rest);
    if (section) {
      const suffix = rest.slice(section[0].length);
      if (!section[2] && suffix && !/^\s*[:.–—-]/.test(suffix) && !/^#+/.test(line.trim())) return null;
      rest = suffix.replace(/^[\s.:#)–—-]+/, "");
    }
    const prefix = scenePrefix.exec(rest);
    const numberedSlug = prefix && locationMarker.test(rest.slice(prefix[0].length));
    if (numberedSlug) rest = rest.slice(prefix[0].length);
    const forced = /^\.(?!\.)\p{L}/u.test(rest);
    if (forced) rest = rest.slice(1);
    const marker = locationMarker.exec(rest);
    if (marker) rest = rest.slice(marker[0].length);
    const openingTime = marker && /^(jour|nuit|matin|soir|aube|day|night|morning|evening)(?:\s*[–—|\uFFFD-]\s*|\s*[,/:]\s*|\s+)(?=\p{L})/iu.exec(rest);
    if (openingTime) rest = rest.slice(openingTime[0].length);
    const token = marker?.[1].toLocaleUpperCase("fr") || "";
    const setting = (token.includes("INT") && token.includes("EXT")) || token.startsWith("I/")
      ? "Intérieur / Extérieur" : token.startsWith("INT") ? "Intérieur" : token.startsWith("EXT") ? "Extérieur" : "";
    const trailing = timeRange(rest);
    const hasTrailingRange = trailing && /^(?:\s*[\])])?\s*$/.test(rest.slice(trailing.index + trailing.length));
    if (hasTrailingRange) rest = rest.slice(0, trailing.index).replace(/[\s([,|:–—-]+$/, "");
    const parts = rest.split(separator).map(part => part.trim()).filter(Boolean);
    const timeParts = parts.length > 1 ? parts.filter(part => dayMarker.test(part) || /^(?:\d{1,2}\s*h(?:\s*\d{2})?|\d{1,2}:\d{2})$/i.test(part)) : [];
    if (!timeParts.length && marker && parts.length === 1) {
      const separated = /^(.+?)\s*[,/]\s*((?:jour|nuit|matin|soir|aube|day|night|morning|evening)\b.*)$/iu.exec(parts[0])
        || /^(.*?)\s+(?:\(([^)]+)\)|\b(jour|nuit|matin|soir|aube|day|night|morning|evening))$/iu.exec(parts[0]);
      const moment = separated?.[2] || separated?.[3];
      if (moment && dayMarker.test(moment)) {
        parts[0] = separated[1].trim();
        parts.push(moment);
        timeParts.push(moment);
      }
    }
    const location = sentenceCase(parts.filter(part => !timeParts.includes(part)).join(" — "));
    const time = openingTime ? capitalize(openingTime[1]) : timeParts.map(sentenceCase).join(" · ");
    const temporal = temporalHeading.exec(rest);
    const temporalLocation = temporalHeading.exec(location);
    const reuseLocation = repeatedLocation.test(location) || temporalLocation?.[0] === location;
    const simpleTemporal = temporal && (temporal[0].length === rest.length || /^[\s]*[–—:-]/u.test(rest.slice(temporal[0].length)));
    const slugWithTime = Boolean(time && location && !/[.!?]$/.test(location) && location.split(/\s+/).length <= 10);
    const numbered = allowNumbered && /^(\d{1,4}[a-z]?)\s*[.)]\s*(.+)$/iu.exec(rest);
    const contextual = Boolean(next && (getField(next, sceneLabels) || shotHeading(next))) || Boolean(numbered && numbered[2] === numbered[2].toLocaleUpperCase("fr") && !/[.!?]$/.test(numbered[2]));
    const markdown = /^#{2,6}\s/.test(line.trim()) && !shotHeading(line, !allowNumbered) && !getField(line, sceneLabels) && !getField(line, projectLabels);
    if (!(section || forced || marker || simpleTemporal || slugWithTime || markdown || (numbered && contextual))) return null;
    if (getField(line, sceneLabels) || sectionHeading.test(heading) || breakdownHeading.test(heading) || transitionHeading.test(heading)) return null;
    const sequence = Boolean(section && /quence/i.test(section[1]));
    return {
      heading, scriptNumber: fountain?.[1] || section?.[2] || (numberedSlug && (prefix[1] || prefix[2])) || numbered?.[1] || "",
      kind: sequence ? "sequence" : "scene", name: numbered ? sentenceCase(numbered[2]) : location,
      location: simpleTemporal ? capitalize(parts.slice(1).filter(part => !dayMarker.test(part)).join(" — ")) : reuseLocation ? "" : location,
      setting, time: time || (temporalLocation && !repeatedLocation.test(temporalLocation[0]) ? capitalize(temporalLocation[0]) : ""),
      chrono: chrono || (hasTrailingRange ? trailing.label : ""),
      inheritLocation: Boolean(simpleTemporal || reuseLocation)
    };
  }

  const endOfTerm = "(?![\\p{L}\\d’'-])";
  const scales = [
    ["tr[eè]s gros plan|tgp|extreme close[- ]?up", "Très gros plan"],
    ["gros plan|gp|close[- ]?up", "Gros plan"],
    ["plan d[’']ensemble|plan g[eé]n[eé]ral|pe|establishing shot", "Plan d’ensemble"],
    ["plan (?:tr[eè]s )?large|pl|wide shot", "Plan large"],
    ["plan moyen|pm|medium shot", "Plan moyen"],
    ["plan (?:am[eé]ricain|taille|poitrine|rapproch[eé]|serr[eé])"],
    ["insert|plan (?:de )?d[eé]tail", "Insert"]
  ].map(([expression, label]) => [new RegExp("^(?:" + expression + ")" + endOfTerm, "iu"), label]);
  const movements = [
    /\btravelling\s+(?:avant|in|arri[eè]re|out)(?:\s+(?:lent|rapide))?/iu,
    /\btravelling\s+lat[eé]ral(?:\s+(?:gauche|droite))?/iu,
    new RegExp("(?:^|[^\\p{L}])((?:travelling|panoramique(?:\\s+(?:horizontal|vertical|gauche|droite))?|zoom(?:\\s+(?:avant|arri[eè]re|in|out))?|cam[eé]ra port[eé]e|cam[eé]ra [àa] l[’']?[eé]paule|suivi stabilis[eé]|plan fixe|fixe|grue|rotation))" + endOfTerm, "iu")
  ];
  const angles = /(?:^|[\s,(])((?:contre[- ]?plong[eé]e|plong[eé]e|z[eé]nithal|par[- ]dessus l[’'][eé]paule|subjectif(?:\s*\(POV\))?|POV|profil|trois[- ]quarts|au ras du sol|[àa] hauteur du regard))(?=$|[\s,.)])/iu;

  function capitalize(text) {
    return text && sentenceCase(text.charAt(0).toLocaleUpperCase("fr") + text.slice(1));
  }

  function technicalFields(text) {
    const scale = scales.find(([pattern]) => pattern.test(text));
    const motion = movements.map(pattern => pattern.exec(text)).find(Boolean);
    const movement = motion?.[1] || motion?.[0];
    const angle = angles.exec(text)?.[1];
    const lens = /\b\d{1,3}\s*mm(?:\s+macro)?\b/iu.exec(text)?.[0];
    const aperture = /\bf\s*\/\s*\d+(?:[.,]\d+)?/iu.exec(text)?.[0];
    return Object.fromEntries([
      ["scale", scale && (scale[1] || capitalize(scale[0].exec(text)[0]))],
      ["movement", movement && (key(movement) === "plan fixe" ? "Fixe" : capitalize(movement))],
      ["angle", angle && (key(angle) === "pov" ? "Subjectif (POV)" : capitalize(angle))],
      ["lens", lens], ["aperture", aperture]
    ].filter(([, value]) => value));
  }

  function shotHeading(line, allowBare = false) {
    const heading = clean(line);
    const timed = leadingTime(stripProductionCue(heading));
    let rest = stripProductionCue(timed.text);
    const numbered = /^(?:plan|pl\.?|shot|p\.?)\s*(?:n[°ºo]\.?\s*|#\s*)?(\d{1,4}[a-z]{0,2}(?:[.-]\d{1,3}[a-z]?)?)(?=$|[\s.:)\]#–—|/-])\s*/iu.exec(rest);
    const bullet = /^(\d{1,4}[a-z]?)\s*[.)|:]\s+(.+)$/iu.exec(rest);
    const plainPlan = /^(?:plan|shot)\s*[:–—-]\s*/iu.exec(rest);
    const technicalBullet = bullet && (allowBare || technicalFields(bullet[2]).scale || timed.chrono);
    if (numbered || plainPlan) rest = rest.slice((numbered || plainPlan)[0].length).replace(/^[\s\])#.:–—|/-]+/, "");
    else if (technicalBullet) rest = bullet[2];
    const scale = scales.find(([pattern]) => pattern.test(rest));
    const coverage = /^(?:contre[- ]?champ|champ[- /]contre[- ]?champ|champ|vue subjective|POV|plan fixe|plan s[eé]quence|travelling|panoramique)(?=$|[\s:–—-])/iu.exec(rest);
    if (!numbered && !plainPlan && !scale && !coverage && !timed.chrono && !technicalBullet) return null;
    const inlineRange = timeRange(rest);
    const hasInlineRange = inlineRange && (/^\s*[(\[]/.test(rest.slice(Math.max(0, inlineRange.index - 1))) ||
      /^(?:\s*[\])])?\s*$/.test(rest.slice(inlineRange.index + inlineRange.length)));
    if (hasInlineRange) {
      const before = rest.slice(0, inlineRange.index).replace(/[\s(\[–—|:-]+$/, "");
      const after = rest.slice(inlineRange.index + inlineRange.length).replace(/^[\s)\]–—|:-]+/, "");
      rest = [before, after].filter(Boolean).join(" ");
    }
    const inlineStamp = leadingTime(rest);
    if (inlineStamp.chrono) rest = inlineStamp.text;
    const fields = {};
    const descriptions = [];
    const ranges = [];
    const protectedRanges = rest.replace(new RegExp(rangePattern.source, "giu"), match => {
      ranges.push(match);
      return "\u0000" + (ranges.length - 1) + "\u0000";
    });
    const chunks = protectedRanges.split(separator).map(part => part.replace(/\u0000(\d+)\u0000/g, (_, index) => ranges[index]).trim()).filter(Boolean);
    const cameraHeading = part => Boolean(technicalFields(part).scale ||
      /^(?:cam[eé]ra|travelling|panoramique|fixe|zoom|plong[eé]e|contre[- ]?plong[eé]e|plan fixe|\d{1,3}\s*mm)\b/iu.test(part));
    for (const chunk of chunks.flatMap(part => getField(part, planLabels)?.value || !cameraHeading(part) ? [part] : part.split(/\s*:\s+(?=[^\d])/))) {
      const annotation = getField(chunk, planLabels);
      if (annotation?.value) {
        append(fields, annotation.field, annotation.value);
        continue;
      }
      const tech = technicalFields(chunk);
      if (cameraHeading(chunk)) {
        Object.assign(fields, tech);
        const detail = /\bsur\s+(.+)$/iu.exec(chunk)?.[1];
        if (detail) fields.detail = capitalize(detail.trim());
        if (!tech.scale && !tech.movement && !tech.angle && !tech.lens) fields.camera = chunk;
      } else if (coverage && chunk === chunks[0]) {
        fields.camera = chunk;
        if (chunk.length > coverage[0].length) descriptions.push(chunk);
      } else {
        descriptions.push(chunk);
      }
    }
    const description = descriptions.join(" — ").trim();
    const hasPlanNumber = numbered || technicalBullet;
    return {
      heading, scriptNumber: numbered?.[1] || (technicalBullet ? bullet[1] : ""),
      fields: {...fields, chrono: timed.chrono || (hasInlineRange ? inlineRange.label : "") || inlineStamp.chrono || fields.chrono || ""},
      description, titled: Boolean(description && (hasPlanNumber || plainPlan) && !timed.chrono && !scale),
      timedOnly: Boolean(timed.chrono && !numbered && !plainPlan)
    };
  }

  function tableCells(line) {
    if (line.includes("\t")) return line.split("\t").map(cell => cell.trim());
    if (!line.includes("|")) return [];
    return line.trim().replace(/^\|/, "").replace(/\|$/, "").split(/(?<!\\)\|/).map(cell => cell.trim().replace(/\\\|/g, "|"));
  }

  function expandTables(lines) {
    const result = [];
    for (let index = 0; index < lines.length; index += 1) {
      const labels = tableCells(lines[index]).map(cell => tableLabels.get(key(clean(cell))));
      const hasTable = labels.filter(Boolean).length >= 2 && labels.some(label => ["action", "plan", "scene"].includes(label));
      if (!hasTable || tableCells(lines[index + 1] || "").length !== labels.length) {
        result.push(lines[index]);
        continue;
      }
      let lastScene = "";
      let nextPlan = 1;
      for (index += 1; index < lines.length; index += 1) {
        const cells = tableCells(lines[index]);
        if (cells.length !== labels.length) break;
        if (cells.every(cell => /^:?-{2,}:?$/.test(cell))) continue;
        const row = Object.fromEntries(labels.flatMap((label, column) => label && cells[column] ? [[label, cells[column]]] : []));
        const plan = row.plan?.match(/^(?:(?:plan|pl\.?|p)\s*)?(\d{1,4}[a-z]{0,2})(?=$|[\s.:–—-])/iu);
        if (row.scene && (key(row.scene) !== lastScene || (nextPlan > 1 && /^0*1a?$/i.test(plan?.[1] || "")))) {
          const value = clean(row.scene);
          result.push("", sceneMarker.test(value) || locationMarker.test(value) ? value : "SCÈNE " + (/^\d/u.test(value) ? value : "— " + value));
          lastScene = key(row.scene);
          nextPlan = 1;
        }
        const title = row.plan?.slice(plan?.[0].length || 0).replace(/^[\s.:–—-]+/, "") || "";
        result.push("", "PLAN " + (plan?.[1] || nextPlan) + (title ? " — " + title : ""));
        for (const [field, aliases] of Object.entries(planFields)) {
          if (row[field]) result.push(aliases[0] + " : " + row[field].replace(/<br\s*\/?>/gi, " / "));
        }
        nextPlan += 1;
      }
      index -= 1;
    }
    return result;
  }

  function readFront(lines) {
    const metadata = {};
    let index = 0;
    const nextContent = start => lines.slice(start).find(line => line.trim()) || "";
    for (; index < lines.length; index += 1) {
      const line = lines[index];
      const text = clean(line);
      if (!text || /^---+$/.test(text)) continue;
      if (sectionHeading.test(text) && !breakdownHeading.test(text)) {
        index += 1;
        break;
      }
      const after = nextContent(index + 1);
      if (sceneHeading(line, after) || shotHeading(line)) break;
      if (breakdownHeading.test(text)) break;
      const entry = getField(line, projectLabels);
      if (entry) {
        let value = entry.value;
        for (let next = index + 1; next < lines.length; next += 1) {
          const continuation = lines[next];
          const detail = clean(continuation);
          if (getField(continuation, projectLabels) || sectionHeading.test(detail) || sceneHeading(continuation) || shotHeading(continuation)) break;
          if (!detail && value) break;
          if (detail && value && entry.value && !/^\s|^[-•]\s/.test(continuation)) break;
          if (detail) value = value ? value + "\n" + detail : detail;
          index = next;
        }
        if (entry.field !== "ignore" && (entry.field !== "ratio" || /^\d+(?:[.,]\d+)?\s*:\s*\d+$/u.test(value))) {
          append(metadata, entry.field, value);
        } else if (entry.field === "ratio" && value) {
          append(metadata, "notes", "Format : " + value);
        }
        continue;
      }
      const namedTitle = /^#\s+\S/u.test(line.trim()) || /^«[^»]+»$|^"[^"]+"$/u.test(text);
      const uppercaseTitle = text === text.toLocaleUpperCase("fr") && /\p{L}/u.test(text) && !/[.!?]$/.test(text) &&
        text.length <= 85 && !getField(line, sceneLabels) && Boolean(getField(after, projectLabels) || sceneHeading(after) || sectionHeading.test(clean(after)));
      const titleBeforeBrief = text.length <= 85 && !/[.!?]$/.test(text) && !placeParagraph.test(text) &&
        Boolean(getField(after, projectLabels)) && !getField(line, planLabels);
      if (!metadata.scriptTitle && (namedTitle || uppercaseTitle || titleBeforeBrief)) {
        metadata.scriptTitle = text.replace(/^[«"]\s*|\s*[»"]$/g, "");
        continue;
      }
      break;
    }
    return {metadata, index};
  }

  function readBody(source) {
    const fields = {};
    const plans = [];
    const loose = [];
    let plan = null;
    let continuingField = "";
    let inlineField = false;
    let inBreakdown = false;
    for (const line of source.split("\n")) {
      const text = clean(line);
      if (breakdownHeading.test(text)) {
        inBreakdown = true;
        continuingField = "";
        continue;
      }
      const entry = getField(line, plan ? planLabels : sceneLabels);
      const heading = !entry?.hasSeparator || (entry.field === "scale" && /^plan\s*[:–—-]/iu.test(text))
        ? shotHeading(line, inBreakdown) : null;
      if (heading?.timedOnly && plan?.scriptNumber && !plan.fields.chrono && !plan.lines.some(item => item.trim()) && !plan.fields.action) {
        Object.assign(plan.fields, heading.fields);
        if (heading.description) plan.lines.push(heading.description);
        continuingField = "";
        continue;
      }
      if (heading) {
        plan = {...heading, lines: []};
        plans.push(plan);
        continuingField = "";
        continue;
      }
      if (sectionHeading.test(text) || /^={3,}$/.test(text)) continue;
      if (transitionHeading.test(text)) {
        append(plan?.fields || fields, "transition", sentenceCase(text.replace(/[.:]$/, "")));
        continuingField = "";
        continue;
      }
      if (entry) {
        append(plan?.fields || fields, entry.field, entry.value);
        continuingField = entry.field;
        inlineField = Boolean(entry.value);
        continue;
      }
      if (continuingField && text && (!inlineField || /^\s/.test(line)) && !/^(?:@|!)|^\p{Lu}[\p{Lu} .'-]{1,26}$/u.test(text)) {
        append(plan?.fields || fields, continuingField, text);
        continue;
      }
      if (plan) plan.lines.push(line);
      else loose.push(line);
      continuingField = "";
    }

    for (const plan of plans) {
      const body = plan.lines.join("\n").trim();
      const {camera, duration, chrono, action, ...details} = plan.fields;
      const range = timeRange(chrono || duration);
      const length = range?.start != null && range.end != null ? Math.round((range.end - range.start) * 1000) / 1000
        : seconds(duration || (/^\d+(?:[.,]\d+)?\s*(?:s|sec\.?|secondes?)$/iu.test(chrono) ? chrono : ""));
      plan.text = [action, body].filter(Boolean).join("\n\n") || (plan.titled ? "" : plan.description);
      const cameraDetails = technicalFields([details.scale, camera].filter(Boolean).join(", "));
      plan.fields = {
        ...cameraDetails, ...details,
        ...(cameraDetails.scale && details.scale ? {scale: cameraDetails.scale} : {}),
        title: details.title || (plan.titled || !body ? plan.description : ""), chrono: chrono || range?.label || (length === null ? duration || "" : ""),
        ...(length !== null && length > 0 ? {duration: String(length)} : {}),
        ...(camera || details.scale && /[,(/]/.test(details.scale) ? {cameraNotes: camera || details.scale} : {})
      };
      delete plan.lines;
    }
    fields.chrono ||= combinedChrono(plans.map(plan => plan.fields.chrono));
    return {fields, loose: loose.join("\n").trim(), plans};
  }

  const temporalParagraph = /^(?:puis,?\s+)?(le lendemain(?: matin| soir)?|plus tard(?: dans la soir[eé]e)?|quelques (?:minutes|heures|jours|ann[eé]es) plus tard|pendant ce temps|au m[eê]me moment|de retour au pr[eé]sent),\s+(.+)/iu;
  const placeParagraph = /^(?:dans\s+(?:la |le |les |l[’']|un |une )|au\s+|à\s+(?:la |l[’']))([^,.;:!?]{2,45}),\s+(\S.+)/iu;
  const nonPlace = /^(?:silence|noir|bruit|ombre|instant|doute|cas|loin|calme|h[âa]te|obscurit[eé]|fond|milieu|passage|d[eé]but|fin)$/iu;

  function paragraphHeading(line, previous, allowPlaceOnly) {
    const text = clean(line);
    const temporal = temporalParagraph.exec(text);
    const place = placeParagraph.exec(temporal?.[2] || text);
    const location = place && !nonPlace.test(place[1]) ? capitalize(place[1]) : "";
    if (!temporal && (!allowPlaceOnly || !location || key(location) === key(previous?.location))) return null;
    return {
      heading: "", name: location || capitalize(temporal[1]), location: location || previous?.location || "",
      setting: location ? "" : previous?.setting || "", time: temporal ? capitalize(temporal[1]) : "", kind: "scene"
    };
  }

  function inspect(script) {
    const lines = expandTables(script.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n")
      .replace(/\/\*[\s\S]*?\*\//g, "").split("\n").filter(line => !/^\s*(?:\x60{3}|~{3})/.test(line)));
    const front = readFront(lines);
    const scenes = [];
    let current = null;
    let sequence = "";
    let sequenceFields = {};
    let body = [];
    let inPlan = false;
    let inBreakdown = false;
    const hasHeadings = lines.slice(front.index).some(line => sceneHeading(line));

    function flush(next) {
      const source = body.join("\n").trim();
      body = [];
      inPlan = false;
      inBreakdown = false;
      if (!source && !current) return;
      const {fields, plans, loose} = readBody(source);
      if (current?.kind === "sequence" && next?.kind === "scene" && !plans.length) {
        sequenceFields = fields;
        if (loose) append(sequenceFields, "synopsis", loose);
        return;
      }
      const previous = scenes.at(-1);
      const {heading = "", name, scriptNumber = "", location, setting, time = "", chrono = "", inheritLocation} = current || {};
      const inherited = Object.fromEntries(Object.entries(sequenceFields).filter(([field]) =>
        ["synopsis", "intention", "artDirection", "palette", "atmosphere", "continuity", "references", "sound"].includes(field)));
      const details = {
        ...inherited, ...fields,
        name: fields.name || name || fields.location || "Scène " + (scenes.length + 1),
        location: fields.location || location || (inheritLocation ? previous?.location : "") || "",
        setting: fields.setting || setting || (inheritLocation ? previous?.setting : "") || "",
        time: fields.time || time, chrono: chrono || fields.chrono || "",
        sequence, scriptNumber, sourceHeading: heading, source,
        sourceKey: [heading, source].join("\n").trim()
      };
      scenes.push({...details, plans, loose});
    }

    for (let index = front.index; index < lines.length; index += 1) {
      const line = lines[index];
      const next = lines[index + 1]?.trim() || lines[index + 2] || "";
      if (breakdownHeading.test(clean(line))) inBreakdown = true;
      const shot = shotHeading(line, inBreakdown);
      const explicit = sceneHeading(line, next, !inBreakdown);
      const previous = current ? {...current, location: current.location || scenes.at(-1)?.location, setting: current.setting || scenes.at(-1)?.setting} : scenes.at(-1);
      const implicit = !explicit && !shot && !inPlan && !lines[index - 1]?.trim() &&
        paragraphHeading(line, previous, !hasHeadings);
      if (explicit || implicit) {
        const incoming = explicit || implicit;
        flush(incoming);
        if (incoming.kind === "sequence") {
          sequence = [incoming.scriptNumber && "Séquence " + incoming.scriptNumber, incoming.name].filter(Boolean).join(" — ");
          sequenceFields = {};
        }
        current = incoming;
        if (explicit) continue;
      }
      if (shot) inPlan = true;
      body.push(line);
    }
    flush();
    const chrono = combinedChrono(scenes.map(scene => scene.chrono));
    if (chrono && !front.metadata.chrono) front.metadata.chrono = chrono;
    return {metadata: front.metadata, scenes};
  }

  return {inspect, readBody, getField, formatFields, planLabels, key, timeRange, combinedChrono, stripProductionCue};
})();
