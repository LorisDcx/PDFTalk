# Règles UI/UX de CramDesk

## Direction

CramDesk est un **atelier de révision éditorial**, pas une vitrine de fonctions IA. La page publique doit montrer comment un étudiant passe d'un cours à une action utile ; l'espace connecté doit donner priorité au travail en cours, aux sources et à la prochaine révision. Le rouge orangé porte les actions, l'encre sombre porte le contenu, et les surfaces claires donnent de l'air aux textes longs. La preuve du produit est une interaction ou une donnée réelle, pas un écran fictif ou un effet de profondeur.

## Système visuel

| Élément | Règle |
| --- | --- |
| Couleur | Utiliser les variables `--cd-*` de `src/app/globals.css`. Orange rouge pour une action primaire ou un état actif ; jamais comme simple décoration répétée. Vert seulement pour un succès, rouge d'alerte pour une erreur. Un statut a aussi un libellé. |
| Typographie | Serif éditorial pour les titres de bibliothèque ; sans serif pour titres de leçon, consignes, données et contrôles. Un seul `h1` par page. Texte courant de 16 px minimum sur mobile, largeur de lecture autour de 65–75 caractères. |
| Grille | Contenu public limité à 1152 px ; espace étudiant fluide, contenu jusqu’à 1736 px et studio jusqu’à 1800 px, avec 16 px de marge mobile et 24–32 px desktop. Utiliser les panneaux latéraux pour programme, professeur et sources ; limiter le texte de lecture à 65–75 caractères. La disposition dépend de la largeur disponible dans le panneau, même avec un PDF ouvert. Espacements issus de 4, 8, 12, 16, 24, 32, 48, 64 px. Aligner titres, champs et actions sur la même grille. |
| Surfaces | Blanc/papier en base ; une seule surface dominante par zone. Coins de 12 px pour les contrôles et 24 px pour un panneau principal. Les bordures séparent ; les ombres sont rares et discrètes. |
| Mouvement | Animer uniquement une relation de cause à effet, en priorité `opacity` et `transform`. Respecter `prefers-reduced-motion`. Pas d'éléments flottants ou de halos sur chaque section. |

## Parcours et contenu

1. Chaque écran répond à **« que puis-je faire maintenant ? »**. Une action principale visible, les actions secondaires plus calmes. Les boutons décrivent un résultat concret (« Créer un quiz »), pas une promesse vague.
2. Dans le studio, montrer le document, son état et le prochain exercice avant les arguments commerciaux. Une synthèse ou une réponse doit permettre de retrouver la source. Les exemples de marketing doivent être explicitement des démonstrations.
3. Concevoir les états **chargement, vide, succès, erreur et limite réelle**. Une panne de base ou d'IA ne doit jamais être présentée comme un quota dépassé ou comme une incitation à payer. Montrer l'action de reprise et préserver le travail saisi.
4. Lors d'un import : vérifier accès et service avant transfert, afficher format/taille/limite, indiquer la progression, puis confirmer ce qui a été créé. Ne pas laisser un fichier orphelin après un échec évitable.
5. Les outils gratuits doivent fonctionner sans compte, annoncer clairement ce qui reste local et proposer un export. Le passage vers le studio est volontaire et contextuel.
6. Le contenu FR/EN doit être complet sur le parcours concerné : interfaces, erreurs, emails et formats de nombres/dates. Ne pas mélanger les deux langues dans un même état.
7. Les pages d'accueil localisées et leurs outils liés conservent la même hiérarchie, le même en-tête et la même action principale que la version française. Traduire les textes sans remplacer un parcours utilisable par un simple bouton d'inscription. Le sélecteur de langue doit ouvrir la page équivalente quand elle existe.
8. Pour la révision, le document sert à créer les cartes et à lancer le quiz ; la bibliothèque `/flashcards` sert à retrouver et réviser les cartes enregistrées. Il n'y a qu'un seul lecteur de cartes et qu'un seul moteur de quiz. Les liens entre les deux espaces doivent garder le document sélectionné. La génération IA affiche son coût en pages ; un quiz issu des cartes existantes est annoncé comme gratuit.

## En-tête de navigation

- Public : trois entrées principales centrées — **Réviser**, **Flashcards**, **Outils gratuits**. Le menu Réviser contient le studio, les guides et les tarifs. Les flashcards ouvrent la bibliothèque ; le menu gratuit contient les outils PDF, l’exploration PDF et les utilitaires réellement disponibles dans la langue choisie.
- Compte connecté : tableau de bord, documents et flashcards au centre, avec un accès permanent aux outils gratuits. Rédacteur, abonnement et paramètres sont accessibles depuis le compte.
- Une seule action d’inscription, libellé court (« Essayer »), sur une ligne. Le logo, la navigation et les actions ont des espaces distincts ; aucune compression des libellés pour faire entrer trop de liens.
- Mobile : logo, action principale et menu. Les accès secondaires sont regroupés dans des sections dépliables. Le menu se ferme à la navigation, à Échap et lors du passage au desktop ; la langue conserve la page équivalente quand elle existe.
- Le header reste visible pendant le défilement. Aucun conteneur parent ne doit créer un contexte de défilement qui neutralise son positionnement sticky.
- Les menus de navigation s’ouvrent au survol de la souris, sans déplacer le focus. Garder le clic, le clavier et Échap ; laisser un bref délai de fermeture pour traverser l’espace entre bouton et menu. Un seul menu de navigation est ouvert à la fois.
- La grille décorative du hero reste discrète et centrée, avec des bords fondus. Les illustrations dans les marges restent sur un fond dégagé.

## Accessibilité et contrôle qualité

- Navigation clavier complète, focus visible, intitulés explicites et ordre de lecture logique. Cible tactile d'au moins 44 px sur mobile ; aucune action fondée uniquement sur la couleur. Contraste de texte au niveau WCAG 2.2 AA et zoom navigateur préservé.
- Vérifier les largeurs 375 px, 768 px, 1280 px et 1904 px avec textes longs, jeu de données vide et documents nombreux. Aucun débordement horizontal, aucune action masquée par l'en-tête fixe. Sur mobile, le programme est repliable ; sur écran large, programme, leçon et professeur restent accessibles côte à côte.
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


## Étudier sans bruit commercial

- Le forfait reste un compteur compact au-dessus des documents ; les documents précèdent les grandes zones d’import. Une limite réelle a un état explicite, sans panneau promotionnel permanent.
- Le parcours, la leçon et le professeur ont des rôles visuels distincts. Le titre de l’onglet actif ne se répète pas dans le contenu. Les détails techniques de stockage et d’accès se déplient ; les erreurs restent visibles.
- La correction reste près des réponses. La question d’une flashcard reste visible après révélation. Le quiz demande une confirmation explicite avant de corriger et montrer sa source. Les questions et corrections incluses ne montrent pas un prix par bouton.
- Références de cette itération : [navigation latérale de Notion](https://www.notion.com/en-gb/help/navigate-with-the-sidebar), [parcours Learn de Quizlet](https://help.quizlet.com/hc/en-us/articles/360030986971-Studying-with-Learn) et [progression de maîtrise de Khan Academy](https://support.khanacademy.org/hc/en-us/articles/5548760867853--How-do-Khan-Academy-s-Mastery-levels-work). Application à CramDesk : navigation secondaire compacte, progression visible, une question à la fois et retour près de l’exercice.
