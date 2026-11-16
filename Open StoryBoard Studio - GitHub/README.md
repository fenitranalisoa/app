# Open StoryBoard Studio - Par Fenitra Rabefaritra

Open StoryBoard Studio aide la direction artistique et la réalisation à préparer un tournage à partir d’un scénario validé. Les planches servent à briefer l’équipe, à discuter des cadrages et à valider les intentions. Le storyboarder garde la responsabilité de l’interprétation visuelle. L’application fonctionne dans le navigateur, sans compte ni service distant.

## Ouvrir l’application

Double-cliquez sur `index.html` dans le dossier du projet. L’accueil propose un guide en trois étapes et le projet de démonstration **Le Dernier Métro**.

Pour ouvrir l’application depuis un serveur de développement local, exécutez la commande suivante dans ce dossier, puis visitez `http://127.0.0.1:8765`.

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Les projets et modifications sont enregistrés dans le stockage local du navigateur. Utilisez la même adresse et le même navigateur pour les retrouver.

## Du scénario aux prompts

1. Dans **Scénario**, collez le texte ou importez un PDF, un fichier Word `.docx` ou `.doc`, un fichier texte, Markdown ou Fountain. Pour un PDF scanné, ajoutez d’abord une couche de texte avec un outil de reconnaissance de caractères. L’import récupère le texte du scénario. Relisez les passages dont la mise en page est complexe.
2. Cliquez sur **Préparer une version technique** pour créer une copie modifiable organisée en scènes et plans avec des propositions de réalisation. Le bouton **Générer le découpage** utilise la version affichée. Vous pouvez basculer entre **Script validé** et **Version technique**.
3. Ouvrez **Indications du projet** pour obtenir un synopsis à partir du scénario validé ou choisir des suggestions d’intention, de direction artistique, d’ambiance et de palette inspirée du cinéma. Après avoir appliqué une suggestion, vous pouvez modifier son texte avant d’enregistrer. Ces indications alimentent les prompts.
4. Dans **Découpage**, ouvrez un plan pour ajuster la description, la voix off, les flèches et l’illustration. Dans **Prompts & rendu**, le mode **Par planche** permet de choisir la répartition, de copier les prompts et d’exporter les planches en PNG.
5. Ouvrez **Projets** pour renommer ou supprimer un projet enregistré sur cet appareil.

### Exemple de script technique

```text
Titre : La lettre
Intention : Faire monter le doute.
DA : Ambre sur le décor, bleu froid dans les ombres.
Chrono : 00:00–00:12

SCÈNE 1 — INT. CUISINE — NUIT
Intention : Léa hésite à ouvrir l’enveloppe.

PLAN 1 — L’arrivée (00:00–00:05)
Action : Léa entre et dépose l’enveloppe sur la table.
Description : Léa en silhouette dans l’encadrement de la porte.
Voix off : Je savais qu’elle m’attendait.
Caméra : Plan large, travelling avant, 35 mm.

PLAN 2 — Insert sur l’enveloppe (00:05–00:08)
Action : Léa déchire le rabat.
Son : Froissement du papier.

SCÈNE 2 — INT. CUISINE — NUIT
PLAN 1 — La découverte (00:08–00:12)
Action : Noé découvre l’enveloppe ouverte.
```

## Publier sur GitHub Pages

Ajoutez les fichiers de l’application à un dépôt GitHub. Dans **Settings → Pages**, choisissez **Deploy from a branch**, puis la branche `main` et le dossier `/(root)`. Une fois le déploiement terminé, **Visit site** ouvre le lien public à partager.

## Bibliothèques d’import

Les lecteurs sont chargés depuis le dossier `vendor` et les documents sont traités dans le navigateur. Les fichiers `pdf.js` et `pdf.worker.js` utilisent la distribution legacy de PDF.js 6.5.438, empaquetée en scripts classiques pour permettre l’ouverture directe de `index.html`. Les tables CMap distribuées avec PDF.js sont regroupées dans `pdf-cmaps.js`. Le lecteur DOCX utilise fflate 0.8.3. Le lecteur DOC utilise le fichier `src/docToText.js` du commit `821695a884e0c0bb8592a635d9524bb3e116cd67` de JSDoc. Les licences sont dans le même dossier. [PDF.js](https://github.com/mozilla/pdf.js) · [fflate](https://github.com/101arrowz/fflate) · [JSDoc](https://github.com/Alpaq92/JSDoc)

## Visuels de démonstration

Les trois photogrammes ont été créés avec l’outil ImageGen intégré et sont stockés dans `assets/`.

- `quai.jpg` — Photogramme néo-noir à l’heure bleue, femme en trench rouille de dos sur un quai parisien, fenêtres ambrées d’une rame en mouvement, ombres profondes, grain 35 mm, cadre panoramique.
- `rame.jpg` — Intérieur d’une rame presque vide, perspective centrée, femme en trench rouille assise à gauche, sièges bordeaux, vitres mouillées et reflets ambrés, grain 35 mm.
- `sortie.jpg` — Femme en trench rouille de dos à la sortie du métro, rue parisienne mouillée, réverbères ambrés, façades dans la brume bleutée, grain 35 mm.

<details>
<summary>Prompts ImageGen utilisés</summary>

**quai.jpg**

```text
Use case: photorealistic-natural. Create one widescreen cinematic editorial still for the hero of a French filmmaking storyboard app. Feature a lone young adult female cinematographer or actor seen mostly from the back, dark brown loose bob, in a warm rust-brown trench coat, standing with a slight forward lean on a quiet Paris metro platform at blue hour, studying a vintage train with lit golden windows pulling in from the right. Place the woman near the right-center, small enough to see her from the hips up. Strong diagonal perspective, glowing amber practical ceiling lights against deep charcoal plum and dusty teal shadows, subtle haze and motion in the lights, analog 35 mm film grain, elegant understated French neo-noir still, realistic human proportions, rich black levels. Framing from across the platform, atmospheric foreground, no signage or legible text, no logo, no typography, no borders. The image will be cropped into a 2.3:1 landscape banner, so keep the subject and important lights in the middle 55 percent vertically, with ample room on the left for a soft dark gradient.
```

**rame.jpg**

```text
Use case: photorealistic-natural. Wide cinematic storyboard still from an atmospheric Paris-set short film. Inside a nearly empty late-night Paris metro carriage, viewed from a doorway at one end, symmetrical one-point perspective, muted oxblood seats, a row of overhead practical fluorescent lights, old windows with subtle rain and amber reflections. The only passenger is a young woman with a loose dark brown bob and a rust-brown trench coat, seated small in the composition, framed from behind and in profile at the left, her reflection in a window. Warm honey and muted dark teal, deep realistic shadows, subtle authentic 35 mm grain, late-1970s French neo-noir grading in a contemporary setting, professional feature film still. Wide horizontal 3:2 composition with focal action in the center band for a 2.1:1 crop. No graphics, readable text, borders, or watermark.
```

**sortie.jpg**

```text
Use case: photorealistic-natural. Wide cinematic storyboard still from an atmospheric Paris-set short film. A lone young woman in a rust-brown trench coat, with a dark loose bob haircut, seen from behind and in silhouette, at the top of an outdoor Paris metro stairway emerging onto an empty rain-slick street at late blue hour. Antique street lamps and small café windows glow amber and cast warm reflections in the wet cobblestones, steel-blue haze, slate Parisian apartment facades dissolve into the background. Frame the woman small and central, architectural perspective, moody depth, understated and realistic French neo-noir film lighting, soft 35 mm grain. Wide horizontal 3:2 composition, with focal subject in the middle for a 2.1:1 crop. No graphics, readable text, borders, or watermark.
```

</details>
