// With the extension: vite.config.ts imports this file too, and Node resolution needs it.
import { buildTd3 } from '../lib/mrz.ts'

export const profile = {
  firstName: 'Antoine',
  lastName: 'Rospars',
  handle: 'P4ST4S',
  role: 'Software Engineer',
  stack: 'Go, TypeScript',
  focus: 'Fullstack, mobile natif, outillage agentique',
  location: 'Marne-la-Vallée',
  employer: 'Datakeen',
  employerUrl: 'https://www.datakeen.co/',
  school: 'EPITECH Paris, Master 2027',
  site: 'https://www.antoinerospars.dev/',
  github: 'https://github.com/P4ST4S',
  linkedin: 'https://www.linkedin.com/in/antoinerospars/',
  pitch:
    'Je construis ce qui vérifie : le SDK qui lit la puce de votre passeport, la plateforme KYC qui s’en sert, et le proxy open source qui audite chaque appel d’outil de vos agents IA.',
}

// What a recruiter, or the agent reading for them, should retain in thirty seconds.
// Not on the visible page: it opens the version served without JavaScript and llms.txt (see src/lib/seo.ts).
export const highlights = [
  'SDK mobile NFC de vérification de pièces d’identité conçu de zéro, livré en Flutter, Kotlin, Swift et React Native, en production chez un client majeur.',
  'Auteur et mainteneur de mcp-audit, proxy d’audit open source en Go pour le Model Context Protocol : stable en v1, 12 releases, référencé dans awesome-mcp-servers (95k ★), score A sur Glama, 8 contributeurs externes.',
  'Contributeur au registry MCP officiel : une issue à l’origine du support des modules Go, des reviews techniques sur OAuth (RFC 8628) et le validateur Cargo.',
  'A porté le refacto de la plateforme KYC / KYB de Datakeen (NestJS, React), avec une suite E2E Playwright et une CI/CD GitLab de publication npm via OIDC.',
  'Référent MCP et IA agentique chez Datakeen, responsable de la revue de code, forme les stagiaires.',
  'Du backend Go concurrent au mobile natif et à la vision par ordinateur dans le navigateur. Master EPITECH en cours (2027), Erasmus à Stuttgart, anglais C1.',
]

// Told from the user's side, like the section on the page: how the SDK works internally is Datakeen's know-how.
export const nfcSdk = {
  summary:
    'Chez Datakeen, j’ai conçu de zéro le SDK mobile qui lit la puce des passeports et des cartes d’identité pendant un parcours KYC.',
  facts: [
    'Le SDK guide l’utilisateur jusqu’à une capture exploitable du document, sans saisie manuelle.',
    'Identité et photo sont lues directement dans la puce, telles que l’autorité émettrice les a écrites, par un échange NFC chiffré.',
    'Il vérifie que la puce a bien été émise par un État, qu’elle n’a pas été modifiée et qu’il ne s’agit pas d’un clone.',
    'Livré en quatre SDK : Flutter, Kotlin, Swift et React Native.',
    'En production chez un client majeur, pour plusieurs centaines d’utilisateurs.',
  ],
}

// The developer's own data page, encoded like a real passport MRZ.
export const mrz = buildTd3({
  issuer: 'UTO', // ICAO's fictional "Utopia", the issuer on every specimen document
  surname: profile.lastName,
  givenNames: profile.firstName,
  documentNumber: profile.handle,
  nationality: 'FRA',
  birthDate: '240101', // first day as a developer at Datakeen
  sex: '<',
  expiryDate: '991231',
  personalNumber: 'Go TypeScript',
})

export const mcpAudit = {
  repo: 'https://github.com/P4ST4S/mcp-audit',
  summary:
    'Un proxy Go qui se place entre un agent IA et ses outils MCP, sans modifier ni l’un ni l’autre, et garde une trace signée de chaque appel.',
  facts: [
    { value: '12', label: 'releases publiques, de v0.1.0 à v1.1.0' },
    { value: '95k ★', label: 'awesome-mcp-servers, où le projet a été mergé' },
    { value: 'A', label: 'score qualité sur Glama' },
    { value: '8', label: 'contributeurs externes venus d’eux-mêmes' },
  ],
  features: [
    'Proxy stdio et HTTP, transparent pour le client comme pour le serveur',
    'Signature HMAC de chaque ligne d’audit, export JSONL ou SQLite',
    'Redaction des données personnelles, policy engine allow/deny, rate limit par outil',
    'Métriques Prometheus, export OpenTelemetry OTLP/HTTP, durcissement mTLS',
    'Builds multi-architecture via GoReleaser',
  ],
  ecosystem: [
    'Une issue ouverte sur le registry MCP officiel d’Anthropic (6,7k ★) a déclenché la PR qui ajoute le support des modules Go. mcp-audit y sert de dépôt de référence pour les tests.',
    'Reviews techniques sur ce même registry : validation du device flow OAuth (RFC 8628 §3.5), design du validateur Cargo.',
  ],
}

// Each stop is shown as a save file on the load screen: where, and when it was written.
export interface Stop {
  place: string
  location: string
  saved: string
  period: string
  title: string
  summary: string
  points: string[]
}

export const journey: Stop[] = [
  {
    place: 'Paris',
    location: 'EPITECH, Paris',
    saved: '2022',
    period: '2022 à 2027',
    title: 'Master of Science in Information Technology, EPITECH Paris',
    summary: 'Spécialisation systèmes distribués, cybersécurité et machine learning.',
    points: ['Témoignage alumni publié dans un ouvrage pédagogique EPITECH.'],
  },
  {
    place: 'Stuttgart',
    location: 'Erasmus, Stuttgart',
    saved: '2023',
    period: '2023 à 2024',
    title: 'Erasmus à Stuttgart',
    summary: 'Une année d’échange universitaire en Allemagne, pendant le cursus EPITECH.',
    points: [],
  },
  {
    place: 'Datakeen',
    location: 'Datakeen, stage',
    saved: '01·2024',
    period: 'Janvier à juin 2024',
    title: 'Développeur fullstack en stage, Datakeen',
    summary:
      'Premiers développements React et NestJS sur une plateforme d’IA documentaire déjà en production.',
    points: ['Montée en compétence sur Docker, GCP et GitLab CI.'],
  },
  {
    place: 'Datakeen',
    location: 'Datakeen, fullstack',
    saved: '10·2024',
    period: 'Octobre 2024 à février 2026',
    title: 'Développeur fullstack, Datakeen',
    summary: 'J’ai porté le refacto de la plateforme KYC / KYB.',
    points: [
      'Choix de NestJS et React/Vite défendu face à l’existant, puis adopté par l’équipe.',
      'Suite E2E Playwright qui couvre tous les nœuds critiques du parcours KYC en un seul run, avec une fausse caméra Y4M injectée par flags Chromium pour la pièce d’identité et le selfie.',
      'Pipeline GitLab CI/CD de publication npm via OIDC, avec promotion contrôlée dev, staging puis production.',
      'Flux de branches dev, staging, main à la place des cherry-picks.',
    ],
  },
  {
    place: 'Datakeen',
    location: 'Datakeen, mobile',
    saved: '03·2026',
    period: 'Depuis mars 2026',
    title: 'Fullstack & Mobile Developer, Datakeen',
    summary:
      'Plateforme d’IA documentaire utilisée par un millier d’utilisateurs B2B. Équipe produit de six personnes.',
    points: [
      'SDK mobile NFC pour pièces d’identité conçu et développé from scratch, déployé chez un client majeur.',
      'Référent MCP et IA agentique, dont l’agent interne qui implémente des features directement depuis Jira.',
      'Responsable de la revue de code. Formation des stagiaires à leur arrivée.',
      'Intégration DocuSeal : génération de PDF et signature électronique (React, NestJS, Kubernetes).',
    ],
  },
]

export interface Project {
  name: string
  pitch: string
  proof: string
  stack: string[]
  detail: string
  links: { label: string; href: string }[]
}

export const projects: Project[] = [
  {
    name: 'AutoScanlate AI',
    pitch: 'Traduit un chapitre de manga de bout en bout sur GPU.',
    proof: '35 ★ sur GitHub',
    stack: ['Python', 'Go', 'NestJS', 'React', 'YOLO', 'MangaOCR', 'Qwen 2.5 7B'],
    detail:
      'Détection des bulles avec YOLO, OCR japonais avec MangaOCR, traduction par un LLM local, puis inpainting du texte d’origine. Quatre outils d’habitude séparés, réunis dans une architecture microservices : worker IA en Python, backend Go et NestJS, suivi de progression en temps réel par Server-Sent Events.',
    links: [{ label: 'Code source', href: 'https://github.com/P4ST4S/AutoScanlate-AI' }],
  },
  {
    name: 'ID Scan',
    pitch: 'Lit la puce des passeports et des cartes d’identité françaises.',
    proof: 'Publiée sur l’App Store',
    stack: ['React Native', 'Swift', 'Kotlin', 'NFC'],
    detail:
      'Lit la puce de la carte d’identité française et des passeports, vérifie que le document est authentique et en extrait la photo du titulaire.',
    links: [{ label: 'App Store', href: 'https://apps.apple.com/fr/app/id-scan/id6762505375' }],
  },
  {
    name: 'NutriScan',
    pitch: 'Reconnaît les aliments à la caméra sans envoyer une seule image à un serveur.',
    proof: 'mAP50 de 0,672 sur 32 classes',
    stack: ['Next.js', 'YOLOv8m-seg', 'ONNX Runtime Web', 'WebAssembly'],
    detail:
      'Modèle de segmentation entraîné sur 32 classes d’aliments, exporté en ONNX et exécuté dans le navigateur en WebAssembly. Les images restent sur l’appareil.',
    links: [
      { label: 'Démo', href: 'https://app-computer-vision.vercel.app/' },
      { label: 'Code source', href: 'https://github.com/P4ST4S/ai_computer_vision' },
    ],
  },
  {
    name: 'Go Load Balancer',
    pitch: 'Répartit la charge vers le backend le moins occupé.',
    proof: '91 % de couverture de tests',
    stack: ['Go', 'sync/atomic', 'RWMutex', 'Docker'],
    detail:
      'Algorithme least-connections, health checks actifs, worker pool. État partagé thread-safe avec RWMutex et opérations atomiques.',
    links: [{ label: 'Code source', href: 'https://github.com/P4ST4S/go-load-balancer' }],
  },
  {
    name: 'Go Image Optimizer',
    pitch: 'Optimise des images sans laisser un gros fichier faire tomber le service.',
    proof: 'Image Docker sous 21 Mo',
    stack: ['Go', 'Docker', 'Sémaphores'],
    detail:
      'Microservice fail-fast : un sémaphore borne la mémoire consommée par les traitements simultanés, et l’arrêt gracieux termine les requêtes en cours avant de couper.',
    links: [{ label: 'Code source', href: 'https://github.com/P4ST4S/go-image-optimizer' }],
  },
  {
    name: 'Wordle Solver',
    pitch: 'Trouve le mot en maximisant l’information de chaque essai.',
    proof: 'Interface à 60 fps pendant le calcul',
    stack: ['Next.js', 'React 19', 'Web Workers'],
    detail:
      'Chaque proposition est choisie par entropie de Shannon sur l’ensemble des mots restants. Le calcul tourne dans des Web Workers pour ne jamais bloquer le thread principal.',
    links: [
      { label: 'Démo', href: 'https://next-wordle-bot.vercel.app/' },
      { label: 'Code source', href: 'https://github.com/P4ST4S/next-wordle-bot' },
    ],
  },
  {
    name: 'Francilienne de Miroiterie',
    pitch: 'Site client pour une entreprise de miroiterie.',
    proof: 'Lighthouse au-dessus de 95',
    stack: ['React', 'SCSS'],
    detail: 'Site responsive, images chargées à la demande, score Lighthouse supérieur à 95.',
    links: [{ label: 'Voir le site', href: 'https://francilienne-de-miroiterie.com/' }],
  },
]

// Shown as the item screen. `item` is the inventory object standing in for the area,
// `note` the line the game would print when you examine it.
export interface Skill {
  area: string
  items: string
  item: string
  icon: 'pipe' | 'radio' | 'flashlight' | 'keys' | 'map' | 'lock' | 'letter'
  note: string
}

export const skills: Skill[] = [
  {
    area: 'Backend',
    items: 'Go, NestJS, TypeScript, Node.js, Python, REST, JSON-RPC',
    item: 'Tuyau d’acier',
    icon: 'pipe',
    note: 'Lourd, sans fioritures. Il tient tout le reste.',
  },
  {
    area: 'Mobile',
    items: 'Kotlin, Swift, Flutter, React Native, bridges natifs C, NFC, Apple Vision, ML Kit',
    item: 'Radio de poche',
    icon: 'radio',
    note: 'Elle capte ce que les puces murmurent.',
  },
  {
    area: 'Frontend',
    items: 'React, TypeScript, Tailwind, Playwright',
    item: 'Lampe de poche',
    icon: 'flashlight',
    note: 'Ce que l’utilisateur voit, et ce qu’on vérifie à sa place.',
  },
  {
    area: 'Cloud et CI',
    items: 'Docker, Kubernetes, GitLab CI/CD, GCP, GoReleaser, OIDC',
    item: 'Trousseau de clés',
    icon: 'keys',
    note: 'Chaque porte, de dev à la production.',
  },
  {
    area: 'Observabilité',
    items: 'OpenTelemetry, Prometheus, Grafana',
    item: 'Carte de la ville',
    icon: 'map',
    note: 'Savoir où l’on est, même dans le brouillard.',
  },
  {
    area: 'Sécurité',
    items: 'mTLS, HMAC, OAuth 2.1, Model Context Protocol',
    item: 'Cadenas',
    icon: 'lock',
    note: 'Ce qui doit rester fermé le reste.',
  },
  {
    area: 'Langues',
    items: 'Français natif, anglais C1',
    item: 'Lettre',
    icon: 'letter',
    note: 'Écrite dans deux langues.',
  },
]
