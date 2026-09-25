# Direction produit web — CramDesk

## Promesse

Transformer un cours en un parcours de révision vérifiable : comprendre une notion, la retrouver dans le document d'origine, s'exercer, puis revenir au bon moment sur ce qui n'est pas acquis. Le rouge orangé devient le repère de marque et des actions principales ; les couleurs secondaires gardent les états de travail lisibles.

## Ce qui existe déjà

- Studio à partir d'un PDF texte : synthèse, explication, flashcards, quiz et questions sur le document.
- Bibliothèque de documents, compte et essai, quotas et forfaits.
- Pages publiques localisées et pages SEO thématiques.
- Trois outils réellement gratuits, sans compte et exécutés dans le navigateur : planificateur de révisions exportable en `.ics`, calculateur de moyenne pondérée avec note à viser, et flashcards manuelles FR/EN avec import/export JSON et rappel actif.

## Priorités produit

| Priorité | Fonction | Résultat attendu | Condition de qualité |
| --- | --- | --- | --- |
| P0 | Fiabiliser le parcours PDF → synthèse → quiz | Un étudiant peut terminer sa première session sans impasse. | États d'erreur et de chargement clairs ; reprise après échec ; validation réelle de fichiers et quotas. |
| P1 | Espace de révision multi-documents par matière | Regrouper plusieurs cours, fiches et quiz sous un même examen. | Chaque réponse IA renvoie vers le document et le passage source ; pas de réponse présentée comme certaine sans preuve. |
| P1 | Répétition espacée persistante | Revoir les cartes au bon moment entre plusieurs sessions. | Historique et échéance synchronisés au compte ; sessions courtes « à revoir aujourd'hui ». |
| P1 | Planning lié aux chapitres | Transformer le plan gratuit en séances ouvrant les bons cours et exercices. | Possibilité d'ajuster le calendrier, exporter/synchroniser, marquer une séance faite. |
| P2 | PDF scannés avec OCR | Accueillir les cours pris en photo ou numérisés. | Qualité d'extraction affichée, pages illisibles signalées, coût plafonné. |
| P2 | Collaboration légère | Partager une fiche ou un jeu de cartes avec sa promo. | Partage explicite, permissions simples et retrait immédiat. |

## Outils gratuits d'acquisition

Les trois outils livrés répondent à des recherches précises sans exiger de compte. Le prolongement le plus utile serait un **diagnostic de révision** : saisir date, temps disponible et nombre de chapitres, puis obtenir une estimation de faisabilité et un lien vers le planning. Un **mini-quiz invité** sur un court extrait collé peut montrer la valeur du produit, mais nécessite limitation d'usage, contrôle des coûts IA et politique claire de conservation ; il vient après la fiabilisation du flux PDF.

Les flashcards ont déjà une page et une interface anglaises. Le planificateur et le calculateur restent à localiser, puis les autres langues prioritaires. Une simple traduction de la page d'accueil ne suffit pas pour l'étudiant international. Éviter de multiplier les pages quasi identiques : chaque langue doit avoir des exemples, unités, questions et liens locaux cohérents.

## Mesure

Suivre séparément l'usage du planificateur, du calculateur, leur taux de résultat et le passage volontaire vers le studio. Pour le produit connecté, mesurer « premier PDF traité », « première session de quiz terminée » et le retour à J7. En SEO, suivre indexation, requêtes, clics et pages de sortie dans Search Console ; aucune place Google ne peut être promise par le seul code.
