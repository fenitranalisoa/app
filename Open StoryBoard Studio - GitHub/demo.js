"use strict";

const Demo = (() => {
  const scenes = [
    {
      id: "exemple-quai", name: "Le quai", location: "Quai du métro", setting: "Intérieur", time: "Nuit",
      heading: "INT. QUAI DU MÉTRO — NUIT", image: "assets/quai.jpg", imageAlt: "Une femme en trench sur le quai, face à une rame aux fenêtres ambrées",
      source: "Nina, un trench rouille sur les épaules, attend seule sur le quai. Une rame entre en station et ses fenêtres éclairées défilent derrière elle. Nina serre une enveloppe froissée, puis monte quand les portes s’ouvrent.",
      environment: "Quai presque désert, faïence sombre, verrière ancienne et reflets au sol.",
      atmosphere: "Attente et tension contenue", continuity: "Nina porte le trench rouille et tient l’enveloppe de la main droite.",
      shots: [
        {title: "L’attente sur le quai", action: "Nina attend de dos pendant que la rame entre en station.", subjects: "Nina, seule sur le quai", blocking: "Nina reste immobile. La rame entre de la droite et défile derrière elle.", scale: "Plan d’ensemble", angle: "À hauteur du regard", movement: "Fixe", support: "Trépied", lens: "28 mm", aperture: "f/5,6", depth: "Grande profondeur de champ", light: "Lumières pratiques ambrées en contraste avec les ombres bleu nuit.", composition: "Nina de dos au tiers droit. La perspective du quai et de la rame mène le regard vers le tunnel.", keyframe: "Premières fenêtres éclairées qui passent derrière Nina.", sound: "Grondement de la rame sur les rails.", duration: "6", image: "assets/quai.jpg"},
        {title: "L’enveloppe froissée", action: "Nina serre l’enveloppe dans sa main droite.", subjects: "Main droite de Nina", detail: "Les plis du papier marquent le geste.", props: "Enveloppe crème froissée", scale: "Insert", angle: "Plongée", movement: "Fixe", support: "Trépied", lens: "100 mm macro", aperture: "f/2,8", focus: "Arête pliée de l’enveloppe", depth: "Faible profondeur de champ", light: "Un reflet ambré glisse sur le papier.", sound: "Froissement discret, freinage en arrière-plan.", duration: "3"},
        {title: "Les portes s’ouvrent", action: "Les portes coulissent. Nina franchit le seuil et disparaît dans la rame.", subjects: "Nina", blocking: "Elle monte sans se retourner, du premier plan vers le fond.", scale: "Plan moyen", angle: "Trois-quarts", movement: "Travelling avant lent", support: "Dolly", lens: "40 mm", light: "La lumière de la rame découpe la silhouette.", transition: "Raccord dans le mouvement", duration: "5"}
      ]
    },
    {
      id: "exemple-rame", name: "Dans la rame", location: "Rame de métro", setting: "Intérieur", time: "Nuit",
      heading: "INT. RAME DE MÉTRO — NUIT", image: "assets/rame.jpg", imageAlt: "Nina assise dans une rame presque vide, éclairée par les plafonniers",
      source: "Nina s’assied près de la fenêtre d’une rame presque vide. La ville se reflète dans la vitre mouillée. Elle ouvre l’enveloppe, lit la première ligne et relève brusquement la tête.",
      environment: "Banquettes bordeaux, métal patiné, vitre couverte de gouttes, reflets de la ville.",
      atmosphere: "Intime et suspendue", continuity: "L’enveloppe apparaît ouverte seulement après l’insert.",
      shots: [
        {title: "Une rame presque vide", action: "Nina s’assied près de la vitre. Son reflet double sa silhouette.", subjects: "Nina", scale: "Plan large", angle: "À hauteur du regard", movement: "Travelling avant lent", support: "Dolly", lens: "35 mm", composition: "Perspectives des banquettes et des plafonniers. Nina au tiers gauche.", light: "Plafonniers chauds, lumière plus froide derrière la vitre.", duration: "6", image: "assets/rame.jpg"},
        {title: "La lettre", action: "Nina déplie le papier et lit la première ligne.", subjects: "Mains de Nina et la lettre", props: "Lettre crème dans l’enveloppe", scale: "Insert", angle: "Par-dessus l’épaule", movement: "Fixe", support: "Trépied", lens: "85 mm", focus: "Les doigts et le bord du papier", light: "Lumière douce des plafonniers sur le papier.", negative: "Texte de la lettre lisible à l’image.", duration: "4"},
        {title: "Le regard se relève", action: "Nina relève brusquement la tête et fixe un point hors champ.", subjects: "Nina", performance: "Un sursaut contenu, le souffle retenu.", eyeline: "Hors champ, à droite de l’image", scale: "Gros plan", angle: "Trois-quarts", movement: "Fixe", lens: "85 mm", depth: "Faible profondeur de champ", sound: "Roulement sourd, puis signal des portes.", transition: "Coupe en J", duration: "3"}
      ]
    },
    {
      id: "exemple-sortie", name: "La sortie", location: "Sortie du métro", setting: "Extérieur", time: "Nuit",
      heading: "EXT. SORTIE DU MÉTRO — NUIT", image: "assets/sortie.jpg", imageAlt: "Nina s’éloigne d’une sortie de métro sur une rue parisienne mouillée",
      source: "Nina monte les dernières marches et débouche dans une rue humide. La lumière des réverbères se reflète sur les pavés. Elle remet la lettre dans sa poche et s’éloigne sans se retourner.",
      environment: "Rue parisienne presque déserte, pavés mouillés et façades dans la brume.",
      atmosphere: "Solitude, résolution", continuity: "Le trench et la lettre ouverte restent visibles jusqu’à la mise en poche.",
      shots: [
        {title: "De retour à la surface", action: "Nina monte les dernières marches et débouche dans la rue.", subjects: "Nina", blocking: "Elle monte au centre du cadre et marque une courte pause.", scale: "Plan moyen", angle: "Contre-plongée", movement: "Suivi stabilisé", support: "Gimbal", lens: "35 mm", light: "Contre-jour d’un réverbère, halo doux dans la brume.", duration: "5"},
        {title: "La lettre disparaît", action: "Nina glisse la lettre pliée dans la poche de son trench.", subjects: "Nina, main droite", scale: "Plan rapproché", angle: "Profil", movement: "Fixe", lens: "65 mm", light: "Un reflet latéral ambré éclaire le geste.", duration: "3"},
        {title: "La rue vide", action: "Nina s’éloigne sans se retourner.", subjects: "Nina, de dos", blocking: "Du centre du cadre vers le point de fuite.", scale: "Plan d’ensemble", angle: "À hauteur du regard", movement: "Fixe", support: "Trépied", lens: "28 mm", light: "Rue bleutée et halos des réverbères reflétés sur les pavés.", weather: "Brume légère après la pluie", composition: "Encadrer Nina avec les rampes de la sortie et les façades convergentes.", transition: "Fondu au noir", duration: "7", image: "assets/sortie.jpg"}
      ]
    }
  ];
  const script = scenes.map(scene => scene.heading + "\n\n" + scene.source).join("\n\n");
  const title = "Le Dernier Métro";

  function createProject() {
    return {
      ...Storyboard.newProject(title, script),
      id: "exemple", analyzedScript: script, analyzedCount: "auto",
      artDirection: "Court métrage nocturne, réalisme et tension feutrée.",
      palette: "Ambre des lumières, ombres bleu nuit, touches de rouille et de bordeaux.",
      continuity: "Nina, cheveux bruns au carré, porte un trench rouille sur toute la séquence.",
      scenes: scenes.map((example, index) => {
        const {heading, shots, ...details} = example;
        return Storyboard.newScene({
          ...details, sourceKey: heading + "\n" + example.source,
          shots: shots.map((shot, shotIndex) => Storyboard.newShot({
            environment: example.environment, atmosphere: example.atmosphere, transition: "Coupe franche",
            ...shot, id: `exemple-${index + 1}-${shotIndex + 1}`
          }))
        });
      })
    };
  }

  return {title, scenes, createProject};
})();
