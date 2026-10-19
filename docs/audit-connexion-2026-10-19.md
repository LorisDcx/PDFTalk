# Vérification des accès au compte — 19 octobre 2026

## Causes constatées

- Supabase était initialement en état `COMING_UP` et son adresse renvoyait `ENOTFOUND`. Pendant la vérification, le projet est passé à `ACTIVE_HEALTHY`. Le contrôle `npm run db:check` passe désormais entièrement. Aucune modification du projet Supabase n’a été effectuée.
- L’en-tête remplaçait les liens Connexion / Essayer par un chargement tant que la session n’était pas restaurée.
- Les formulaires attendaient les appels d’authentification sans délai maximal.
- À 375 px, le lien d’inscription du formulaire de connexion était un lien inline sur deux lignes. Le clic au centre de son rectangle tombait sur le parent, dans l’espace entre les lignes. Ce défaut a été reproduit puis corrigé.
- L’inscription attendait aussi l’écriture d’un événement analytique avant de naviguer.

## Corrections locales

- Liens publics disponibles immédiatement dans l’en-tête et le menu mobile.
- Délai maximal de 12 secondes pour la restauration de session, les formulaires de connexion / inscription / récupération et la vérification dans le proxy. Les requêtes HTTP d’authentification bloquées sont annulées ; les transferts de documents gardent leur comportement habituel.
- Erreurs de service, identifiants incorrects et email non confirmé distingués et traduits. Les champs sont conservés et les boutons réactivés après échec.
- Zones tactiles d’au moins 44 px pour les liens de connexion / inscription concernés ; le clic mobile ouvre maintenant la page attendue.
- L’événement analytique et les restrictions de stockage navigateur ne bloquent plus une authentification réussie.

## Résultats

| Contrôle | Résultat |
| --- | --- |
| Accueil → Connexion, desktop et menu mobile | OK |
| Connexion → Inscription et retour | OK après correction du lien mobile |
| Connexion → Mot de passe oublié et retour | OK |
| Formulaire d’inscription vide | Validation native : email requis |
| Échec réseau du formulaire | Message de service, champs conservés, bouton réactivé |
| Identifiants fictifs, après reprise de Supabase | Erreur « Adresse email ou mot de passe incorrect. », bouton réactivé |
| `/dashboard` sans session | Redirection `/login?redirect=%2Fdashboard` |
| Largeurs 375, 768, 1280, 1904 px | Aucun débordement du formulaire ; bouton 48 px, lien d’inscription 44 px |
| `npm run db:check` | Auth, users, colonnes d’essai, source des fiches, flashcards et fonction de quota : HTTP 200 |
| `npm run test:auth` | OK : délais, erreurs, annulation et absence de délai ajouté aux uploads |
| `npx tsc --noEmit` | OK |
| ESLint sur les fichiers modifiés | Aucune erreur ; deux avertissements préexistants dans le chargement de profil |

Les tests navigateur utilisent le serveur local avec Webpack, Turbopack ayant échoué dans l’environnement de test. Aucun déploiement n’a été effectué. La connexion avec un compte valide, la création effective d’un compte et la réception des emails ne sont pas validées par cet audit.
