# CramDesk

CramDesk est une application web de révision à partir de cours PDF. Elle extrait le texte d'un PDF, crée une synthèse et une lecture simplifiée, puis permet de générer des flashcards, des quiz, des présentations et de poser des questions sur le document. Le site public propose une page française et huit pages localisées pour les étudiants internationaux. Les PDF image sans texte sélectionnable ne sont pas pris en charge.

## Stack et parcours

- Next.js 16 (App Router), React 19, TypeScript et Tailwind CSS.
- Supabase Auth, PostgreSQL avec RLS et Storage privé.
- OpenAI pour l'analyse et les outils de révision ; Stripe pour les abonnements ; Resend pour le formulaire de contact.
- Le visiteur peut choisir un PDF avant son inscription. Le fichier reste dans son navigateur jusqu'à la connexion, puis le tableau de bord lance l'analyse.
- Les routes d'application sont exclues de l'indexation. Les pages publiques possèdent des métadonnées, un sitemap, des URL canoniques et des liens hreflang.
- Le planificateur (`/planificateur-revisions`), le calculateur de moyenne (`/calculateur-moyenne`) et les flashcards manuelles (`/flashcards-gratuites`, `/en/free-flashcards`) sont gratuits et sans compte. Ils fonctionnent localement dans le navigateur ; le premier exporte un calendrier `.ics`, le second calcule la note à viser, et le troisième permet de créer, réviser, importer et exporter un jeu de cartes.

Les prochaines fonctions web et leurs priorités sont décrites dans [docs/product-roadmap-web.md](docs/product-roadmap-web.md). La stratégie de coût et de qualité IA est dans [docs/ai-strategy.md](docs/ai-strategy.md). Toute évolution d'interface suit [docs/ui-ux-rules.md](docs/ui-ux-rules.md).

L'ancien dossier `mobile/` n'est pas requis pour construire le site web.

## Installation

Installer les dépendances avec `npm install`. Créer `.env.local` avec les variables suivantes :

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_STARTER_PRICE_ID=
STRIPE_STUDENT_PRICE_ID=
STRIPE_GRADUATE_PRICE_ID=
NEXT_PUBLIC_APP_URL=http://localhost:3000
RESEND_API_KEY=
```

La clé Supabase `SUPABASE_SERVICE_ROLE_KEY` est obligatoire côté serveur pour les quotas, la facturation et la suppression de compte. Ne jamais la préfixer par `NEXT_PUBLIC_` ni l'exposer au navigateur.

Dans Supabase Auth, autoriser les URL de redirection `http://localhost:3000/auth/callback`, `http://localhost:3000/reset-password/callback` et leurs équivalents sur le domaine de production. La seconde URL permet au lien reçu par email d'ouvrir le formulaire de réinitialisation du mot de passe.

Pour une base neuve, appliquer `supabase/schema.sql` dans Supabase SQL Editor. Pour une base déjà créée, appliquer **avant le nouveau code** `supabase/migrations/20260924_align_web_schema.sql`. Cette migration ajoute les flashcards et le texte source des résumés, aligne les forfaits, rend les décomptes atomiques et retire aux clients la possibilité de modifier leur forfait ou quota. Sauvegarder la base avant la migration et vérifier les politiques RLS dans le projet cible.

Créer dans Stripe trois prix mensuels correspondant aux forfaits Starter (3,99 €), Student (7,99 €) et Graduate (12,99 €), puis renseigner leurs identifiants. Configurer le webhook `/api/webhooks/stripe` pour les événements `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded` et `invoice.payment_failed`. Configurer l'envoi depuis `no-reply@cramdesk.com` chez Resend avant d'activer le formulaire de contact.

Lancer `npm run dev` pour le développement, `npm run build` pour valider la production et `npm start` pour servir la version compilée.

`npm run db:check` vérifie que l'URL Supabase et les clés correspondent au même projet, que son DNS répond, puis que l'API Auth et la table `users` sont accessibles. La commande n'affiche jamais les clés.

## Points de mise en production

Vérifier sur l'environnement réel l'inscription et sa redirection email, le stockage privé, un PDF de test, les quotas d'essai et d'abonnement, la réception des webhooks Stripe et la délivrabilité du contact. Les secrets externes ne sont pas nécessaires au build, mais les fonctionnalités correspondantes ne peuvent pas être testées complètement sans eux. Soumettre ensuite `/sitemap.xml` dans Google Search Console et suivre l'indexation ainsi que les performances réelles : le code SEO ne garantit pas une position donnée.
