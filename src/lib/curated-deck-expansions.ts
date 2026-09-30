import { STUDY_PDF_LOCALES, type StudyPdfLocale } from '@/lib/study-pdf-locales'

type Card = readonly [string, string]
type TermDeckId = 'cell-biology' | 'chemistry' | 'economics' | 'algorithms' | 'organic-chemistry'
type BaseDeckId = 'cell-biology' | 'chemistry' | 'derivatives' | 'thermodynamics' | 'economics' | 'algorithms'
type SpecialtyId = 'organic-chemistry' | 'mechanics'
type LocaleTerms = { terms: Record<TermDeckId, string>; organicTitle: string; organicDescription: string; mechanicsTitle: string; mechanicsDescription: string }

// Each line is an original concept|answer pair. A short localized question is
// generated from the concept so the same study flow works in every language.
const localizedTerms: Record<StudyPdfLocale, LocaleTerms> = {
  fr: {
    organicTitle: 'Chimie organique', organicDescription: 'Groupes fonctionnels, isomérie et réactions de base.',
    mechanicsTitle: 'Mécanique', mechanicsDescription: 'Forces, mouvement, énergie et quantité de mouvement.',
    terms: {
      'cell-biology': `Cellule procaryote|Cellule sans noyau délimité par une membrane.
Cytosol|Phase aqueuse du cytoplasme, hors des organites.
Réticulum endoplasmique rugueux|Il participe à la synthèse et au début du repliement des protéines destinées notamment à la sécrétion ou aux membranes.
Réticulum endoplasmique lisse|Il participe à la synthèse des lipides et à certaines réactions de détoxification.
Appareil de Golgi|Il modifie, trie et expédie des protéines et des lipides.
Lysosome|Compartiment contenant des enzymes qui dégradent des molécules.
Cytosquelette|Réseau de filaments qui contribue à la forme et au mouvement de la cellule.
ATP|Molécule qui fournit de l’énergie utilisable à de nombreuses réactions cellulaires.
Diffusion simple|Déplacement passif d’une substance selon son gradient de concentration.
Diffusion facilitée|Passage passif suivant un gradient grâce à une protéine membranaire.
Transport actif|Déplacement contre un gradient nécessitant de l’énergie.
Endocytose|Entrée de matière dans la cellule par formation de vésicules.
Exocytose|Libération de matière par fusion d’une vésicule avec la membrane.
Mitose|Division du noyau répartissant les chromosomes dupliqués entre deux noyaux fils.`,
      chemistry: `Numéro atomique Z|Nombre de protons du noyau.
Nombre de masse A|Nombre total de protons et de neutrons du noyau.
Isotopes|Atomes du même élément ayant un nombre différent de neutrons.
Mole|Quantité contenant environ 6,022 × 10²³ entités élémentaires.
Concentration molaire C|C = n/V : quantité de matière du soluté divisée par le volume de solution.
Dilution|Si le soluté est conservé : C₁V₁ = C₂V₂.
Acide de Brønsted|Espèce capable de céder un proton H⁺.
Base de Brønsted|Espèce capable de capter un proton H⁺.
Oxydation|Perte d’électrons par une espèce.
Réduction|Gain d’électrons par une espèce.
Réaction exothermique|Réaction qui libère de l’énergie vers l’extérieur, souvent sous forme de chaleur.
Catalyseur|Il accélère une réaction sans être consommé globalement.
Électrons de valence|Électrons de la couche externe, importants pour les liaisons chimiques.
pH|Grandeur logarithmique qui caractérise l’acidité d’une solution aqueuse.`,
      economics: `Déplacement de la demande|Variation de la quantité demandée à chaque prix, due à un facteur autre que le prix du bien.
Bien normal|Bien dont la demande tend à augmenter quand le revenu augmente.
Bien substitut|Bien pouvant remplacer un autre dans la consommation.
Bien complémentaire|Bien souvent consommé avec un autre.
Déplacement de l’offre|Variation de la quantité offerte à chaque prix, due par exemple aux coûts de production.
Prix plafond contraignant|Prix maximal inférieur au prix d’équilibre ; il peut créer une pénurie.
Prix plancher contraignant|Prix minimal supérieur au prix d’équilibre ; il peut créer un excédent.
PIB|Valeur des biens et services finaux produits sur un territoire pendant une période.
PIB réel|PIB corrigé des variations de prix.
Taux de chômage|Nombre de chômeurs divisé par la population active, selon une définition statistique donnée.
Coût marginal|Coût supplémentaire de production d’une unité de plus.
Utilité marginale|Satisfaction supplémentaire tirée d’une unité consommée de plus.
Concurrence parfaite|Modèle où chaque vendeur individuel prend le prix du marché comme donné.
Externalité|Effet d’une activité sur un tiers, non entièrement reflété dans le prix.`,
      algorithms: `Tableau indexé|Structure permettant d’accéder directement à un élément par sa position.
File FIFO|Premier entré, premier sorti.
Cas de base récursif|Condition qui arrête les appels récursifs.
Recherche linéaire|Parcours des éléments un par un ; complexité O(n) dans le pire cas.
Tri fusion|Tri par division et fusion ; complexité temporelle O(n log n).
Table de hachage|Structure offrant une recherche moyenne proche de O(1), selon les hypothèses de hachage.
Graphe|Ensemble de sommets reliés par des arêtes.
Parcours en largeur BFS|Explore les sommets par distance croissante avec une file.
Parcours en profondeur DFS|Explore une branche avant de revenir en arrière ; utilise une pile ou la récursion.
Opérateur ET logique|Vrai seulement si les deux conditions sont vraies.
Erreur de décalage d’indice|Erreur où une boucle commence ou finit une position trop tôt ou trop tard.
Invariant de boucle|Propriété vraie avant et après chaque itération.
Complexité dans le pire cas|Borne du coût maximal pour une taille d’entrée donnée.
Tri stable|Conserve l’ordre relatif des éléments de même clé.`,
      'organic-chemistry': `Alcool|Composé comportant un groupe hydroxyle –OH lié à un carbone saturé.
Acide carboxylique|Composé portant le groupe –COOH.
Aldéhyde|Composé portant un groupe carbonyle terminal –CHO.
Cétone|Composé portant un groupe carbonyle entre deux carbones.
Éther|Composé de forme générale R–O–R′.
Amine primaire|Composé organique comportant un groupe –NH₂ lié à un groupe carboné.
Alcène|Hydrocarbure contenant au moins une double liaison C=C.
Alcyne|Hydrocarbure contenant au moins une triple liaison C≡C.
Alcane|Hydrocarbure saturé ne comportant que des liaisons simples C–C.
Carbone sp³|Carbone dont les quatre liaisons σ ont une géométrie approximativement tétraédrique.
Carbone sp²|Carbone de géométrie approximativement trigonale plane autour de trois directions de liaison.
Isomères de constitution|Molécules de même formule brute mais de connectivités différentes.
Énantiomères|Stéréoisomères images l’un de l’autre dans un miroir et non superposables.
Nucléophile|Espèce qui donne une paire d’électrons pour former une liaison.
Électrophile|Espèce qui accepte une paire d’électrons pour former une liaison.
Groupe partant|Atome ou groupe qui quitte une molécule avec la paire d’électrons de la liaison.
Estérification|Réaction entre un acide carboxylique et un alcool pouvant former un ester et de l’eau.
Hydrolyse d’un ester|Réaction d’un ester avec l’eau donnant des produits dérivés d’un acide et d’un alcool.
Hydrogénation d’un alcène|Addition de H₂ sur C=C, donnant une liaison simple C–C.
Oxydation d’un alcool primaire|Selon les conditions, elle peut conduire à un aldéhyde puis à un acide carboxylique.`,
    },
  },
  en: {
    organicTitle: 'Organic chemistry', organicDescription: 'Functional groups, isomerism and core reactions.',
    mechanicsTitle: 'Mechanics', mechanicsDescription: 'Forces, motion, energy and momentum.',
    terms: {
      'cell-biology': `Prokaryotic cell|A cell without a membrane-bound nucleus.
Cytosol|The aqueous part of the cytoplasm outside organelles.
Rough endoplasmic reticulum|Helps synthesize and begin folding proteins destined for secretion or membranes.
Smooth endoplasmic reticulum|Helps synthesize lipids and carry out some detoxification reactions.
Golgi apparatus|Modifies, sorts and dispatches proteins and lipids.
Lysosome|An enzyme-containing compartment that breaks down molecules.
Cytoskeleton|A filament network that helps give the cell shape and movement.
ATP|A molecule that supplies usable energy to many cell reactions.
Simple diffusion|Passive movement of a substance down its concentration gradient.
Facilitated diffusion|Passive movement down a gradient through a membrane protein.
Active transport|Movement against a gradient that requires energy.
Endocytosis|Uptake of material by forming vesicles from the cell membrane.
Exocytosis|Release of material when a vesicle fuses with the cell membrane.
Mitosis|Division of the nucleus that distributes duplicated chromosomes into two daughter nuclei.`,
      chemistry: `Atomic number Z|The number of protons in the nucleus.
Mass number A|The total number of protons and neutrons in the nucleus.
Isotopes|Atoms of the same element with different numbers of neutrons.
Mole|An amount containing about 6.022 × 10²³ elementary entities.
Molar concentration C|C = n/V: amount of solute divided by solution volume.
Dilution|If solute is conserved: C₁V₁ = C₂V₂.
Brønsted acid|A species able to donate a proton H⁺.
Brønsted base|A species able to accept a proton H⁺.
Oxidation|Loss of electrons by a species.
Reduction|Gain of electrons by a species.
Exothermic reaction|A reaction that releases energy to its surroundings, often as heat.
Catalyst|Speeds up a reaction without being consumed overall.
Valence electrons|Outer-shell electrons important in chemical bonding.
pH|A logarithmic quantity characterizing the acidity of an aqueous solution.`,
      economics: `Demand shift|A change in quantity demanded at each price caused by a factor other than the good’s price.
Normal good|A good whose demand tends to rise as income rises.
Substitute good|A good that can replace another in consumption.
Complementary good|A good often consumed together with another.
Supply shift|A change in quantity supplied at each price, for example due to production costs.
Binding price ceiling|A maximum price below equilibrium that can cause a shortage.
Binding price floor|A minimum price above equilibrium that can cause a surplus.
GDP|Value of final goods and services produced in an area during a period.
Real GDP|GDP adjusted for changes in prices.
Unemployment rate|Number of unemployed people divided by the labor force under a stated statistical definition.
Marginal cost|Extra cost of producing one additional unit.
Marginal utility|Extra satisfaction from consuming one additional unit.
Perfect competition|A model in which each individual seller takes the market price as given.
Externality|An effect of an activity on a third party not fully reflected in its price.`,
      algorithms: `Indexed array|A structure allowing direct access to an element by its position.
FIFO queue|First in, first out.
Recursive base case|The condition that stops recursive calls.
Linear search|Checks elements one by one; worst-case time O(n).
Merge sort|Divide-and-merge sort with O(n log n) time complexity.
Hash table|A structure with near O(1) average lookup under suitable hashing assumptions.
Graph|A set of vertices connected by edges.
Breadth-first search BFS|Explores vertices by increasing distance using a queue.
Depth-first search DFS|Explores one branch before backtracking, using a stack or recursion.
Logical AND|True only when both conditions are true.
Off-by-one error|A loop starts or ends one position too early or too late.
Loop invariant|A property true before and after each iteration.
Worst-case complexity|A bound on the maximum cost for an input size.
Stable sort|Preserves the relative order of items with equal keys.`,
      'organic-chemistry': `Alcohol|A compound with a hydroxyl –OH group attached to a saturated carbon.
Carboxylic acid|A compound containing the –COOH group.
Aldehyde|A compound with a terminal carbonyl group –CHO.
Ketone|A compound with a carbonyl group between two carbons.
Ether|A compound with the general structure R–O–R′.
Primary amine|An organic compound with –NH₂ bonded to one carbon-containing group.
Alkene|A hydrocarbon with at least one C=C double bond.
Alkyne|A hydrocarbon with at least one C≡C triple bond.
Alkane|A saturated hydrocarbon with only C–C single bonds.
sp³ carbon|A carbon whose four σ bonds have approximately tetrahedral geometry.
sp² carbon|A carbon with approximately trigonal planar geometry around three bond directions.
Constitutional isomers|Molecules with the same molecular formula but different connectivity.
Enantiomers|Stereoisomers that are non-superimposable mirror images.
Nucleophile|A species that donates an electron pair to form a bond.
Electrophile|A species that accepts an electron pair to form a bond.
Leaving group|An atom or group that departs with the bonding electron pair.
Esterification|A carboxylic acid and an alcohol can react to form an ester and water.
Ester hydrolysis|Reaction of an ester with water giving products derived from an acid and an alcohol.
Alkene hydrogenation|Addition of H₂ across C=C to form a C–C single bond.
Primary alcohol oxidation|Depending on conditions, it can yield an aldehyde and then a carboxylic acid.`,
    },
  },
  es: {
    organicTitle: 'Química orgánica', organicDescription: 'Grupos funcionales, isomería y reacciones básicas.',
    mechanicsTitle: 'Mecánica', mechanicsDescription: 'Fuerzas, movimiento, energía y cantidad de movimiento.',
    terms: {
      'cell-biology': `Célula procariota|Célula sin núcleo rodeado por membrana.
Citosol|Parte acuosa del citoplasma fuera de los orgánulos.
Retículo endoplasmático rugoso|Interviene en la síntesis y el plegamiento inicial de proteínas destinadas a secreción o membranas.
Retículo endoplasmático liso|Participa en la síntesis de lípidos y algunas reacciones de desintoxicación.
Aparato de Golgi|Modifica, clasifica y envía proteínas y lípidos.
Lisosoma|Compartimento con enzimas que degradan moléculas.
Citoesqueleto|Red de filamentos que ayuda a dar forma y movimiento a la célula.
ATP|Molécula que aporta energía utilizable a muchas reacciones celulares.
Difusión simple|Movimiento pasivo de una sustancia a favor de su gradiente de concentración.
Difusión facilitada|Paso pasivo a favor de un gradiente mediante una proteína de membrana.
Transporte activo|Movimiento contra un gradiente que requiere energía.
Endocitosis|Entrada de material formando vesículas de la membrana celular.
Exocitosis|Liberación de material cuando una vesícula se fusiona con la membrana.
Mitosis|División nuclear que reparte cromosomas duplicados entre dos núcleos hijos.`,
      chemistry: `Número atómico Z|Número de protones del núcleo.
Número másico A|Número total de protones y neutrones del núcleo.
Isótopos|Átomos del mismo elemento con distinto número de neutrones.
Mol|Cantidad que contiene aproximadamente 6,022 × 10²³ entidades elementales.
Concentración molar C|C = n/V: cantidad de soluto dividida por el volumen de solución.
Dilución|Si se conserva el soluto: C₁V₁ = C₂V₂.
Ácido de Brønsted|Especie capaz de donar un protón H⁺.
Base de Brønsted|Especie capaz de aceptar un protón H⁺.
Oxidación|Pérdida de electrones por una especie.
Reducción|Ganancia de electrones por una especie.
Reacción exotérmica|Reacción que libera energía al entorno, a menudo como calor.
Catalizador|Acelera una reacción sin consumirse globalmente.
Electrones de valencia|Electrones de la capa externa importantes para los enlaces.
pH|Magnitud logarítmica que caracteriza la acidez de una solución acuosa.`,
      economics: `Desplazamiento de la demanda|Cambio de la cantidad demandada a cada precio causado por otro factor.
Bien normal|Bien cuya demanda tiende a aumentar cuando aumenta la renta.
Bien sustitutivo|Bien que puede reemplazar a otro en el consumo.
Bien complementario|Bien que suele consumirse junto con otro.
Desplazamiento de la oferta|Cambio de la cantidad ofrecida a cada precio, por ejemplo debido a costes.
Precio máximo vinculante|Límite inferior al precio de equilibrio que puede causar escasez.
Precio mínimo vinculante|Límite superior al precio de equilibrio que puede causar excedente.
PIB|Valor de bienes y servicios finales producidos en un territorio durante un período.
PIB real|PIB ajustado por cambios en los precios.
Tasa de desempleo|Número de desempleados dividido por la población activa según una definición estadística.
Coste marginal|Coste adicional de producir una unidad más.
Utilidad marginal|Satisfacción adicional de consumir una unidad más.
Competencia perfecta|Modelo en el que cada vendedor toma el precio de mercado como dado.
Externalidad|Efecto sobre terceros que no se refleja plenamente en el precio.`,
      algorithms: `Arreglo indexado|Estructura que permite acceder directamente a un elemento por su posición.
Cola FIFO|Primero en entrar, primero en salir.
Caso base recursivo|Condición que detiene las llamadas recursivas.
Búsqueda lineal|Revisa elementos uno por uno; peor caso O(n).
Ordenación por mezcla|Divide y combina; complejidad temporal O(n log n).
Tabla hash|Estructura con búsqueda media cercana a O(1) bajo supuestos adecuados.
Grafo|Conjunto de vértices conectados por aristas.
Búsqueda en anchura BFS|Explora por distancia creciente mediante una cola.
Búsqueda en profundidad DFS|Explora una rama antes de retroceder con pila o recursión.
Operador lógico Y|Verdadero solo si ambas condiciones son verdaderas.
Error de índice por uno|Un bucle empieza o termina una posición antes o después de lo debido.
Invariante de bucle|Propiedad verdadera antes y después de cada iteración.
Complejidad del peor caso|Límite del coste máximo para un tamaño de entrada.
Ordenación estable|Conserva el orden relativo de elementos con igual clave.`,
      'organic-chemistry': `Alcohol|Compuesto con un grupo hidroxilo –OH unido a un carbono saturado.
Ácido carboxílico|Compuesto que contiene el grupo –COOH.
Aldehído|Compuesto con un grupo carbonilo terminal –CHO.
Cetona|Compuesto con un grupo carbonilo entre dos carbonos.
Éter|Compuesto de estructura general R–O–R′.
Amina primaria|Compuesto orgánico con –NH₂ unido a un grupo carbonado.
Alqueno|Hidrocarburo con al menos un doble enlace C=C.
Alquino|Hidrocarburo con al menos un triple enlace C≡C.
Alcano|Hidrocarburo saturado con solo enlaces simples C–C.
Carbono sp³|Carbono cuyos cuatro enlaces σ tienen geometría aproximadamente tetraédrica.
Carbono sp²|Carbono con geometría aproximadamente trigonal plana.
Isómeros constitucionales|Moléculas con igual fórmula molecular pero distinta conectividad.
Enantiómeros|Estereoisómeros que son imágenes especulares no superponibles.
Nucleófilo|Especie que dona un par de electrones para formar un enlace.
Electrófilo|Especie que acepta un par de electrones para formar un enlace.
Grupo saliente|Átomo o grupo que sale con el par de electrones del enlace.
Esterificación|Un ácido carboxílico y un alcohol pueden formar un éster y agua.
Hidrólisis de un éster|Reacción con agua que da productos derivados de un ácido y un alcohol.
Hidrogenación de un alqueno|Adición de H₂ a C=C para formar un enlace simple C–C.
Oxidación de un alcohol primario|Según las condiciones, puede dar un aldehído y después un ácido carboxílico.`,
    },
  },
  de: {
    organicTitle: 'Organische Chemie', organicDescription: 'Funktionelle Gruppen, Isomerie und grundlegende Reaktionen.',
    mechanicsTitle: 'Mechanik', mechanicsDescription: 'Kräfte, Bewegung, Energie und Impuls.',
    terms: {
      'cell-biology': `Prokaryotische Zelle|Zelle ohne membranumhüllten Zellkern.
Zytosol|Wässriger Teil des Zytoplasmas außerhalb der Organellen.
Raues endoplasmatisches Retikulum|Hilft bei Synthese und erster Faltung von Proteinen für Sekretion oder Membranen.
Glattes endoplasmatisches Retikulum|Beteiligt an Lipidsynthese und manchen Entgiftungsreaktionen.
Golgi-Apparat|Modifiziert, sortiert und versendet Proteine und Lipide.
Lysosom|Enzymhaltiger Bereich zum Abbau von Molekülen.
Zytoskelett|Filamentnetz, das Form und Bewegung der Zelle unterstützt.
ATP|Molekül, das vielen Zellreaktionen nutzbare Energie liefert.
Einfache Diffusion|Passive Bewegung entlang eines Konzentrationsgefälles.
Erleichterte Diffusion|Passiver Transport entlang eines Gradienten durch ein Membranprotein.
Aktiver Transport|Transport gegen einen Gradienten, der Energie benötigt.
Endozytose|Aufnahme von Stoffen durch Bildung von Vesikeln an der Zellmembran.
Exozytose|Abgabe von Stoffen durch Verschmelzen eines Vesikels mit der Membran.
Mitose|Kernteilung, die duplizierte Chromosomen auf zwei Tochterkerne verteilt.`,
      chemistry: `Ordnungszahl Z|Anzahl der Protonen im Kern.
Massenzahl A|Gesamtzahl der Protonen und Neutronen im Kern.
Isotope|Atome desselben Elements mit unterschiedlicher Neutronenzahl.
Mol|Stoffmenge mit etwa 6,022 × 10²³ elementaren Teilchen.
Stoffmengenkonzentration C|C = n/V: Stoffmenge des gelösten Stoffes geteilt durch Lösungsvolumen.
Verdünnung|Bei erhaltener Stoffmenge des gelösten Stoffes: C₁V₁ = C₂V₂.
Brønsted-Säure|Teilchen, das ein Proton H⁺ abgeben kann.
Brønsted-Base|Teilchen, das ein Proton H⁺ aufnehmen kann.
Oxidation|Abgabe von Elektronen durch ein Teilchen.
Reduktion|Aufnahme von Elektronen durch ein Teilchen.
Exotherme Reaktion|Reaktion, die Energie an die Umgebung abgibt, oft als Wärme.
Katalysator|Beschleunigt eine Reaktion, ohne insgesamt verbraucht zu werden.
Valenzelektronen|Außenelektronen, die für chemische Bindungen wichtig sind.
pH-Wert|Logarithmische Größe für den Säuregrad einer wässrigen Lösung.`,
      economics: `Verschiebung der Nachfrage|Änderung der nachgefragten Menge bei jedem Preis durch einen anderen Faktor.
Normales Gut|Gut, dessen Nachfrage bei steigendem Einkommen tendenziell steigt.
Substitutionsgut|Gut, das ein anderes im Konsum ersetzen kann.
Komplementärgut|Gut, das häufig zusammen mit einem anderen konsumiert wird.
Verschiebung des Angebots|Änderung der angebotenen Menge bei jedem Preis, etwa durch Produktionskosten.
Bindende Preisobergrenze|Höchstpreis unter dem Gleichgewichtspreis, der Knappheit bewirken kann.
Bindender Mindestpreis|Mindestpreis über dem Gleichgewichtspreis, der Überschuss bewirken kann.
BIP|Wert der in einem Gebiet während einer Periode erzeugten Endgüter und Dienstleistungen.
Reales BIP|Um Preisänderungen bereinigtes BIP.
Arbeitslosenquote|Arbeitslose geteilt durch Erwerbspersonen nach festgelegter statistischer Definition.
Grenzkosten|Zusätzliche Kosten für eine weitere produzierte Einheit.
Grenznutzen|Zusätzlicher Nutzen einer weiteren konsumierten Einheit.
Vollkommener Wettbewerb|Modell, in dem jeder einzelne Anbieter den Marktpreis als gegeben nimmt.
Externalität|Wirkung auf Dritte, die nicht vollständig im Preis enthalten ist.`,
      algorithms: `Indexiertes Array|Struktur mit direktem Zugriff auf Elemente über ihre Position.
FIFO-Warteschlange|Zuerst hinein, zuerst hinaus.
Rekursiver Basisfall|Bedingung, die rekursive Aufrufe beendet.
Lineare Suche|Prüft Elemente einzeln; im schlechtesten Fall O(n).
Mergesort|Teile-und-füge-zusammen-Sortierung mit O(n log n) Zeit.
Hashtabelle|Struktur mit durchschnittlich ungefähr O(1) Suchzeit bei geeigneten Annahmen.
Graph|Menge von Knoten, die durch Kanten verbunden sind.
Breitensuche BFS|Durchsucht Knoten nach wachsendem Abstand mithilfe einer Warteschlange.
Tiefensuche DFS|Verfolgt einen Zweig vor dem Zurückgehen mit Stapel oder Rekursion.
Logisches UND|Nur wahr, wenn beide Bedingungen wahr sind.
Off-by-one-Fehler|Eine Schleife beginnt oder endet eine Position zu früh oder zu spät.
Schleifeninvariante|Eigenschaft, die vor und nach jedem Durchlauf gilt.
Worst-Case-Komplexität|Schranke für den maximalen Aufwand bei einer Eingabegröße.
Stabile Sortierung|Erhält die Reihenfolge von Elementen mit gleichem Schlüssel.`,
      'organic-chemistry': `Alkohol|Verbindung mit einer Hydroxygruppe –OH an einem gesättigten Kohlenstoff.
Carbonsäure|Verbindung mit der Gruppe –COOH.
Aldehyd|Verbindung mit einer endständigen Carbonylgruppe –CHO.
Keton|Verbindung mit einer Carbonylgruppe zwischen zwei Kohlenstoffen.
Ether|Verbindung der allgemeinen Form R–O–R′.
Primäres Amin|Organische Verbindung mit –NH₂ an einer kohlenstoffhaltigen Gruppe.
Alken|Kohlenwasserstoff mit mindestens einer C=C-Doppelbindung.
Alkin|Kohlenwasserstoff mit mindestens einer C≡C-Dreifachbindung.
Alkan|Gesättigter Kohlenwasserstoff mit nur C–C-Einfachbindungen.
sp³-Kohlenstoff|Kohlenstoff mit vier σ-Bindungen in annähernd tetraedrischer Geometrie.
sp²-Kohlenstoff|Kohlenstoff mit annähernd trigonal-planarer Geometrie.
Konstitutionsisomere|Moleküle gleicher Summenformel mit unterschiedlicher Verknüpfung.
Enantiomere|Nicht deckungsgleiche Spiegelbild-Stereoisomere.
Nukleophil|Teilchen, das ein Elektronenpaar für eine Bindung abgibt.
Elektrophil|Teilchen, das ein Elektronenpaar für eine Bindung annimmt.
Abgangsgruppe|Atom oder Gruppe, die mit dem bindenden Elektronenpaar abgeht.
Veresterung|Carbonsäure und Alkohol können zu Ester und Wasser reagieren.
Esterhydrolyse|Reaktion eines Esters mit Wasser zu Produkten aus Säure und Alkohol.
Hydrierung eines Alkens|Addition von H₂ an C=C zu einer C–C-Einfachbindung.
Oxidation eines primären Alkohols|Je nach Bedingungen entsteht erst ein Aldehyd und dann eine Carbonsäure.`,
    },
  },
  it: {
    organicTitle: 'Chimica organica', organicDescription: 'Gruppi funzionali, isomeria e reazioni fondamentali.',
    mechanicsTitle: 'Meccanica', mechanicsDescription: 'Forze, movimento, energia e quantità di moto.',
    terms: {
      'cell-biology': `Cellula procariote|Cellula priva di nucleo delimitato da membrana.
Citosol|Parte acquosa del citoplasma esterna agli organelli.
Reticolo endoplasmatico rugoso|Contribuisce alla sintesi e al primo ripiegamento di proteine destinate a secrezione o membrane.
Reticolo endoplasmatico liscio|Partecipa alla sintesi dei lipidi e ad alcune reazioni di detossificazione.
Apparato di Golgi|Modifica, seleziona e smista proteine e lipidi.
Lisosoma|Compartimento con enzimi che degradano molecole.
Citoscheletro|Rete di filamenti che sostiene forma e movimento della cellula.
ATP|Molecola che fornisce energia utilizzabile a molte reazioni cellulari.
Diffusione semplice|Movimento passivo lungo un gradiente di concentrazione.
Diffusione facilitata|Trasporto passivo lungo un gradiente tramite una proteina di membrana.
Trasporto attivo|Movimento contro gradiente che richiede energia.
Endocitosi|Ingresso di materiale mediante formazione di vescicole dalla membrana.
Esocitosi|Rilascio di materiale quando una vescicola si fonde con la membrana.
Mitosi|Divisione nucleare che distribuisce i cromosomi duplicati in due nuclei figli.`,
      chemistry: `Numero atomico Z|Numero di protoni nel nucleo.
Numero di massa A|Numero totale di protoni e neutroni nel nucleo.
Isotopi|Atomi dello stesso elemento con diverso numero di neutroni.
Mole|Quantità contenente circa 6,022 × 10²³ entità elementari.
Concentrazione molare C|C = n/V: quantità di soluto divisa per il volume della soluzione.
Diluizione|Se il soluto si conserva: C₁V₁ = C₂V₂.
Acido di Brønsted|Specie capace di donare un protone H⁺.
Base di Brønsted|Specie capace di accettare un protone H⁺.
Ossidazione|Perdita di elettroni da parte di una specie.
Riduzione|Acquisto di elettroni da parte di una specie.
Reazione esotermica|Reazione che libera energia nell’ambiente, spesso come calore.
Catalizzatore|Accelera una reazione senza essere consumato nel complesso.
Elettroni di valenza|Elettroni del guscio esterno importanti nei legami chimici.
pH|Grandezza logaritmica che descrive l’acidità di una soluzione acquosa.`,
      economics: `Spostamento della domanda|Variazione della quantità domandata a ogni prezzo dovuta a un altro fattore.
Bene normale|Bene la cui domanda tende ad aumentare con il reddito.
Bene sostitutivo|Bene che può sostituirne un altro nel consumo.
Bene complementare|Bene spesso consumato insieme a un altro.
Spostamento dell’offerta|Variazione della quantità offerta a ogni prezzo, per esempio per i costi.
Prezzo massimo vincolante|Limite sotto il prezzo di equilibrio che può causare scarsità.
Prezzo minimo vincolante|Limite sopra il prezzo di equilibrio che può causare eccedenza.
PIL|Valore dei beni e servizi finali prodotti in un territorio in un periodo.
PIL reale|PIL corretto per le variazioni dei prezzi.
Tasso di disoccupazione|Disoccupati divisi per la forza lavoro secondo una definizione statistica.
Costo marginale|Costo aggiuntivo per produrre un’unità in più.
Utilità marginale|Soddisfazione aggiuntiva di un’unità consumata in più.
Concorrenza perfetta|Modello in cui ogni venditore prende il prezzo di mercato come dato.
Esternalità|Effetto su terzi non interamente riflesso nel prezzo.`,
      algorithms: `Array indicizzato|Struttura che permette accesso diretto a un elemento tramite la sua posizione.
Coda FIFO|Primo entrato, primo uscito.
Caso base ricorsivo|Condizione che interrompe le chiamate ricorsive.
Ricerca lineare|Controlla gli elementi uno a uno; nel caso peggiore O(n).
Merge sort|Ordinamento per divisione e fusione con tempo O(n log n).
Tabella hash|Struttura con ricerca media vicina a O(1) in condizioni adatte.
Grafo|Insieme di vertici collegati da archi.
Ricerca in ampiezza BFS|Esplora per distanza crescente usando una coda.
Ricerca in profondità DFS|Esplora un ramo prima di tornare indietro, con pila o ricorsione.
Operatore logico E|Vero solo se entrambe le condizioni sono vere.
Errore di indice di uno|Un ciclo inizia o finisce una posizione troppo presto o troppo tardi.
Invariante di ciclo|Proprietà vera prima e dopo ogni iterazione.
Complessità nel caso peggiore|Limite del costo massimo per una dimensione dell’input.
Ordinamento stabile|Mantiene l’ordine relativo di elementi con chiavi uguali.`,
      'organic-chemistry': `Alcol|Composto con gruppo ossidrile –OH legato a un carbonio saturo.
Acido carbossilico|Composto che contiene il gruppo –COOH.
Aldeide|Composto con gruppo carbonilico terminale –CHO.
Chetone|Composto con gruppo carbonilico tra due carboni.
Etere|Composto di struttura generale R–O–R′.
Ammina primaria|Composto organico con –NH₂ legato a un gruppo carbonioso.
Alchene|Idrocarburo con almeno un doppio legame C=C.
Alchino|Idrocarburo con almeno un triplo legame C≡C.
Alcano|Idrocarburo saturo con soli legami semplici C–C.
Carbonio sp³|Carbonio con quattro legami σ in geometria circa tetraedrica.
Carbonio sp²|Carbonio con geometria circa trigonale planare.
Isomeri costituzionali|Molecole con uguale formula molecolare ma diversa connettività.
Enantiomeri|Stereoisomeri speculari non sovrapponibili.
Nucleofilo|Specie che dona una coppia di elettroni per formare un legame.
Elettrofilo|Specie che accetta una coppia di elettroni per formare un legame.
Gruppo uscente|Atomo o gruppo che se ne va con la coppia elettronica del legame.
Esterificazione|Acido carbossilico e alcol possono dare estere e acqua.
Idrolisi di un estere|Reazione con acqua che dà prodotti derivati da acido e alcol.
Idrogenazione di un alchene|Aggiunta di H₂ a C=C che forma un legame semplice C–C.
Ossidazione di un alcol primario|Secondo le condizioni produce un’aldeide e poi un acido carbossilico.`,
    },
  },
  pt: {
    organicTitle: 'Química orgânica', organicDescription: 'Grupos funcionais, isomeria e reações fundamentais.',
    mechanicsTitle: 'Mecânica', mechanicsDescription: 'Forças, movimento, energia e momento linear.',
    terms: {
      'cell-biology': `Célula procariótica|Célula sem núcleo delimitado por membrana.
Citosol|Parte aquosa do citoplasma fora dos organelos.
Retículo endoplasmático rugoso|Ajuda na síntese e na primeira dobragem de proteínas para secreção ou membranas.
Retículo endoplasmático liso|Participa na síntese de lípidos e em certas reações de desintoxicação.
Complexo de Golgi|Modifica, separa e envia proteínas e lípidos.
Lisossoma|Compartimento com enzimas que degradam moléculas.
Citoesqueleto|Rede de filamentos que ajuda a dar forma e movimento à célula.
ATP|Molécula que fornece energia utilizável a muitas reações celulares.
Difusão simples|Movimento passivo a favor de um gradiente de concentração.
Difusão facilitada|Passagem passiva a favor de um gradiente por uma proteína da membrana.
Transporte ativo|Movimento contra um gradiente que exige energia.
Endocitose|Entrada de material por formação de vesículas da membrana.
Exocitose|Libertação de material quando uma vesícula se funde com a membrana.
Mitose|Divisão nuclear que distribui cromossomas duplicados por dois núcleos filhos.`,
      chemistry: `Número atómico Z|Número de protões no núcleo.
Número de massa A|Total de protões e neutrões no núcleo.
Isótopos|Átomos do mesmo elemento com diferentes números de neutrões.
Mole|Quantidade com cerca de 6,022 × 10²³ entidades elementares.
Concentração molar C|C = n/V: quantidade de soluto dividida pelo volume da solução.
Diluição|Se o soluto for conservado: C₁V₁ = C₂V₂.
Ácido de Brønsted|Espécie capaz de ceder um protão H⁺.
Base de Brønsted|Espécie capaz de aceitar um protão H⁺.
Oxidação|Perda de eletrões por uma espécie.
Redução|Ganho de eletrões por uma espécie.
Reação exotérmica|Reação que liberta energia para o exterior, muitas vezes como calor.
Catalisador|Acelera uma reação sem ser consumido globalmente.
Eletrões de valência|Eletrões da camada externa importantes nas ligações químicas.
pH|Grandeza logarítmica que caracteriza a acidez de uma solução aquosa.`,
      economics: `Deslocamento da procura|Mudança na quantidade procurada a cada preço por outro fator.
Bem normal|Bem cuja procura tende a aumentar com o rendimento.
Bem substituto|Bem que pode substituir outro no consumo.
Bem complementar|Bem frequentemente consumido com outro.
Deslocamento da oferta|Mudança na quantidade oferecida a cada preço, por exemplo pelos custos.
Preço máximo vinculativo|Limite abaixo do equilíbrio que pode causar escassez.
Preço mínimo vinculativo|Limite acima do equilíbrio que pode causar excedente.
PIB|Valor dos bens e serviços finais produzidos num território num período.
PIB real|PIB ajustado às alterações de preços.
Taxa de desemprego|Desempregados divididos pela população ativa segundo uma definição estatística.
Custo marginal|Custo adicional de produzir mais uma unidade.
Utilidade marginal|Satisfação adicional de consumir mais uma unidade.
Concorrência perfeita|Modelo em que cada vendedor toma o preço de mercado como dado.
Externalidade|Efeito sobre terceiros não totalmente refletido no preço.`,
      algorithms: `Array indexado|Estrutura com acesso direto a um elemento pela posição.
Fila FIFO|Primeiro a entrar, primeiro a sair.
Caso base recursivo|Condição que termina chamadas recursivas.
Pesquisa linear|Verifica elementos um a um; pior caso O(n).
Merge sort|Ordenação por divisão e fusão com tempo O(n log n).
Tabela de dispersão|Estrutura com pesquisa média próxima de O(1) sob hipóteses adequadas.
Grafo|Conjunto de vértices ligados por arestas.
Pesquisa em largura BFS|Explora por distância crescente usando uma fila.
Pesquisa em profundidade DFS|Segue um ramo antes de voltar, com pilha ou recursão.
Operador lógico E|Verdadeiro só se ambas as condições forem verdadeiras.
Erro de índice por um|Ciclo começa ou termina uma posição cedo ou tarde demais.
Invariante de ciclo|Propriedade verdadeira antes e depois de cada iteração.
Complexidade no pior caso|Limite do custo máximo para uma dimensão de entrada.
Ordenação estável|Mantém a ordem relativa de elementos com a mesma chave.`,
      'organic-chemistry': `Álcool|Composto com grupo hidroxilo –OH ligado a carbono saturado.
Ácido carboxílico|Composto com o grupo –COOH.
Aldeído|Composto com grupo carbonilo terminal –CHO.
Cetona|Composto com grupo carbonilo entre dois carbonos.
Éter|Composto com estrutura geral R–O–R′.
Amina primária|Composto orgânico com –NH₂ ligado a um grupo carbonado.
Alceno|Hidrocarboneto com pelo menos uma ligação dupla C=C.
Alcino|Hidrocarboneto com pelo menos uma ligação tripla C≡C.
Alcano|Hidrocarboneto saturado com apenas ligações simples C–C.
Carbono sp³|Carbono com quatro ligações σ de geometria aproximadamente tetraédrica.
Carbono sp²|Carbono de geometria aproximadamente trigonal plana.
Isómeros constitucionais|Moléculas com a mesma fórmula molecular mas ligações entre átomos diferentes.
Enantiómeros|Estereoisómeros que são imagens no espelho não sobreponíveis.
Nucleófilo|Espécie que doa um par de eletrões para formar uma ligação.
Eletrófilo|Espécie que aceita um par de eletrões para formar uma ligação.
Grupo de saída|Átomo ou grupo que sai com o par de eletrões da ligação.
Esterificação|Ácido carboxílico e álcool podem formar éster e água.
Hidrólise de éster|Reação com água que origina produtos derivados de ácido e álcool.
Hidrogenação de alceno|Adição de H₂ a C=C formando uma ligação simples C–C.
Oxidação de álcool primário|Consoante as condições, pode formar aldeído e depois ácido carboxílico.`,
    },
  },
  zh: {
    organicTitle: '有机化学', organicDescription: '官能团、异构现象与基础反应。',
    mechanicsTitle: '力学', mechanicsDescription: '力、运动、能量和动量。',
    terms: {
      'cell-biology': `原核细胞|没有膜包围的细胞核的细胞。
细胞质基质|细胞质中细胞器以外的水相部分。
粗面内质网|参与分泌蛋白和膜蛋白的合成及初步折叠。
滑面内质网|参与脂质合成和部分解毒反应。
高尔基体|修饰、分类并运输蛋白质和脂质。
溶酶体|含有可分解分子的酶的细胞区室。
细胞骨架|帮助维持细胞形状和运动的丝状网络。
ATP|为许多细胞反应提供可用能量的分子。
简单扩散|物质沿浓度梯度的被动移动。
易化扩散|物质借助膜蛋白沿梯度被动移动。
主动运输|需要能量、逆梯度进行的运输。
胞吞作用|细胞膜形成囊泡将物质摄入细胞。
胞吐作用|囊泡与细胞膜融合并释放物质。
有丝分裂|把复制的染色体分配到两个子细胞核中的核分裂。`,
      chemistry: `原子序数 Z|原子核中的质子数。
质量数 A|原子核中质子数与中子数之和。
同位素|质子数相同、中子数不同的同种元素原子。
摩尔|含约 6.022 × 10²³ 个基本粒子的物质的量。
物质的量浓度 C|C = n/V：溶质的物质的量除以溶液体积。
稀释|溶质守恒时：C₁V₁ = C₂V₂。
布朗斯特酸|能够提供质子 H⁺ 的粒子。
布朗斯特碱|能够接受质子 H⁺ 的粒子。
氧化|粒子失去电子。
还原|粒子得到电子。
放热反应|向环境释放能量、常以热量形式释放的反应。
催化剂|提高反应速率，整体上不被消耗。
价电子|外层电子，对化学键形成很重要。
pH|表征水溶液酸度的对数值。`,
      economics: `需求曲线移动|非商品自身价格因素使每个价格下的需求量变化。
正常品|收入上升时需求通常增加的商品。
替代品|消费中可代替另一种商品的商品。
互补品|常与另一种商品一起消费的商品。
供给曲线移动|生产成本等因素使每个价格下的供给量变化。
有效最高限价|低于均衡价格的上限，可能造成短缺。
有效最低限价|高于均衡价格的下限，可能造成过剩。
国内生产总值 GDP|某地区在一定时期生产的最终产品与服务的价值。
实际 GDP|剔除价格变化影响后的 GDP。
失业率|按指定统计口径，失业人数除以劳动力人数。
边际成本|多生产一个单位的额外成本。
边际效用|多消费一个单位带来的额外满足感。
完全竞争|单个卖方将市场价格视为既定的模型。
外部性|未完全反映在价格中的、活动对第三方的影响。`,
      algorithms: `可索引数组|可通过位置直接访问元素的数据结构。
先进先出队列|先进入的元素先离开。
递归基例|使递归调用停止的条件。
线性搜索|逐一检查元素；最坏情况下为 O(n)。
归并排序|分割后合并的排序方法；时间复杂度 O(n log n)。
哈希表|在适当哈希假设下，平均查找时间接近 O(1) 的结构。
图|由边连接顶点构成的结构。
广度优先搜索 BFS|借助队列按距离从近到远探索顶点。
深度优先搜索 DFS|沿一条分支深入后回溯，可用栈或递归。
逻辑与|只有两个条件都为真时才为真。
差一错误|循环的起点或终点比应有位置早或晚一位。
循环不变式|每轮迭代前后都成立的性质。
最坏情况复杂度|给定输入规模时最大成本的界。
稳定排序|保留键值相同元素的相对顺序。`,
      'organic-chemistry': `醇|含有连接在饱和碳上的羟基 –OH 的化合物。
羧酸|含有 –COOH 基团的化合物。
醛|含有末端羰基 –CHO 的化合物。
酮|羰基位于两个碳原子之间的化合物。
醚|一般结构为 R–O–R′ 的化合物。
伯胺|–NH₂ 连在一个含碳基团上的有机化合物。
烯烃|至少含一个 C=C 双键的烃。
炔烃|至少含一个 C≡C 三键的烃。
烷烃|只含 C–C 单键的饱和烃。
sp³ 杂化碳|四个 σ 键的空间构型近似四面体。
sp² 杂化碳|三个成键方向近似平面三角形。
构造异构体|分子式相同而原子连接方式不同的分子。
对映异构体|互为镜像而不能重合的立体异构体。
亲核试剂|提供一对电子以形成化学键的粒子。
亲电试剂|接受一对电子以形成化学键的粒子。
离去基团|带着成键电子对离开分子的原子或基团。
酯化反应|羧酸与醇可反应生成酯和水。
酯的水解|酯与水反应，形成来自酸和醇的产物。
烯烃氢化|H₂ 加到 C=C 上，使其成为 C–C 单键。
伯醇氧化|依条件不同，可先生成醛，再生成羧酸。`,
    },
  },
  ja: {
    organicTitle: '有機化学', organicDescription: '官能基、異性体、基本的な反応。',
    mechanicsTitle: '力学', mechanicsDescription: '力、運動、エネルギー、運動量。',
    terms: {
      'cell-biology': `原核細胞|膜で囲まれた核を持たない細胞。
細胞質基質|細胞質のうち細胞小器官以外の水性部分。
粗面小胞体|分泌タンパク質や膜タンパク質の合成と初期の折り畳みに関わる。
滑面小胞体|脂質合成や一部の解毒反応に関わる。
ゴルジ体|タンパク質や脂質を修飾、選別、輸送する。
リソソーム|分子を分解する酵素を含む区画。
細胞骨格|細胞の形や動きを支える繊維状のネットワーク。
ATP|多くの細胞反応に利用できるエネルギーを供給する分子。
単純拡散|濃度勾配に沿った物質の受動的な移動。
促進拡散|膜タンパク質を介して勾配に沿って進む受動輸送。
能動輸送|エネルギーを使って勾配に逆らう輸送。
エンドサイトーシス|膜から小胞を作り物質を細胞内に取り込むこと。
エキソサイトーシス|小胞が膜と融合して物質を放出すること。
有糸分裂|複製された染色体を二つの娘核に分ける核分裂。`,
      chemistry: `原子番号 Z|原子核の陽子の数。
質量数 A|原子核の陽子数と中性子数の合計。
同位体|陽子数は同じで中性子数が異なる同一元素の原子。
モル|約 6.022 × 10²³ 個の基本粒子を含む物質量。
モル濃度 C|C = n/V：溶質の物質量を溶液の体積で割った値。
希釈|溶質量が保存されるなら C₁V₁ = C₂V₂。
ブレンステッド酸|プロトン H⁺ を与えられる化学種。
ブレンステッド塩基|プロトン H⁺ を受け取れる化学種。
酸化|化学種が電子を失うこと。
還元|化学種が電子を得ること。
発熱反応|周囲へエネルギーを放出する反応。多くは熱として放出する。
触媒|反応を速め、全体として消費されない物質。
価電子|化学結合に重要な最外殻の電子。
pH|水溶液の酸性度を表す対数的な量。`,
      economics: `需要曲線のシフト|商品の価格以外の要因による、各価格での需要量の変化。
正常財|所得が増えると需要が増える傾向にある財。
代替財|消費の際に別の財の代わりになる財。
補完財|別の財と一緒に消費されやすい財。
供給曲線のシフト|生産費などによる、各価格での供給量の変化。
拘束的な価格上限|均衡価格より低い上限で、不足を招くことがある。
拘束的な価格下限|均衡価格より高い下限で、余剰を招くことがある。
GDP|一定期間に国内で生産された最終財とサービスの価値。
実質 GDP|価格変動の影響を調整した GDP。
失業率|定めた統計基準による失業者数を労働力人口で割った値。
限界費用|生産量を一単位増やす追加費用。
限界効用|消費量を一単位増やす追加の満足度。
完全競争|各売り手が市場価格を所与として受け入れるモデル。
外部性|価格に十分反映されない、活動が第三者に与える影響。`,
      algorithms: `添字付き配列|位置を指定して要素に直接アクセスできる構造。
FIFO キュー|先に入ったものが先に出る。
再帰の基底ケース|再帰呼び出しを止める条件。
線形探索|要素を順番に調べる。最悪の場合 O(n)。
マージソート|分割と併合によるソート。計算時間は O(n log n)。
ハッシュ表|適切な条件下で平均探索時間が O(1) に近い構造。
グラフ|辺で結ばれた頂点の集合。
幅優先探索 BFS|キューを使い近い頂点から順に探索する。
深さ優先探索 DFS|スタックや再帰を使い枝を深くたどってから戻る。
論理積 AND|両方の条件が真のときだけ真。
オフバイワンエラー|ループの開始や終了が一つずれている誤り。
ループ不変条件|各反復の前後で成り立つ性質。
最悪計算量|入力サイズごとの最大コストの上界。
安定ソート|同じキーの要素の相対順序を保つソート。`,
      'organic-chemistry': `アルコール|飽和炭素に結合したヒドロキシ基 –OH を持つ化合物。
カルボン酸|–COOH 基を持つ化合物。
アルデヒド|末端カルボニル基 –CHO を持つ化合物。
ケトン|二つの炭素の間にカルボニル基を持つ化合物。
エーテル|一般構造が R–O–R′ の化合物。
第一級アミン|一つの炭素含有基に –NH₂ が結合した有機化合物。
アルケン|少なくとも一つの C=C 二重結合を持つ炭化水素。
アルキン|少なくとも一つの C≡C 三重結合を持つ炭化水素。
アルカン|C–C 単結合のみを持つ飽和炭化水素。
sp³ 炭素|四つの σ 結合がほぼ正四面体形に配置された炭素。
sp² 炭素|三つの結合方向がほぼ平面三角形に配置された炭素。
構造異性体|分子式が同じで原子の結合順序が異なる分子。
エナンチオマー|鏡像関係にあり重ね合わせられない立体異性体。
求核剤|電子対を与えて結合を作る化学種。
求電子剤|電子対を受け取って結合を作る化学種。
脱離基|結合電子対を伴って分子から離れる原子または基。
エステル化|カルボン酸とアルコールからエステルと水が生じ得る反応。
エステルの加水分解|エステルが水と反応し、酸とアルコールに由来する生成物を作る。
アルケンの水素化|C=C に H₂ が付加し C–C 単結合になる。
第一級アルコールの酸化|条件によりアルデヒドを経てカルボン酸を生じ得る。`,
    },
  },
  ar: {
    organicTitle: 'الكيمياء العضوية', organicDescription: 'المجموعات الوظيفية والتماكب والتفاعلات الأساسية.',
    mechanicsTitle: 'الميكانيكا', mechanicsDescription: 'القوى والحركة والطاقة وكمية الحركة.',
    terms: {
      'cell-biology': `خلية بدائية النواة|خلية بلا نواة محاطة بغشاء.
السيتوسول|الجزء المائي من السيتوبلازم خارج العضيات.
الشبكة الإندوبلازمية الخشنة|تساعد في تصنيع البروتينات المخصصة للإفراز أو الأغشية وبداية طيها.
الشبكة الإندوبلازمية الملساء|تساهم في تصنيع الدهون وبعض تفاعلات إزالة السموم.
جهاز غولجي|يعدّل البروتينات والدهون ويفرزها ويوجهها.
الجسيم الحال|حيز يحتوي إنزيمات تفكك الجزيئات.
الهيكل الخلوي|شبكة خيوط تدعم شكل الخلية وحركتها.
ATP|جزيء يمد كثيرًا من تفاعلات الخلية بطاقة قابلة للاستخدام.
الانتشار البسيط|انتقال سلبي لمادة مع تدرج تركيزها.
الانتشار الميسر|انتقال سلبي مع التدرج عبر بروتين غشائي.
النقل النشط|انتقال عكس التدرج يحتاج إلى طاقة.
الإدخال الخلوي|دخول مادة بتكوين حويصلات من غشاء الخلية.
الإخراج الخلوي|إطلاق مادة عندما تندمج حويصلة مع الغشاء.
الانقسام المتساوي|انقسام النواة وتوزيع الصبغيات المضاعفة على نواتين بنتين.`,
      chemistry: `العدد الذري Z|عدد البروتونات في النواة.
العدد الكتلي A|مجموع البروتونات والنيوترونات في النواة.
النظائر|ذرات العنصر نفسه تختلف في عدد النيوترونات.
المول|كمية تحتوي نحو 6.022 × 10²³ كيانًا أوليًا.
التركيز المولاري C|C = n/V: كمية المذاب مقسومة على حجم المحلول.
التخفيف|إذا حُفظت كمية المذاب: C₁V₁ = C₂V₂.
حمض برونستد|نوع كيميائي يستطيع منح بروتون H⁺.
قاعدة برونستد|نوع كيميائي يستطيع استقبال بروتون H⁺.
الأكسدة|فقد نوع كيميائي للإلكترونات.
الاختزال|اكتساب نوع كيميائي للإلكترونات.
تفاعل طارد للحرارة|تفاعل يطلق طاقة إلى الوسط، غالبًا على شكل حرارة.
العامل الحفاز|يسرّع التفاعل دون أن يُستهلك إجمالًا.
إلكترونات التكافؤ|إلكترونات الغلاف الخارجي المهمة في الروابط الكيميائية.
pH|مقدار لوغاريتمي يصف حموضة محلول مائي.`,
      economics: `انتقال منحنى الطلب|تغير الكمية المطلوبة عند كل سعر بسبب عامل غير سعر السلعة.
سلعة عادية|سلعة يميل طلبها إلى الزيادة مع ارتفاع الدخل.
سلعة بديلة|سلعة يمكن أن تحل محل أخرى في الاستهلاك.
سلعة مكملة|سلعة تُستهلك غالبًا مع سلعة أخرى.
انتقال منحنى العرض|تغير الكمية المعروضة عند كل سعر بسبب عامل مثل تكاليف الإنتاج.
حد أقصى ملزم للسعر|سقف دون سعر التوازن قد يسبب نقصًا.
حد أدنى ملزم للسعر|أرضية فوق سعر التوازن قد تسبب فائضًا.
الناتج المحلي الإجمالي|قيمة السلع والخدمات النهائية المنتجة في منطقة خلال فترة.
الناتج المحلي الحقيقي|الناتج المحلي بعد تعديل أثر تغير الأسعار.
معدل البطالة|عدد العاطلين مقسومًا على قوة العمل وفق تعريف إحصائي محدد.
التكلفة الحدية|التكلفة الإضافية لإنتاج وحدة أخرى.
المنفعة الحدية|الرضا الإضافي من استهلاك وحدة أخرى.
المنافسة الكاملة|نموذج يأخذ فيه كل بائع منفرد سعر السوق كما هو.
الأثر الخارجي|أثر نشاط على طرف ثالث لا ينعكس كله في السعر.`,
      algorithms: `مصفوفة مفهرسة|بنية تتيح الوصول المباشر إلى عنصر بحسب موقعه.
طابور FIFO|الأول دخولًا هو الأول خروجًا.
حالة الأساس في الاستدعاء الذاتي|شرط يوقف الاستدعاءات الذاتية.
البحث الخطي|يفحص العناصر واحدًا واحدًا؛ أسوأ حالة O(n).
ترتيب الدمج|تقسيم ثم دمج بوقت O(n log n).
جدول التجزئة|بنية يقترب متوسط البحث فيها من O(1) وفق افتراضات مناسبة.
الرسم البياني|مجموعة رؤوس تصل بينها حواف.
البحث بالعرض BFS|يستكشف الرؤوس وفق المسافة المتزايدة باستخدام طابور.
البحث بالعمق DFS|يتبع فرعًا قبل الرجوع باستخدام مكدس أو استدعاء ذاتي.
العامل المنطقي وَ|صحيح فقط إذا كان الشرطان صحيحين.
خطأ الإزاحة بمقدار واحد|تبدأ الحلقة أو تنتهي قبل الموضع الصحيح أو بعده بواحد.
ثابت الحلقة|خاصية تصح قبل كل تكرار وبعده.
تعقيد أسوأ حالة|حد للكلفة القصوى عند حجم إدخال محدد.
الترتيب المستقر|يحافظ على الترتيب النسبي للعناصر ذات المفتاح نفسه.`,
      'organic-chemistry': `كحول|مركب يحوي مجموعة هيدروكسيل –OH مرتبطة بكربون مشبع.
حمض كربوكسيلي|مركب يحوي المجموعة –COOH.
ألدهيد|مركب يحوي مجموعة كربونيل طرفية –CHO.
كيتون|مركب تحوي بنيته مجموعة كربونيل بين ذرتي كربون.
إيثر|مركب بنيته العامة R–O–R′.
أمين أولي|مركب عضوي فيه –NH₂ مرتبطة بمجموعة كربونية واحدة.
ألكين|هيدروكربون فيه رابطة مزدوجة C=C واحدة على الأقل.
ألكاين|هيدروكربون فيه رابطة ثلاثية C≡C واحدة على الأقل.
ألكان|هيدروكربون مشبع بروابط مفردة C–C فقط.
كربون sp³|كربون روابطه σ الأربع مرتبة تقريبًا على هيئة رباعي وجوه.
كربون sp²|كربون هندسته تقريبًا مثلثية مستوية.
متماكبات بنيوية|جزيئات لها الصيغة الجزيئية نفسها وترابط ذري مختلف.
متقابلات ضوئية|متماكبات فراغية صورتها المرآتية غير قابلة للتطابق.
محب للنواة|نوع يمنح زوج إلكترونات لتكوين رابطة.
محب للإلكترونات|نوع يقبل زوج إلكترونات لتكوين رابطة.
مجموعة مغادرة|ذرة أو مجموعة تغادر ومعها زوج إلكترونات الرابطة.
الأسترة|تفاعل حمض كربوكسيلي مع كحول قد ينتج إسترًا وماء.
حلمهة الإستر|تفاعل الإستر مع الماء ليعطي نواتج مشتقة من حمض وكحول.
هدرجة الألكين|إضافة H₂ إلى C=C لتصبح رابطة مفردة C–C.
أكسدة الكحول الأولي|بحسب الشروط قد تعطي ألدهيدًا ثم حمضًا كربوكسيليًا.`,
    },
  },
}

const questionFrames: Record<StudyPdfLocale, readonly [string, string]> = {
  fr: ['Que signifie « ', ' » ?'], en: ['What does “', '” mean?'], es: ['¿Qué significa «', '»?'],
  de: ['Was bedeutet „', '“?'], it: ['Che cosa significa «', '»?'], pt: ['O que significa «', '»?'],
  zh: ['“', '”是什么意思？'], ja: ['「', '」とは？'], ar: ['ما معنى «', '»؟'],
}

function termCards(locale: StudyPdfLocale, id: TermDeckId): readonly Card[] {
  const [before, after] = questionFrames[locale]
  const cards = localizedTerms[locale].terms[id].split('\n').map(line => {
    const separator = line.indexOf('|')
    if (separator < 1) throw new Error(`Invalid flashcard: ${locale}/${id}`)
    return [`${before}${line.slice(0, separator)}${after}`, line.slice(separator + 1)] as const
  })
  const expected = id === 'organic-chemistry' ? 20 : 14
  if (cards.length !== expected || cards.some(([question, answer]) => !question.trim() || !answer.trim())) {
    throw new Error(`Expected ${expected} complete flashcards: ${locale}/${id}`)
  }
  return cards
}

const derivativeCards: readonly Card[] = [
  ['d/dx [cos(x)] = ?', '−sin(x).'], ['d/dx [ln(x)] = ? (x > 0)', '1/x.'],
  ['d/dx [1/x] = ? (x ≠ 0)', '−1/x².'], ['d/dx [x²] = ?', '2x.'],
  ['d/dx [x³] = ?', '3x².'], ['d/dx [√x] = ? (x > 0)', '1/(2√x).'],
  ['d/dx [tan(x)] = ?', '1/cos²(x) (cos(x) ≠ 0).'], ['d/dx [2x + 3] = ?', '2.'],
  ['d/dx [3x² + 2x] = ?', '6x + 2.'], ['d/dx [sin²(x)] = ?', '2sin(x)cos(x).'],
  ['d/dx [e^(2x)] = ?', '2e^(2x).'], ['d/dx [ln(2x)] = ? (x > 0)', '1/x.'],
  ['d/dx [c] = ? (c ∈ ℝ)', '0.'], ['d/dx [f(x)g(x)] = ?', 'f′(x)g(x) + f(x)g′(x).'],
]

const thermodynamicsCards: readonly Card[] = [
  ['Cᵥ = ? (Cₚ, R)', 'Cᵥ = Cₚ − R.'], ['γ = ? (Cₚ, Cᵥ)', 'γ = Cₚ/Cᵥ.'],
  ['P₂ = ? (T₁ = T₂; P₁,V₁,V₂)', 'P₂ = P₁V₁/V₂.'],
  ['P₁V₁^γ = ? (ΔS=0, PV=nRT)', 'P₂V₂^γ.'],
  ['T₁V₁^(γ−1) = ? (ΔS=0, PV=nRT)', 'T₂V₂^(γ−1).'],
  ['W = ? (ΔV = 0)', 'W = 0.'],
  ['ΔU = ? (n, Cᵥ, ΔT)', 'ΔU = nCᵥΔT.'],
  ['W = ? (Pₑₓₜ, dV; ΔU=Q+W)', 'W = −∫Pₑₓₜ dV.'],
  ['W = ? (T₁=T₂, PV=nRT, Pₑₓₜ=P, ΔU=Q+W)', 'W = nRT ln(V₁/V₂).'],
  ['Q = ? (T₁=T₂, PV=nRT, ΔU=Q+W)', 'Q = −W.'],
  ['P₂? P₁ = 1 atm, V₁ = 8 L, V₂ = 5 L, T₁=T₂', 'P₂ = 1.6 atm.'],
  ['T₂? T₁ = 300 K, V₁ = 8 L, V₂ = 5 L, γ = 1.4, Q=0, ΔS=0', 'T₂ = 300 × (8/5)^0.4 ≈ 362 K.'],
  ['ΔU? Q = 0, W = +50 J, ΔU=Q+W', 'ΔU = +50 J.'],
  ['1 atm·L = ? J', '1 atm·L = 101.325 J.'],
]

const mechanicsCards: readonly Card[] = [
  ['v̄ = ? (Δx, Δt)', 'v̄ = Δx/Δt.'], ['ā = ? (Δv, Δt)', 'ā = Δv/Δt.'],
  ['ΣF = ? (m, a)', 'ΣF = ma.'], ['W = ? (F, d, θ)', 'W = Fd cos θ.'],
  ['Eₖ = ? (m, v)', 'Eₖ = ½mv².'], ['Eₚ = ? (m, g, h)', 'Eₚ = mgh.'],
  ['P̄ = ? (W, Δt)', 'P̄ = W/Δt.'], ['p = ? (m, v)', 'p = mv.'],
  ['J = ? (F(t)=F₀, Δt)', 'J = F₀Δt = Δp.'], ['F = ? (k, x; Hooke)', 'F = −kx.'],
  ['f = ? (T)', 'f = 1/T.'], ['ω = ? (f)', 'ω = 2πf.'],
  ['a꜀ = ? (v, r)', 'a꜀ = v²/r.'], ['F꜀ = ? (m, v, r)', 'F꜀ = mv²/r.'],
  ['F = ? (G, m₁, m₂, r)', 'F = Gm₁m₂/r².'],
  ['Fₖ = ? (μₖ, N)', 'Fₖ = μₖN.'], ['Fₛ,max = ? (μₛ, N)', 'Fₛ,max = μₛN.'],
  ['τ = ? (r, F, θ)', 'τ = rF sin θ.'], ['Σpᵢ = ? (ΣFₑₓₜ=0)', 'Σpᶠ.'],
  ['v² = ? (v₀, a, Δx)', 'v² = v₀² + 2aΔx.'],
]

if (derivativeCards.length !== 14 || thermodynamicsCards.length !== 14 || mechanicsCards.length !== 20) {
  throw new Error('Invalid formula deck size')
}

export const curatedDeckExpansions = Object.fromEntries(STUDY_PDF_LOCALES.map(locale => {
  const c = localizedTerms[locale]
  const extra: Record<BaseDeckId, readonly Card[]> = {
    'cell-biology': termCards(locale, 'cell-biology'), chemistry: termCards(locale, 'chemistry'),
    derivatives: derivativeCards, thermodynamics: thermodynamicsCards,
    economics: termCards(locale, 'economics'), algorithms: termCards(locale, 'algorithms'),
  }
  const specialties: Record<SpecialtyId, { title: string; description: string; cards: readonly Card[] }> = {
    'organic-chemistry': { title: c.organicTitle, description: c.organicDescription, cards: termCards(locale, 'organic-chemistry') },
    mechanics: { title: c.mechanicsTitle, description: c.mechanicsDescription, cards: mechanicsCards },
  }
  return [locale, { extra, specialties }]
})) as Record<StudyPdfLocale, { extra: Record<BaseDeckId, readonly Card[]>; specialties: Record<SpecialtyId, { title: string; description: string; cards: readonly Card[] }> }>
