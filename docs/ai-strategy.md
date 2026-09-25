# Stratégie IA : qualité mesurée, coût maîtrisé

## État du produit

Le code mélange actuellement `gpt-4o` (rédaction), `gpt-4o-mini` (analyse initiale, quiz, flashcards et slides) et `gpt-5-nano` (lecture simplifiée, chat, suggestions, traduction et comparaison). Un PDF est envoyé deux fois lors de son traitement initial, une fois pour la synthèse et une fois pour la lecture simplifiée. Les deux routes de traitement enregistrent maintenant le total de tokens renvoyé par l'API dans `summaries.tokens_used` ; auparavant cette valeur était toujours `0`. Cela ne couvre pas encore les autres appels IA ni la ventilation par modèle.

L'extraction de PDF est limitée au texte sélectionnable ; les documents scannés échouent. `truncateText` ne garde que le début d'un document au-delà de son plafond, ce qui peut supprimer des chapitres entiers. Ces deux problèmes ont plus d'effet sur la qualité que le choix d'un modèle légèrement plus puissant.

## Choix recommandé

Garder `gpt-5-nano` pour les petites tâches où sa qualité est suffisante. Tester **GPT-6 Luna** comme modèle principal de synthèse, quiz, flashcards et chat sur un corpus représentatif ; utiliser **GPT-6 Sol** uniquement pour les documents difficiles ou une seconde passe demandée par l'étudiant. Ne pas remplacer les modèles en production sans mesurer la fidélité aux sources, la qualité FR/EN, les réponses incomplètes, la latence et le coût par tâche réussie. Une alternative à comparer sur les PDF scannés est [Gemini 3.5 Flash-Lite](https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash-lite), qui accepte les PDF en entrée, avec un coût et une qualité à vérifier sur les mêmes cas.

Au tarif Standard *short context* publié le 25 septembre 2026, GPT-6 Luna coûte **0,10 $ / million de tokens en entrée** et **0,50 $ / million en sortie** ; GPT-6 Sol coûte **2 $ / 10 $**. Ces prix varient selon le contexte, le mode de traitement et la résidence des données. Luna n'est pas automatiquement moins cher que `gpt-5-nano` pour une tâche déjà fiable avec nano. Voir [tarifs OpenAI](https://developers.openai.com/api/docs/pricing), [GPT-6 Luna](https://developers.openai.com/api/docs/models/gpt-6-luna) et [tarifs Gemini](https://ai.google.dev/gemini-api/docs/pricing).

## Ordre de mise en œuvre

1. Vérifier un traitement réel de PDF avec un compte de test. Le contrôle `npm run db:check` confirme que l'API Auth et la table `users` répondent, mais ne prouve pas encore le parcours complet ni la migration du schéma.
2. Instrumenter chaque appel IA avec modèle, tokens d'entrée/sortie, éventuels tokens cachés, durée et fonction produit. Afficher le coût estimé par document et par forfait dans un tableau interne ; ne pas journaliser le contenu des cours.
3. Constituer environ 20 PDF de test autorisés, avec des textes courts/longs, FR/EN, tableaux, formules et cas ambigus. Noter chaque sortie sur exactitude, ancrage dans le document, utilité pédagogique et format valide. Comparer le modèle actuel, Luna, Sol et éventuellement Gemini sur les mêmes entrées.
4. Réduire les envois inutiles : extraire des passages pertinents pour le chat, découper les gros cours par section, réutiliser la synthèse ou un découpage commun pour plusieurs fonctions. Garder les consignes stables en tête du prompt pour permettre le [cache de prompts](https://developers.openai.com/api/docs/guides/prompt-caching). Mesurer les économies réelles.
5. Définir un plafond de dépense par utilisateur et par période, puis réexaminer les quotas de pages des forfaits, surtout les 10 000 pages du Graduate à 12,99 €. Le quota de pages seul ne borne pas le coût des conversations et des régénérations.

Un outil d'acquisition avec IA, comme un mini-quiz invité, ne doit être ouvert qu'après limites par visiteur, anti-abus et télémétrie. Les outils gratuits locaux existants n'ont pas de coût de modèle.
