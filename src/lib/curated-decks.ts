import { STUDY_PDF_LOCALES, type StudyPdfLocale } from '@/lib/study-pdf-locales'
import { curatedDeckExpansions } from '@/lib/curated-deck-expansions'
import { MEDICAL_DECK_IDS, medicalDecks } from '@/lib/medical-decks'

export const BASE_DECK_IDS = ['cell-biology', 'chemistry', 'derivatives', 'thermodynamics', 'economics', 'algorithms'] as const
export const SPECIALIZED_DECK_IDS = ['organic-chemistry', 'mechanics'] as const
export const CURATED_DECK_IDS = [...BASE_DECK_IDS, ...SPECIALIZED_DECK_IDS, ...MEDICAL_DECK_IDS] as const
export type CuratedDeckId = typeof CURATED_DECK_IDS[number]
type BaseDeckId = typeof BASE_DECK_IDS[number]
type Card = readonly [question: string, answer: string]
type Deck = { title: string; description: string; cards: readonly Card[] }
type LocaleContent = { title: string; intro: string; search: string; noResults: string; cards: string; start: string; deck: Record<CuratedDeckId, Deck> }

const baseCuratedDeckCopy: Record<StudyPdfLocale, Omit<LocaleContent, 'deck'> & { deck: Record<BaseDeckId, Deck> }> = {
  fr: {
    title: 'Des flashcards prêtes à réviser', intro: 'Choisis une matière et commence sans compte. Ces jeux de départ sont rédigés par CramDesk ; adapte les cartes à ton cours avant un examen.', search: 'Rechercher une matière', noResults: 'Aucune matière ne correspond à ta recherche.', cards: 'cartes', start: 'Réviser ce jeu',
    deck: {
      'cell-biology': { title: 'Biologie cellulaire', description: 'Les structures et échanges essentiels de la cellule.', cards: [
        ['Quel est le rôle de la membrane plasmique ?', 'Elle délimite la cellule et contrôle une partie des échanges avec son environnement.'],
        ['Que contient principalement le noyau d’une cellule eucaryote ?', 'L’ADN, organisé en chromosomes.'],
        ['Quel est le rôle principal des mitochondries ?', 'Elles produisent de l’ATP grâce à la respiration cellulaire.'],
        ['Que fabriquent les ribosomes ?', 'Des protéines à partir de l’information portée par l’ARN messager.'],
        ['Où se déroule la photosynthèse dans une cellule végétale ?', 'Dans les chloroplastes.'],
        ['Qu’est-ce que l’osmose ?', 'Le déplacement de l’eau à travers une membrane perméable à l’eau, vers le milieu le plus concentré en solutés.'],
      ] },
      chemistry: { title: 'Chimie générale', description: 'Atomes, liaisons, pH et quantité de matière.', cards: [
        ['Dans un atome électriquement neutre, comment se comparent protons et électrons ?', 'Il y a autant de protons que d’électrons.'],
        ['Qu’est-ce qu’une liaison covalente ?', 'Une liaison où deux atomes partagent une ou plusieurs paires d’électrons.'],
        ['À quoi correspond une liaison ionique ?', 'À l’attraction électrostatique entre ions de charges opposées.'],
        ['À 25 °C, que signifie un pH inférieur à 7 pour une solution aqueuse ?', 'La solution est acide.'],
        ['Comment calculer la quantité de matière à partir d’une masse ?', 'n = m / M, avec m la masse et M la masse molaire.'],
        ['Que faut-il conserver lorsqu’on équilibre une équation chimique ?', 'Le nombre d’atomes de chaque élément, ainsi que la charge totale.'],
      ] },
      derivatives: { title: 'Dérivées', description: 'Les règles de calcul et leur interprétation graphique.', cards: [
        ['Quelle est la dérivée de xⁿ ?', 'n·xⁿ⁻¹, là où la fonction est dérivable.'],
        ['Quelle est la dérivée de sin(x) ?', 'cos(x).'],
        ['Quelle est la dérivée de eˣ ?', 'eˣ.'],
        ['Que représente f′(a) sur le graphique de f ?', 'La pente de la tangente à la courbe au point d’abscisse a.'],
        ['Si f′(x) > 0 sur un intervalle, comment varie f ?', 'f est strictement croissante sur cet intervalle.'],
        ['Quelle est la règle de dérivation d’une composée f(g(x)) ?', 'f′(g(x)) · g′(x).'],
      ] },
      thermodynamics: { title: 'Thermodynamique', description: 'Gaz parfait, énergie et transformations.', cards: [
        ['Comment convertir une température en °C en kelvins ?', 'T(K) = T(°C) + 273,15.'],
        ['Quelle est l’équation d’état du gaz parfait ?', 'PV = nRT.'],
        ['Que vaut ΔU pour une transformation isotherme d’un gaz parfait ?', 'ΔU = 0, car son énergie interne dépend seulement de la température.'],
        ['Quelle relation P–V suit une compression isotherme réversible d’un gaz parfait ?', 'PV = constante.'],
        ['Que signifie « adiabatique » pour la chaleur échangée ?', 'Q = 0 : il n’y a pas d’échange de chaleur avec l’extérieur.'],
        ['Avec W le travail reçu par le système, quelle est la première loi ?', 'ΔU = Q + W. Il faut annoncer cette convention de signe.'],
      ] },
      economics: { title: 'Économie', description: 'Offre, demande et notions utiles pour raisonner.', cards: [
        ['Qu’est-ce que le coût d’opportunité ?', 'La valeur de la meilleure option abandonnée lorsqu’on fait un choix.'],
        ['Toutes choses égales par ailleurs, que fait une hausse du prix à la quantité demandée ?', 'Elle tend à la réduire.'],
        ['Toutes choses égales par ailleurs, que fait une hausse du prix à la quantité offerte ?', 'Elle tend à l’augmenter.'],
        ['Qu’est-ce qu’un équilibre de marché dans un modèle simple ?', 'Un prix pour lequel quantité offerte et quantité demandée sont égales.'],
        ['Comment définit-on l’élasticité-prix de la demande ?', 'Variation en % de la quantité demandée divisée par la variation en % du prix.'],
        ['Qu’est-ce que l’inflation ?', 'Une hausse générale et durable du niveau des prix.'],
      ] },
      algorithms: { title: 'Algorithmique', description: 'Les bases pour lire et analyser un algorithme.', cards: [
        ['Qu’est-ce qu’un algorithme ?', 'Une suite finie d’instructions précises pour résoudre un problème.'],
        ['Quelle condition faut-il pour utiliser une recherche binaire ?', 'Les éléments doivent être triés selon un ordre connu.'],
        ['Quelle est la complexité temporelle d’une recherche binaire ?', 'O(log n) dans une collection indexable triée.'],
        ['Quel ordre de sortie suit une pile ?', 'Dernier entré, premier sorti (LIFO).'],
        ['À quoi sert une variable ?', 'À associer un nom à une valeur qui peut être lue et éventuellement modifiée.'],
        ['Que fait une boucle ?', 'Elle répète des instructions tant qu’une condition ou un nombre d’itérations le demande.'],
      ] },
    },
  },
  en: {
    title: 'Ready-to-study flashcards', intro: 'Pick a subject and start without an account. CramDesk wrote these starter decks; adapt the cards to your own course before an exam.', search: 'Search subjects', noResults: 'No subjects match your search.', cards: 'cards', start: 'Study this deck',
    deck: {
      'cell-biology': { title: 'Cell biology', description: 'Essential cell structures and exchanges.', cards: [
        ['What does the plasma membrane do?', 'It defines the cell boundary and controls some exchanges with the environment.'],
        ['What does the nucleus of a eukaryotic cell mainly contain?', 'DNA organized into chromosomes.'],
        ['What is the main role of mitochondria?', 'They produce ATP through cellular respiration.'],
        ['What do ribosomes make?', 'Proteins, using information carried by messenger RNA.'],
        ['Where does photosynthesis take place in a plant cell?', 'In chloroplasts.'],
        ['What is osmosis?', 'The movement of water across a water-permeable membrane toward the side with more solute.'],
      ] },
      chemistry: { title: 'General chemistry', description: 'Atoms, bonds, pH and the mole.', cards: [
        ['In a neutral atom, how do protons and electrons compare?', 'Their numbers are equal.'],
        ['What is a covalent bond?', 'A bond in which atoms share one or more pairs of electrons.'],
        ['What is an ionic bond?', 'Electrostatic attraction between oppositely charged ions.'],
        ['At 25 °C, what does pH below 7 mean for an aqueous solution?', 'The solution is acidic.'],
        ['How do you calculate amount of substance from mass?', 'n = m / M, where m is mass and M is molar mass.'],
        ['What must be conserved when balancing a chemical equation?', 'The number of atoms of each element and the total charge.'],
      ] },
      derivatives: { title: 'Derivatives', description: 'Differentiation rules and graph interpretation.', cards: [
        ['What is the derivative of xⁿ?', 'n·xⁿ⁻¹ wherever the function is differentiable.'],
        ['What is the derivative of sin(x)?', 'cos(x).'],
        ['What is the derivative of eˣ?', 'eˣ.'],
        ['What does f′(a) mean on the graph of f?', 'The slope of the tangent at x = a.'],
        ['If f′(x) > 0 on an interval, how does f vary?', 'It is strictly increasing on that interval.'],
        ['What is the chain rule for f(g(x))?', 'f′(g(x)) · g′(x).'],
      ] },
      thermodynamics: { title: 'Thermodynamics', description: 'Ideal gas, energy and transformations.', cards: [
        ['How do you convert °C to kelvins?', 'T(K) = T(°C) + 273.15.'],
        ['What is the ideal gas equation?', 'PV = nRT.'],
        ['What is ΔU for an isothermal ideal-gas process?', 'ΔU = 0 because internal energy depends only on temperature.'],
        ['What P–V relation holds for reversible isothermal compression of an ideal gas?', 'PV = constant.'],
        ['What does adiabatic mean for heat transfer?', 'Q = 0: no heat is exchanged with the surroundings.'],
        ['If W is work received by the system, what is the first law?', 'ΔU = Q + W. State the sign convention explicitly.'],
      ] },
      economics: { title: 'Economics', description: 'Supply, demand and useful reasoning tools.', cards: [
        ['What is opportunity cost?', 'The value of the best alternative you give up when making a choice.'],
        ['All else equal, what does a higher price do to quantity demanded?', 'It tends to decrease it.'],
        ['All else equal, what does a higher price do to quantity supplied?', 'It tends to increase it.'],
        ['What is market equilibrium in a simple model?', 'A price at which quantity supplied equals quantity demanded.'],
        ['How is price elasticity of demand defined?', 'Percentage change in quantity demanded divided by percentage change in price.'],
        ['What is inflation?', 'A broad, sustained rise in the general price level.'],
      ] },
      algorithms: { title: 'Algorithms', description: 'The basics of reading and analyzing algorithms.', cards: [
        ['What is an algorithm?', 'A finite sequence of precise instructions for solving a problem.'],
        ['What condition is required for binary search?', 'The elements must be sorted in a known order.'],
        ['What is the time complexity of binary search?', 'O(log n) in a sorted, indexable collection.'],
        ['What order does a stack use?', 'Last in, first out (LIFO).'],
        ['What is a variable for?', 'It associates a name with a value that can be read and possibly changed.'],
        ['What does a loop do?', 'It repeats instructions according to a condition or iteration count.'],
      ] },
    },
  },
  es: {
    title: 'Tarjetas listas para estudiar', intro: 'Elige una materia y empieza sin cuenta. CramDesk ha redactado estos juegos iniciales; adapta las tarjetas a tu curso antes del examen.', search: 'Buscar una materia', noResults: 'No hay materias que coincidan con tu búsqueda.', cards: 'tarjetas', start: 'Estudiar este juego',
    deck: {
      'cell-biology': { title: 'Biología celular', description: 'Estructuras e intercambios esenciales de la célula.', cards: [
        ['¿Qué hace la membrana plasmática?', 'Delimita la célula y controla parte de los intercambios con el entorno.'],
        ['¿Qué contiene principalmente el núcleo de una célula eucariota?', 'ADN organizado en cromosomas.'],
        ['¿Cuál es la función principal de las mitocondrias?', 'Producen ATP mediante la respiración celular.'],
        ['¿Qué fabrican los ribosomas?', 'Proteínas a partir de la información del ARN mensajero.'],
        ['¿Dónde se realiza la fotosíntesis en una célula vegetal?', 'En los cloroplastos.'],
        ['¿Qué es la ósmosis?', 'El movimiento de agua a través de una membrana permeable al agua hacia el lado con más solutos.'],
      ] },
      chemistry: { title: 'Química general', description: 'Átomos, enlaces, pH y cantidad de sustancia.', cards: [
        ['En un átomo neutro, ¿cómo se comparan protones y electrones?', 'Hay el mismo número de protones y electrones.'],
        ['¿Qué es un enlace covalente?', 'Un enlace en el que los átomos comparten uno o varios pares de electrones.'],
        ['¿Qué es un enlace iónico?', 'La atracción electrostática entre iones de cargas opuestas.'],
        ['A 25 °C, ¿qué indica un pH inferior a 7 en una disolución acuosa?', 'Que la disolución es ácida.'],
        ['¿Cómo se calcula la cantidad de sustancia a partir de la masa?', 'n = m / M, donde m es la masa y M la masa molar.'],
        ['¿Qué se conserva al ajustar una ecuación química?', 'El número de átomos de cada elemento y la carga total.'],
      ] },
      derivatives: { title: 'Derivadas', description: 'Reglas de cálculo e interpretación gráfica.', cards: [
        ['¿Cuál es la derivada de xⁿ?', 'n·xⁿ⁻¹ donde la función sea derivable.'],
        ['¿Cuál es la derivada de sin(x)?', 'cos(x).'],
        ['¿Cuál es la derivada de eˣ?', 'eˣ.'],
        ['¿Qué representa f′(a) en la gráfica de f?', 'La pendiente de la tangente en x = a.'],
        ['Si f′(x) > 0 en un intervalo, ¿cómo varía f?', 'Es estrictamente creciente en ese intervalo.'],
        ['¿Cuál es la regla de la cadena para f(g(x))?', 'f′(g(x)) · g′(x).'],
      ] },
      thermodynamics: { title: 'Termodinámica', description: 'Gas ideal, energía y transformaciones.', cards: [
        ['¿Cómo se convierten los °C a kelvin?', 'T(K) = T(°C) + 273,15.'],
        ['¿Cuál es la ecuación del gas ideal?', 'PV = nRT.'],
        ['¿Cuánto vale ΔU en un proceso isotérmico de gas ideal?', 'ΔU = 0 porque la energía interna depende solo de la temperatura.'],
        ['¿Qué relación P–V sigue una compresión isotérmica reversible de gas ideal?', 'PV = constante.'],
        ['¿Qué significa adiabático respecto al calor?', 'Q = 0: no se intercambia calor con el entorno.'],
        ['Si W es el trabajo recibido por el sistema, ¿cuál es la primera ley?', 'ΔU = Q + W. Hay que indicar esta convención de signos.'],
      ] },
      economics: { title: 'Economía', description: 'Oferta, demanda y herramientas para razonar.', cards: [
        ['¿Qué es el coste de oportunidad?', 'El valor de la mejor alternativa a la que renuncias al elegir.'],
        ['Si todo lo demás no cambia, ¿qué ocurre con la cantidad demandada al subir el precio?', 'Tiende a disminuir.'],
        ['Si todo lo demás no cambia, ¿qué ocurre con la cantidad ofrecida al subir el precio?', 'Tiende a aumentar.'],
        ['¿Qué es el equilibrio de mercado en un modelo sencillo?', 'Un precio al que la cantidad ofrecida iguala la demandada.'],
        ['¿Cómo se define la elasticidad-precio de la demanda?', 'Variación porcentual de la cantidad demandada dividida por la variación porcentual del precio.'],
        ['¿Qué es la inflación?', 'Un aumento general y sostenido del nivel de precios.'],
      ] },
      algorithms: { title: 'Algoritmos', description: 'Bases para leer y analizar algoritmos.', cards: [
        ['¿Qué es un algoritmo?', 'Una secuencia finita de instrucciones precisas para resolver un problema.'],
        ['¿Qué condición requiere la búsqueda binaria?', 'Los elementos deben estar ordenados según un criterio conocido.'],
        ['¿Cuál es la complejidad temporal de la búsqueda binaria?', 'O(log n) en una colección ordenada e indexable.'],
        ['¿Qué orden sigue una pila?', 'Último en entrar, primero en salir (LIFO).'],
        ['¿Para qué sirve una variable?', 'Asocia un nombre a un valor que puede leerse y quizá modificarse.'],
        ['¿Qué hace un bucle?', 'Repite instrucciones según una condición o un número de iteraciones.'],
      ] },
    },
  },
  de: {
    title: 'Lernkarten zum direkten Üben', intro: 'Wähle ein Fach und lerne ohne Konto. Diese Startsets stammen von CramDesk; passe die Karten vor einer Prüfung an deinen Kurs an.', search: 'Fach suchen', noResults: 'Keine passenden Fächer gefunden.', cards: 'Karten', start: 'Dieses Set lernen',
    deck: {
      'cell-biology': { title: 'Zellbiologie', description: 'Wichtige Zellstrukturen und Stoffaustausch.', cards: [
        ['Was ist die Aufgabe der Zellmembran?', 'Sie begrenzt die Zelle und steuert einen Teil des Austauschs mit der Umgebung.'],
        ['Was enthält der Zellkern einer eukaryotischen Zelle vor allem?', 'DNA, die in Chromosomen organisiert ist.'],
        ['Was ist die Hauptaufgabe von Mitochondrien?', 'Sie bilden ATP durch Zellatmung.'],
        ['Was stellen Ribosomen her?', 'Proteine nach der Information der Boten-RNA.'],
        ['Wo findet in Pflanzenzellen die Photosynthese statt?', 'In den Chloroplasten.'],
        ['Was ist Osmose?', 'Die Bewegung von Wasser durch eine wasserdurchlässige Membran zur Seite mit höherer Konzentration gelöster Stoffe.'],
      ] },
      chemistry: { title: 'Allgemeine Chemie', description: 'Atome, Bindungen, pH und Stoffmenge.', cards: [
        ['Wie verhalten sich Protonen und Elektronen in einem neutralen Atom?', 'Ihre Anzahl ist gleich.'],
        ['Was ist eine kovalente Bindung?', 'Eine Bindung, bei der Atome ein oder mehrere Elektronenpaare teilen.'],
        ['Was ist eine Ionenbindung?', 'Elektrostatische Anziehung zwischen entgegengesetzt geladenen Ionen.'],
        ['Was bedeutet bei 25 °C ein pH unter 7 für eine wässrige Lösung?', 'Die Lösung ist sauer.'],
        ['Wie berechnet man die Stoffmenge aus der Masse?', 'n = m / M; m ist die Masse und M die molare Masse.'],
        ['Was bleibt beim Ausgleichen einer Reaktionsgleichung erhalten?', 'Die Anzahl der Atome jedes Elements und die Gesamtladung.'],
      ] },
      derivatives: { title: 'Ableitungen', description: 'Ableitungsregeln und grafische Bedeutung.', cards: [
        ['Was ist die Ableitung von xⁿ?', 'n·xⁿ⁻¹, wo die Funktion differenzierbar ist.'],
        ['Was ist die Ableitung von sin(x)?', 'cos(x).'],
        ['Was ist die Ableitung von eˣ?', 'eˣ.'],
        ['Was bedeutet f′(a) im Graphen von f?', 'Die Steigung der Tangente bei x = a.'],
        ['Wie verhält sich f, wenn f′(x) > 0 in einem Intervall?', 'f ist dort streng monoton steigend.'],
        ['Wie lautet die Kettenregel für f(g(x))?', 'f′(g(x)) · g′(x).'],
      ] },
      thermodynamics: { title: 'Thermodynamik', description: 'Ideales Gas, Energie und Zustandsänderungen.', cards: [
        ['Wie rechnet man °C in Kelvin um?', 'T(K) = T(°C) + 273,15.'],
        ['Wie lautet die ideale Gasgleichung?', 'PV = nRT.'],
        ['Welchen Wert hat ΔU bei einem isothermen Prozess eines idealen Gases?', 'ΔU = 0, denn die innere Energie hängt nur von der Temperatur ab.'],
        ['Welche P–V-Beziehung gilt bei reversibler isothermer Kompression eines idealen Gases?', 'PV = konstant.'],
        ['Was bedeutet adiabatisch für den Wärmeaustausch?', 'Q = 0: Es wird keine Wärme mit der Umgebung ausgetauscht.'],
        ['Wenn W die am System verrichtete Arbeit ist: Wie lautet der erste Hauptsatz?', 'ΔU = Q + W. Die Vorzeichenkonvention muss genannt werden.'],
      ] },
      economics: { title: 'Volkswirtschaft', description: 'Angebot, Nachfrage und grundlegende Begriffe.', cards: [
        ['Was sind Opportunitätskosten?', 'Der Wert der besten Alternative, auf die man bei einer Entscheidung verzichtet.'],
        ['Was passiert ceteris paribus mit der nachgefragten Menge bei steigendem Preis?', 'Sie sinkt tendenziell.'],
        ['Was passiert ceteris paribus mit der angebotenen Menge bei steigendem Preis?', 'Sie steigt tendenziell.'],
        ['Was ist Marktgleichgewicht in einem einfachen Modell?', 'Ein Preis, bei dem angebotene und nachgefragte Menge gleich sind.'],
        ['Wie ist die Preiselastizität der Nachfrage definiert?', 'Prozentuale Änderung der nachgefragten Menge geteilt durch die prozentuale Preisänderung.'],
        ['Was ist Inflation?', 'Ein allgemeiner und anhaltender Anstieg des Preisniveaus.'],
      ] },
      algorithms: { title: 'Algorithmen', description: 'Grundlagen zum Lesen und Analysieren.', cards: [
        ['Was ist ein Algorithmus?', 'Eine endliche Folge präziser Anweisungen zur Lösung eines Problems.'],
        ['Welche Voraussetzung hat die binäre Suche?', 'Die Elemente müssen nach einer bekannten Ordnung sortiert sein.'],
        ['Welche Zeitkomplexität hat die binäre Suche?', 'O(log n) in einer sortierten, indexierbaren Sammlung.'],
        ['In welcher Reihenfolge gibt ein Stapel Elemente zurück?', 'Zuletzt hinein, zuerst hinaus (LIFO).'],
        ['Wozu dient eine Variable?', 'Sie verbindet einen Namen mit einem Wert, der gelesen und eventuell geändert werden kann.'],
        ['Was macht eine Schleife?', 'Sie wiederholt Anweisungen nach einer Bedingung oder einer Anzahl von Durchläufen.'],
      ] },
    },
  },
  it: {
    title: 'Flashcard pronte da studiare', intro: 'Scegli una materia e inizia senza account. Questi mazzi iniziali sono scritti da CramDesk: adatta le carte al tuo corso prima dell’esame.', search: 'Cerca una materia', noResults: 'Nessuna materia corrisponde alla ricerca.', cards: 'carte', start: 'Studia questo mazzo',
    deck: {
      'cell-biology': { title: 'Biologia cellulare', description: 'Strutture e scambi essenziali della cellula.', cards: [
        ['Qual è il ruolo della membrana plasmatica?', 'Delimita la cellula e controlla parte degli scambi con l’ambiente.'],
        ['Cosa contiene soprattutto il nucleo di una cellula eucariote?', 'DNA organizzato in cromosomi.'],
        ['Qual è il ruolo principale dei mitocondri?', 'Producono ATP attraverso la respirazione cellulare.'],
        ['Cosa producono i ribosomi?', 'Proteine usando le informazioni dell’RNA messaggero.'],
        ['Dove avviene la fotosintesi in una cellula vegetale?', 'Nei cloroplasti.'],
        ['Che cos’è l’osmosi?', 'Il movimento dell’acqua attraverso una membrana permeabile all’acqua verso il lato più concentrato in soluti.'],
      ] },
      chemistry: { title: 'Chimica generale', description: 'Atomi, legami, pH e quantità di sostanza.', cards: [
        ['In un atomo neutro, come si confrontano protoni ed elettroni?', 'Sono presenti nello stesso numero.'],
        ['Che cos’è un legame covalente?', 'Un legame in cui gli atomi condividono una o più coppie di elettroni.'],
        ['Che cos’è un legame ionico?', 'L’attrazione elettrostatica tra ioni di carica opposta.'],
        ['A 25 °C, cosa indica un pH inferiore a 7 in una soluzione acquosa?', 'La soluzione è acida.'],
        ['Come si calcola la quantità di sostanza dalla massa?', 'n = m / M, dove m è la massa e M la massa molare.'],
        ['Cosa va conservato nel bilanciare un’equazione chimica?', 'Il numero di atomi di ogni elemento e la carica totale.'],
      ] },
      derivatives: { title: 'Derivate', description: 'Regole di derivazione e interpretazione grafica.', cards: [
        ['Qual è la derivata di xⁿ?', 'n·xⁿ⁻¹ dove la funzione è derivabile.'],
        ['Qual è la derivata di sin(x)?', 'cos(x).'],
        ['Qual è la derivata di eˣ?', 'eˣ.'],
        ['Cosa rappresenta f′(a) sul grafico di f?', 'La pendenza della tangente in x = a.'],
        ['Se f′(x) > 0 in un intervallo, come varia f?', 'È strettamente crescente in quell’intervallo.'],
        ['Qual è la regola della catena per f(g(x))?', 'f′(g(x)) · g′(x).'],
      ] },
      thermodynamics: { title: 'Termodinamica', description: 'Gas ideale, energia e trasformazioni.', cards: [
        ['Come si convertono i °C in kelvin?', 'T(K) = T(°C) + 273,15.'],
        ['Qual è l’equazione del gas ideale?', 'PV = nRT.'],
        ['Quanto vale ΔU per una trasformazione isoterma di un gas ideale?', 'ΔU = 0 perché l’energia interna dipende solo dalla temperatura.'],
        ['Quale relazione P–V vale per una compressione isoterma reversibile di gas ideale?', 'PV = costante.'],
        ['Che cosa significa adiabatico per il calore scambiato?', 'Q = 0: non avvengono scambi di calore con l’esterno.'],
        ['Se W è il lavoro ricevuto dal sistema, qual è il primo principio?', 'ΔU = Q + W. Bisogna dichiarare la convenzione dei segni.'],
      ] },
      economics: { title: 'Economia', description: 'Domanda, offerta e concetti fondamentali.', cards: [
        ['Che cos’è il costo opportunità?', 'Il valore della migliore alternativa a cui si rinuncia scegliendo.'],
        ['A parità delle altre condizioni, cosa accade alla quantità domandata se il prezzo sale?', 'Tende a diminuire.'],
        ['A parità delle altre condizioni, cosa accade alla quantità offerta se il prezzo sale?', 'Tende ad aumentare.'],
        ['Che cos’è l’equilibrio di mercato in un modello semplice?', 'Un prezzo per cui quantità offerta e quantità domandata coincidono.'],
        ['Come si definisce l’elasticità della domanda rispetto al prezzo?', 'Variazione percentuale della quantità domandata divisa per la variazione percentuale del prezzo.'],
        ['Che cos’è l’inflazione?', 'Un aumento generale e persistente del livello dei prezzi.'],
      ] },
      algorithms: { title: 'Algoritmi', description: 'Le basi per leggere e analizzare un algoritmo.', cards: [
        ['Che cos’è un algoritmo?', 'Una sequenza finita di istruzioni precise per risolvere un problema.'],
        ['Quale condizione richiede la ricerca binaria?', 'Gli elementi devono essere ordinati secondo un criterio noto.'],
        ['Qual è la complessità temporale della ricerca binaria?', 'O(log n) in una raccolta ordinata e indicizzabile.'],
        ['Quale ordine segue una pila?', 'Ultimo a entrare, primo a uscire (LIFO).'],
        ['A cosa serve una variabile?', 'Associa un nome a un valore che può essere letto ed eventualmente modificato.'],
        ['Cosa fa un ciclo?', 'Ripete istruzioni in base a una condizione o a un numero di iterazioni.'],
      ] },
    },
  },
  pt: {
    title: 'Flashcards prontas para estudar', intro: 'Escolhe uma matéria e começa sem conta. Estes conjuntos iniciais foram escritos pela CramDesk; adapta os cartões ao teu curso antes do exame.', search: 'Pesquisar matéria', noResults: 'Nenhuma matéria corresponde à pesquisa.', cards: 'cartões', start: 'Estudar este conjunto',
    deck: {
      'cell-biology': { title: 'Biologia celular', description: 'Estruturas e trocas essenciais da célula.', cards: [
        ['Qual é a função da membrana plasmática?', 'Delimita a célula e controla parte das trocas com o ambiente.'],
        ['O que contém principalmente o núcleo de uma célula eucariótica?', 'ADN organizado em cromossomas.'],
        ['Qual é a principal função das mitocôndrias?', 'Produzem ATP através da respiração celular.'],
        ['O que produzem os ribossomas?', 'Proteínas a partir da informação do ARN mensageiro.'],
        ['Onde ocorre a fotossíntese numa célula vegetal?', 'Nos cloroplastos.'],
        ['O que é a osmose?', 'O movimento da água através de uma membrana permeável à água para o lado com mais solutos.'],
      ] },
      chemistry: { title: 'Química geral', description: 'Átomos, ligações, pH e quantidade de matéria.', cards: [
        ['Num átomo neutro, como se comparam protões e eletrões?', 'Existem em igual número.'],
        ['O que é uma ligação covalente?', 'Uma ligação em que os átomos partilham um ou mais pares de eletrões.'],
        ['O que é uma ligação iónica?', 'A atração eletrostática entre iões de cargas opostas.'],
        ['A 25 °C, o que indica um pH inferior a 7 numa solução aquosa?', 'A solução é ácida.'],
        ['Como se calcula a quantidade de matéria a partir da massa?', 'n = m / M, sendo m a massa e M a massa molar.'],
        ['O que se conserva ao acertar uma equação química?', 'O número de átomos de cada elemento e a carga total.'],
      ] },
      derivatives: { title: 'Derivadas', description: 'Regras de derivação e interpretação gráfica.', cards: [
        ['Qual é a derivada de xⁿ?', 'n·xⁿ⁻¹ onde a função é derivável.'],
        ['Qual é a derivada de sin(x)?', 'cos(x).'],
        ['Qual é a derivada de eˣ?', 'eˣ.'],
        ['O que representa f′(a) no gráfico de f?', 'O declive da tangente em x = a.'],
        ['Se f′(x) > 0 num intervalo, como varia f?', 'É estritamente crescente nesse intervalo.'],
        ['Qual é a regra da cadeia para f(g(x))?', 'f′(g(x)) · g′(x).'],
      ] },
      thermodynamics: { title: 'Termodinâmica', description: 'Gás ideal, energia e transformações.', cards: [
        ['Como converter °C em kelvin?', 'T(K) = T(°C) + 273,15.'],
        ['Qual é a equação do gás ideal?', 'PV = nRT.'],
        ['Quanto vale ΔU num processo isotérmico de gás ideal?', 'ΔU = 0, pois a energia interna depende apenas da temperatura.'],
        ['Que relação P–V vale numa compressão isotérmica reversível de gás ideal?', 'PV = constante.'],
        ['O que significa adiabático quanto ao calor trocado?', 'Q = 0: não há troca de calor com o exterior.'],
        ['Se W é o trabalho recebido pelo sistema, qual é a primeira lei?', 'ΔU = Q + W. É preciso indicar esta convenção de sinais.'],
      ] },
      economics: { title: 'Economia', description: 'Oferta, procura e conceitos essenciais.', cards: [
        ['O que é o custo de oportunidade?', 'O valor da melhor alternativa de que se abdica ao escolher.'],
        ['Mantendo tudo o resto constante, o que acontece à quantidade procurada se o preço sobe?', 'Tende a diminuir.'],
        ['Mantendo tudo o resto constante, o que acontece à quantidade oferecida se o preço sobe?', 'Tende a aumentar.'],
        ['O que é o equilíbrio de mercado num modelo simples?', 'Um preço em que a quantidade oferecida iguala a procurada.'],
        ['Como se define a elasticidade-preço da procura?', 'Variação percentual da quantidade procurada dividida pela variação percentual do preço.'],
        ['O que é a inflação?', 'Uma subida geral e persistente do nível de preços.'],
      ] },
      algorithms: { title: 'Algoritmos', description: 'Bases para ler e analisar algoritmos.', cards: [
        ['O que é um algoritmo?', 'Uma sequência finita de instruções precisas para resolver um problema.'],
        ['Qual é a condição necessária para a pesquisa binária?', 'Os elementos têm de estar ordenados segundo um critério conhecido.'],
        ['Qual é a complexidade temporal da pesquisa binária?', 'O(log n) numa coleção ordenada e indexável.'],
        ['Que ordem usa uma pilha?', 'Último a entrar, primeiro a sair (LIFO).'],
        ['Para que serve uma variável?', 'Associa um nome a um valor que pode ser lido e eventualmente alterado.'],
        ['O que faz um ciclo?', 'Repete instruções conforme uma condição ou um número de iterações.'],
      ] },
    },
  },
  zh: {
    title: '打开就能复习的闪卡', intro: '选择学科，无需注册即可开始。这些入门卡组由 CramDesk 编写；考前请结合自己的课程调整内容。', search: '搜索学科', noResults: '没有找到匹配的学科。', cards: '张卡片', start: '复习这套卡片',
    deck: {
      'cell-biology': { title: '细胞生物学', description: '细胞的基本结构和物质交换。', cards: [
        ['质膜有什么作用？', '界定细胞边界，并调控细胞与环境之间的部分物质交换。'],
        ['真核细胞的细胞核主要含有什么？', '组织成染色体的 DNA。'],
        ['线粒体的主要作用是什么？', '通过细胞呼吸产生 ATP。'],
        ['核糖体制造什么？', '根据信使 RNA 携带的信息合成蛋白质。'],
        ['植物细胞中，光合作用在哪里进行？', '在叶绿体中。'],
        ['什么是渗透作用？', '水透过可透水膜，向溶质浓度较高的一侧移动。'],
      ] },
      chemistry: { title: '基础化学', description: '原子、化学键、pH 与物质的量。', cards: [
        ['中性原子的质子数和电子数有什么关系？', '二者相等。'],
        ['什么是共价键？', '原子共享一对或多对电子形成的键。'],
        ['什么是离子键？', '带相反电荷的离子之间的静电吸引。'],
        ['在 25 °C 下，水溶液的 pH 小于 7 表示什么？', '该溶液呈酸性。'],
        ['如何根据质量计算物质的量？', 'n = m / M，其中 m 是质量，M 是摩尔质量。'],
        ['配平化学方程式时必须守恒什么？', '每种元素的原子数以及总电荷。'],
      ] },
      derivatives: { title: '导数', description: '求导规则及其图像意义。', cards: [
        ['xⁿ 的导数是什么？', '在函数可导处为 n·xⁿ⁻¹。'],
        ['sin(x) 的导数是什么？', 'cos(x)。'],
        ['eˣ 的导数是什么？', 'eˣ。'],
        ['在 f 的图像上，f′(a) 表示什么？', 'x = a 处切线的斜率。'],
        ['如果某区间内 f′(x) > 0，f 如何变化？', 'f 在该区间严格递增。'],
        ['复合函数 f(g(x)) 的链式法则是什么？', 'f′(g(x)) · g′(x)。'],
      ] },
      thermodynamics: { title: '热力学', description: '理想气体、能量与状态变化。', cards: [
        ['如何把摄氏温度换算为开尔文？', 'T(K) = T(°C) + 273.15。'],
        ['理想气体状态方程是什么？', 'PV = nRT。'],
        ['理想气体等温过程中的 ΔU 是多少？', 'ΔU = 0，因为其内能只取决于温度。'],
        ['理想气体可逆等温压缩满足什么 P–V 关系？', 'PV = 常量。'],
        ['绝热过程的热交换量是多少？', 'Q = 0：系统与外界不交换热量。'],
        ['若 W 表示系统吸收的功，热力学第一定律如何写？', 'ΔU = Q + W。必须先说明功的符号约定。'],
      ] },
      economics: { title: '经济学', description: '供给、需求与基本分析概念。', cards: [
        ['什么是机会成本？', '做出选择时放弃的最佳替代方案的价值。'],
        ['其他条件不变，价格上涨通常如何影响需求量？', '需求量倾向于下降。'],
        ['其他条件不变，价格上涨通常如何影响供给量？', '供给量倾向于上升。'],
        ['简单模型中的市场均衡是什么？', '某一价格下供给量与需求量相等。'],
        ['需求价格弹性如何定义？', '需求量的百分比变化除以价格的百分比变化。'],
        ['什么是通货膨胀？', '总体价格水平持续、普遍上涨。'],
      ] },
      algorithms: { title: '算法基础', description: '阅读和分析算法的基本概念。', cards: [
        ['什么是算法？', '用于解决问题的有限且明确的指令序列。'],
        ['二分查找需要满足什么前提？', '元素必须按已知顺序排好。'],
        ['二分查找的时间复杂度是多少？', '在可索引的有序集合中为 O(log n)。'],
        ['栈遵循什么进出顺序？', '后进先出（LIFO）。'],
        ['变量有什么作用？', '把名称与一个可读取、可能可修改的值关联起来。'],
        ['循环做什么？', '按条件或指定次数重复执行指令。'],
      ] },
    },
  },
  ja: {
    title: 'すぐに学べるフラッシュカード', intro: '科目を選べば、登録せずに始められます。入門用のカードは CramDesk が作成しました。試験前に自分の授業に合わせて調整してください。', search: '科目を検索', noResults: '一致する科目はありません。', cards: '枚のカード', start: 'このセットで学ぶ',
    deck: {
      'cell-biology': { title: '細胞生物学', description: '細胞の基本構造と物質の移動。', cards: [
        ['細胞膜の役割は何ですか？', '細胞の境界を作り、周囲との物質のやり取りの一部を調節します。'],
        ['真核細胞の核には主に何が含まれますか？', '染色体として構成された DNA です。'],
        ['ミトコンドリアの主な役割は何ですか？', '細胞呼吸によって ATP を作ることです。'],
        ['リボソームは何を作りますか？', 'メッセンジャー RNA の情報に基づいてタンパク質を作ります。'],
        ['植物細胞では光合成はどこで行われますか？', '葉緑体です。'],
        ['浸透とは何ですか？', '水が透過できる膜を通り、溶質濃度の高い側へ移動することです。'],
      ] },
      chemistry: { title: '基礎化学', description: '原子、結合、pH、物質量。', cards: [
        ['電気的に中性な原子では、陽子と電子の数はどうなりますか？', '同じ数です。'],
        ['共有結合とは何ですか？', '原子が一組以上の電子対を共有してできる結合です。'],
        ['イオン結合とは何ですか？', '反対の電荷を持つイオン間の静電気的な引力です。'],
        ['25 °C で水溶液の pH が 7 未満なら何を示しますか？', '酸性であることを示します。'],
        ['質量から物質量をどう計算しますか？', 'n = m / M。m は質量、M はモル質量です。'],
        ['化学反応式を合わせる際、何を保存しますか？', '各元素の原子数と全電荷です。'],
      ] },
      derivatives: { title: '導関数', description: '微分の公式とグラフ上の意味。', cards: [
        ['xⁿ の導関数は何ですか？', '微分可能なところで n·xⁿ⁻¹ です。'],
        ['sin(x) の導関数は何ですか？', 'cos(x) です。'],
        ['eˣ の導関数は何ですか？', 'eˣ です。'],
        ['f のグラフで f′(a) は何を表しますか？', 'x = a における接線の傾きです。'],
        ['ある区間で f′(x) > 0 なら、f はどう変化しますか？', 'その区間で狭義単調増加します。'],
        ['f(g(x)) の連鎖律は何ですか？', 'f′(g(x)) · g′(x) です。'],
      ] },
      thermodynamics: { title: '熱力学', description: '理想気体、エネルギー、状態変化。', cards: [
        ['摂氏温度をケルビンにどう変換しますか？', 'T(K) = T(°C) + 273.15 です。'],
        ['理想気体の状態方程式は何ですか？', 'PV = nRT です。'],
        ['理想気体の等温過程で ΔU はいくつですか？', 'ΔU = 0。内部エネルギーは温度だけに依存するためです。'],
        ['理想気体の可逆等温圧縮では、P と V にどんな関係がありますか？', 'PV = 一定です。'],
        ['断熱過程では熱の出入り Q はいくつですか？', 'Q = 0。周囲との熱交換はありません。'],
        ['W を系が受け取る仕事とすると、熱力学第一法則は？', 'ΔU = Q + W です。仕事の符号規約を明示します。'],
      ] },
      economics: { title: '経済学', description: '需要、供給、基本的な考え方。', cards: [
        ['機会費用とは何ですか？', 'ある選択によって諦めた最良の代替案の価値です。'],
        ['他の条件が同じとき、価格上昇は需要量にどう影響しますか？', '需要量は減少する傾向があります。'],
        ['他の条件が同じとき、価格上昇は供給量にどう影響しますか？', '供給量は増加する傾向があります。'],
        ['単純なモデルで市場均衡とは何ですか？', '供給量と需要量が等しくなる価格の状態です。'],
        ['需要の価格弾力性はどう定義されますか？', '需要量の変化率を価格の変化率で割ったものです。'],
        ['インフレとは何ですか？', '全般的な物価水準が持続して上昇することです。'],
      ] },
      algorithms: { title: 'アルゴリズム', description: 'アルゴリズムを読み解くための基礎。', cards: [
        ['アルゴリズムとは何ですか？', '問題を解くための、有限で明確な手順の列です。'],
        ['二分探索を使う前提条件は何ですか？', '要素が既知の順序で並んでいることです。'],
        ['二分探索の時間計算量は何ですか？', '添字で参照できる整列済みの集合なら O(log n) です。'],
        ['スタックの取り出し順序は何ですか？', '後入れ先出し（LIFO）です。'],
        ['変数は何のために使いますか？', '名前と、読み出しや変更が可能な値を対応させるためです。'],
        ['ループは何をしますか？', '条件や指定回数に従って命令を繰り返します。'],
      ] },
    },
  },
  ar: {
    title: 'بطاقات جاهزة للمذاكرة', intro: 'اختر مادة وابدأ دون حساب. أعدّت CramDesk هذه المجموعات التمهيدية؛ عدّل البطاقات وفق مقررك قبل الامتحان.', search: 'ابحث عن مادة', noResults: 'لا توجد مواد تطابق بحثك.', cards: 'بطاقات', start: 'ذاكر هذه المجموعة',
    deck: {
      'cell-biology': { title: 'علم الخلية', description: 'بنية الخلية الأساسية وتبادل المواد.', cards: [
        ['ما وظيفة الغشاء البلازمي؟', 'يحدد حدود الخلية وينظم بعض التبادلات بينها وبين محيطها.'],
        ['ماذا تحتوي نواة الخلية حقيقية النواة أساسًا؟', 'الحمض النووي DNA المنظم في كروموسومات.'],
        ['ما الدور الرئيسي للميتوكوندريا؟', 'إنتاج ATP عن طريق التنفس الخلوي.'],
        ['ماذا تصنع الريبوسومات؟', 'البروتينات اعتمادًا على معلومات الحمض النووي الريبي الرسول.'],
        ['أين يحدث البناء الضوئي في الخلية النباتية؟', 'في البلاستيدات الخضراء.'],
        ['ما التناضح؟', 'انتقال الماء عبر غشاء منفذ للماء نحو الجهة الأعلى تركيزًا بالمواد المذابة.'],
      ] },
      chemistry: { title: 'الكيمياء العامة', description: 'الذرات والروابط والأس الهيدروجيني وكمية المادة.', cards: [
        ['في الذرة المتعادلة، ما العلاقة بين عدد البروتونات والإلكترونات؟', 'العددان متساويان.'],
        ['ما الرابطة التساهمية؟', 'رابطة تتشارك فيها الذرات زوجًا أو أكثر من الإلكترونات.'],
        ['ما الرابطة الأيونية؟', 'تجاذب كهربائي ساكن بين أيونات متعاكسة الشحنة.'],
        ['عند 25 °م، ماذا يعني أن pH محلول مائي أقل من 7؟', 'المحلول حمضي.'],
        ['كيف تحسب كمية المادة من الكتلة؟', 'n = m / M؛ حيث m الكتلة وM الكتلة المولية.'],
        ['ما الذي يجب حفظه عند موازنة معادلة كيميائية؟', 'عدد ذرات كل عنصر والشحنة الكلية.'],
      ] },
      derivatives: { title: 'المشتقات', description: 'قواعد الاشتقاق ومعناها البياني.', cards: [
        ['ما مشتقة xⁿ؟', 'n·xⁿ⁻¹ حيث تكون الدالة قابلة للاشتقاق.'],
        ['ما مشتقة sin(x)؟', 'cos(x).'],
        ['ما مشتقة eˣ؟', 'eˣ.'],
        ['ماذا تمثل f′(a) على منحنى f؟', 'ميل المماس عند x = a.'],
        ['إذا كانت f′(x) > 0 على مجال، فكيف تتغير f؟', 'تكون متزايدة تمامًا على ذلك المجال.'],
        ['ما قاعدة السلسلة للدالة f(g(x))؟', 'f′(g(x)) · g′(x).'],
      ] },
      thermodynamics: { title: 'الديناميكا الحرارية', description: 'الغاز المثالي والطاقة والتحولات.', cards: [
        ['كيف تحول الدرجة المئوية إلى كلفن؟', 'T(K) = T(°C) + 273.15.'],
        ['ما معادلة حالة الغاز المثالي؟', 'PV = nRT.'],
        ['كم يساوي ΔU في تحول متساوي الحرارة لغاز مثالي؟', 'ΔU = 0 لأن الطاقة الداخلية تعتمد على درجة الحرارة فقط.'],
        ['ما علاقة P وV في ضغط عكوس متساوي الحرارة لغاز مثالي؟', 'PV = ثابت.'],
        ['ماذا يعني تحول أديباتي بالنسبة للحرارة المتبادلة؟', 'Q = 0: لا يحدث تبادل حراري مع الوسط الخارجي.'],
        ['إذا كان W هو الشغل الذي يتلقاه النظام، فما القانون الأول؟', 'ΔU = Q + W. يجب توضيح اصطلاح الإشارة.'],
      ] },
      economics: { title: 'الاقتصاد', description: 'العرض والطلب ومفاهيم التحليل الأساسية.', cards: [
        ['ما تكلفة الفرصة البديلة؟', 'قيمة أفضل بديل نتخلى عنه عند اتخاذ قرار.'],
        ['مع ثبات العوامل الأخرى، كيف يؤثر ارتفاع السعر في الكمية المطلوبة؟', 'تميل إلى الانخفاض.'],
        ['مع ثبات العوامل الأخرى، كيف يؤثر ارتفاع السعر في الكمية المعروضة؟', 'تميل إلى الارتفاع.'],
        ['ما توازن السوق في نموذج بسيط؟', 'سعر تتساوى عنده الكمية المعروضة والكمية المطلوبة.'],
        ['كيف تُعرّف مرونة الطلب السعرية؟', 'التغير النسبي في الكمية المطلوبة مقسومًا على التغير النسبي في السعر.'],
        ['ما التضخم؟', 'ارتفاع عام ومستمر في مستوى الأسعار.'],
      ] },
      algorithms: { title: 'الخوارزميات', description: 'أساسيات قراءة الخوارزميات وتحليلها.', cards: [
        ['ما الخوارزمية؟', 'سلسلة محدودة من تعليمات دقيقة لحل مشكلة.'],
        ['ما شرط استخدام البحث الثنائي؟', 'أن تكون العناصر مرتبة وفق ترتيب معروف.'],
        ['ما التعقيد الزمني للبحث الثنائي؟', 'O(log n) في مجموعة مرتبة يمكن الوصول إلى عناصرها بالفهرس.'],
        ['ما ترتيب إخراج العناصر من المكدس؟', 'الأخير دخولًا هو الأول خروجًا (LIFO).'],
        ['ما فائدة المتغير؟', 'ربط اسم بقيمة يمكن قراءتها وربما تعديلها.'],
        ['ماذا تفعل الحلقة التكرارية؟', 'تكرر التعليمات وفق شرط أو عدد محدد من المرات.'],
      ] },
    },
  },
}

export const curatedDeckCopy: Record<StudyPdfLocale, LocaleContent> = Object.fromEntries(STUDY_PDF_LOCALES.map(locale => {
  const base = baseCuratedDeckCopy[locale]
  const expansion = curatedDeckExpansions[locale]
  const extend = (id: BaseDeckId): Deck => ({ ...base.deck[id], cards: [...base.deck[id].cards, ...expansion.extra[id]] })
  const deck: Record<BaseDeckId, Deck> = {
    'cell-biology': extend('cell-biology'), chemistry: extend('chemistry'), derivatives: extend('derivatives'),
    thermodynamics: extend('thermodynamics'), economics: extend('economics'), algorithms: extend('algorithms'),
  }
  return [locale, { ...base, deck: { ...deck, ...expansion.specialties, ...medicalDecks[locale] } }]
})) as Record<StudyPdfLocale, LocaleContent>

for (const locale of STUDY_PDF_LOCALES) {
  for (const id of CURATED_DECK_IDS) {
    const cards = curatedDeckCopy[locale].deck[id].cards
    if (cards.length !== 20 || new Set(cards.map(([question]) => question)).size !== cards.length ||
      cards.some(([question, answer]) => !question.trim() || !answer.trim() || question.length > 280 || answer.length > 600)) {
      throw new Error(`Invalid curated deck: ${locale}/${id}`)
    }
  }
}

export function freeFlashcardsPath(locale: StudyPdfLocale) {
  return locale === 'fr' ? '/flashcards-gratuites' : `/${locale}/free-flashcards`
}

export function curatedDeckPath(locale: StudyPdfLocale, id: CuratedDeckId) {
  return `${freeFlashcardsPath(locale)}/${id}`
}

export function freeFlashcardsAlternates() {
  return Object.fromEntries((['fr', 'en', 'es', 'de', 'it', 'pt', 'zh', 'ja', 'ar'] as const).map(locale => [locale, freeFlashcardsPath(locale)]))
}

export function curatedDeckAlternates(id: CuratedDeckId) {
  return Object.fromEntries((['fr', 'en', 'es', 'de', 'it', 'pt', 'zh', 'ja', 'ar'] as const).map(locale => [locale, curatedDeckPath(locale, id)]))
}
