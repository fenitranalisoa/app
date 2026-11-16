"use strict";

const Storyboard = (() => {
  const MAX_SHOTS = 50;
  const ANALYSIS_VERSION = 3;
  const styles = {
    realiste: ["Réaliste cinématographique", "Photogramme réaliste de cinéma, matières crédibles, peau et lumière naturelles, grain subtil."],
    crayon: ["Dessin au crayon", "Storyboard dessiné au graphite, traits de construction légers, valeurs lisibles, ombres hachurées sur papier."],
    caricature: ["Caricature", "Illustration caricaturale, expressions amplifiées, silhouettes distinctives et composition cinématographique lisible."],
    bd: ["Bande dessinée", "Case de bande dessinée, ligne expressive, aplats de couleur et contrastes francs, sans bulles ajoutées."],
    aquarelle: ["Aquarelle", "Illustration à l’aquarelle, lavis transparents et texture du papier, contours sélectifs et profondeur atmosphérique."],
    noir: ["Encre noir et blanc", "Dessin de storyboard à l’encre noire, masses d’ombre nettes, valeurs de gris maîtrisées et silhouettes lisibles."],
    animation: ["Animation 3D", "Image de film d’animation 3D, formes stylisées, éclairage volumétrique doux et matériaux cohérents."],
    libre: ["Style personnalisé", ""]
  };
  const ratios = ["16:9", "2.39:1", "1.85:1", "4:3", "3:2", "9:16", "1:1"];
  const values = {
    scale: ["Plan d’ensemble", "Plan large", "Plan moyen", "Plan américain", "Plan taille", "Plan poitrine", "Plan rapproché", "Gros plan", "Très gros plan", "Insert"],
    angle: ["À hauteur du regard", "Plongée", "Contre-plongée", "Zénithal", "Au ras du sol", "Profil", "Trois-quarts", "Par-dessus l’épaule", "Subjectif (POV)", "Axe incliné"],
    movement: ["Fixe", "Travelling avant lent", "Travelling arrière", "Travelling latéral", "Panoramique horizontal", "Panoramique vertical", "Caméra portée", "Suivi stabilisé", "Grue", "Zoom", "Rotation autour du sujet"],
    lens: ["18 mm", "24 mm", "28 mm", "35 mm", "40 mm", "50 mm", "65 mm", "85 mm", "100 mm macro", "135 mm"],
    aperture: ["f/1,4", "f/2", "f/2,8", "f/4", "f/5,6", "f/8", "f/11"],
    depth: ["Faible profondeur de champ", "Plans intermédiaires distincts", "Grande profondeur de champ", "Bascule de point"],
    support: ["Trépied", "Épaule", "Dolly", "Gimbal", "Steadicam", "Grue", "Slider", "Drone"],
    transition: ["Coupe franche", "Fondu enchaîné", "Fondu au noir", "Raccord dans le mouvement", "Raccord de regard", "Coupe en J", "Coupe en L"],
    time: ["Jour", "Nuit", "Aube", "Matin", "Midi", "Après-midi", "Crépuscule", "Heure bleue", "Soir", "En continu"],
    setting: ["Intérieur", "Extérieur", "Intérieur / Extérieur"],
    temperature: ["2 800 K · très chaud", "3 200 K · tungstène", "4 300 K · neutre", "5 600 K · lumière du jour", "6 500 K · froid"]
  };
  const shotGroups = [
    {
      name: "Mise en scène", icon: "users", fields: [
        ["title", "Intitulé du plan", "text"], ["scriptNumber", "Numéro du plan dans le script", "text"],
        ["description", "Description visuelle du plan", "area"], ["action", "Action dans le plan", "area"], ["intention", "Intention du plan", "area"],
        ["subjects", "Personnages et sujets", "text"], ["blocking", "Mouvement et placement des sujets", "area"],
        ["performance", "Jeu et émotion", "area"], ["eyeline", "Direction des regards", "text"],
        ["dialogue", "Dialogue à l’image", "area"], ["voiceOver", "Voix off", "area"], ["detail", "Détail à mettre en valeur", "text"],
        ["wardrobe", "Costumes et maquillage", "area"], ["props", "Accessoires", "text"]
      ]
    },
    {
      name: "Caméra", icon: "camera", fields: [
        ["scale", "Échelle de plan", "text"], ["angle", "Angle de prise de vue", "text"],
        ["movement", "Mouvement de caméra", "text"], ["support", "Support caméra", "text"],
        ["lens", "Focale", "text"], ["aperture", "Ouverture", "text"],
        ["focus", "Point de netteté", "text"], ["depth", "Profondeur de champ", "text"],
        ["height", "Hauteur de caméra", "text"], ["speed", "Vitesse du mouvement", "text"],
        ["composition", "Composition et axe", "area"], ["keyframe", "Instant à représenter", "area"],
        ["cameraNotes", "Consignes caméra du script", "area"]
      ]
    },
    {
      name: "Direction artistique", icon: "sun", fields: [
        ["artDirection", "Direction artistique du plan", "area"], ["light", "Lumière et contraste", "area"],
        ["lightDirection", "Direction et sources de lumière", "text"],
        ["temperature", "Température de couleur", "text"], ["palette", "Palette", "text"],
        ["environment", "Décor et arrière-plan", "area"], ["foreground", "Avant-plan", "text"],
        ["weather", "Météo et effets atmosphériques", "text"], ["textures", "Matières et textures", "text"],
        ["atmosphere", "Ambiance", "text"], ["reference", "Références visuelles", "text"]
      ]
    },
    {
      name: "Montage & rendu", icon: "film", fields: [
        ["duration", "Durée (s)", "number"], ["chrono", "Chrono ou timecode", "text"], ["transition", "Transition de sortie", "text"],
        ["sound", "Son, bruitage et musique", "area"], ["continuity", "Raccords et continuité", "area"],
        ["style", "Style visuel du plan", "style"], ["ratio", "Format d’image du plan", "text"],
        ["customStyle", "Précisions sur le style", "area"], ["negative", "Éléments à exclure", "area"],
        ["notes", "Notes de réalisation", "area"]
      ]
    }
  ];
  const shotFields = Object.fromEntries(shotGroups.flatMap(group => group.fields.map(([name, label]) => [name, label])));
  const arrowFields = ["cameraArrow", "subjectArrow"];
  const arrowDirections = {
    "": "Automatique", none: "Aucune", right: "Droite →", left: "Gauche ←", up: "Haut ↑", down: "Bas ↓",
    forward: "Vers le fond ↗", backward: "Vers l’avant-plan ↙", clockwise: "Rotation horaire ↻",
    counterclockwise: "Rotation antihoraire ↺"
  };
  const voiceMarker = /(?:^|[\s(])(?:v\.?\s*o\.?|o\.?\s*s\.?|voix[ -]off|hors[ -]champ|narration|narrat(?:eur|rice)|voix de)(?=$|[\s).,:])/iu;
  const projectBriefFields = [
    ["scriptTitle", "Titre du scénario"], ["synopsis", "Synopsis"], ["intention", "Intention de réalisation"],
    ["artDirection", "Direction artistique"], ["chrono", "Chrono / durée"], ["palette", "Palette générale"],
    ["atmosphere", "Ambiance"], ["references", "Références visuelles"], ["continuity", "Continuité du projet"],
    ["sound", "Son du projet"], ["notes", "Notes du projet"]
  ];
  const sceneBriefFields = [
    ["synopsis", "Synopsis de la scène"], ["intention", "Intention de la scène"], ["artDirection", "Direction artistique de la scène"],
    ["environment", "Décor de la scène"], ["atmosphere", "Ambiance de la scène"], ["palette", "Palette de la scène"],
    ["references", "Références de la scène"], ["continuity", "Raccords de scène"], ["sound", "Son de la scène"],
    ["transition", "Transition de scène"], ["notes", "Notes de scène"]
  ];

  let fallbackId = 0;
  function id() {
    return globalThis.crypto?.randomUUID?.() || `local-${Date.now().toString(36)}-${fallbackId++}`;
  }

  function newProject(name = "", script = "") {
    return {
      id: id(), name, script, technicalScript: "", scriptMode: "source", analyzedScript: "", analyzedCount: "", analysisVersion: ANALYSIS_VERSION,
      scenes: [], countMode: "auto", fixedCount: 3, boardSizes: [],
      style: "realiste", ratio: "16:9", customStyle: "", artDirection: "", palette: "", references: "",
      continuity: "", negative: "Filigrane, logo ou texte ajouté.", detectedMetadata: {}, updated: Date.now()
    };
  }

  function newScene(data = {}) {
    return {
      id: id(), name: "", setting: "", location: "", time: "", chrono: "", scriptNumber: "", sequence: "",
      source: "", environment: "",
      atmosphere: "", continuity: "", notes: "", sourceKey: "", shots: [], ...data
    };
  }

  function newShot(data = {}) {
    const shot = {id: id(), ...Object.fromEntries([...Object.keys(shotFields), ...arrowFields].map(field => [field, ""])), ...data};
    if (!shot.description && !Object.hasOwn(data, "description")) shot.description = describeShot(shot);
    return shot;
  }

  function describeShot(shot) {
    const frame = [shot.scale, shot.angle].filter(Boolean).join(" · ");
    const action = shot.action || shot.detail || shot.subjects;
    return [frame, action].filter(Boolean).join(" — ");
  }

  function normalizeShot(shot) {
    if (shot.voiceOver !== undefined) return shot;
    const lines = (shot.dialogue || "").split("\n");
    const off = lines.filter(line => {
      const [cue, text] = line.split(/\s+—\s+|:\s+/, 2);
      return Boolean(text && voiceMarker.test(cue));
    });
    return {
      ...shot,
      description: shot.description ?? describeShot(shot),
      dialogue: lines.filter(line => !off.includes(line)).join("\n"),
      voiceOver: off.join("\n")
    };
  }

  function sentenceCase(text) {
    if (text !== text.toLocaleUpperCase("fr")) return text;
    return text.charAt(0) + text.slice(1).toLocaleLowerCase("fr");
  }

  function parseScript(script) {
    return ScriptAnalysis.inspect(script).scenes;
  }

  function nameFromScript(script) {
    return ScriptAnalysis.inspect(script).metadata.scriptTitle || "";
  }

  function words(text) {
    return text.match(/[\p{L}\p{N}]+(?:[’'-][\p{L}]+)*/gu) || [];
  }

  function splitAction(paragraph) {
    const sentences = paragraph.split(/(?<=[!?…]|(?<!\bM|\bMme|\bDr|\bSt|\bMr|\betc)\.)\s+(?=[«“"\p{Lu}\p{N}])/u);
    const change = /;\s*|,?\s+(?=(?:[Pp]uis|[Ee]nsuite|[Ss]oudain|[Aa]u même instant|[Pp]endant ce temps|[Tt]hen|[Ss]uddenly)\b)|,?\s+et\s+(?=(?:il|elle|ils|elles|on|[A-ZÀ-ÖØ-Þ][\p{L}]+)\s+)|(?:,\s+|\s+et\s+)(?=(?:entre|sort|traverse|avance|recule|monte|descend|ouvre|ferme|tourne|prend|pose|dépose|saisit|essuie|déplie|plie|relève|se lève|s[’']assied)\b)/gu;
    return sentences.flatMap(sentence => sentence.split(change).map(part => part.trim().replace(/,$/, "")).filter(Boolean));
  }

  function extractBeats(source) {
    const lines = source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\[\[[\s\S]*?\]\]/g, "").split("\n");
    const beats = [];
    let spoken = null;
    let action = [];

    function flushAction() {
      for (const line of action) {
        const paragraph = line.replace(/\s+/g, " ").trim();
        for (const sentence of splitAction(paragraph)) beats.push({action: sentence, speaker: "", dialogue: "", performance: ""});
      }
      action = [];
    }

    function flushSpoken() {
      if (spoken?.dialogue) beats.push({...spoken, dialogue: spoken.dialogue.trim(), off: Boolean(spoken.off || voiceMarker.test(spoken.speaker))});
      spoken = null;
    }

    for (const [index, line] of lines.entries()) {
      const raw = line.trim().replace(/^\*\*(.+)\*\*$/, "$1");
      const content = ScriptAnalysis.stripProductionCue(raw);
      if (!content) {
        flushAction();
        flushSpoken();
        continue;
      }
      if (/^(?:={3,}$|#|>|\[\[)/.test(content)) continue;
      const directive = ScriptAnalysis.getField(content, ScriptAnalysis.planLabels);
      if (directive?.hasSeparator) {
        flushAction();
        flushSpoken();
        if (["action", "description"].includes(directive.field)) action.push(directive.value);
        if (["dialogue", "voiceOver"].includes(directive.field)) spoken = {
          action: "", speaker: directive.field === "voiceOver" ? "" : content.split(":")[0], dialogue: directive.value,
          performance: "", off: directive.field === "voiceOver"
        };
        continue;
      }
      const inline = /^(@?[\p{Lu}][\p{L}'’.-]*(?:\s+[\p{L}'’.-]+){0,3}(?:\s*\([^)]+\))?)\s*(?::|[–—]|(?:\uFFFD\s*(?=[«“"\uFFFD])))(?:\s*)(.+)$/u.exec(content);
      const forced = /^@[\p{L}]/u.test(content);
      const character = content.replace(/^@/, "").replace(/\s*\^$/, "");
      const isolated = /^[\p{Lu}][\p{Lu}\d .’'-]{0,32}(?:\s*\([^)]+\))?$/u.test(character)
        && character.split(/\s+/).length <= 4 && !/[.!?]$/.test(character)
        && !/^(?:FONDU|COUPE|CUT|FIN|INSERT|NOIR|LUMIÈRE|SON|TITRE)\b/iu.test(character)
        && Boolean(lines[index + 1]?.trim());
      const resumesAction = raw !== content || content.startsWith("!") || /^(?:insert|contre[- ]?champ|gros plan)\b/iu.test(content) || (/^\p{Lu}\p{Ll}+\s+(?:entre|sort|ferme|ouvre|pose|traverse|court|se lève|s’assied|recule)\b/u.test(content)
        && !/^\s/.test(line));
      if (inline || forced || (isolated && (!spoken || (spoken.dialogue && line === line.trim())))) {
        flushAction();
        flushSpoken();
        spoken = {action: "", speaker: inline ? inline[1].replace(/^@/, "") : character, dialogue: inline ? inline[2] : "", performance: ""};
      } else if (spoken && /^\(.+\)$/.test(content)) {
        spoken.performance = content.slice(1, -1);
      } else if (spoken && !resumesAction) {
        spoken.dialogue += (spoken.dialogue ? " " : "") + content;
      } else {
        flushSpoken();
        action.push(content.replace(/^!(?=\S)|^[-*•]\s+/, ""));
      }
    }
    flushAction();
    flushSpoken();
    return beats;
  }

  function sceneMaterial(scene, parsed) {
    const {plans, loose} = parsed || ScriptAnalysis.readBody(scene.source);
    const beats = extractBeats(loose);
    return {plans, beats, allBeats: [...beats, ...plans.flatMap(plan => extractBeats(plan.text))]};
  }

  function suggestedCount(scene, material = sceneMaterial(scene)) {
    return material.plans.length || Math.max(1, material.beats.length);
  }

  function lightFor(scene) {
    const cue = scene.time || [scene.source, scene.artDirection, scene.environment].join(" ");
    const inside = scene.setting === "Intérieur";
    if (/\b(?:nuit|night)\b/iu.test(cue)) return inside
      ? "Sources motivées par le décor, pénombre lisible et séparation du sujet au contre-jour."
      : "Sources nocturnes du lieu, zones d’ombre profondes et exposition réservée aux points d’intérêt.";
    if (/aube|cr[eé]puscule|heure (?:bleue|dorée)|dawn|dusk|sunset|coucher du soleil/iu.test(cue)) {
      return "Lumière rasante et contrastes doux, dégradé visible entre le ciel et les surfaces éclairées.";
    }
    if (/\b(?:jour|matin|midi|day|morning|après-midi)\b/iu.test(cue)) return inside
      ? "Lumière naturelle filtrée par les ouvertures, ombres adoucies sur le sujet."
      : "Lumière naturelle cohérente avec l’heure et le décor, détails conservés dans les ombres.";
    return "Lumière motivée par les sources du décor, avec un contraste qui guide le regard.";
  }

  function namedSubjects(beats, sceneBeats) {
    const cast = [...new Set(sceneBeats.filter(beat => !beat.off).map(beat => beat.speaker.replace(/\s*\(.+\)$/, "")).filter(Boolean))];
    const actions = beats.map(beat => beat.action.toLocaleLowerCase("fr")).join(" ");
    const speakers = beats.filter(beat => !beat.off).map(beat => beat.speaker.replace(/\s*\(.+\)$/, "")).filter(Boolean);
    const mentioned = cast.filter(name => {
      const expression = name.toLocaleLowerCase("fr").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(`(?:^|[^\\p{L}])${expression}(?![\\p{L}])`, "u").test(actions);
    });
    const names = [...new Set([...speakers, ...mentioned])];
    if (names.length) return names.map(sentenceCase).join(", ");
    const firstName = action => /^(\p{Lu}\p{Ll}{2,})(?:,[^,]+,)?\s+(?:entre|sort|marche|court|traverse|attend|regarde|suit|arrive|s[’']approche|ouvre|ferme|prend|dépose|se |walks|enters|looks|stands|runs|turns)\b/u.exec(action)?.[1];
    const localName = beats.map(beat => firstName(beat.action)).find(Boolean);
    if (localName) return localName;
    const sceneNames = [...new Set(sceneBeats.map(beat => firstName(beat.action)).filter(Boolean))];
    return sceneNames.length === 1 ? sceneNames[0] : "";
  }

  const visualCues = [
    [/\b(?:main|mains|doigts?|hands?|fingers?)\b/iu, "Le geste et la position des doigts"],
    [/\b(?:regard|visage|yeux|face|glance|eyes?)\b/iu, "Le regard au moment où l’expression change"],
    [/\b(?:enveloppe|lettre|letter|envelope)\b/iu, "L’enveloppe ou la lettre dans le cadre"],
    [/\b(?:porte|portes|portail|door|doors|gate)\b/iu, "Le seuil et ce qui apparaît derrière"],
    [/\b(?:fen[êe]tre|vitre|miroir|reflet|window|mirror|reflection)\b/iu, "La surface vitrée et ce qu’elle laisse voir"],
    [/\b(?:[eé]cran|t[eé]l[eé]phone|screen|phone)\b/iu, "L’écran et son interaction avec le sujet"],
    [/\b(?:cl[eé]s?|photo|goutte|keys?|picture|droplet)\b/iu, "L’objet au moment où il attire l’attention"]
  ];

  const movementCues = [
    [/\b(?:monte|descend|gravit|climbs|descends)\b/iu, "Panoramique vertical", "Garder visibles le point de départ et la direction du déplacement vertical."],
    [/\b(?:court|fuit|se pr[eé]cipite|runs|rushes)\b/iu, "Suivi stabilisé", "Accompagner le départ du sujet et conserver une marge dans sa direction."],
    [/\b(?:s[’']approche|avance|arrive|approaches)\b/iu, "Travelling arrière", "Laisser le sujet réduire la distance avec la caméra pendant le mouvement."],
    [/\b(?:entre|sort|traverse|franchit|marche|suit|roule|walks|crosses|enters|follows)\b/iu, "Travelling latéral", "Préserver le sens du déplacement à l’écran et laisser du champ devant le sujet."]
  ];

  function estimateShot(scene, index, total, selected, beats, alternate = false, coverageIndex = 0) {
    const subjects = namedSubjects(selected, beats);
    const action = selected.map(beat => beat.action).filter(Boolean).join(" ");
    const speech = selected.filter(beat => beat.dialogue && !beat.off);
    const voiceOver = selected.filter(beat => beat.dialogue && beat.off);
    const visual = visualCues.find(([pattern]) => pattern.test(action))?.[1];
    const motion = movementCues.find(([pattern]) => pattern.test(action));
    const close = alternate || (Boolean(visual) && !motion);
    const establish = index === 0 && total > 1;
    const environment = scene.environment || scene.location;
    const lighting = lightFor(scene);
    const performance = selected.map(beat => beat.performance).filter(Boolean).join(" · ");
    const weatherFor = text => /\b(?:neige|snow)\b/iu.test(text) ? "Neige"
      : /\b(?:pluie|pleut|rain|raining|averse)\b/iu.test(text) ? "Pluie"
      : /\b(?:brouillard|brume|fog|mist)\b/iu.test(text) ? "Brume" : "";
    const weather = weatherFor(action) || weatherFor(scene.environment || "") || weatherFor(scene.source);
    const coverage = establish ? "Situer l’action dans le décor"
      : speech.length ? "Prise de parole"
      : motion ? "Accompagner le déplacement"
      : close ? "Détail de l’action"
      : index === total - 1 ? "Dernier temps de la scène" : "Développer l’action";
    const anglesOfCoverage = ["Trois-quarts", "Profil", "Par-dessus l’épaule"];
    const coverageTitle = visual ? "Insert · " + visual : "Couverture · " + anglesOfCoverage[(coverageIndex - 1) % anglesOfCoverage.length];
    const excerpt = (selected.find(beat => beat.action)?.action || "").replace(/^(?:puis|ensuite|soudain),?\s+/iu, "").replace(/[.!?…]$/, "");
    const shortTitle = excerpt.length > 65 ? excerpt.slice(0, 64).replace(/\s+\S*$/, "") + "…" : excerpt;
    const title = alternate ? coverageTitle : capitalize(shortTitle) || (subjects && speech.length ? subjects + " prend la parole" : coverage);
    const movement = motion && !close ? motion[1] : "Fixe";
    const support = {"Suivi stabilisé": "Gimbal", "Panoramique vertical": "Trépied", Fixe: "Trépied"}[movement] || "Dolly";
    const focal = establish ? "28 mm" : close ? "85 mm" : speech.length ? "65 mm" : "50 mm";
    const estimatedTime = Math.max(establish ? 4 : 3, words(selected.map(beat => beat.dialogue).join(" ")).length / 2.5, words(action).length / 7);
    const speechAction = (subjects || "Le sujet") + " prend la parole.";
    const sceneAction = action || (speech.length ? speechAction : "Montrer " + (environment || "l’espace de la scène") + ".");
    const coverageAction = "Montrer " + (visual ? visual.charAt(0).toLocaleLowerCase("fr") + visual.slice(1) : "l’action sous un autre angle");
    return {
      title,
      action: alternate ? coverageAction + ". " + sceneAction : sceneAction,
      subjects,
      blocking: motion ? motion[2] : speech.length ? "Installer la prise de parole sur un axe constant et garder le regard dégagé." : "",
      performance: performance || (alternate ? "Privilégier une réaction lisible dans le geste ou le regard." : ""),
      dialogue: alternate ? "" : speech.map(spokenText).join("\n"),
      voiceOver: alternate ? "" : voiceOver.map(spokenText).join("\n"),
      detail: visual || (alternate ? "Un geste ou un regard qui prolonge le temps fort du plan précédent." : ""),
      scale: establish ? "Plan d’ensemble" : alternate && visual ? "Insert" : close ? "Gros plan" : speech.length ? "Plan poitrine" : "Plan moyen",
      angle: alternate ? anglesOfCoverage[(coverageIndex - 1) % anglesOfCoverage.length] : speech.length && !establish && !close ? "Trois-quarts" : "À hauteur du regard",
      movement,
      support,
      lens: focal,
      aperture: establish ? "f/5,6" : close ? "f/2,8" : "f/4",
      focus: establish ? "Le décor et la position du sujet" : close && visual ? visual : subjects || "Le sujet principal",
      depth: establish ? "Grande profondeur de champ" : close ? "Faible profondeur de champ" : "Plans intermédiaires distincts",
      composition: establish ? "Lignes du décor lisibles et situation du sujet dans l’espace." :
        motion ? "Réserver de l’espace devant le sujet dans le sens du déplacement." :
        "Hiérarchiser le sujet et l’arrière-plan autour de l’action principale.",
      keyframe: motion ? "L’instant où la posture ou le placement traduit le plus clairement la direction du déplacement." : "",
      light: lighting,
      environment,
      weather,
      atmosphere: scene.atmosphere,
      duration: String(Math.ceil(alternate ? 3 : estimatedTime)),
      transition: index === total - 1 && scene.transition ? scene.transition : "Coupe franche"
    };
  }

  function spokenText(beat) {
    return [beat.speaker, beat.dialogue].filter(Boolean).join(" — ");
  }

  function capitalize(text) {
    return text.charAt(0).toLocaleUpperCase("fr") + text.slice(1);
  }

  function screenDirection(text) {
    const cue = ScriptAnalysis.key(text);
    if (/\b(?:antihoraire|counterclockwise)\b/u.test(cue)) return "counterclockwise";
    if (/\b(?:horaire|orbite|tourne autour|rotation|clockwise)\b/u.test(cue)) return "clockwise";
    if (/\b(?:vers la gauche|de droite a gauche|lateral gauche|panoramique gauche|a gauche du cadre)\b/u.test(cue)) return "left";
    if (/\b(?:vers la droite|de gauche a droite|lateral droite|panoramique droite|a droite du cadre)\b/u.test(cue)) return "right";
    if (/\b(?:travelling arriere|zoom arriere|vers l'avant-plan|recule|vers la camera)\b/u.test(cue)) return "backward";
    if (/\b(?:travelling avant|zoom avant|vers le fond|s'eloigne|s'enfonce)\b/u.test(cue)) return "forward";
    if (/\b(?:vers le bas|descend|vers le sol|inclinaison vers le bas)\b/u.test(cue)) return "down";
    if (/\b(?:vers le haut|monte|se leve|gravit|inclinaison vers le haut)\b/u.test(cue)) return "up";
    return "";
  }

  function movementArrows(shot) {
    const camera = ScriptAnalysis.key(shot.movement || "");
    const subject = [shot.action, shot.blocking].filter(Boolean).join(" ");
    const cameraDefault = camera && !/^(?:plan )?fixe$/u.test(camera)
      ? screenDirection(camera) || (/\b(?:grue|vertical)\b/u.test(camera) ? screenDirection(subject) || "up" : "right") : "";
    const subjectDefault = screenDirection(subject) ||
      (/\b(?:entre|sort|traverse|avance|marche|court|franchit|se deplace|walks|runs|crosses)\b/u.test(ScriptAnalysis.key(subject)) ? "right" : "");
    return [
      {kind: "camera", label: "Caméra", direction: shot.cameraArrow || cameraDefault},
      {kind: "subject", label: "Sujet", direction: shot.subjectArrow || subjectDefault}
    ].filter(arrow => arrow.direction && arrow.direction !== "none" && Object.hasOwn(arrowDirections, arrow.direction));
  }

  function countFor(scene, project, material) {
    return project.countMode === "fixed" ? boundedCount(project.fixedCount) : suggestedCount(scene, material);
  }

  function countSignature(project) {
    return project.countMode === "fixed" ? `fixed-${boundedCount(project.fixedCount)}` : "auto";
  }

  function boundedCount(count) {
    const size = Math.trunc(Number(count));
    return Number.isSafeInteger(size) ? Math.max(1, size) : 1;
  }

  function generateShots(scene, target, material = sceneMaterial(scene)) {
    const {plans, beats, allBeats} = material;
    if (plans.length) {
      const explicit = plans.map((plan, index) => {
        const selected = extractBeats(plan.text);
        const suggested = estimateShot(scene, index, plans.length, selected, allBeats);
        const fields = Object.fromEntries(Object.entries(plan.fields).filter(([, value]) => value));
        if (!selected.length) suggested.action = plan.description || fields.detail || "";
        if (!suggested.action && fields.description) suggested.action = fields.description;
        if (fields.voiceOver && suggested.voiceOver) fields.voiceOver = [fields.voiceOver, suggested.voiceOver].join("\n");
        if (!fields.title && !selected.length && fields.detail) suggested.title = fields.scale + " · " + fields.detail;
        return newShot({
          ...suggested, ...fields, scriptNumber: plan.scriptNumber, explicit: true, edited: false,
          sourceKey: [plan.scriptNumber, plan.heading, plan.text || plan.description].join("\n")
        });
      });
      if (target >= explicit.length) {
        const extra = Array.from({length: target - explicit.length}, (_, index) => {
          const plan = plans[index % plans.length];
          const selected = extractBeats(plan.text);
          return newShot({...estimateShot(scene, explicit.length + index, target, selected, allBeats, true, index + 1),
            edited: false, sourceKey: explicit[index % explicit.length].sourceKey + "\nCouverture " + (index + 1)});
        });
        return explicit.concat(extra);
      }
      return Array.from({length: target}, (_, index) => {
        const first = Math.floor(index * explicit.length / target);
        const end = Math.floor((index + 1) * explicit.length / target);
        const group = explicit.slice(first, end);
        if (group.length === 1) return group[0];
        const shot = {...group[0]};
        for (const field of Object.keys(shotFields)) {
          if (field === "duration") continue;
          if (["style", "ratio", "chrono"].includes(field)) continue;
          shot[field] = [...new Set(group.map(item => item[field]).filter(Boolean))].join(field === "scriptNumber" ? " / " : "\n");
        }
        shot.duration = String(Math.round(group.reduce((sum, item) => sum + Number(item.duration || 0), 0) * 1000) / 1000);
        shot.chrono = ScriptAnalysis.combinedChrono(group.map(item => item.chrono)) || group.map(item => item.chrono).filter(Boolean).join(" / ");
        shot.sourceKey = group.map(item => item.sourceKey).join("\n---\n");
        return shot;
      });
    }
    let coverageIndex = 0;
    return Array.from({length: target}, (_, index) => {
      const first = Math.floor(index * beats.length / target);
      const end = Math.floor((index + 1) * beats.length / target);
      const selected = beats.slice(first, Math.max(first + 1, end));
      const alternate = index > 0 && first === Math.floor((index - 1) * beats.length / target);
      if (alternate) coverageIndex += 1;
      const fields = estimateShot(scene, index, target, selected, allBeats, alternate, coverageIndex);
      const sourceKey = selected.map(beat => [beat.action, beat.speaker, beat.dialogue, beat.performance].join("\n")).join("\n---\n");
      return newShot({...fields, edited: false, sourceKey: sourceKey + (alternate ? "\nCouverture " + coverageIndex : "")});
    });
  }

  function suggestShot(scene, index, total) {
    return generateShots(scene, Math.max(1, total))[index];
  }

  function fillShots(scene, target) {
    const count = boundedCount(target);
    if (count <= scene.shots.length) return scene.shots.slice(0, count);
    return scene.shots.concat(generateShots(scene, count).slice(scene.shots.length));
  }

  const recognizedSceneFields = ["name", "setting", "location", "time", "chrono", "scriptNumber", "sequence",
    ...sceneBriefFields.map(([field]) => field)];

  function mergeScene(existing, details) {
    const scene = {...existing, sourceKey: details.sourceKey, sourceHeading: details.sourceHeading};
    const sameSource = existing.sourceKey === details.sourceKey;
    if (!sameSource) scene.source = details.source;
    for (const field of recognizedSceneFields) {
      const prior = existing.detectedFields?.[field];
      const current = existing[field];
      if (current === undefined || current === prior || (!current && prior === undefined)) scene[field] = details[field] || "";
    }
    scene.detectedFields = Object.fromEntries(recognizedSceneFields.map(field => [field, details[field] || ""]));
    return scene;
  }

  function hasEdits(shot) {
    return shot.edited === true || shot.edited === undefined;
  }

  function keepEdits(scene, generated, {legacy = false, keepManual = false} = {}) {
    const used = new Set();
    const updated = generated.map((shot, index) => {
      let old = scene.shots.find(item => !used.has(item.id) && item.sourceKey && item.sourceKey === shot.sourceKey);
      if (!old && shot.explicit && shot.scriptNumber) {
        old = scene.shots.find(item => !used.has(item.id) && item.explicit && item.scriptNumber === shot.scriptNumber);
      }
      if (!old && legacy) {
        const action = ScriptAnalysis.key(shot.action);
        old = action && scene.shots.find(item => !used.has(item.id) && ScriptAnalysis.key(item.action) === action);
        if (!old && !shot.explicit && !scene.shots.some(item => item.sourceKey)) {
          const legacyShot = scene.shots[index];
          const text = ScriptAnalysis.key(legacyShot?.action || "");
          if (text && action && (text.includes(action) || action.includes(text))) old = legacyShot;
        }
      }
      if (!old || used.has(old.id)) return shot;
      used.add(old.id);
      if (!hasEdits(old)) return {...shot, id: old.id, edited: false};
      const values = Object.fromEntries([...Object.keys(shotFields), ...arrowFields, "image"].flatMap(field => {
        if (old.editedFields && !old.editedFields.includes(field)) return [];
        return old[field] === undefined || (old.edited === undefined && !old[field]) ? [] : [[field, old[field]]];
      }));
      return {...shot, ...values, id: old.id, edited: true, editedFields: old.editedFields || Object.keys(values)};
    });
    if (keepManual) updated.push(...scene.shots.filter(shot => shot.manual && !used.has(shot.id)));
    return updated;
  }

  function analyze(project, inspection = ScriptAnalysis.inspect(project.script)) {
    const versionChanged = project.analysisVersion !== ANALYSIS_VERSION;
    const countChanged = project.analyzedCount !== countSignature(project);
    if (!versionChanged && project.script.trim() === project.analyzedScript && !countChanged) return project.scenes;
    const existing = new Map();
    const byNumber = new Map();
    const used = new Set();
    for (const scene of project.scenes) {
      if (scene.sourceKey) {
        const matches = existing.get(scene.sourceKey) || [];
        matches.push(scene);
        existing.set(scene.sourceKey, matches);
      }
      if (scene.scriptNumber) {
        const number = [scene.detectedFields?.sequence || scene.sequence || "", scene.detectedFields?.scriptNumber || scene.scriptNumber].join("/");
        const numbered = byNumber.get(number) || [];
        numbered.push(scene);
        byNumber.set(number, numbered);
      }
    }

    const parsed = inspection.scenes.map(({plans, loose, ...details}) => ({
      details, plans, loose, old: existing.get(details.sourceKey)?.shift()
    }));
    for (const entry of parsed) if (entry.old) used.add(entry.old.id);
    const numberCount = new Map();
    for (const {details} of parsed) {
      const number = [details.sequence, details.scriptNumber].join("/");
      numberCount.set(number, (numberCount.get(number) || 0) + 1);
    }
    const scenes = parsed.map(({details, plans, loose, old}) => {
      if (!old && details.scriptNumber) {
        const number = [details.sequence, details.scriptNumber].join("/");
        const matches = byNumber.get(number);
        if (numberCount.get(number) === 1 && matches?.length === 1 && !used.has(matches[0].id)) {
          old = matches[0];
          used.add(old.id);
        }
      }
      const scene = mergeScene(old || newScene(), details);
      const sourceChanged = old?.sourceKey !== details.sourceKey;
      if (old && !versionChanged && !sourceChanged && !countChanged) return scene;
      const material = sceneMaterial(scene, !sourceChanged && old.source !== details.source ? undefined : {plans, loose});
      const target = countFor(scene, project, material);
      if (old && !versionChanged && !sourceChanged && !material.plans.length) {
        return {...scene, shots: fillShots(scene, target)};
      }
      const generated = generateShots(scene, target, material);
      scene.shots = old ? keepEdits(old, generated, {legacy: versionChanged, keepManual: !countChanged}) : generated;
      return scene;
    });
    const manual = project.scenes.filter(scene => !used.has(scene.id) && (scene.manual || !scene.sourceKey)).map(scene => countChanged ?
      {...scene, shots: fillShots(scene, countFor(scene, project))} : scene);
    const combined = scenes.concat(manual);
    if (project.script.trim() !== project.analyzedScript) return combined;
    const byId = new Map(combined.map(scene => [scene.id, scene]));
    const retained = project.scenes.map(scene => byId.get(scene.id)).filter(Boolean);
    const retainedIds = new Set(retained.map(scene => scene.id));
    return retained.concat(combined.filter(scene => !retainedIds.has(scene.id)));
  }

  function metadataUpdates(project, metadata) {
    const updates = {};
    for (const field of [...projectBriefFields.map(([key]) => key), "ratio"]) {
      const detected = metadata[field];
      if (!detected || project.briefOverrides?.includes(field)) continue;
      const before = project.detectedMetadata?.[field];
      if (!project[field] || project[field] === before || (field === "ratio" && project.ratio === "16:9" && !before)) {
        updates[field] = detected;
      }
    }
    if (metadata.scriptTitle && (!project.name || project.name === project.detectedMetadata?.scriptTitle)) {
      updates.name = metadata.scriptTitle.slice(0, 120);
    }
    return {...updates, detectedMetadata: metadata};
  }

  function briefLines(fields, source) {
    return fields.map(([field, label]) => [label, source[field]]);
  }

  function formatGroup(name, fields) {
    const lines = fields.filter(([, value]) => String(value ?? "").trim())
      .map(([label, value]) => label + " : " + String(value).trim());
    return lines.length ? [name.toLocaleUpperCase("fr"), ...lines].join("\n") : "";
  }

  function projectPromptFields(project) {
    return briefLines(projectBriefFields, project);
  }

  function scenePromptFields(scene) {
    return [
      ["Numéro de scène dans le script", scene.scriptNumber], ["Séquence", scene.sequence],
      ["Lieu", scene.location], ["Intérieur / extérieur", scene.setting], ["Moment", scene.time], ["Chrono de la scène", scene.chrono],
      ...briefLines(sceneBriefFields, scene)
    ];
  }

  function renderFields(project, shot) {
    const style = styles[shot.style || project.style] || styles.realiste;
    return [
      ["Style", style[0]], ["Traitement visuel", style[1]], ["Précisions de style du projet", project.customStyle],
      ["Précisions de style du plan", shot.customStyle], ["Format d’image", shot.ratio || project.ratio || "16:9"]
    ];
  }

  function shotSections(shot) {
    return shotGroups.map(group => formatGroup(group.name === "Montage & rendu" ? "Montage et son" : group.name, group.fields
      .filter(([field]) => !["title", "style", "ratio", "customStyle", "negative"].includes(field))
      .map(([field, label]) => [label, field === "duration" && shot[field] ? shot[field] + " s" : shot[field]])));
  }

  function arrowInstructions(shot) {
    return formatGroup("Flèches de mouvement", movementArrows(shot).map(({label, direction, kind}) =>
      [label, arrowDirections[direction] + (kind === "camera" ? " · flèche orange en bord de cadre" : " · flèche bleue près de la trajectoire")]));
  }

  function planTitle(scene, shot, sceneNumber, shotNumber) {
    return "Scène " + sceneNumber + " — " + (scene.name || "Sans titre") + " · Plan " + shotNumber +
      (shot.title ? " — " + shot.title : "");
  }

  const visualInstructions = "Choisir un instant précis de l’action et rendre lisibles le placement des sujets et le sens du mouvement. Utiliser le son, les dialogues et la voix off comme indications de jeu et d’ambiance. La voix off reste hors image et hors texte affiché. Respecter en priorité les réglages du plan.";

  function buildPrompt(project, scene, shot, sceneNumber, shotNumber) {
    return [
      (project.name || "Storyboard sans titre") + " · " + planTitle(scene, shot, sceneNumber, shotNumber),
      "Créer une image unique de storyboard. " + visualInstructions,
      formatGroup("Rendu", renderFields(project, shot)),
      formatGroup("Contexte", [...scenePromptFields(scene), ...projectPromptFields(project)]),
      ...shotSections(shot),
      arrowInstructions(shot),
      formatGroup("À exclure", [["Contraintes du projet", project.negative], ["Contraintes du plan", shot.negative]])
    ].filter(Boolean).join("\n\n");
  }

  function listShots(project) {
    let ordinal = 0;
    return project.scenes.flatMap((scene, sceneIndex) => scene.shots.map((shot, shotIndex) =>
      ({scene, shot, sceneNumber: sceneIndex + 1, shotNumber: shotIndex + 1, ordinal: ++ordinal})));
  }

  function layoutBoards(entries, sizes = []) {
    const boards = [];
    let offset = 0;
    function add(count) {
      const cells = entries.slice(offset, offset + count);
      const columns = Math.min(cells.length, Math.ceil(Math.sqrt(cells.length)));
      const rows = Math.ceil(cells.length / columns);
      boards.push({number: boards.length + 1, cells, columns, rows});
      offset += cells.length;
    }

    for (const size of sizes) {
      if (offset >= entries.length) break;
      if (Number.isSafeInteger(size) && size > 0) add(size);
    }
    if (offset < entries.length) add(entries.length - offset);
    return boards;
  }

  function buildBoardPrompt(project, board, total) {
    const defaultRender = formatGroup("Rendu commun", renderFields(project, {}));
    const scenes = [...new Map(board.cells.map(entry => [entry.scene.id, entry])).values()];
    const contexts = scenes.map(({scene, sceneNumber}) =>
      formatGroup("Contexte scène " + sceneNumber + " — " + (scene.name || "Sans titre"), scenePromptFields(scene)));
    const cells = board.cells.map(({scene, shot, sceneNumber, shotNumber, ordinal}, index) => {
      const row = Math.floor(index / board.columns) + 1;
      const column = index % board.columns + 1;
      const styleOverride = shot.style || shot.ratio || shot.customStyle;
      return [
        "CASE " + (index + 1) + " · ligne " + row + ", colonne " + column + " · plan global " + ordinal + " · " + planTitle(scene, shot, sceneNumber, shotNumber),
        styleOverride && formatGroup("Rendu de la case", renderFields(project, shot)),
        ...shotSections(shot),
        arrowInstructions(shot),
        formatGroup("À exclure dans cette case", [["Contraintes du plan", shot.negative]])
      ].filter(Boolean).join("\n");
    });
    const blank = board.columns * board.rows - board.cells.length;
    return [
      (project.name || "Storyboard sans titre") + " · Planche " + board.number + " / " + total + " · " + board.cells.length + " plans",
      "Créer une seule planche-contact de storyboard avec exactement " + board.cells.length + " cases illustrées distinctes. Grille régulière de " +
      board.columns + " colonnes × " + board.rows + " rangées, gouttières fines et constantes. Lire de gauche à droite, puis de haut en bas." +
      (blank ? " Laisser " + blank + " emplacement(s) vide(s) à la fin de la dernière rangée." : ""),
      "Respecter l’ordre et le contenu de chaque case. Un photogramme par case, avec des bordures nettes. Dessiner les flèches de mouvement indiquées par case, avec des pointes lisibles et sans couvrir les visages. Conserver l’apparence des personnages, costumes et accessoires entre les cases selon les raccords, y compris avec les autres planches. " + visualInstructions +
      " Garder les éventuels textes prévus par l’action dans l’image et réserver les bordures à la mise en page.",
      defaultRender,
      formatGroup("Contexte du projet", projectPromptFields(project)),
      ...contexts, ...cells,
      formatGroup("À exclure sur toute la planche", [["Contraintes du projet", project.negative], ["Mise en page", "Plans fusionnés ou répétés, cases supplémentaires, légendes, watermark."]])
    ].filter(Boolean).join("\n\n");
  }

  return {MAX_SHOTS, ANALYSIS_VERSION, projectBriefFields, sceneBriefFields, styles, ratios, values, shotGroups, arrowDirections, movementArrows, normalizeShot, newProject, newScene, newShot, parseScript, nameFromScript,
    extractBeats, suggestedCount, suggestShot, countFor, countSignature, boundedCount, fillShots, analyze, metadataUpdates, buildPrompt, listShots, layoutBoards, buildBoardPrompt};
})();
