# Règles UI/UX de CramDesk

## Direction

CramDesk est un **atelier de révision éditorial**, pas une vitrine de fonctions IA. La page publique doit montrer comment un étudiant passe d'un cours à une action utile ; l'espace connecté doit donner priorité au travail en cours, aux sources et à la prochaine révision. Le rouge orangé porte les actions, l'encre sombre porte le contenu, et les surfaces claires donnent de l'air aux textes longs. La preuve du produit est une interaction ou une donnée réelle, pas un écran fictif ou un effet de profondeur.

## Système visuel

| Élément | Règle |
| --- | --- |
| Couleur | Utiliser les variables `--cd-*` de `src/app/globals.css`. Orange rouge pour une action primaire ou un état actif ; jamais comme simple décoration répétée. Vert seulement pour un succès, rouge d'alerte pour une erreur. Un statut a aussi un libellé. |
| Typographie | Serif éditorial pour les titres et chiffres forts ; sans serif pour consignes, données et contrôles. Un seul `h1` par page. Texte courant de 16 px minimum sur mobile, largeur de lecture autour de 65–75 caractères. |
| Grille | Contenu public limité à 1152 px ; produit limité à 1280 px. Espacements issus de 4, 8, 12, 16, 24, 32, 48, 64 px. Aligner titres, champs et actions sur la même grille. |
| Surfaces | Blanc/papier en base ; une seule surface dominante par zone. Coins de 12 px pour les contrôles et 24 px pour un panneau principal. Les bordures séparent ; les ombres sont rares et discrètes. |
| Mouvement | Animer uniquement une relation de cause à effet, en priorité `opacity` et `transform`. Respecter `prefers-reduced-motion`. Pas d'éléments flottants ou de halos sur chaque section. |

## Parcours et contenu

1. Chaque écran répond à **« que puis-je faire maintenant ? »**. Une action principale visible, les actions secondaires plus calmes. Les boutons décrivent un résultat concret (« Créer un quiz »), pas une promesse vague.
2. Dans le studio, montrer le document, son état et le prochain exercice avant les arguments commerciaux. Une synthèse ou une réponse doit permettre de retrouver la source. Les exemples de marketing doivent être explicitement des démonstrations.
3. Concevoir les états **chargement, vide, succès, erreur et limite réelle**. Une panne de base ou d'IA ne doit jamais être présentée comme un quota dépassé ou comme une incitation à payer. Montrer l'action de reprise et préserver le travail saisi.
4. Lors d'un import : vérifier accès et service avant transfert, afficher format/taille/limite, indiquer la progression, puis confirmer ce qui a été créé. Ne pas laisser un fichier orphelin après un échec évitable.
5. Les outils gratuits doivent fonctionner sans compte, annoncer clairement ce qui reste local et proposer un export. Le passage vers le studio est volontaire et contextuel.
6. Le contenu FR/EN doit être complet sur le parcours concerné : interfaces, erreurs, emails et formats de nombres/dates. Ne pas mélanger les deux langues dans un même état.

## Accessibilité et contrôle qualité

- Navigation clavier complète, focus visible, intitulés explicites et ordre de lecture logique. Cible tactile d'au moins 44 px sur mobile ; aucune action fondée uniquement sur la couleur. Contraste de texte au niveau WCAG 2.2 AA et zoom navigateur préservé.
- Vérifier les largeurs 375 px, 768 px et 1280 px avec textes longs, jeu de données vide et documents nombreux. Aucun débordement horizontal, aucune action masquée par l'en-tête fixe.
- Tester avant livraison : première visite, retour après connexion, essai expiré, quota atteint, panne de service, PDF refusé, génération lente et erreur IA. Une erreur doit nommer la cause connue et une suite possible.
- Revoir le visuel sans effets : si la hiérarchie ne fonctionne plus après retrait des halos, ombres et pastilles, corriger la composition et la typographie.

## Dette actuelle et ordre de correction

| Priorité | Constat | Décision |
| --- | --- | --- |
| P0 | Le schéma Supabase absent remontait comme « Page quota exceeded ». | Codes d'erreur distincts, contrôle avant upload, état de service visible. Migration encore requise sur Supabase. |
| P1 | Les pages publiques multiplient halos, cartes, badges et rayons différents. | Retirer les ornements sans rôle, limiter les surfaces et appliquer les tokens. Recomposer d'abord la page d'accueil et le studio. |
| P1 | Certaines démonstrations ressemblent à de vraies données mais sont fictives. | Les nommer « aperçu interactif » et montrer un lien crédible entre texte source et exercice. |
| P1 | Le produit connecté n'a pas de traitement visuel unique pour ses états. | Unifier les panneaux, messages de statut, contrôles et actions de récupération. |

Références : [Vercel Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines) pour les interactions et les états ; [WCAG 2.2](https://www.w3.org/TR/WCAG22/) pour l'accessibilité.
