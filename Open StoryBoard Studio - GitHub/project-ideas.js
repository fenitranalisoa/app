"use strict";

const ProjectIdeas = (() => {
  const grandBudapest = "https://www.criterion.com/films/29601-the-grand-budapest-hotel";
  const moodForLove = "https://www.criterion.com/films/198-in-the-mood-for-love";
  const bladeRunner = "https://staging.ascmag.com/articles/blade-runner-2049-designing-the-future";
  const getOut = "https://staging.ascmag.com/podcasts/get-out-toby-oliver-acs";
  const lighthouse = "https://staging.ascmag.com/articles/stormy-isle-the-lighthouse";

  const choices = {
    intention: [
      ["Rester près du personnage", "Faire vivre la scène depuis le point de vue du personnage principal. Laisser le temps à ses regards et à ses gestes de traduire ce qu’il ressent. Étudier les regards et les silences dans In the Mood for Love.", moodForLove],
      ["Faire monter le suspense", "Donner au public une information à la fois. Retarder la révélation par le hors-champ, puis isoler le détail décisif dans un cadre plus serré. Observer la progression de la tension dans Get Out.", getOut],
      ["Mettre en valeur la comédie", "Laisser les acteurs installer le rythme dans des cadres lisibles. Couper sur les réactions et ménager un temps après les répliques fortes. Observer le rythme des échanges dans The Grand Budapest Hotel.", grandBudapest],
      ["Observer avec naturel", "Adopter un regard proche du documentaire. Laisser les corps occuper le décor librement et suivre les gestes du quotidien à hauteur humaine."],
      ["Faire sentir un changement", "Construire une évolution entre le début et la fin. Modifier la distance, la lumière ou l’espace autour du personnage quand sa situation bascule."],
      ["Raconter sans dialogue", "Confier les informations essentielles aux gestes, aux regards et aux accessoires. Prévoir un cadre lisible pour chaque action décisive."],
      ["Mettre en scène un souvenir", "Rapprocher les plans par des objets, reflets ou gestes récurrents. Adapter le rythme et la lumière au souvenir tel que le personnage le perçoit."]
    ],
    artDirection: [
      ["Réalisme du quotidien", "Matières crédibles et traces d’usage sur les objets. Costumes cohérents avec l’activité des personnages et lumière motivée par les fenêtres ou les luminaires du décor."],
      ["Composition graphique", "Cadres structurés par des axes symétriques. Répartir des aplats de couleur entre murs, costumes et accessoires pour guider l’œil."],
      ["Intérieurs feutrés", "Bois patiné, textiles et lampes visibles. Travailler les reflets et les passages étroits pour suggérer la proximité des personnages."],
      ["Nuit urbaine", "Sources colorées du décor, reflets sur les vitres et l’asphalte. Distinguer la silhouette au premier plan du fond par contraste de couleur."],
      ["Décor minimal", "Peu d’accessoires, surfaces mates et volumes simples. Réserver un contraste fort à l’objet ou au geste qui porte la scène."],
      ["Époque et mémoire", "Choisir des matières et des accessoires cohérents avec l’époque. Utiliser costumes et éclairages pour distinguer les périodes du récit."]
    ],
    atmosphere: [
      ["Chaleureuse et familière", "Lumière enveloppante, échanges détendus, fond sonore discret. Le décor donne le sentiment d’un lieu habité."],
      ["Intime et retenue", "Proximité des visages, silences et faible agitation du fond. L’émotion se lit dans des gestes discrets."],
      ["Tension sous la surface", "Cadres calmes, arrière-plans qui laissent de l’espace au hors-champ, sons isolés. Augmenter le contraste aux moments de rupture."],
      ["Vive et comique", "Cadres ouverts, lumière homogène, interactions lisibles. Créer des pauses courtes pour mettre en valeur les réactions."],
      ["Nostalgique et douce-amère", "Lumière rasante, couleurs légèrement atténuées et rythme posé. Laisser revenir une matière, un bruit ou une couleur au fil des scènes."],
      ["Étrange et onirique", "Profondeurs incertaines, reflets et gestes ralentis. Donner à chaque scène un repère visuel concret pour maintenir sa lisibilité."]
    ],
    continuity: [
      ["Continuité des accessoires", "Suivre la position, la main utilisée et l’état de chaque accessoire entre les plans d’une même action."],
      ["Raccords de regard et d’axe", "Fixer la direction des regards et le sens des déplacements. Prendre un plan d’ensemble comme repère spatial pour la scène."],
      ["Lumière qui évolue", "Noter la direction et la couleur des sources dans chaque lieu. Montrer le passage du temps par une progression cohérente de la lumière."],
      ["Apparence des personnages", "Reprendre le costume, la coiffure et les détails visibles du même personnage d’une case à l’autre, selon la chronologie."]
    ],
    sound: [
      ["Documentaire et direct", "Privilégier les sons du lieu, les voix et les bruits proches du personnage. Garder l’ambiance entre les coupes."],
      ["Silences et détails", "Isoler les respirations et les gestes décisifs. Laisser les silences installer l’attention avant les événements clés."],
      ["Motif récurrent", "Associer un son discret à un lieu, à un personnage ou à un objet. Le faire évoluer avec les étapes du récit."],
      ["Voix off et ambiance", "Distinguer la voix off des répliques à l’image. Maintenir un fond léger sous la narration et laisser respirer les transitions."]
    ],
    notes: [
      ["Priorités de couverture", "Repérer les moments sans lesquels la scène devient difficile à comprendre. Prévoir leur cadre, le contrechamp utile et un plan de raccord."],
      ["Répétition des déplacements", "Répéter les déplacements et les gestes clés avec les acteurs avant de régler le mouvement de caméra. Vérifier ce qui reste visible dans le cadre."],
      ["Repérage des sources de lumière", "Identifier les fenêtres et les luminaires qui motivent la lumière. Comparer les angles de prise de vue avant de fixer leur direction et leurs contrastes."]
    ],
    references: [
      ["The Grand Budapest Hotel · symétrie et décor", "The Grand Budapest Hotel (Wes Anderson) — étudier les cadres frontaux, les décors symétriques et l’usage des costumes pour distinguer des univers visuels.", grandBudapest],
      ["In the Mood for Love · cadres intimes", "In the Mood for Love (Wong Kar Wai) — étudier les seuils, les reflets et les motifs de costumes qui structurent la proximité entre les personnages.", moodForLove],
      ["Blade Runner 2049 · couleur et espace", "Blade Runner 2049 (Denis Villeneuve) — étudier la couleur dominante par séquence et la façon dont les silhouettes se détachent de décors immenses.", bladeRunner],
      ["Get Out · évolution du ton", "Get Out (Jordan Peele) — étudier comment une lumière accueillante peut évoluer vers des nuits cyan et des espaces plus inquiétants.", getOut],
      ["The Lighthouse · contraste et matière", "The Lighthouse (Robert Eggers) — étudier les silhouettes en noir et blanc, la texture des visages et le contraste des lumières dans les espaces confinés.", lighthouse]
    ],
    palette: [
      ["Pastels et bordeaux · The Grand Budapest Hotel", "Palette inspirée de The Grand Budapest Hotel. Utiliser le rose et le crème sur les décors, le bordeaux sur les costumes et le mauve pour les ombres.", grandBudapest,
        [["Rose poudré", "#E8ABBC"], ["Crème", "#F2DEC8"], ["Bordeaux", "#6D223E"], ["Mauve", "#A27DAD"], ["Prune", "#3F284C"]]],
      ["Rouge et jade · In the Mood for Love", "Palette inspirée de In the Mood for Love. Jouer le rouge sur les tissus, le jade dans les reflets et l’ambre sur les sources du décor.", moodForLove,
        [["Grenat", "#781F38"], ["Jade sombre", "#234A41"], ["Ambre", "#C28249"], ["Sable", "#D8BA91"], ["Brun profond", "#241D20"]]],
      ["Orange poussière · Blade Runner 2049", "Palette inspirée des séquences désertiques de Blade Runner 2049. Construire la profondeur avec des ocres successifs et des silhouettes brun sombre.", bladeRunner,
        [["Orange brûlé", "#B84A22"], ["Ocre", "#C97B37"], ["Sable doré", "#DFAD65"], ["Terre cuite", "#763B2D"], ["Brun noir", "#2E2021"]]],
      ["Chaud et cyan · Get Out", "Palette inspirée des contrastes jour et nuit de Get Out. Employer les beiges chauds dans les intérieurs et le cyan dans les ombres des extérieurs nocturnes.", getOut,
        [["Beige", "#D7BB95"], ["Miel", "#B57745"], ["Cyan bleu", "#538D9A"], ["Vert nuit", "#2D5658"], ["Gris profond", "#18292D"]]],
      ["Noir et blanc · The Lighthouse", "Palette de gris inspirée de The Lighthouse. Distinguer le métal, le bois et la peau par la valeur et la texture, avec des réserves claires autour des sources.", lighthouse,
        [["Noir", "#171717"], ["Graphite", "#424242"], ["Ardoise", "#777777"], ["Gris clair", "#B7B7B7"], ["Blanc chaud", "#E9E6DF"]]]
    ]
  };

  function forField(name) {
    return (choices[name] || []).map(([label, text, link, colors]) => ({
      label, link, colors,
      text: colors ? text + " " + colors.map(([color, code]) => color + " " + code).join(", ") + "." : text
    }));
  }

  return {forField};
})();
