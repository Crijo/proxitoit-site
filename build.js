// Générateur du site PROXITOIT.
// Toutes les infos de l'entreprise sont dans ENTREPRISE ci-dessous : modifiez-les ici,
// puis lancez `node build.js` pour régénérer les pages dans /site.
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, 'site');

// ------------------------------------------------------------------
// 1. Informations de l'entreprise
// ------------------------------------------------------------------
const ENTREPRISE = {
  nom: 'PROXITOIT',
  domaine: 'https://www.proxitoit.fr', // à adapter au nom de domaine réel
  rue: '18 rue de Decize',
  cp: '71200',
  ville: 'Le Creusot',
  departement: 'Saône-et-Loire',
  telFixe: '03 85 80 48 41',
  telMobile: '06 12 88 77 29',
  email: 'proxitoit@gmail.com',
  gerant: 'Christophe Roulot',
  creation: 2005,
  forme: 'SARL au capital de 12 200 €',
  siren: '482 299 948',
  siret: '482 299 948 00026',
  tva: 'FR35482299948',
  rcs: 'RCS Chalon-sur-Saône', // à confirmer
  horaires: 'Du lundi au vendredi, de 8h30 à 18h', // à confirmer
  horairesSchema: [{ jours: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], ouvre: '08:30', ferme: '18:00' }],
  // Communes à confirmer avec le dirigeant
  communes: ['Le Creusot', 'Montceau-les-Mines', 'Montchanin', 'Torcy', 'Le Breuil', 'Saint-Sernin-du-Bois', 'Écuisses', 'Blanzy', 'Saint-Vallier', 'Couches', 'Autun', 'Chalon-sur-Saône'],
};
const E = ENTREPRISE;
const anneesExp = new Date().getFullYear() - E.creation;
const telLien = (t) => 'tel:+33' + t.replace(/\s/g, '').slice(1);

// ------------------------------------------------------------------
// 2. Dimensions des images (évite les décalages de mise en page)
// ------------------------------------------------------------------
function dimsJpeg(file) {
  const b = fs.readFileSync(file);
  if (b.toString('ascii', 8, 12) === 'WEBP') {
    const t = b.toString('ascii', 12, 16);
    if (t === 'VP8X') return { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) };
    if (t === 'VP8 ') return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
    if (t === 'VP8L') { const n = b.readUInt32LE(21); return { w: 1 + (n & 0x3fff), h: 1 + ((n >> 14) & 0x3fff) }; }
  }
  let i = 2;
  while (i < b.length) {
    if (b[i] !== 0xff) { i++; continue; }
    const m = b[i + 1];
    if (m === 0xff) { i++; continue; }
    if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
    i += 2 + b.readUInt16BE(i + 2);
  }
  return { w: 1200, h: 800 };
}
function img(src, alt, { cls = '', eager = false, sizes = '100vw' } = {}) {
  const d = dimsJpeg(path.join(OUT, 'img', src));
  return `<img src="img/${src}" alt="${alt}" width="${d.w}" height="${d.h}"${cls ? ` class="${cls}"` : ''} ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" sizes="${sizes}">`;
}

// ------------------------------------------------------------------
// 3. Icônes
// ------------------------------------------------------------------
const ico = {
  tel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
  devis: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  toit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M2 12 12 3l10 9M5 10v10h14V10"/></svg>',
  outil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14.7 6.3a4 4 0 0 0 5 5L22 14l-8 8-2.6-2.6a4 4 0 0 0-5-5L2 10l8-8z"/></svg>',
  logo: '<svg viewBox="0 0 34 22" aria-hidden="true"><path d="M1 20 17 3l16 17" fill="none" stroke="#c58a52" stroke-width="3" stroke-linejoin="miter"/><path d="M9 20V13M25 20V13M9 13h16" stroke="#a3adb4" stroke-width="2" fill="none"/></svg>',
};

// ------------------------------------------------------------------
// 4. Pages métiers
// ------------------------------------------------------------------
const METIERS = [
  {
    slug: 'charpente',
    nav: 'Charpente',
    titre: `Charpentier au Creusot : charpente bois neuve et rénovation`,
    h1: 'Charpente bois au Creusot',
    desc: `Pose, fabrication, modification et surélévation de charpente bois au Creusot et en Saône-et-Loire. Entreprise locale depuis ${E.creation}. Devis gratuit.`,
    resume: 'Fabrication et pose de charpentes bois, traditionnelles ou industrielles, modification et surélévation.',
    image: 'charpente-bois-interieur.webp',
    alt: 'Assemblage de poutres et chevrons d\'une charpente en bois',
    image2: 'pose-charpente-maison.jpg',
    alt2: 'Fermettes de charpente posées sur une maison en construction',
    chapo: `La charpente porte tout le toit. Nous la fabriquons, la posons et la remettons en état pour les maisons, granges et bâtiments du Creusot et des environs.`,
    prestations: [
      ['Charpente traditionnelle', 'Fabrication et pose de charpentes en bois massif, assemblées sur mesure.'],
      ['Charpente industrielle (fermettes)', 'Solution économique pour la construction neuve et les extensions.'],
      ['Lamellé-collé et charpente métallique', 'Pour les grandes portées, les hangars et les bâtiments professionnels.'],
      ['Modification et surélévation', 'Créer des combles aménageables, rehausser une toiture, ouvrir un volume.'],
      ['Renforcement et traitement', 'Remplacement de pièces abîmées, traitement contre insectes et champignons.'],
      ['Vérandas et auvents à structure bois', 'Carports, préaux, auvents et vérandas en ossature bois.'],
    ],
    texte: `<h2>Une charpente adaptée à votre bâtiment</h2>
<p>Avant tout chantier, nous venons voir la charpente existante : état du bois, déformations, traces d'humidité ou d'insectes. Ce diagnostic permet de savoir s'il faut renforcer, remplacer quelques pièces ou refaire l'ensemble.</p>
<p>Pour une construction neuve ou une extension, nous choisissons avec vous entre charpente traditionnelle et fermettes industrielles, selon l'usage des combles, la portée et le budget.</p>`,
    faq: [
      ['Combien de temps dure la pose d\'une charpente ?', 'Pour une maison individuelle, la pose prend généralement quelques jours, couverture comprise selon la surface. Nous vous donnons un planning précis avec le devis.'],
      ['Peut-on aménager des combles avec une charpente en fermettes ?', 'Pas directement : les fermettes occupent tout le volume. Il faut modifier la charpente pour libérer l\'espace. Nous étudions la faisabilité sur place.'],
      ['Comment savoir si ma charpente doit être traitée ?', 'Sciure au sol, petits trous dans le bois, bois qui s\'effrite sont des signes à surveiller. Nous pouvons passer faire un contrôle.'],
    ],
  },
  {
    slug: 'couverture',
    nav: 'Couverture',
    titre: `Couvreur au Creusot : toiture tuile, ardoise, bac acier`,
    h1: 'Couverture et rénovation de toiture au Creusot',
    desc: `Couvreur au Creusot : réfection et rénovation de toiture en tuile, ardoise, zinc ou bac acier, démoussage, réparation de fuites. Devis gratuit en Saône-et-Loire.`,
    resume: 'Toitures en tuile, ardoise, zinc ou bac acier : réfection complète, réparation de fuites, démoussage.',
    image: 'couverture-tuiles.jpg',
    alt: 'Rangs de tuiles mécaniques sur une toiture',
    image2: 'couverture-ardoise.jpg',
    alt2: 'Couverture en ardoises vue de près',
    chapo: `Tuiles qui glissent, fuite après un orage, toit couvert de mousse : nous intervenons sur toutes les toitures, de la réparation ponctuelle à la réfection complète.`,
    prestations: [
      ['Couverture en tuile', 'Tuiles terre cuite ou béton, plates ou mécaniques, pose neuve et réfection.'],
      ['Couverture en ardoise', 'Ardoise naturelle ou fibrociment, pose au crochet ou au clou.'],
      ['Bac acier et couverture métallique', 'Bâtiments agricoles, ateliers, garages et toitures industrielles.'],
      ['Couverture zinc', 'Toitures et terrassons en zinc à joint debout.'],
      ['Réparation et recherche de fuite', 'Remplacement de tuiles cassées, faîtage, solins, abergements.'],
      ['Démoussage et traitement', 'Nettoyage de la toiture et traitement hydrofuge pour la protéger.'],
      ['Fenêtres de toit', 'Pose et remplacement de fenêtres de toit type Velux.'],
    ],
    texte: `<h2>Réparer ou refaire sa toiture ?</h2>
<p>Une toiture bien entretenue dure des décennies. Quand quelques tuiles sont cassées ou qu'un faîtage se dégrade, une réparation suffit souvent. Quand les fuites se multiplient ou que les liteaux sont pourris, une réfection complète devient plus rentable.</p>
<p>Nous vous disons franchement ce qui est nécessaire après avoir vu le toit. Nous travaillons avec des matériaux de marques reconnues comme Terreal, Imerys Toiture ou Koramic.</p>`,
    faq: [
      ['Faut-il une autorisation pour refaire sa toiture ?', 'Si vous changez l\'aspect extérieur (matériau, couleur, forme), une déclaration préalable en mairie est généralement nécessaire. Pour une réfection à l\'identique, ce n\'est souvent pas le cas. Renseignez-vous auprès de la mairie du Creusot.'],
      ['Quand faire démousser son toit ?', 'Idéalement au printemps ou à l\'automne, par temps sec. Un démoussage régulier évite que la mousse retienne l\'humidité et abîme les tuiles.'],
      ['Intervenez-vous en urgence après une tempête ?', 'Appelez-nous : nous faisons notre possible pour bâcher ou réparer rapidement une toiture endommagée.'],
    ],
  },
  {
    slug: 'zinguerie',
    nav: 'Zinguerie',
    titre: `Zinguerie au Creusot : gouttières, chéneaux, descentes`,
    h1: 'Zinguerie et gouttières au Creusot',
    desc: `Pose et remplacement de gouttières, chéneaux, descentes et habillages en zinc au Creusot et en Saône-et-Loire. Entreprise de charpente-couverture-zinguerie.`,
    resume: 'Gouttières, chéneaux, descentes d\'eau pluviale, noues et habillages en zinc.',
    image: 'zinguerie-gouttiere.jpg',
    alt: 'Gouttière en bas de pente d\'une toiture en tuiles',
    image2: 'renovation-toiture.jpg',
    alt2: 'Maison en cours de rénovation de toiture',
    chapo: `Une gouttière qui déborde finit par abîmer façade et fondations. Nous posons et remplaçons l'ensemble des ouvrages qui évacuent l'eau du toit.`,
    prestations: [
      ['Gouttières et chéneaux', 'Zinc, aluminium ou PVC, demi-rondes ou carrées, pose neuve et remplacement.'],
      ['Descentes d\'eau pluviale', 'Raccordement, dauphins, remplacement des descentes abîmées.'],
      ['Noues, solins et abergements', 'Étanchéité autour des cheminées, des fenêtres de toit et des jonctions de pans.'],
      ['Habillages de rives et bandeaux', 'Protection des bois de rive et des débords de toit.'],
      ['Nettoyage et entretien', 'Débouchage et remise en état des gouttières.'],
    ],
    texte: `<h2>Le zinc, un travail de précision</h2>
<p>La zinguerie se joue au détail : pentes d'écoulement, soudures, dilatation du métal. Un ouvrage bien posé évite les infiltrations aux points sensibles du toit, là où se produisent la plupart des fuites.</p>`,
    faq: [
      ['Zinc, alu ou PVC : que choisir ?', 'Le zinc est durable et esthétique, l\'aluminium léger et sans entretien, le PVC le plus économique. Nous vous conseillons selon votre maison et votre budget.'],
      ['À quelle fréquence nettoyer ses gouttières ?', 'Au moins une fois par an, après la chute des feuilles, et plus souvent si des arbres sont proches de la maison.'],
    ],
  },
  {
    slug: 'isolation',
    nav: 'Isolation',
    titre: `Isolation de toiture et combles au Creusot`,
    h1: 'Isolation de toiture et des combles',
    desc: `Isolation de toiture par l'intérieur ou par l'extérieur (sarking), aménagement de combles au Creusot et en Saône-et-Loire. Devis gratuit.`,
    resume: 'Isolation de toiture, aménagement de combles, bardage extérieur pour réduire les pertes de chaleur.',
    image: 'couvreur-chantier.jpg',
    alt: "Artisan en nacelle intervenant sur la toiture d'une maison",
    image2: 'pose-charpente-maison.jpg',
    alt2: "Structure de toiture avant pose de l'isolant",
    chapo: `Jusqu'à 30 % de la chaleur d'une maison mal isolée s'échappe par le toit. Profiter d'une rénovation de toiture pour isoler, c'est faire deux chantiers en un.`,
    prestations: [
      ['Isolation sous rampants', 'Isolation entre et sous chevrons pour des combles aménagés.'],
      ['Isolation par l\'extérieur (sarking)', 'Panneaux isolants posés sur la charpente lors d\'une réfection de couverture : aucune perte de place à l\'intérieur.'],
      ['Isolants minces multicouches', 'Solution complémentaire quand l\'épaisseur disponible est limitée.'],
      ['Aménagement de combles', 'Modification de charpente, plancher, fenêtres de toit, isolation.'],
      ['Bardage extérieur', 'Bardage bois ou composite pour protéger et isoler les façades et pignons.'],
    ],
    texte: `<h2>Isoler en refaisant son toit</h2>
<p>Quand la couverture doit être refaite, c'est le meilleur moment pour isoler par l'extérieur : l'isolant est posé directement sur la charpente, sans toucher à vos plafonds.</p>
<p>Des aides à la rénovation énergétique peuvent exister selon votre situation. Renseignez-vous sur <a href="https://france-renov.gouv.fr" rel="noopener">france-renov.gouv.fr</a>.</p>`,
    faq: [
      ['Quelle épaisseur d\'isolant pour une toiture ?', 'Cela dépend de l\'isolant et de la performance visée. Nous vous proposons une solution adaptée à votre charpente et à la place disponible.'],
      ['Peut-on isoler sans refaire la couverture ?', 'Oui, par l\'intérieur, sous les rampants. L\'isolation par l\'extérieur se fait plutôt à l\'occasion d\'une réfection de toiture.'],
    ],
  },
];

// ------------------------------------------------------------------
// 5. Gabarit commun
// ------------------------------------------------------------------
const NAV = [
  ['index.html', 'Accueil'],
  ...METIERS.map((m) => [`${m.slug}.html`, m.nav]),
  ['contact.html', 'Contact et devis'],
];

function schemaEntreprise() {
  return {
    '@context': 'https://schema.org',
    '@type': 'RoofingContractor',
    '@id': `${E.domaine}/#entreprise`,
    name: E.nom,
    description: `Entreprise de charpente, couverture et zinguerie au Creusot (${E.departement}) depuis ${E.creation}.`,
    url: `${E.domaine}/`,
    telephone: telLien(E.telFixe).replace('tel:', ''),
    email: E.email,
    image: `${E.domaine}/img/charpente-traditionnelle-bois.jpg`,
    logo: `${E.domaine}/img/logo.svg`,
    foundingDate: String(E.creation),
    vatID: E.tva,
    taxID: E.siret.replace(/\s/g, ''),
    founder: { '@type': 'Person', name: E.gerant },
    address: { '@type': 'PostalAddress', streetAddress: E.rue, postalCode: E.cp, addressLocality: E.ville, addressRegion: 'Bourgogne-Franche-Comté', addressCountry: 'FR' },
    areaServed: E.communes.map((c) => ({ '@type': 'City', name: c })),
    openingHoursSpecification: E.horairesSchema.map((h) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: h.jours, opens: h.ouvre, closes: h.ferme })),
    priceRange: '€€',
    knowsAbout: ['Charpente bois', 'Couverture', 'Zinguerie', 'Isolation de toiture', 'Démoussage', 'Bardage'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Prestations',
      itemListElement: METIERS.map((m) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: m.h1, url: `${E.domaine}/${m.slug}.html` } })),
    },
  };
}

function page({ fichier, titre, desc, corps, schemas = [], ogImage = 'charpente-traditionnelle-bois.jpg' }) {
  const url = `${E.domaine}/${fichier === 'index.html' ? '' : fichier}`;
  const navHtml = NAV.map(([href, lib]) => `<li><a href="${href}"${href === fichier ? ' aria-current="page"' : ''}>${lib}</a></li>`).join('');
  const ld = [schemaEntreprise(), ...schemas].map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n');
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${titre}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="#222c35">
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_FR">
<meta property="og:site_name" content="${E.nom}">
<meta property="og:title" content="${titre}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${E.domaine}/img/${ogImage}">
<link rel="icon" href="img/logo.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@100..125,500..900&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&display=swap">
<link rel="stylesheet" href="css/style.css">
${ld}
</head>
<body>
<a class="skip" href="#contenu">Aller au contenu</a>
<header class="entete">
  <div class="wrap">
    <a class="logo" href="index.html">${ico.logo}<span>${E.nom}<small>Charpente, couverture, zinguerie</small></span></a>
    <button class="menu-btn" aria-expanded="false" aria-controls="nav">Menu</button>
    <nav class="nav" id="nav" aria-label="Navigation principale">
      <ul>${navHtml}<li><a class="tel-nav" href="${telLien(E.telFixe)}">${E.telFixe}</a></li></ul>
    </nav>
  </div>
</header>
<main id="contenu">
${corps}
</main>
<footer class="pied">
  <div class="wrap">
    <div>
      <h2>${E.nom}</h2>
      <address>
        ${E.rue}<br>${E.cp} ${E.ville}<br>
        <a href="${telLien(E.telFixe)}">${E.telFixe}</a> · <a href="${telLien(E.telMobile)}">${E.telMobile}</a><br>
        <a href="mailto:${E.email}">${E.email}</a>
      </address>
      <p>${E.horaires}</p>
    </div>
    <div>
      <h2>Nos métiers</h2>
      <ul>${METIERS.map((m) => `<li><a href="${m.slug}.html">${m.nav}</a></li>`).join('')}</ul>
    </div>
    <div>
      <h2>Infos</h2>
      <ul><li><a href="contact.html">Demander un devis</a></li><li><a href="mentions-legales.html">Mentions légales</a></li></ul>
    </div>
    <div class="legal">
      <p>${E.nom}, ${E.forme}. SIRET ${E.siret}. Entreprise de charpente, couverture et zinguerie au ${E.ville} (${E.departement}).</p>
      <p>© ${new Date().getFullYear()} ${E.nom}</p>
    </div>
  </div>
</footer>
<nav class="barre-appel" aria-label="Contact rapide">
  <a href="${telLien(E.telFixe)}">${ico.tel}Appeler</a>
  <a href="contact.html#devis">${ico.devis}Devis gratuit</a>
</nav>
<script src="js/main.js" defer></script>
</body>
</html>
`;
}

const blocCta = () => `<section class="cta">
  <div class="wrap">
    <div>
      <h2>Un projet de toiture ?</h2>
      <p>Nous nous déplaçons pour voir votre toit et vous remettons un devis gratuit.</p>
    </div>
    <div class="actions">
      <a class="btn btn-bois" href="${telLien(E.telFixe)}">${ico.tel}${E.telFixe}</a>
      <a class="btn btn-ligne" href="contact.html#devis">Demander un devis</a>
    </div>
  </div>
</section>`;

function schemaFaq(faq) {
  return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(([q, r]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: r } })) };
}
function schemaFil(items) {
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map(([nom, url], i) => ({ '@type': 'ListItem', position: i + 1, name: nom, item: `${E.domaine}/${url}` })) };
}

// ------------------------------------------------------------------
// 6. Accueil
// ------------------------------------------------------------------
function accueil() {
  const corps = `
<section class="hero">
  <div class="wrap">
    <div class="texte">
      <h1>Charpentier couvreur au Creusot</h1>
      <p class="chapo">Charpente, couverture et zinguerie pour les maisons et bâtiments de Saône-et-Loire. Une entreprise locale, installée au Creusot depuis ${E.creation}.</p>
      <div class="actions">
        <a class="btn btn-bois" href="${telLien(E.telFixe)}">${ico.tel}Appeler le ${E.telFixe}</a>
        <a class="btn btn-ligne" href="contact.html#devis">Demander un devis gratuit</a>
      </div>
    </div>
    <div class="pignon">${img('charpente-traditionnelle-bois.jpg', 'Charpente traditionnelle en bois sous une toiture de lavoir en Bourgogne', { eager: true, sizes: '(min-width: 1000px) 55vw, 100vw' })}</div>
  </div>
</section>

<section class="faits" aria-label="En bref">
  <div class="wrap">
    <ul>
      <li>${ico.cal}<span><strong>${anneesExp} ans d'expérience</strong>Entreprise créée en ${E.creation}</span></li>
      <li>${ico.pin}<span><strong>Basés au Creusot</strong>${E.rue}</span></li>
      <li>${ico.toit}<span><strong>Tous types de toitures</strong>Tuile, ardoise, zinc, bac acier</span></li>
      <li>${ico.devis}<span><strong>Devis gratuit</strong>Déplacement pour voir votre toit</span></li>
    </ul>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <h2>Nos métiers</h2>
    <p class="chapo">De la charpente jusqu'à la dernière gouttière, nous prenons en charge toute la toiture.</p>
    <ul class="metiers">
      ${METIERS.map((m) => `<li class="metier"><a href="${m.slug}.html">
        ${img(m.image, m.alt, { sizes: '(min-width: 700px) 340px, 100vw' })}
        <div><h3>${m.nav}</h3><p>${m.resume}</p></div>
        <span class="voir">Voir les prestations</span>
      </a></li>`).join('\n      ')}
    </ul>
  </div>
</section>

<section class="section section-sombre">
  <div class="wrap">
    <h2>Comment se passe un chantier</h2>
    <ol class="etapes">
      <li><div><h3>Vous nous appelez</h3><p>Par téléphone ou via le formulaire, vous nous décrivez votre besoin.</p></div></li>
      <li><div><h3>Nous venons voir</h3><p>Visite sur place pour examiner la charpente et la couverture.</p></div></li>
      <li><div><h3>Vous recevez le devis</h3><p>Un devis détaillé et gratuit, poste par poste.</p></div></li>
      <li><div><h3>Nous réalisons les travaux</h3><p>Chantier mené par notre équipe, nettoyé à la fin.</p></div></li>
    </ol>
  </div>
</section>

<section class="section section-blanche">
  <div class="wrap duo">
    <div>
      <h2>Une entreprise du Creusot</h2>
      <p>${E.nom} est une entreprise de charpente, couverture et zinguerie dirigée par ${E.gerant}. Depuis ${E.creation}, notre petite équipe intervient chez les particuliers, les collectivités et les professionnels du bassin creusotin.</p>
      <p>Être proches, c'est pouvoir passer voir un toit rapidement, revenir si besoin, et connaître les maisons du secteur : pavillons, maisons ouvrières, corps de ferme et bâtiments d'activité.</p>
    </div>
    <div>
      <h2>Zone d'intervention</h2>
      <p>Nous intervenons au ${E.ville} et dans les communes alentour, en ${E.departement} :</p>
      <ul class="communes">${E.communes.map((c) => `<li>${c}</li>`).join('')}</ul>
    </div>
  </div>
</section>
${blocCta()}`;
  return page({
    fichier: 'index.html',
    titre: `Charpentier couvreur au Creusot (71) | ${E.nom}`,
    desc: `${E.nom}, charpente, couverture et zinguerie au Creusot depuis ${E.creation}. Toiture tuile, ardoise, zinc, isolation, gouttières. Devis gratuit : ${E.telFixe}.`,
    corps,
  });
}

// ------------------------------------------------------------------
// 7. Pages métiers
// ------------------------------------------------------------------
function pageMetier(m) {
  const fichier = `${m.slug}.html`;
  const autres = METIERS.filter((x) => x !== m);
  const corps = `
<section class="hero">
  <div class="wrap">
    <div class="texte">
      <nav class="fil" aria-label="Fil d'Ariane"><ol><li><a href="index.html">Accueil</a></li><li aria-current="page">${m.nav}</li></ol></nav>
      <h1>${m.h1}</h1>
      <p class="chapo">${m.chapo}</p>
      <div class="actions">
        <a class="btn btn-bois" href="${telLien(E.telFixe)}">${ico.tel}${E.telFixe}</a>
        <a class="btn btn-ligne" href="contact.html#devis">Devis gratuit</a>
      </div>
    </div>
    <div class="pignon">${img(m.image, m.alt, { eager: true, sizes: '(min-width: 1000px) 55vw, 100vw' })}</div>
  </div>
</section>

<section class="section">
  <div class="wrap duo">
    <div>
      <h2>Nos prestations</h2>
      <ul class="prestations">${m.prestations.map(([t, d]) => `<li><strong>${t}</strong><span>${d}</span></li>`).join('')}</ul>
    </div>
    <div>
      ${m.texte}
      <figure class="figure">${img(m.image2, m.alt2, { sizes: '(min-width: 700px) 50vw, 100vw' })}</figure>
    </div>
  </div>
</section>

<section class="section section-blanche">
  <div class="wrap">
    <h2>Questions fréquentes</h2>
    <div class="faq">${m.faq.map(([q, r]) => `<details><summary>${q}</summary><p>${r}</p></details>`).join('')}</div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <h2>Nos autres métiers</h2>
    <ul class="metiers">
      ${autres.map((x) => `<li class="metier"><a href="${x.slug}.html">${img(x.image, x.alt, { sizes: '(min-width: 700px) 340px, 100vw' })}<div><h3>${x.nav}</h3><p>${x.resume}</p></div><span class="voir">Voir les prestations</span></a></li>`).join('\n      ')}
    </ul>
  </div>
</section>
${blocCta()}`;
  return page({
    fichier,
    titre: `${m.titre} | ${E.nom}`,
    desc: m.desc,
    corps,
    ogImage: m.image,
    schemas: [schemaFaq(m.faq), schemaFil([['Accueil', ''], [m.nav, fichier]])],
  });
}

// ------------------------------------------------------------------
// 8. Contact
// ------------------------------------------------------------------
function contact() {
  const carte = `https://www.openstreetmap.org/export/embed.html?bbox=4.405%2C46.795%2C4.445%2C46.815&layer=mapnik`;
  const corps = `
<section class="hero">
  <div class="wrap">
    <div class="texte">
      <nav class="fil" aria-label="Fil d'Ariane"><ol><li><a href="index.html">Accueil</a></li><li aria-current="page">Contact</li></ol></nav>
      <h1>Contact et devis gratuit</h1>
      <p class="chapo">Le plus simple est de nous appeler. Vous pouvez aussi nous décrire votre projet ci-dessous : nous vous rappelons pour convenir d'une visite.</p>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap duo">
    <div>
      <h2>Nous joindre</h2>
      <ul class="coord">
        <li><span class="lib">Téléphone</span><a href="${telLien(E.telFixe)}">${E.telFixe}</a></li>
        <li><span class="lib">Portable</span><a href="${telLien(E.telMobile)}">${E.telMobile}</a></li>
        <li><span class="lib">E-mail</span><a href="mailto:${E.email}">${E.email}</a></li>
        <li><span class="lib">Adresse</span><span class="val">${E.rue}<br>${E.cp} ${E.ville}</span></li>
        <li><span class="lib">Horaires</span><span class="val">${E.horaires}</span></li>
      </ul>
      <iframe class="carte" title="Carte du Creusot" loading="lazy" src="${carte}"></iframe>
      <p class="note"><a href="https://www.openstreetmap.org/search?query=${encodeURIComponent(`${E.rue} ${E.cp} ${E.ville}`)}" rel="noopener">Voir l'adresse sur la carte</a></p>
    </div>
    <div id="devis">
      <h2>Demande de devis</h2>
      <form id="form-devis" novalidate>
        <label>Nom<input name="nom" autocomplete="name" required></label>
        <label>Téléphone<input name="tel" type="tel" autocomplete="tel" required></label>
        <label>Commune des travaux<input name="commune" autocomplete="address-level2"></label>
        <label>Type de travaux
          <select name="type">${METIERS.map((m) => `<option>${m.nav}</option>`).join('')}<option>Autre</option></select>
        </label>
        <label>Votre projet<textarea name="message" required placeholder="Ex. : tuiles cassées après l'orage, maison de 100 m², accès facile"></textarea></label>
        <button class="btn btn-bois" type="submit">Envoyer ma demande</button>
        <p class="note" id="form-retour" role="status"></p>
        <p class="note">Le bouton ouvre votre messagerie avec un e-mail prêt à envoyer à ${E.email}. Vos informations servent uniquement à répondre à votre demande.</p>
      </form>
    </div>
  </div>
</section>`;
  return page({
    fichier: 'contact.html',
    titre: `Contact et devis gratuit – charpente couverture Le Creusot | ${E.nom}`,
    desc: `Contactez ${E.nom} au ${E.telFixe} pour un devis gratuit de charpente, couverture ou zinguerie au Creusot et en Saône-et-Loire.`,
    corps,
    schemas: [schemaFil([['Accueil', ''], ['Contact', 'contact.html']])],
  });
}

// ------------------------------------------------------------------
// 9. Mentions légales
// ------------------------------------------------------------------
function mentions() {
  const corps = `
<section class="section">
  <div class="wrap">
    <h1>Mentions légales</h1>
    <h2>Éditeur du site</h2>
    <p>${E.nom}, ${E.forme}<br>${E.rue}, ${E.cp} ${E.ville}<br>SIREN ${E.siren} – SIRET ${E.siret} – ${E.rcs}<br>TVA intracommunautaire : ${E.tva}<br>Téléphone : ${E.telFixe} – E-mail : ${E.email}<br>Directeur de la publication : ${E.gerant}, gérant.</p>
    <h2>Hébergement</h2>
    <p>[À compléter : nom, adresse et téléphone de l'hébergeur.]</p>
    <h2>Assurance professionnelle</h2>
    <p>[À compléter : assureur et zone de couverture de l'assurance décennale.]</p>
    <h2>Données personnelles</h2>
    <p>Les informations envoyées via le formulaire de contact servent uniquement à répondre à votre demande et ne sont pas transmises à des tiers. Vous pouvez demander leur suppression en écrivant à ${E.email}.</p>
    <h2>Crédits photos</h2>
    <p>Photos libres de droits (domaine public / CC0) :</p>
    <ul>
      <li>Charpente du lavoir de Druyes-les-Belles-Fontaines : Benoît Prieur, Wikimedia Commons (CC0)</li>
      <li>Charpente bois intérieure : rawpixel (CC0)</li>
      <li>Fermettes de charpente : Cape Hatteras National Seashore, Flickr (domaine public)</li>
      <li>Tuiles : GeorgeTan, Flickr (domaine public)</li>
      <li>Ardoises : Picdrome Public Domain Pictures, Flickr (CC0)</li>
      <li>Gouttière : Rámon van Raaij, WordPress Photos (CC0)</li>
      <li>Rénovation de toiture : Gary Lee Todd, Flickr (CC0)</li>
      <li>Artisan en nacelle : Dennis S. Hurd, Flickr (CC0)</li>
    </ul>
  </div>
</section>`;
  return page({ fichier: 'mentions-legales.html', titre: `Mentions légales | ${E.nom}`, desc: `Mentions légales du site ${E.nom}, charpente couverture zinguerie au Creusot.`, corps });
}

// ------------------------------------------------------------------
// 10. Écriture des fichiers
// ------------------------------------------------------------------
const pages = {
  'index.html': accueil(),
  ...Object.fromEntries(METIERS.map((m) => [`${m.slug}.html`, pageMetier(m)])),
  'contact.html': contact(),
  'mentions-legales.html': mentions(),
};
for (const [f, html] of Object.entries(pages)) fs.writeFileSync(path.join(OUT, f), html);

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Object.keys(pages).map((f) => `  <url><loc>${E.domaine}/${f === 'index.html' ? '' : f}</loc><lastmod>${today}</lastmod><priority>${f === 'index.html' ? '1.0' : f === 'mentions-legales.html' ? '0.2' : '0.8'}</priority></url>`).join('\n')}
</urlset>
`);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${E.domaine}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, 'img', 'logo.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 34"><rect width="34" height="34" rx="6" fill="#222c35"/><path d="M4 26 17 9l13 17" fill="none" stroke="#c58a52" stroke-width="3.2"/><path d="M10 26v-7M24 26v-7M10 19h14" stroke="#a3adb4" stroke-width="2" fill="none"/></svg>`);
console.log('Pages générées :', Object.keys(pages).join(', '));
