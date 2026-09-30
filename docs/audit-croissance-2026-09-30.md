# Audit produit, SEO et acquisition — 30 septembre 2026

## Conclusion vérifiée

CramDesk possède un parcours différenciant crédible : partir du cours PDF, comprendre, pratiquer et revenir à la source. Le site dispose d'un essai, d'outils PDF locaux, d'un planificateur, d'un calculateur et de flashcards manuelles. L'enjeu immédiat est de relier ces portes d'entrée à une première révision réussie, puis de mesurer cette progression. Aucun audit public ne permet à lui seul d'affirmer que le produit connecté, Stripe ou la rétention fonctionnent parfaitement en production.

## Vérification de l'audit externe

| Affirmation | Verdict | Éléments observables |
| --- | --- | --- |
| Huit outils PDF gratuits locaux | Confirmé dans le code | `src/lib/pdf-tools.ts`, `src/components/pdf-toolkit.tsx`. Le traitement passe dans le navigateur ; cela ne valide pas tous les fichiers possibles. |
| Planificateur, calculateur et flashcards gratuites | Confirmé, avec limite | Routes publiques fonctionnelles en français ; les flashcards ont aussi une route anglaise. Les autres langues n'ont pas encore une parité complète. |
| CramDesk a un problème de liaison gratuit → produit | Confirmé | Les outils avaient surtout des liens génériques. Le PDF produit peut désormais être transmis au parcours de révision sur clic explicite. |
| Architecture internationale incohérente | Partiellement confirmé | Les homes existent en neuf langues, mais plusieurs anciennes pages anglaises restent à la racine ; les outils étudiants ne sont pas tous traduits. Canonical et sitemap utilisaient auparavant des domaines différents. |
| Articles comparatifs « 2025 » dépassés | Confirmé | Deux routes publiques portent 2025 dans le titre et l'URL. Elles sont retirées du sitemap et mises en `noindex` jusqu'à réécriture vérifiée. |
| Cramd a des decks publics, un blog actif et davantage de formats d'import | Confirmé comme annonces/pages publiques | [Accueil Cramd](https://trycramd.com/), [bibliothèque](https://trycramd.com/browse), [blog](https://trycramd.com/blog). Les fonctionnalités internes et la qualité des résultats n'ont pas été testées avec un compte. |
| Cramd fait 500–5 000 $ de MRR et compte des milliers d'utilisateurs | Non vérifiable | Les estimateurs tiers, compteurs publics et hypothèses de conversion ne donnent accès ni aux paiements, ni aux utilisateurs actifs. Ne pas utiliser ces nombres pour décider du budget. |
| Témoignages et résultats étudiants manquent sur CramDesk | À documenter avant publication | N'ajouter que des retours obtenus avec accord, un contexte réel et des chiffres vérifiables. Aucun avis inventé. |
| « Top 1 Google » accessible par multiplication de pages | Non démontré | Google privilégie les pages utiles, originales et adaptées à leur langue ; la position dépend aussi de la requête et de la concurrence. [Guide contenu utile](https://developers.google.com/search/docs/fundamentals/creating-helpful-content). |

## Changements réalisés dans ce sprint

1. Deux guides pratiques originaux sur le travail d'un cours PDF et la vérification d'un résumé IA, traduits pour les neuf langues, avec index, liens vers l'essai, métadonnées, données Article et `hreflang`.
2. Liens vers les guides depuis les pages publiques et lien vers la [présentation de CramDesk par 3h36 Agency](https://www.3h36agency.fr/realisations/cramdesk).
3. Canonical, Open Graph, données structurées et sitemap alignés sur `https://www.cramdesk.com`, destination réelle de la redirection. Sitemap multilingue généré et contrôlé localement.
4. Passage volontaire de l'outil PDF au studio : le fichier généré peut être réutilisé sans seconde sélection, si sa taille respecte la limite de 20 Mo et s'il ne provient pas d'un assemblage d'images sans texte. Le traitement gratuit reste sans compte.
5. Anciennes pages comparatives 2025 désindexées provisoirement : une comparaison commerciale doit être réécrite avec tarifs, fonctionnalités et dates vérifiés avant réindexation.

## Priorités produit avant acquisition payante

| Priorité | Travail | Critère de sortie |
| --- | --- | --- |
| P0 | Tester le vrai parcours : PDF texte, PDF scanné, échec IA, quota, essai expiré, paiement, retour après paiement | Chaque état indique la vraie cause, préserve le travail et permet une reprise ; Stripe est validé avec des événements de test et un compte utilisateur de test. |
| P0 | Vérifier la qualité de 20 cours réels de filières différentes | Synthèse fidèle, pages sources exactes, cartes utiles, exercices résolubles ; noter les erreurs et corriger avant d'augmenter le trafic. |
| P0 | Compléter la parité des outils étudiants entre langues | Planificateur, calculateur et cartes manuelles traduits et testés, y compris dates, unités, erreur et aide. |
| P0 | Instrumenter un entonnoir sobre, avec la politique de confidentialité à jour | Mesurer visite de page, choix d'un PDF, création de compte, premier document prêt, premier quiz, retour J7 et paiement, agrégés par canal sans journaliser le contenu des PDF. |
| P1 | Ajouter un exemple réel et partageable, avec consentement | Une personne sans compte peut réviser quelques cartes et comprendre l'origine du contenu ; aucun cours privé n'est publié par défaut. |
| P1 | Mettre à jour les comparatifs 2025 | Test daté des offres et prix, critères publiés, limites de CramDesk exposées ; réindexation après revue. |
| P1 | Étendre le contenu éditorial par intention, pas par permutations de mots-clés | Chaque page apporte un exemple, une méthode, un outil ou une comparaison vérifiée et dirige vers la prochaine action utile. |

## Acquisition organique recommandée

Commencer en français par trois parcours mesurables : « préparer mon PDF », « réviser mon cours PDF » et « organiser mes examens ». Chaque entrée doit donner une valeur gratuite avant de proposer le compte. Les outils PDF et le calculateur peuvent ouvrir ces parcours ; les guides expliquent la méthode et renvoient à l'outil correspondant. Après validation, localiser les meilleures pages avec une vraie adaptation aux systèmes scolaires locaux. Google recommande des URL distinctes et des annotations `hreflang` réciproques pour les variantes linguistiques : [documentation officielle](https://developers.google.com/search/docs/specialty/international/localized-versions).

Créer des démonstrations courtes à partir de documents autorisés : un PDF, une question difficile, la réponse et le retour à la page source. Publier d'abord en organique et mesurer les visiteurs qui atteignent une première séance utile. Ne pas lancer de publicités ni de programme de parrainage avant de connaître le coût d'une activation, la rétention et la marge réelle par plan. Un abonnement « période d'examens » peut être testé plus tard ; il ne doit pas être ajouté sans observation du comportement d'achat.

## Indicateurs de décision

- **Activation** : pourcentage des nouveaux inscrits qui obtiennent une synthèse exploitable puis terminent au moins un quiz dans les 24 heures.
- **Qualité** : proportion de réponses et cartes reliées à une source correcte sur l'échantillon de cours de test ; nombre de documents abandonnés après erreur.
- **Rétention** : retour à J7 parmi les étudiants activés, séparé de simples visites de l'outil gratuit.
- **Économie** : revenus nets après frais de paiement, coût IA, stockage et support par cohorte ; distinguer utilisateurs en essai, actifs et payants.
- **SEO** : impressions et clics par page/langue dans Search Console, pages indexées correctes, canonicals choisis par Google, conversions du gratuit au premier quiz.

Ne pas présenter un compteur de decks, une estimation de trafic tiers ou des témoignages de concurrent comme une preuve de revenus ou de résultats pédagogiques. Les changements de production, l'indexation réelle et les conversions nécessitent une vérification après déploiement dans Search Console et dans les journaux de l'application.
