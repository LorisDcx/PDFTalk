# Préparation à la vente — CramDesk

Date : 30 septembre 2026. Périmètre : code web, configuration locale sans lecture des secrets, Supabase accessible depuis le projet, tests automatisés, pages publiques indexées. Aucun achat réel, compte client de test authentifié, webhook Stripe en production ou métrique Search Console n'a été vérifié.

## Décision

Le site public peut servir de bêta et les outils gratuits constituent déjà une entrée utile. **Ne pas annoncer le paiement comme validé et ne pas ouvrir une campagne payante de vente avant les contrôles ci-dessous.** Un build vert ne prouve ni l'encaissement, ni l'activation d'un abonnement, ni la rentabilité du forfait.

## Preuves obtenues

- Build Next.js et TypeScript réussis ; tests des huit opérations PDF, des sources documentaires, du flux de révision, du chat tutoré et des contenus localisés réussis.
- `npm run db:check` répond 200 pour Auth, les tables et les colonnes attendues ; l'appel de contrôle à `consume_pages` renvoie `false` pour un utilisateur inexistant.
- Le code impose une connexion sur les routes de facturation et vérifie les signatures Stripe dans le webhook.
- La page d'accueil et plusieurs anciennes pages sont visibles dans les résultats de recherche. Ce signal ne mesure ni les impressions, ni le classement, ni les inscriptions.
- La configuration **locale** contient une clé Stripe de test et les anciens noms de prix `BASIC/GROWTH/PRO`, mais pas les trois clés `STARTER/STUDENT/GRADUATE` attendues par le checkout actuel. La configuration de **production** reste inconnue.

## Blocages et risques de vente

1. **Configuration Stripe de production non certifiée.** Confirmer côté propriétaire les trois prix mensuels actifs : Starter 3,99 €, Student 7,99 €, Graduate 12,99 €, en EUR, puis le mode test/live de la clé, le domaine de retour et les événements du webhook. Une validation serveur empêche désormais de créer un checkout si le prix Stripe ne correspond pas au prix annoncé.
2. **Parcours payé non testé de bout en bout.** Sur un compte de test : inscription et email, PDF textuel, synthèse et chat, checkout Stripe en test, webhook reçu, accès actif, portail client, changement de plan, annulation, paiement échoué, quota après renouvellement. Vérifier dans Supabase et Stripe le même identifiant client, abonnement et état. Ne pas effectuer d'achat réel pour ce contrôle.
3. **Webhook et compteurs.** La réussite du checkout réinitialise les compteurs sans vérification d'un traitement antérieur de l'événement ; le renouvellement remet également à zéro en cas de répétition de `invoice.payment_succeeded`. Prévoir une déduplication transactionnelle des événements avant une montée en charge. Le changement de plan déclenche une mise à jour Stripe immédiate avec prorata possible, sans aperçu du montant dans l'interface.
4. **Expérience de retour de paiement.** La page affiche maintenant « activation en cours » au retour `?success=true`, puis rafraîchit le profil. Il faut encore vérifier sur un vrai parcours Stripe que le webhook met à jour l'état rapidement et ajouter une reprise automatique si cette confirmation tarde.
5. **Économie du forfait.** Graduate annonce 10 000 pages à 12,99 € par mois ; le chat n'est pas mesuré comme quota de pages. Mesurer le coût IA, stockage et traitement par étudiant actif avant d'acquérir à grande échelle ; définir une limite d'usage abusive sans dégrader l'offre annoncée.
6. **Informations de vente.** La page `/terms` porte « Décembre 2024 », est intitulée CGU alors qu'elle contient les conditions de paiement, et n'identifie pas clairement l'entreprise vendeuse. Faire revoir les CGV, les mentions légales, les modalités de rétractation, TVA et remboursement selon le statut de l'entreprise et les pays vendus. Ne pas inventer ces informations dans le code.
7. **Acquisition et confiance.** Certaines pages indexées en 2025 revendiquent « any PDF », « perfect » ou « thousands of students », sans preuve et alors que les PDF scannés ne sont pas pris en charge. Corriger les affirmations et les dates ; ne publier une page que si l'outil correspondant accomplit réellement la tâche.

## Condition de sortie avant vente publique

Une commande Stripe **en mode test** pour chaque formule aboutit au montant affiché, au bon plan dans `users`, à l'accès effectif aux fonctions et au portail client ; un échec ou une annulation ne donne aucun accès payant. Le test de renouvellement et de répétition du webhook ne remet pas le quota à zéro deux fois. Les CGV et mentions légales sont renseignées avec l'identité réelle du vendeur. Le coût par utilisateur actif laisse une marge après commissions et consommation IA.

## Entrée étudiante à construire après validation

Le parcours cible est : page sur un problème de révision → geste gratuit immédiatement utile → PDF choisi ou cartes créées → inscription volontaire → première réponse sourcée ou première séance → retour pour réviser → offre payante lorsque le quota est réellement utile. Mesurer les étapes par langue et source d'arrivée, sans confondre visite d'une page outil et activation d'un étudiant.

Priorités : (1) corriger les pages indexées aux promesses anciennes ; (2) instrumenter vues de pages, sélection de PDF, import réussi, première question, séance de cartes et début/fin du checkout ; (3) relier les outils gratuits aux pages de révision pertinentes ; (4) publier quelques exemples originaux fondés sur de vrais cours autorisés et des sorties vérifiables ; (5) mesurer requêtes et conversions dans Search Console avant de multiplier les pages ou d'acheter du trafic.

Références : [Stripe — webhooks d'abonnement](https://docs.stripe.com/billing/subscriptions/webhooks), [Google — contenu utile](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), [Google — sites multilingues](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites), [Google — règles antispam](https://developers.google.com/search/docs/essentials/spam-policies), [Service Public — CGV](https://entreprendre.service-public.fr/vosdroits/F33527), [Commission européenne — TVA OSS](https://europa.eu/youreurope/business/finance-and-tax/vat/one-stop-shop/index_en.htm).
