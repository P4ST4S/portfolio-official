import { buildTd3 } from '../lib/mrz'

export const profile = {
  firstName: 'Antoine',
  lastName: 'Rospars',
  handle: 'P4ST4S',
  role: 'Software Engineer',
  stack: 'Go, TypeScript',
  focus: 'Fullstack, mobile natif, outillage agentique',
  location: 'Marne-la-Vallée',
  employer: 'Datakeen',
  school: 'EPITECH Paris, Master 2027',
  github: 'https://github.com/P4ST4S',
  linkedin: 'https://www.linkedin.com/in/antoinerospars/',
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
  facts: [
    { value: '10', label: 'releases publiques, de v0.1.0 à v0.9.0' },
    { value: '87k ★', label: 'awesome-mcp-servers, où le projet a été mergé' },
    { value: 'A', label: 'score qualité sur Glama' },
    { value: '4', label: 'contributeurs externes venus d’eux-mêmes' },
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

export type StampShape = 'circle' | 'rect' | 'oval' | 'octagon'

export interface Stop {
  place: string
  stampTop: string
  stampBottom: string
  stampDate: string
  shape: StampShape
  ink: 'bordeaux' | 'blue' | 'green' | 'violet'
  period: string
  title: string
  summary: string
  points: string[]
}

export const journey: Stop[] = [
  {
    place: 'Paris',
    stampTop: 'EPITECH',
    stampBottom: 'PARIS',
    stampDate: '2022',
    shape: 'circle',
    ink: 'blue',
    period: '2022 à 2027',
    title: 'Master of Science in Information Technology, EPITECH Paris',
    summary: 'Spécialisation systèmes distribués, cybersécurité et machine learning.',
    points: ['Témoignage alumni publié dans un ouvrage pédagogique EPITECH.'],
  },
  {
    place: 'Stuttgart',
    stampTop: 'ERASMUS',
    stampBottom: 'STUTTGART',
    stampDate: '2023',
    shape: 'oval',
    ink: 'green',
    period: '2023 à 2024',
    title: 'Erasmus à Stuttgart',
    summary: 'Une année d’échange universitaire en Allemagne, pendant le cursus EPITECH.',
    points: [],
  },
  {
    place: 'Datakeen',
    stampTop: 'DATAKEEN',
    stampBottom: 'STAGE',
    stampDate: '01·2024',
    shape: 'rect',
    ink: 'violet',
    period: 'Janvier à juin 2024',
    title: 'Développeur fullstack en stage, Datakeen',
    summary:
      'Premiers développements React et NestJS sur une plateforme d’IA documentaire déjà en production.',
    points: ['Montée en compétence sur Docker, GCP et GitLab CI.'],
  },
  {
    place: 'Datakeen',
    stampTop: 'DATAKEEN',
    stampBottom: 'FULLSTACK',
    stampDate: '10·2024',
    shape: 'octagon',
    ink: 'bordeaux',
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
    stampTop: 'DATAKEEN',
    stampBottom: 'MOBILE CDI',
    stampDate: '03·2026',
    shape: 'circle',
    ink: 'bordeaux',
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
    proof: '29 ★ sur GitHub',
    stack: ['Python', 'Go', 'NestJS', 'React', 'YOLO', 'MangaOCR', 'Qwen 2.5 7B'],
    detail:
      'Détection des bulles avec YOLO, OCR japonais avec MangaOCR, traduction par un LLM local, puis inpainting du texte d’origine. Quatre outils d’habitude séparés, réunis dans une architecture microservices : worker IA en Python, backend Go et NestJS, suivi de progression en temps réel par Server-Sent Events.',
    links: [{ label: 'Code source', href: 'https://github.com/P4ST4S/AutoScanlate-AI' }],
  },
  {
    name: 'ID Scan',
    pitch: 'Lit la puce des passeports et des cartes d’identité françaises.',
    proof: 'Publiée sur l’App Store',
    stack: ['React Native', 'Swift', 'Kotlin', 'C', 'ICAO 9303'],
    detail:
      'PACE pour la carte d’identité, BAC pour le passeport. Bridges natifs Swift et Kotlin vers du C pour la cryptographie, authentification passive et active, extraction de la photo et de la signature stockées dans la puce.',
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

export const skills: { area: string; items: string }[] = [
  { area: 'Backend', items: 'Go, NestJS, TypeScript, Node.js, Python, REST, JSON-RPC' },
  { area: 'Mobile', items: 'Kotlin, Swift, Flutter, React Native, bridges natifs C, NFC, Apple Vision, ML Kit' },
  { area: 'Frontend', items: 'React, TypeScript, Tailwind, Playwright' },
  { area: 'Cloud et CI', items: 'Docker, Kubernetes, GitLab CI/CD, GCP, GoReleaser, OIDC' },
  { area: 'Observabilité', items: 'OpenTelemetry, Prometheus, Grafana' },
  { area: 'Sécurité', items: 'mTLS, HMAC, OAuth 2.1, Model Context Protocol' },
  { area: 'Langues', items: 'Français natif, anglais C1' },
]
