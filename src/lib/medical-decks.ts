import { STUDY_PDF_LOCALES, type StudyPdfLocale } from '@/lib/study-pdf-locales'

export const MEDICAL_DECK_IDS = ['human-anatomy', 'human-physiology'] as const
export type MedicalDeckId = typeof MEDICAL_DECK_IDS[number]
type Card = readonly [string, string]

export function medicalFlashcardsPath(locale: StudyPdfLocale) {
  return locale === 'fr' ? '/flashcards-medecine' : `/${locale}/medical-flashcards`
}

export function medicalFlashcardsAlternates() {
  return Object.fromEntries(STUDY_PDF_LOCALES.map(locale => [locale, medicalFlashcardsPath(locale)]))
}

type MedicalLocale = {
  title: Record<MedicalDeckId, string>
  description: Record<MedicalDeckId, string>
  question: (id: MedicalDeckId, term: string) => string
  terms: Record<MedicalDeckId, string>
}

// Original, introductory study prompts. They deliberately avoid diagnosis,
// treatment and course-specific clinical thresholds.
const copy: Record<StudyPdfLocale, MedicalLocale> = {
  fr: {
    title: { 'human-anatomy': 'Anatomie humaine', 'human-physiology': 'Physiologie humaine' },
    description: { 'human-anatomy': 'Cœur, poumons, rein et système nerveux : les structures à situer.', 'human-physiology': 'Circulation, respiration, rein et régulation : les mécanismes à expliquer.' },
    question: (id, term) => id === 'human-anatomy' ? `Quel est le rôle de « ${term} » ?` : `Comment définir « ${term} » ?`,
    terms: {
      'human-anatomy': `Oreillette droite|Reçoit le sang veineux de la circulation générale.
Ventricule droit|Propulse le sang vers les poumons par l’artère pulmonaire.
Oreillette gauche|Reçoit le sang oxygéné qui revient des poumons.
Ventricule gauche|Propulse le sang dans la circulation générale par l’aorte.
Valve mitrale|Sépare l’oreillette gauche du ventricule gauche et limite le reflux.
Aorte|Distribue le sang issu du ventricule gauche vers l’organisme.
Artère pulmonaire|Conduit le sang du ventricule droit vers les poumons.
Veines pulmonaires|Ramènent le sang oxygéné des poumons à l’oreillette gauche.
Alvéoles pulmonaires|Lieu principal des échanges de gaz entre l’air et le sang.
Diaphragme|Muscle majeur de l’inspiration ; sa contraction augmente le volume thoracique.
Trachée|Conduit l’air vers les bronches.
Néphron|Unité fonctionnelle du rein qui filtre puis modifie le filtrat.
Glomérule|Réseau de capillaires où commence la filtration du plasma.
Uretère|Conduit l’urine du rein vers la vessie.
Encéphale|Intègre des informations et coordonne de nombreuses fonctions ; il comprend cerveau, cervelet et tronc cérébral.
Cervelet|Participe à la coordination des mouvements et à l’équilibre.
Moelle épinière|Transmet des signaux entre l’encéphale et le corps et intègre des réflexes.
Synapse|Zone de communication entre deux cellules excitables.
Tendon|Relie généralement un muscle à un os.
Foie|Produit la bile et participe au métabolisme et au stockage de substances.`,
      'human-physiology': `Homéostasie|Maintien dynamique de certaines variables internes dans des plages compatibles avec la vie.
Rétrocontrôle négatif|Une variation déclenche une réponse qui tend à s’opposer à cette variation.
Nœud sinusal|Initie normalement les impulsions électriques qui rythment le cœur.
Systole ventriculaire|Phase de contraction des ventricules qui éjectent le sang.
Diastole ventriculaire|Phase de relâchement pendant laquelle les ventricules se remplissent.
Débit cardiaque|Volume de sang pompé par un ventricule par minute : fréquence × volume d’éjection.
Ventilation pulmonaire|Mouvement d’air entrant et sortant des poumons.
Diffusion alvéolaire|Déplacement d’O₂ et de CO₂ selon leurs gradients de pression partielle.
Hémoglobine|Protéine des globules rouges qui transporte la majeure partie de l’O₂ sanguin.
Filtration glomérulaire|Passage d’eau et de petits solutés du sang vers la capsule rénale.
Réabsorption tubulaire|Retour de substances du filtrat rénal vers le sang.
ADH|Hormone qui favorise la réabsorption d’eau par le rein.
Insuline|Hormone qui favorise notamment l’entrée du glucose dans certains tissus et son stockage.
Glucagon|Hormone qui stimule notamment la libération de glucose par le foie.
Potentiel d’action|Variation brève du potentiel de membrane qui se propage dans une cellule excitable.
Dépolarisation|Diminution de la différence de potentiel à travers la membrane.
Système sympathique|Branche autonome qui prépare notamment l’organisme à l’action.
Système parasympathique|Branche autonome qui favorise notamment les fonctions de repos et de digestion.
Équilibre acido-basique|Régulation de la concentration en ions H⁺ et donc du pH des liquides biologiques.
Osmolarité plasmatique|Concentration totale de particules osmotiquement actives dans le plasma.`,
    },
  },
  en: {
    title: { 'human-anatomy': 'Human anatomy', 'human-physiology': 'Human physiology' },
    description: { 'human-anatomy': 'Locate essential structures in the heart, lungs, kidneys and nervous system.', 'human-physiology': 'Explain circulation, breathing, kidney function and regulation.' },
    question: (id, term) => id === 'human-anatomy' ? `What does “${term}” do?` : `How do you define “${term}”?`,
    terms: {
      'human-anatomy': `Right atrium|Receives venous blood returning from the systemic circulation.
Right ventricle|Pumps blood toward the lungs through the pulmonary artery.
Left atrium|Receives oxygenated blood returning from the lungs.
Left ventricle|Pumps blood into the systemic circulation through the aorta.
Mitral valve|Separates the left atrium and ventricle and limits backflow.
Aorta|Distributes blood from the left ventricle to the body.
Pulmonary artery|Carries blood from the right ventricle to the lungs.
Pulmonary veins|Return oxygenated blood from the lungs to the left atrium.
Pulmonary alveoli|Main sites of gas exchange between air and blood.
Diaphragm|Main inspiratory muscle; contraction increases thoracic volume.
Trachea|Conducts air toward the bronchi.
Nephron|Functional kidney unit that filters and then modifies filtrate.
Glomerulus|Capillary network where plasma filtration begins.
Ureter|Carries urine from a kidney to the bladder.
Encephalon|Integrates information and coordinates many functions; it includes the cerebrum, cerebellum and brainstem.
Cerebellum|Helps coordinate movement and balance.
Spinal cord|Carries signals between brain and body and integrates reflexes.
Synapse|Communication site between excitable cells.
Tendon|Usually connects a muscle to a bone.
Liver|Produces bile and participates in metabolism and storage.`,
      'human-physiology': `Homeostasis|Dynamic maintenance of internal variables within ranges compatible with life.
Negative feedback|A change triggers a response that tends to oppose that change.
Sinoatrial node|Normally initiates the electrical impulses that set heart rhythm.
Ventricular systole|Contraction phase when the ventricles eject blood.
Ventricular diastole|Relaxation phase when the ventricles fill.
Cardiac output|Blood volume pumped by one ventricle per minute: heart rate × stroke volume.
Pulmonary ventilation|Movement of air into and out of the lungs.
Alveolar diffusion|Movement of O₂ and CO₂ along partial-pressure gradients.
Hemoglobin|Red-cell protein that carries most oxygen in the blood.
Glomerular filtration|Movement of water and small solutes from blood into the renal capsule.
Tubular reabsorption|Return of substances from kidney filtrate to blood.
ADH|Hormone that promotes kidney water reabsorption.
Insulin|Hormone that promotes glucose uptake in some tissues and its storage.
Glucagon|Hormone that promotes glucose release by the liver.
Action potential|Brief change in membrane potential that propagates in an excitable cell.
Depolarization|Decrease in the electrical potential difference across a membrane.
Sympathetic system|Autonomic branch that helps prepare the body for action.
Parasympathetic system|Autonomic branch that supports rest and digestion.
Acid–base balance|Regulation of H⁺ concentration and thus pH in body fluids.
Plasma osmolarity|Total concentration of osmotically active particles in plasma.`,
    },
  },
  es: {
    title: { 'human-anatomy': 'Anatomía humana', 'human-physiology': 'Fisiología humana' },
    description: { 'human-anatomy': 'Sitúa las estructuras esenciales del corazón, los pulmones, el riñón y el sistema nervioso.', 'human-physiology': 'Explica circulación, respiración, función renal y regulación.' },
    question: (id, term) => id === 'human-anatomy' ? `¿Qué función tiene «${term}»?` : `¿Cómo defines «${term}»?`,
    terms: {
      'human-anatomy': `Aurícula derecha|Recibe la sangre venosa que vuelve de la circulación general.
Ventrículo derecho|Impulsa sangre a los pulmones por la arteria pulmonar.
Aurícula izquierda|Recibe la sangre oxigenada que vuelve de los pulmones.
Ventrículo izquierdo|Impulsa sangre a la circulación general por la aorta.
Válvula mitral|Separa aurícula y ventrículo izquierdos y limita el reflujo.
Aorta|Distribuye la sangre del ventrículo izquierdo al organismo.
Arteria pulmonar|Lleva sangre del ventrículo derecho a los pulmones.
Venas pulmonares|Devuelven sangre oxigenada de los pulmones a la aurícula izquierda.
Alvéolos pulmonares|Lugar principal del intercambio gaseoso entre aire y sangre.
Diafragma|Principal músculo inspiratorio; al contraerse aumenta el volumen torácico.
Tráquea|Conduce el aire hacia los bronquios.
Nefrona|Unidad funcional renal que filtra y después modifica el filtrado.
Glomérulo|Red capilar donde comienza la filtración del plasma.
Uréter|Lleva la orina del riñón a la vejiga.
Encéfalo|Integra información y coordina muchas funciones; incluye cerebro, cerebelo y tronco encefálico.
Cerebelo|Ayuda a coordinar el movimiento y el equilibrio.
Médula espinal|Transmite señales entre encéfalo y cuerpo e integra reflejos.
Sinapsis|Zona de comunicación entre células excitables.
Tendón|Suele unir un músculo a un hueso.
Hígado|Produce bilis y participa en el metabolismo y el almacenamiento.`,
      'human-physiology': `Homeostasis|Mantenimiento dinámico de variables internas dentro de rangos compatibles con la vida.
Retroalimentación negativa|Un cambio provoca una respuesta que tiende a oponerse a él.
Nodo sinoauricular|Inicia normalmente los impulsos eléctricos que marcan el ritmo cardíaco.
Sístole ventricular|Contracción de los ventrículos que expulsa la sangre.
Diástole ventricular|Relajación durante la que se llenan los ventrículos.
Gasto cardíaco|Volumen bombeado por un ventrículo por minuto: frecuencia × volumen sistólico.
Ventilación pulmonar|Movimiento de aire que entra y sale de los pulmones.
Difusión alveolar|Movimiento de O₂ y CO₂ según gradientes de presión parcial.
Hemoglobina|Proteína de los eritrocitos que transporta la mayor parte del O₂ sanguíneo.
Filtración glomerular|Paso de agua y solutos pequeños de la sangre a la cápsula renal.
Reabsorción tubular|Retorno de sustancias del filtrado renal a la sangre.
ADH|Hormona que favorece la reabsorción renal de agua.
Insulina|Hormona que favorece la entrada de glucosa en ciertos tejidos y su almacenamiento.
Glucagón|Hormona que favorece la liberación de glucosa por el hígado.
Potencial de acción|Cambio breve del potencial de membrana que se propaga en una célula excitable.
Despolarización|Disminución de la diferencia de potencial a través de la membrana.
Sistema simpático|Rama autónoma que ayuda a preparar el organismo para la acción.
Sistema parasimpático|Rama autónoma que favorece el reposo y la digestión.
Equilibrio ácido-base|Regulación de la concentración de H⁺ y del pH de los líquidos corporales.
Osmolaridad plasmática|Concentración total de partículas osmóticamente activas en el plasma.`,
    },
  },
  de: {
    title: { 'human-anatomy': 'Anatomie des Menschen', 'human-physiology': 'Physiologie des Menschen' },
    description: { 'human-anatomy': 'Wichtige Strukturen von Herz, Lunge, Niere und Nervensystem zuordnen.', 'human-physiology': 'Kreislauf, Atmung, Nierenfunktion und Regulation erklären.' },
    question: (id, term) => id === 'human-anatomy' ? `Welche Funktion hat „${term}“?` : `Wie definierst du „${term}“?`,
    terms: {
      'human-anatomy': `Rechter Vorhof|Nimmt venöses Blut aus dem Körperkreislauf auf.
Rechte Herzkammer|Pumpt Blut über die Lungenarterie zur Lunge.
Linker Vorhof|Nimmt sauerstoffreiches Blut aus der Lunge auf.
Linke Herzkammer|Pumpt Blut über die Aorta in den Körperkreislauf.
Mitralklappe|Trennt linken Vorhof und linke Kammer und begrenzt den Rückfluss.
Aorta|Verteilt Blut aus der linken Herzkammer im Körper.
Lungenarterie|Führt Blut aus der rechten Herzkammer zur Lunge.
Lungenvenen|Führen sauerstoffreiches Blut zum linken Vorhof zurück.
Lungenbläschen|Wichtigster Ort des Gasaustauschs zwischen Luft und Blut.
Zwerchfell|Wichtigster Atemmuskel; seine Kontraktion vergrößert den Brustraum.
Luftröhre|Leitet Luft zu den Bronchien.
Nephron|Funktionseinheit der Niere; filtert und verändert den Harnvorläufer.
Glomerulus|Kapillarnetz, in dem die Plasmafiltration beginnt.
Harnleiter|Transportiert Urin von der Niere zur Blase.
Enzephalon|Verarbeitet Informationen und koordiniert viele Funktionen; umfasst Großhirn, Kleinhirn und Hirnstamm.
Kleinhirn|Hilft bei Bewegungskoordination und Gleichgewicht.
Rückenmark|Leitet Signale zwischen Gehirn und Körper und verschaltet Reflexe.
Synapse|Kontaktstelle zur Kommunikation zwischen erregbaren Zellen.
Sehne|Verbindet meist einen Muskel mit einem Knochen.
Leber|Produziert Galle und ist an Stoffwechsel und Speicherung beteiligt.`,
      'human-physiology': `Homöostase|Dynamische Erhaltung innerer Größen in lebensverträglichen Bereichen.
Negative Rückkopplung|Eine Änderung löst eine Gegenreaktion aus.
Sinusknoten|Löst normalerweise die elektrischen Impulse für den Herzrhythmus aus.
Ventrikuläre Systole|Kontraktionsphase, in der die Herzkammern Blut auswerfen.
Ventrikuläre Diastole|Entspannungsphase, in der sich die Kammern füllen.
Herzzeitvolumen|Von einer Kammer pro Minute gepumptes Blut: Frequenz × Schlagvolumen.
Lungenventilation|Bewegung der Luft in die Lunge und aus ihr heraus.
Alveoläre Diffusion|Bewegung von O₂ und CO₂ entlang ihrer Partialdruckgefälle.
Hämoglobin|Protein in roten Blutzellen, das den Großteil des O₂ transportiert.
Glomeruläre Filtration|Übertritt von Wasser und kleinen gelösten Stoffen in die Nierenkapsel.
Tubuläre Rückresorption|Rücktransport von Stoffen aus dem Filtrat ins Blut.
ADH|Hormon, das die Wasserrückresorption in der Niere fördert.
Insulin|Hormon, das die Glukoseaufnahme mancher Gewebe und die Speicherung fördert.
Glukagon|Hormon, das die Glukosefreisetzung durch die Leber fördert.
Aktionspotenzial|Kurze Änderung des Membranpotenzials, die sich in einer erregbaren Zelle fortpflanzt.
Depolarisation|Abnahme der Potenzialdifferenz über einer Membran.
Sympathikus|Autonomer Anteil, der den Körper unter anderem auf Aktivität vorbereitet.
Parasympathikus|Autonomer Anteil, der Ruhe und Verdauung unterstützt.
Säure-Basen-Gleichgewicht|Regulation der H⁺-Konzentration und des pH in Körperflüssigkeiten.
Plasmaosmolarität|Gesamtkonzentration osmotisch wirksamer Teilchen im Plasma.`,
    },
  },
  it: {
    title: { 'human-anatomy': 'Anatomia umana', 'human-physiology': 'Fisiologia umana' },
    description: { 'human-anatomy': 'Individua le strutture essenziali di cuore, polmoni, rene e sistema nervoso.', 'human-physiology': 'Spiega circolazione, respirazione, rene e regolazione.' },
    question: (id, term) => id === 'human-anatomy' ? `Qual è la funzione di «${term}»?` : `Come definisci «${term}»?`,
    terms: {
      'human-anatomy': `Atrio destro|Riceve il sangue venoso che torna dalla circolazione sistemica.
Ventricolo destro|Pompa il sangue ai polmoni tramite l’arteria polmonare.
Atrio sinistro|Riceve il sangue ossigenato di ritorno dai polmoni.
Ventricolo sinistro|Pompa il sangue nella circolazione sistemica attraverso l’aorta.
Valvola mitrale|Separa atrio e ventricolo sinistri e limita il reflusso.
Aorta|Distribuisce al corpo il sangue proveniente dal ventricolo sinistro.
Arteria polmonare|Porta il sangue dal ventricolo destro ai polmoni.
Vene polmonari|Riportano sangue ossigenato dai polmoni all’atrio sinistro.
Alveoli polmonari|Principale sede degli scambi gassosi tra aria e sangue.
Diaframma|Principale muscolo inspiratorio; contraendosi aumenta il volume toracico.
Trachea|Conduce l’aria verso i bronchi.
Nefrone|Unità funzionale del rene che filtra e modifica il filtrato.
Glomerulo|Rete capillare in cui inizia la filtrazione del plasma.
Uretere|Porta l’urina dal rene alla vescica.
Encefalo|Integra informazioni e coordina molte funzioni; comprende cervello, cervelletto e tronco encefalico.
Cervelletto|Aiuta a coordinare i movimenti e l’equilibrio.
Midollo spinale|Trasmette segnali tra encefalo e corpo e integra riflessi.
Sinapsi|Sede di comunicazione tra cellule eccitabili.
Tendine|Collega di solito un muscolo a un osso.
Fegato|Produce la bile e partecipa a metabolismo e deposito.`,
      'human-physiology': `Omeostasi|Mantenimento dinamico delle variabili interne entro intervalli compatibili con la vita.
Feedback negativo|Un cambiamento provoca una risposta che tende a contrastarlo.
Nodo senoatriale|Avvia normalmente gli impulsi elettrici che scandiscono il ritmo cardiaco.
Sistole ventricolare|Contrazione dei ventricoli che espellono il sangue.
Diastole ventricolare|Rilassamento durante il quale i ventricoli si riempiono.
Gittata cardiaca|Volume pompato da un ventricolo al minuto: frequenza × gittata sistolica.
Ventilazione polmonare|Movimento dell’aria dentro e fuori dai polmoni.
Diffusione alveolare|Movimento di O₂ e CO₂ lungo i rispettivi gradienti di pressione parziale.
Emoglobina|Proteina dei globuli rossi che trasporta gran parte dell’O₂ nel sangue.
Filtrazione glomerulare|Passaggio di acqua e piccoli soluti dal sangue alla capsula renale.
Riassorbimento tubulare|Ritorno di sostanze dal filtrato renale al sangue.
ADH|Ormone che favorisce il riassorbimento renale di acqua.
Insulina|Ormone che favorisce l’ingresso del glucosio in alcuni tessuti e il suo deposito.
Glucagone|Ormone che favorisce il rilascio di glucosio da parte del fegato.
Potenziale d’azione|Breve variazione del potenziale di membrana che si propaga in una cellula eccitabile.
Depolarizzazione|Riduzione della differenza di potenziale attraverso la membrana.
Sistema simpatico|Ramo autonomo che prepara l’organismo all’azione.
Sistema parasimpatico|Ramo autonomo che favorisce riposo e digestione.
Equilibrio acido-base|Regolazione della concentrazione di H⁺ e del pH dei liquidi corporei.
Osmolarità plasmatica|Concentrazione totale delle particelle osmoticamente attive nel plasma.`,
    },
  },
  pt: {
    title: { 'human-anatomy': 'Anatomia humana', 'human-physiology': 'Fisiologia humana' },
    description: { 'human-anatomy': 'Identifica estruturas essenciais do coração, pulmões, rim e sistema nervoso.', 'human-physiology': 'Explica circulação, respiração, função renal e regulação.' },
    question: (id, term) => id === 'human-anatomy' ? `Qual é a função de «${term}»?` : `Como defines «${term}»?`,
    terms: {
      'human-anatomy': `Átrio direito|Recebe sangue venoso que regressa da circulação sistémica.
Ventrículo direito|Bombeia sangue para os pulmões pela artéria pulmonar.
Átrio esquerdo|Recebe sangue oxigenado que regressa dos pulmões.
Ventrículo esquerdo|Bombeia sangue para a circulação sistémica pela aorta.
Válvula mitral|Separa átrio e ventrículo esquerdos e limita o refluxo.
Aorta|Distribui pelo corpo sangue vindo do ventrículo esquerdo.
Artéria pulmonar|Leva sangue do ventrículo direito aos pulmões.
Veias pulmonares|Trazem sangue oxigenado dos pulmões ao átrio esquerdo.
Alvéolos pulmonares|Principal local de troca gasosa entre ar e sangue.
Diafragma|Principal músculo inspiratório; a contração aumenta o volume torácico.
Traqueia|Conduz o ar até aos brônquios.
Néfron|Unidade funcional do rim que filtra e modifica o filtrado.
Glomérulo|Rede capilar onde começa a filtração do plasma.
Ureter|Leva urina do rim até à bexiga.
Encéfalo|Integra informação e coordena muitas funções; inclui cérebro, cerebelo e tronco cerebral.
Cerebelo|Ajuda a coordenar os movimentos e o equilíbrio.
Medula espinal|Transmite sinais entre encéfalo e corpo e integra reflexos.
Sinapse|Local de comunicação entre células excitáveis.
Tendão|Geralmente liga um músculo a um osso.
Fígado|Produz bílis e participa no metabolismo e armazenamento.`,
      'human-physiology': `Homeostase|Manutenção dinâmica de variáveis internas em intervalos compatíveis com a vida.
Retroalimentação negativa|Uma alteração provoca uma resposta que tende a contrariá-la.
Nó sinoatrial|Inicia normalmente impulsos elétricos que definem o ritmo cardíaco.
Sístole ventricular|Contração dos ventrículos que ejeta o sangue.
Diástole ventricular|Relaxamento durante o qual os ventrículos se enchem.
Débito cardíaco|Volume bombeado por um ventrículo por minuto: frequência × volume sistólico.
Ventilação pulmonar|Movimento de ar para dentro e fora dos pulmões.
Difusão alveolar|Movimento de O₂ e CO₂ segundo gradientes de pressão parcial.
Hemoglobina|Proteína dos glóbulos vermelhos que transporta a maior parte do O₂ no sangue.
Filtração glomerular|Passagem de água e pequenos solutos do sangue para a cápsula renal.
Reabsorção tubular|Regresso de substâncias do filtrado renal ao sangue.
ADH|Hormona que favorece a reabsorção renal de água.
Insulina|Hormona que favorece a entrada de glicose em alguns tecidos e o seu armazenamento.
Glucagon|Hormona que favorece a libertação de glicose pelo fígado.
Potencial de ação|Breve alteração do potencial de membrana que se propaga numa célula excitável.
Despolarização|Diminuição da diferença de potencial através da membrana.
Sistema simpático|Ramo autónomo que ajuda a preparar o corpo para a ação.
Sistema parassimpático|Ramo autónomo que favorece repouso e digestão.
Equilíbrio ácido-base|Regulação da concentração de H⁺ e do pH dos líquidos corporais.
Osmolaridade plasmática|Concentração total de partículas osmoticamente ativas no plasma.`,
    },
  },
  zh: {
    title: { 'human-anatomy': '人体解剖学', 'human-physiology': '人体生理学' },
    description: { 'human-anatomy': '认识心脏、肺、肾和神经系统的关键结构。', 'human-physiology': '解释循环、呼吸、肾功能和机体调节。' },
    question: (id, term) => id === 'human-anatomy' ? `“${term}”的作用是什么？` : `如何定义“${term}”？`,
    terms: {
      'human-anatomy': `右心房|接收来自体循环的静脉血。
右心室|经肺动脉将血液泵往肺部。
左心房|接收由肺返回的含氧血。
左心室|经主动脉将血液泵入体循环。
二尖瓣|位于左心房和左心室之间，限制血液倒流。
主动脉|将左心室输出的血液输送至全身。
肺动脉|将右心室的血液输送至肺部。
肺静脉|将肺部含氧血送回左心房。
肺泡|空气与血液进行气体交换的主要部位。
膈肌|主要吸气肌；收缩时胸腔容积增大。
气管|将空气导向支气管。
肾单位|肾脏的功能单位，负责滤过并调整滤液。
肾小球|血浆滤过开始的毛细血管网。
输尿管|将尿液从肾脏输送至膀胱。
脑|整合信息并协调多种功能；包括大脑、小脑和脑干。
小脑|参与运动协调与平衡。
脊髓|在脑与身体间传递信号，并整合反射。
突触|可兴奋细胞之间进行信息传递的部位。
肌腱|通常连接肌肉与骨骼。
肝脏|产生胆汁，并参与代谢和物质储存。`,
      'human-physiology': `体内稳态|动态维持内部变量，使其处于与生命活动相容的范围。
负反馈|某项变化引发倾向于抵消该变化的反应。
窦房结|通常启动控制心律的电脉冲。
心室收缩期|心室收缩并射血的阶段。
心室舒张期|心室舒张并充盈的阶段。
心输出量|一个心室每分钟泵出的血量：心率 × 每搏输出量。
肺通气|空气进出肺部的运动。
肺泡气体扩散|O₂ 和 CO₂ 沿各自分压梯度移动。
血红蛋白|红细胞中运输血液内大部分 O₂ 的蛋白质。
肾小球滤过|水和小分子溶质从血液进入肾小囊。
肾小管重吸收|物质从肾滤液返回血液。
抗利尿激素 ADH|促进肾脏重吸收水分的激素。
胰岛素|促进某些组织摄取葡萄糖并储存的激素。
胰高血糖素|促进肝脏释放葡萄糖的激素。
动作电位|在可兴奋细胞中传播的短暂膜电位变化。
去极化|细胞膜两侧电位差减小。
交感神经系统|帮助机体为活动做准备的自主神经分支。
副交感神经系统|支持休息与消化的自主神经分支。
酸碱平衡|调节体液 H⁺ 浓度及 pH。
血浆渗透浓度|血浆中具有渗透活性的颗粒总浓度。`,
    },
  },
  ja: {
    title: { 'human-anatomy': '人体解剖学', 'human-physiology': '人体生理学' },
    description: { 'human-anatomy': '心臓・肺・腎臓・神経系の重要な構造を確認。', 'human-physiology': '循環・呼吸・腎機能・調節の仕組みを説明。' },
    question: (id, term) => id === 'human-anatomy' ? `「${term}」の働きは？` : `「${term}」とは？`,
    terms: {
      'human-anatomy': `右心房|体循環から戻る静脈血を受け取る。
右心室|肺動脈を通じて血液を肺へ送り出す。
左心房|肺から戻る酸素の多い血液を受け取る。
左心室|大動脈を通じて血液を体循環へ送り出す。
僧帽弁|左心房と左心室の間にあり、血液の逆流を抑える。
大動脈|左心室から出た血液を全身に送る。
肺動脈|右心室から肺へ血液を運ぶ。
肺静脈|肺で酸素を受け取った血液を左心房へ戻す。
肺胞|空気と血液のガス交換が主に行われる場所。
横隔膜|主要な吸気筋で、収縮すると胸腔容積が増す。
気管|空気を気管支へ導く。
ネフロン|濾過と再吸収などを行う腎臓の機能単位。
糸球体|血漿の濾過が始まる毛細血管の集まり。
尿管|腎臓から膀胱へ尿を運ぶ。
脳|情報を統合し多くの機能を調整する。大脳・小脳・脳幹を含む。
小脳|運動の協調と平衡に関わる。
脊髄|脳と体の間で信号を伝え、反射を統合する。
シナプス|興奮性細胞間の情報伝達部位。
腱|通常、筋肉を骨につなぐ。
肝臓|胆汁を作り、代謝と物質の貯蔵に関わる。`,
      'human-physiology': `ホメオスタシス|生命を保てる範囲で体内の状態を動的に維持すること。
負のフィードバック|変化を打ち消す方向の反応が起こる仕組み。
洞房結節|通常、心拍のリズムを決める電気信号を生み出す。
心室収縮期|心室が収縮し血液を送り出す時期。
心室拡張期|心室が弛緩し血液で満たされる時期。
心拍出量|片側の心室が1分間に送り出す血液量：心拍数 × 1回拍出量。
肺換気|空気が肺に入り、出ていく動き。
肺胞での拡散|O₂ と CO₂ がそれぞれの分圧差に従って移動すること。
ヘモグロビン|血液中の酸素の大部分を運ぶ赤血球内のタンパク質。
糸球体濾過|水と小さな溶質が血液から腎小嚢へ移ること。
尿細管再吸収|腎臓の濾液から物質が血液へ戻ること。
抗利尿ホルモン ADH|腎臓での水の再吸収を促すホルモン。
インスリン|一部の組織への糖の取り込みや貯蔵を促すホルモン。
グルカゴン|肝臓からの糖放出を促すホルモン。
活動電位|興奮性細胞内を伝わる短い膜電位の変化。
脱分極|細胞膜を挟む電位差が小さくなること。
交感神経系|活動に備える働きを持つ自律神経系の一部。
副交感神経系|休息と消化を支える自律神経系の一部。
酸塩基平衡|体液中の H⁺ 濃度、つまり pH を調節すること。
血漿浸透圧濃度|血漿中の浸透圧に関わる粒子の総濃度。`,
    },
  },
  ar: {
    title: { 'human-anatomy': 'تشريح جسم الإنسان', 'human-physiology': 'فسيولوجيا جسم الإنسان' },
    description: { 'human-anatomy': 'تعرّف إلى بنى القلب والرئتين والكلى والجهاز العصبي الأساسية.', 'human-physiology': 'اشرح الدورة الدموية والتنفس ووظيفة الكلى وآليات التنظيم.' },
    question: (id, term) => id === 'human-anatomy' ? `ما وظيفة «${term}»؟` : `كيف تعرّف «${term}»؟`,
    terms: {
      'human-anatomy': `الأذين الأيمن|يستقبل الدم الوريدي العائد من الدورة الدموية العامة.
البطين الأيمن|يضخ الدم إلى الرئتين عبر الشريان الرئوي.
الأذين الأيسر|يستقبل الدم المؤكسج العائد من الرئتين.
البطين الأيسر|يضخ الدم إلى الدورة العامة عبر الأبهر.
الصمام التاجي|يفصل الأذين الأيسر عن البطين الأيسر ويحد من رجوع الدم.
الأبهر|يوزع الدم الخارج من البطين الأيسر إلى الجسم.
الشريان الرئوي|ينقل الدم من البطين الأيمن إلى الرئتين.
الأوردة الرئوية|تعيد الدم المؤكسج من الرئتين إلى الأذين الأيسر.
الحويصلات الرئوية|الموقع الرئيسي لتبادل الغازات بين الهواء والدم.
الحجاب الحاجز|عضلة الشهيق الرئيسية؛ يزيد انقباضها حجم التجويف الصدري.
القصبة الهوائية|توجّه الهواء نحو الشعب الهوائية.
النفرون|الوحدة الوظيفية للكلية؛ ترشح الراشح ثم تعدّله.
الكبيبة|شبكة شعيرية يبدأ فيها ترشيح البلازما.
الحالب|ينقل البول من الكلية إلى المثانة.
الدماغ|يدمج المعلومات وينسق وظائف كثيرة؛ ويشمل المخ والمخيخ وجذع الدماغ.
المخيخ|يساعد على تنسيق الحركة والتوازن.
الحبل الشوكي|ينقل الإشارات بين الدماغ والجسم وينسق المنعكسات.
المشبك العصبي|موضع التواصل بين الخلايا القابلة للاستثارة.
الوتر|يربط عادةً العضلة بالعظم.
الكبد|ينتج الصفراء ويساهم في الاستقلاب وتخزين المواد.`,
      'human-physiology': `الاستتباب|الحفاظ الديناميكي على المتغيرات الداخلية ضمن حدود مناسبة للحياة.
التغذية الراجعة السلبية|يؤدي التغير إلى استجابة تميل إلى معاكسته.
العقدة الجيبية الأذينية|تبدأ عادةً النبضات الكهربائية التي تحدد نظم القلب.
انقباض البطينين|مرحلة تنقبض فيها البطينات لتدفع الدم.
انبساط البطينين|مرحلة ترتخي فيها البطينات وتمتلئ بالدم.
النتاج القلبي|حجم الدم الذي يضخه بطين واحد في الدقيقة: معدل النبض × حجم الضربة.
التهوية الرئوية|حركة الهواء إلى داخل الرئتين وخارجهما.
الانتشار السنخي|انتقال O₂ وCO₂ وفق تدرج الضغط الجزئي لكل منهما.
الهيموغلوبين|بروتين في الكريات الحمراء ينقل معظم الأكسجين في الدم.
الترشيح الكبيبي|انتقال الماء والجزيئات الصغيرة من الدم إلى محفظة الكلية.
إعادة الامتصاص الأنبوبية|عودة مواد من راشح الكلية إلى الدم.
الهرمون المضاد لإدرار البول ADH|يعزز إعادة امتصاص الماء في الكلية.
الإنسولين|يعزز دخول الغلوكوز إلى بعض الأنسجة وتخزينه.
الغلوكاغون|يعزز إطلاق الكبد للغلوكوز.
جهد الفعل|تغير وجيز في جهد الغشاء ينتشر في خلية قابلة للاستثارة.
إزالة الاستقطاب|انخفاض فرق الجهد عبر غشاء الخلية.
الجهاز الودي|فرع ذاتي يساعد على تهيئة الجسم للنشاط.
الجهاز نظير الودي|فرع ذاتي يدعم الراحة والهضم.
التوازن الحمضي القاعدي|تنظيم تركيز H⁺ وبالتالي درجة الحموضة في سوائل الجسم.
أسمولارية البلازما|التركيز الكلي للجسيمات الفعالة أسموزيًا في البلازما.`,
    },
  },
}

export const medicalDecks = STUDY_PDF_LOCALES.reduce<Record<StudyPdfLocale, Record<MedicalDeckId, { title: string; description: string; cards: readonly Card[] }>>>((all, locale) => {
  const local = copy[locale]
  const createDeck = (id: MedicalDeckId) => {
    const cards = local.terms[id].split('\n').map(line => {
      const separator = line.indexOf('|')
      if (separator < 1) throw new Error(`Invalid medical flashcard: ${locale}/${id}`)
      return [local.question(id, line.slice(0, separator)), line.slice(separator + 1)] as const
    })
    if (cards.length !== 20) throw new Error(`Expected 20 medical flashcards: ${locale}/${id}`)
    return { title: local.title[id], description: local.description[id], cards }
  }
  const decks = {
    'human-anatomy': createDeck('human-anatomy'),
    'human-physiology': createDeck('human-physiology'),
  }
  all[locale] = decks
  return all
}, {} as Record<StudyPdfLocale, Record<MedicalDeckId, { title: string; description: string; cards: readonly Card[] }>>)
