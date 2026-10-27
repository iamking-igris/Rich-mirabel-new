export type Choice = "A" | "B" | "C" | "D";

export type Question = {
  id: string;
  prompt: string;
  options: { key: Choice; text: string }[];
  answer?: Choice;
  explain?: string;
  answerKeyStatus?: "shipped" | "demo" | "missing";
};

export type TheoryQuestion = {
  id: string;
  prompt: string;
  modelAnswer?: string;
  marks?: number;
};

export type NoteBlock = {
  heading: string;
  paragraphs: string[];
  formula?: string;
  points?: string[];
  diagramCaption?: string;
  diagramSvg?: string;
};

export type ContentOrigin = "shipped" | "demo";

export type Topic = {
  id: string;
  title: string;
  minutes: number;
  summary: string;
  diagram?: "wave" | "cell" | "balance";
  objectives?: string[];
  notes: NoteBlock[];
  questions: Question[];
  theory?: TheoryQuestion[];
  status?: "published" | "draft";
  mainTopic?: string;
  origin?: ContentOrigin;
};

export type SubjectGroup = "sciences" | "arts" | "commercial";

export type Subject = {
  id: string;
  name: string;
  exam: string;
  blurb: string;
  group: SubjectGroup;
  /** Optional photo path. Defaults to /media/<id>.jpg */
  photo?: string;
  topics: Topic[];
  /** Admin-controlled. false hides the subject from students. */
  available?: boolean;
};

const q = (
  id: string,
  prompt: string,
  options: [string, string, string, string],
  answer: Choice,
  explain: string,
): Question => ({
  id,
  prompt,
  options: (["A", "B", "C", "D"] as Choice[]).map((key, i) => ({ key, text: options[i] })),
  answer,
  explain,
  answerKeyStatus: "shipped",
});

export const subjects: Subject[] = [
  {
    id: "mathematics",
    name: "Mathematics",
    exam: "JAMB · WAEC",
    blurb: "Algebra, variation, and the questions that decide your score.",
    group: "sciences",
    topics: [
      {
        id: "quadratic",
        title: "Quadratic equations",
        minutes: 18,
        summary: "Standard form, roots, and the formula you actually use under time pressure.",
        notes: [
          {
            heading: "What counts as quadratic",
            paragraphs: [
              "A quadratic equation has 2 as its highest power of the unknown. Anything written as ax² + bx + c = 0, with a not equal to zero, is already in standard form.",
            ],
            formula: "ax² + bx + c = 0",
            points: ["a is the coefficient of x²", "b is the coefficient of x", "c is the constant term"],
          },
          {
            heading: "The formula that always works",
            paragraphs: [
              "When factorisation is slow, go straight to the quadratic formula. The expression under the square root is the discriminant. It tells you how many real roots you have before you finish the arithmetic.",
            ],
            formula: "x = (−b ± √(b² − 4ac)) / 2a",
            points: ["Discriminant > 0 → two real roots", "Discriminant = 0 → one repeated root", "Discriminant < 0 → no real roots"],
          },
        ],
        questions: [
          q("q1", "Which of the following is in standard quadratic form?", ["2x + 5 = 0", "x² − 4x + 3 = 0", "x³ + x = 1", "1/x = 4"], "B", "The highest power is 2 and the equation equals zero."),
          q("q2", "For 2x² + 5x − 3 = 0, the value of a is", ["5", "−3", "2", "0"], "C", "a is the coefficient of x², which is 2."),
          q("q3", "If the discriminant is zero, the equation has", ["two different real roots", "no roots", "one repeated real root", "three roots"], "C", "A zero discriminant means the roots coincide."),
          q("q4", "The quadratic formula solves", ["only perfect squares", "any ax² + bx + c = 0 with a ≠ 0", "linear equations only", "simultaneous equations only"], "B", "The formula covers every standard quadratic."),
        ],
        theory: [
          { id: "qt1", prompt: "Solve 2x² − 5x − 3 = 0 by factorisation or the formula. Show your working.", modelAnswer: "Factors as (2x + 1)(x − 3) = 0, so x = −1/2 or x = 3.", marks: 4 },
          { id: "qt2", prompt: "Explain what the discriminant tells you about the number of real roots.", modelAnswer: "b² − 4ac > 0 two real roots; = 0 one repeated root; < 0 no real roots.", marks: 3 },
        ],
      },
      {
        id: "variation",
        title: "Variation",
        minutes: 14,
        summary: "Direct, inverse, and joint variation written as equations you can solve.",
        notes: [
          {
            heading: "The three patterns",
            paragraphs: [
              "Variation questions are translation questions. Read the sentence, write the equation with a constant k, then use the given pair of values to find k.",
            ],
            points: ["y ∝ x means y = kx", "y ∝ 1/x means y = k/x", "y ∝ xz means y = kxz"],
          },
        ],
        questions: [
          q("v1", "If y varies directly as x, then", ["y = k/x", "y = kx", "xy = 1", "y = x + k"], "B", "Direct variation is a constant multiple."),
          q("v2", "If y varies inversely as x and y = 6 when x = 4, then k is", ["10", "24", "1.5", "2"], "B", "y = k/x so 6 = k/4 and k = 24."),
          q("v3", "Joint variation of p with q and r is written", ["p = k(q + r)", "p = kqr", "p = k/qr", "p = q/r"], "B", "Joint means the product, with constant k."),
          q("v4", "Partial variation usually contains", ["only a product", "a constant term plus a varying term", "no constant", "a square root only"], "B", "Example: C = a + bn."),
        ],
      },
      {
        id: "indices",
        title: "Indices and logarithms",
        minutes: 16,
        summary: "Laws that turn ugly powers into short working.",
        notes: [
          {
            heading: "Laws you should not re-derive in the hall",
            paragraphs: ["Memorise the five moves. Every JAMB indices item is one of them wearing a disguise."],
            points: ["aᵐ × aⁿ = aᵐ⁺ⁿ", "aᵐ ÷ aⁿ = aᵐ⁻ⁿ", "(aᵐ)ⁿ = aᵐⁿ", "a⁰ = 1 (a ≠ 0)", "a⁻ⁿ = 1/aⁿ"],
          },
        ],
        questions: [
          q("i1", "Simplify 2³ × 2⁴", ["2⁷", "2¹²", "4⁷", "8"], "A", "Same base: add the powers."),
          q("i2", "The value of 5⁰ is", ["0", "5", "1", "undefined"], "C", "Any non-zero number to the power 0 is 1."),
          q("i3", "3⁻² equals", ["−9", "−6", "1/9", "9"], "C", "A negative index is a reciprocal."),
          q("i4", "log₁₀ 100 equals", ["1", "10", "2", "100"], "C", "10² = 100."),
        ],
      },
    ],
  },
  {
    id: "english",
    name: "Use of English",
    exam: "JAMB · WAEC",
    blurb: "Lexis, structure, and the reading habits that raise the paper.",
    group: "arts",
    topics: [
      {
        id: "concord",
        title: "Subject–verb concord",
        minutes: 12,
        summary: "Match the verb to the real subject, not the nearest noun.",
        notes: [
          {
            heading: "Find the head noun",
            paragraphs: [
              "Phrases between the subject and the verb are noise. ‘The list of items is long’ — list is singular, so the verb is singular.",
            ],
            points: ["Each, every, neither, either → singular verb", "A number of → plural; the number of → singular", "Collective nouns can go either way if the sense is clear"],
          },
        ],
        questions: [
          q("c1", "Choose the correct sentence.", ["The committee have decided, and it is final in every case here today.", "Each of the boys have a book.", "Each of the boys has a book.", "Neither of them are ready."], "C", "Each takes a singular verb."),
          q("c2", "‘The number of candidates ___ increasing.’", ["are", "were", "is", "have"], "C", "‘The number’ is singular."),
          q("c3", "Neither the teacher nor the students ___ late.", ["was", "is", "were", "has"], "C", "With neither/nor, the verb follows the nearer subject."),
          q("c4", "A pair of scissors ___ on the table.", ["are", "were lying as they", "is", "have been"], "C", "Pair, treated as one item, takes a singular verb in this test style."),
        ],
      },
      {
        id: "lexis",
        title: "Lexis and closest meaning",
        minutes: 15,
        summary: "Pick the option that can replace the word in that sentence, not in a dictionary.",
        notes: [
          {
            heading: "Context beats the first synonym you remember",
            paragraphs: [
              "Read the whole sentence. A word like ‘fair’ can mean just, pale, or average. The sentence decides.",
            ],
            points: ["Eliminate options that change the tone", "Watch register: formal passage, formal option", "If two options are close, test each inside the sentence"],
          },
        ],
        questions: [
          q("l1", "In ‘The plea was granted’, granted means", ["refused", "approved", "delayed", "written"], "B", "To grant a plea is to allow it."),
          q("l2", "A ‘candid’ remark is", ["hidden", "frank", "rude only", "long"], "B", "Candid means open and sincere."),
          q("l3", "‘Sparse’ vegetation is", ["thick", "green", "thinly scattered", "tall"], "C", "Sparse means thinly spread."),
          q("l4", "The opposite of ‘scarce’ is", ["rare", "abundant", "little", "costly"], "B", "Abundant is the clear antonym."),
        ],
      },
    ],
  },
  {
    id: "physics",
    name: "Physics",
    exam: "JAMB · WAEC",
    blurb: "Waves, motion, and diagrams that match the marking scheme.",
    group: "sciences",
    topics: [
      {
        id: "waves",
        title: "Waves",
        minutes: 20,
        summary: "Wavelength, amplitude, frequency, and the wave equation.",
        diagram: "wave",
        origin: "shipped",
        mainTopic: "Waves",
        objectives: [
          "Define wavelength, amplitude, frequency and period",
          "Use the wave equation v = fλ to solve for speed, frequency or wavelength",
          "Distinguish distance-axis and time-axis graphs for a wave",
        ],
        theory: [
          { id: "w-t1", prompt: "State the relationship between wave speed, frequency and wavelength. Define each quantity and give its SI unit.", modelAnswer: "v = fλ. Speed v is in m/s, frequency f in hertz (Hz), wavelength λ in metres (m).", marks: 4 },
          { id: "w-t2", prompt: "A transverse wave has frequency 5 Hz and wavelength 2 m. Calculate its speed and explain one full cycle on a distance graph.", modelAnswer: "v = 5 × 2 = 10 m/s. On a distance graph, one full cycle from crest to crest is one wavelength (2 m).", marks: 5 },
        ],
        notes: [
          {
            heading: "What the diagram is measuring",
            paragraphs: [
              "A transverse wave moves energy forward while the particles move up and down. Wavelength is the distance between two matching points — crest to crest, or trough to trough. Amplitude is the maximum displacement from the rest position.",
            ],
            formula: "v = fλ",
            points: ["v is speed in m/s", "f is frequency in hertz", "λ is wavelength in metres", "Period T = 1/f"],
          },
          {
            heading: "How to read a graph in the exam",
            paragraphs: [
              "If the horizontal axis is distance, one full cycle is λ. If the horizontal axis is time, one full cycle is the period. Do not mix those up. Half a cycle is not the wavelength.",
            ],
          },
        ],
        questions: [
          q("w1", "The distance between two successive crests is the", ["amplitude", "frequency", "wavelength", "period"], "C", "Crest to crest is one wavelength."),
          q("w2", "If frequency is 5 Hz and wavelength is 2 m, the speed is", ["2.5 m/s", "7 m/s", "10 m/s", "0.4 m/s"], "C", "v = fλ = 5 × 2 = 10 m/s."),
          q("w3", "Amplitude is measured from", ["crest to trough", "rest position to crest", "one node to the next", "source to observer"], "B", "Amplitude is maximum displacement from rest."),
          q("w4", "A wave of period 0.2 s has frequency", ["0.2 Hz", "2 Hz", "5 Hz", "20 Hz"], "C", "f = 1/T = 1/0.2 = 5 Hz."),
        ],
      },
      {
        id: "motion",
        title: "Linear motion",
        minutes: 16,
        summary: "The three equations, and which one to pick when a quantity is missing.",
        origin: "shipped",
        mainTopic: "Motion",
        objectives: [
          "Select the correct equation of motion when one quantity is unknown",
          "Apply v = u + at, s = ut + ½at² and v² = u² + 2as",
        ],
        theory: [
          { id: "m-t1", prompt: "State the three equations of linear motion and say which quantity is absent from each.", modelAnswer: "v = u + at (no s); s = ut + ½at² (no v); v² = u² + 2as (no t).", marks: 4 },
        ],
        notes: [
          {
            heading: "Choose the equation by what is absent",
            paragraphs: ["Write the knowns first. Then pick the equation that does not need the missing quantity."],
            points: ["v = u + at  (no s)", "s = ut + ½at²  (no v)", "v² = u² + 2as  (no t)"],
          },
        ],
        questions: [
          q("m1", "A body starts from rest. Its initial velocity u is", ["1", "10", "0", "g"], "C", "From rest means u = 0."),
          q("m2", "Which equation does not contain time?", ["v = u + at", "s = ut + ½at²", "v² = u² + 2as", "a = (v − u)/t"], "C", "v² = u² + 2as has no t."),
          q("m3", "Acceleration is the rate of change of", ["distance", "velocity", "mass", "force only"], "B", "a = Δv / Δt."),
          q("m4", "A car at 20 m/s stops in 4 s. Its acceleration is", ["5 m/s²", "−5 m/s²", "80 m/s²", "0"], "B", "a = (0 − 20)/4 = −5 m/s²."),
        ],
      },
    ],
  },
  {
    id: "chemistry",
    name: "Chemistry",
    exam: "JAMB · WAEC",
    blurb: "Equations you can balance, and the mole without panic.",
    group: "sciences",
    topics: [
      {
        id: "equations",
        title: "Balancing equations",
        minutes: 14,
        summary: "Atoms in equals atoms out. Coefficients, not subscripts.",
        diagram: "balance",
        notes: [
          {
            heading: "The rule",
            paragraphs: [
              "You may change the numbers in front of formulas. You may not change the small numbers inside a formula, because that would be a different substance.",
            ],
            formula: "2H₂ + O₂ → 2H₂O",
            points: ["Count each element on both sides", "Balance metals and non-metals before hydrogen and oxygen when the equation is busy", "Check the count again after the last change"],
          },
        ],
        questions: [
          q("e1", "In 2H₂ + O₂ → 2H₂O, hydrogen atoms on the left are", ["2", "4", "1", "8"], "B", "2 × H₂ gives 4 hydrogen atoms."),
          q("e2", "Changing a subscript in H₂O to balance an equation", ["is correct", "makes a new substance", "is optional", "only changes state"], "B", "Subscripts define the compound."),
          q("e3", "A coefficient multiplies", ["one atom inside the formula only", "the whole formula", "the arrow", "the state symbol only"], "B", "The number in front applies to the entire formula."),
          q("e4", "The law behind balancing is conservation of", ["energy only", "mass / atoms", "volume always", "temperature"], "B", "Atoms are neither created nor destroyed."),
        ],
      },
      {
        id: "mole",
        title: "The mole",
        minutes: 16,
        summary: "Mass, molar mass, and number of moles in one line.",
        notes: [
          {
            heading: "The only equation you need first",
            paragraphs: ["Amount of substance in moles is mass divided by molar mass. Units: grams over grams per mole."],
            formula: "n = m / M",
            points: ["n in mol", "m in g", "M in g/mol", "1 mole contains 6.02 × 10²³ particles"],
          },
        ],
        questions: [
          q("mo1", "Moles in 18 g of water (M = 18 g/mol) is", ["18", "1", "0.5", "36"], "B", "n = 18/18 = 1 mol."),
          q("mo2", "Molar mass is measured in", ["mol", "g", "g/mol", "mol/g"], "C", "Molar mass is mass per mole."),
          q("mo3", "Avogadro’s number is about", ["6.02 × 10²³", "6.02 × 10⁻²³", "3 × 10⁸", "22.4 only"], "A", "Particles in one mole."),
          q("mo4", "If n = 2 mol and M = 40 g/mol, mass is", ["20 g", "42 g", "80 g", "38 g"], "C", "m = nM = 80 g."),
        ],
      },
    ],
  },
  {
    id: "biology",
    name: "Biology",
    exam: "JAMB · WAEC",
    blurb: "Cells, and the functions examiners actually ask.",
    group: "sciences",
    topics: [
      {
        id: "cell",
        title: "The cell",
        minutes: 18,
        summary: "Organelles, what each one does, and plant versus animal.",
        diagram: "cell",
        notes: [
          {
            heading: "Name the part, then the job",
            paragraphs: [
              "Markers award the function, not a long description. Nucleus controls the cell and holds genetic material. Mitochondria release energy. Chloroplasts, in plant cells, trap light for photosynthesis.",
            ],
            points: ["Cell membrane: controls entry and exit", "Cytoplasm: site of many reactions", "Ribosomes: protein synthesis", "Cell wall: plant support, not in animal cells"],
          },
        ],
        questions: [
          q("b1", "The organelle that releases energy is the", ["nucleus", "mitochondrion", "vacuole", "cell wall"], "B", "Respiration is associated with mitochondria."),
          q("b2", "Which is absent in a typical animal cell?", ["nucleus", "cell membrane", "cell wall", "cytoplasm"], "C", "Animal cells have no cellulose cell wall."),
          q("b3", "Photosynthesis in a leaf cell occurs in the", ["mitochondrion", "chloroplast", "ribosome", "nucleus"], "B", "Chloroplasts contain chlorophyll."),
          q("b4", "The cell membrane", ["makes glucose", "controls movement of substances", "is made of cellulose only", "stores DNA"], "B", "Selective control of entry and exit."),
        ],
      },
      {
        id: "ecology",
        title: "Ecology basics",
        minutes: 12,
        summary: "Producers, consumers, and what a food chain is actually saying.",
        notes: [
          {
            heading: "Arrows mean energy",
            paragraphs: ["The arrow points to the organism that receives the energy. Grass → grasshopper → lizard means energy moves that way."],
            points: ["Producer: makes food, usually a green plant", "Primary consumer: eats the producer", "Decomposers return nutrients"],
          },
        ],
        questions: [
          q("ec1", "In a food chain the arrow shows", ["who is bigger", "direction of energy flow", "who is faster", "the habitat"], "B", "Energy flows along the arrow."),
          q("ec2", "A green plant in a chain is a", ["consumer", "producer", "decomposer only", "parasite"], "B", "It produces food by photosynthesis."),
          q("ec3", "An organism that eats a producer is a", ["primary consumer", "producer", "secondary producer", "saprophyte only"], "A", "First eater of the plant."),
          q("ec4", "Decomposers mainly", ["hunt", "photosynthesise", "break down dead matter", "pollinate"], "C", "Fungi and many bacteria recycle nutrients."),
        ],
      },
    ],
  },
  {
    id: "government",
    name: "Government",
    exam: "JAMB · WAEC",
    blurb: "Constitutions, arms of government, and precise definitions.",
    group: "arts",
    topics: [
      {
        id: "constitution",
        title: "Constitutions",
        minutes: 15,
        summary: "Written, unwritten, rigid, flexible — the contrasts the paper loves.",
        notes: [
          {
            heading: "Four labels, two axes",
            paragraphs: [
              "Written versus unwritten is about form. Rigid versus flexible is about how hard it is to amend. A constitution can be written and rigid, which is the usual description of Nigeria’s.",
            ],
            points: ["Written: provisions in a formal document", "Rigid: special procedure to amend", "Federal constitution shares power between centre and units"],
          },
        ],
        questions: [
          q("g1", "A rigid constitution is one that", ["is not written", "is difficult to amend", "has no courts", "changes every year by itself"], "B", "Amendment needs a special process."),
          q("g2", "Nigeria operates a", ["unitary and unwritten system only", "federal written constitution", "confederation with no centre", "absolute monarchy"], "B", "Federal, and the constitution is a written document."),
          q("g3", "Separation of powers shares functions among", ["only the police", "legislature, executive, judiciary", "states alone", "political parties"], "B", "The three arms."),
          q("g4", "The legislature mainly", ["interprets laws", "makes laws", "implements only", "commands the army alone"], "B", "Law-making is the legislature’s core job."),
        ],
      },
      {
        id: "arms",
        title: "Arms of government",
        minutes: 12,
        summary: "Legislature, executive, judiciary, and why power is split between them.",
        notes: [
          {
            heading: "Three arms, three jobs",
            paragraphs: [
              "The legislature makes laws. The executive carries them out and runs the daily business of government. The judiciary interprets the law and settles disputes, including disputes involving government itself.",
            ],
            points: ["Legislature: makes laws, approves budgets, oversees the executive", "Executive: implements laws and policy", "Judiciary: interprets laws and protects rights"],
          },
          {
            heading: "Separation of powers and checks and balances",
            paragraphs: [
              "Separation of powers, popularised by Montesquieu, spreads authority across the three arms so that no single person or body holds all of it. Checks and balances let each arm limit the others, for example when courts declare an act unconstitutional.",
            ],
          },
        ],
        questions: [
          q("a1", "The arm of government that makes laws is the", ["executive", "legislature", "judiciary", "civil service"], "B", "Law-making is the job of the legislature."),
          q("a2", "The main function of the judiciary is to", ["make laws", "interpret laws and settle disputes", "collect taxes", "command the army"], "B", "Courts interpret the law and decide disputes."),
          q("a3", "The doctrine of separation of powers was popularised by", ["Montesquieu", "Karl Marx", "Plato", "Adam Smith"], "A", "Montesquieu argued for dividing governmental power."),
          q("a4", "Checks and balances exist to prevent", ["elections", "any one arm from becoming too powerful", "taxation", "federalism"], "B", "Each arm can limit the others."),
        ],
      },
      {
        id: "federalism",
        title: "Federalism and unitary government",
        minutes: 13,
        summary: "How power is shared, and what makes a system federal or unitary.",
        notes: [
          {
            heading: "Where power sits",
            paragraphs: [
              "In a federal system the constitution divides power between a central government and regional governments, and each level has its own sphere. In a unitary system, sovereignty rests with the central government, and any lower levels exist at its pleasure.",
            ],
            points: ["Federal: written constitution, shared power, tiers with defined roles", "Unitary: one central authority, local units get delegated power"],
          },
          {
            heading: "Why large countries choose federalism",
            paragraphs: [
              "Federalism helps a country with many ethnic groups and regions to govern itself without forcing every decision through the centre. Nigeria runs three tiers: federal, state, and local government.",
            ],
          },
        ],
        questions: [
          q("f1", "In a federal system, power is", ["held entirely by the centre", "shared between central and regional governments by the constitution", "held by regions only", "held by a monarch"], "B", "A constitution divides power between levels."),
          q("f2", "How many tiers of government does Nigeria have?", ["one", "two", "three", "four"], "C", "Federal, state, and local government."),
          q("f3", "A feature of a unitary system is that", ["sovereignty rests with the central government", "regions hold independent power", "there are two constitutions", "each state has its own army"], "A", "Lower units depend on the centre."),
          q("f4", "A major advantage of federalism is that it", ["accommodates diversity in large countries", "removes all disputes", "needs no constitution", "abolishes local government"], "A", "It lets diverse regions manage their own affairs."),
        ],
      },
    ],
  },
  {
    id: "economics",
    name: "Economics",
    exam: "JAMB · WAEC",
    blurb: "Demand, supply, and the national income questions that repeat every year.",
    group: "commercial",
    topics: [
      {
        id: "demand-supply",
        title: "Demand and supply",
        minutes: 15,
        summary: "The law of demand, shifts versus movements, and how price finds its level.",
        notes: [
          {
            heading: "The law of demand",
            paragraphs: [
              "Other things equal, when the price of a good rises, the quantity demanded falls, and when the price falls, the quantity demanded rises. This is a movement along the demand curve. A change in anything other than the good's own price, such as income or tastes, shifts the whole curve.",
            ],
            points: ["Price change: movement along the curve", "Income, tastes, price of related goods, number of buyers: shift the curve"],
          },
          {
            heading: "Equilibrium",
            paragraphs: [
              "The market clears at the price where quantity demanded equals quantity supplied. Above that price there is a surplus, and below it there is a shortage. Prices tend to move back toward equilibrium.",
            ],
            formula: "Equilibrium: Qd = Qs",
          },
        ],
        questions: [
          q("ds1", "When the price of a good rises, other things equal, quantity demanded", ["rises", "falls", "stays the same", "doubles"], "B", "That is the law of demand."),
          q("ds2", "Which of these shifts the demand curve for a normal good to the right?", ["A fall in incomes", "A rise in incomes", "A rise in the good's own price", "A fall in the number of buyers"], "B", "Higher income raises demand at every price. A change in own price only moves along the curve."),
          q("ds3", "Equilibrium price is where", ["demand exceeds supply", "supply exceeds demand", "quantity demanded equals quantity supplied", "price is zero"], "C", "The market clears at equilibrium."),
          q("ds4", "A price fixed above equilibrium produces", ["a shortage", "a surplus", "equilibrium", "a shift in demand"], "B", "Quantity supplied exceeds quantity demanded."),
        ],
      },
      {
        id: "national-income",
        title: "National income",
        minutes: 14,
        summary: "GDP, GNP, NNP, and the three ways of measuring them.",
        notes: [
          {
            heading: "The main measures",
            paragraphs: [
              "Gross Domestic Product is the value of all final goods and services produced inside a country in a year. Gross National Product adds the net income that citizens earn from abroad. Net National Product removes depreciation.",
            ],
            formula: "GNP = GDP + net property income from abroad",
            points: ["NNP = GNP − depreciation", "Count final goods only, to avoid double counting"],
          },
          {
            heading: "Three ways to measure",
            paragraphs: [
              "The output method adds the value added by each sector. The income method adds wages, rent, interest and profit. The expenditure method adds consumption, investment, government spending and net exports. In theory all three give the same total.",
            ],
          },
        ],
        questions: [
          q("ni1", "GDP measures", ["income earned abroad by citizens only", "the value of final goods and services produced within a country in a year", "the value of imports", "government revenue"], "B", "GDP is output produced inside the country."),
          q("ni2", "GNP equals GDP plus", ["net property income from abroad", "taxes", "imports", "depreciation"], "A", "GNP adds net income from abroad."),
          q("ni3", "Which is NOT a method of measuring national income?", ["Output method", "Income method", "Expenditure method", "Exchange method"], "D", "The three methods are output, income, and expenditure."),
          q("ni4", "NNP is found by subtracting from GNP", ["depreciation", "exports", "taxes", "transfer payments"], "A", "NNP is GNP less capital consumption."),
        ],
      },
    ],
  },
  {
    id: "accounting",
    name: "Financial Accounting",
    exam: "JAMB · WAEC",
    blurb: "Double entry and the trial balance, explained step by step.",
    group: "commercial",
    topics: [
      {
        id: "double-entry",
        title: "Double entry",
        minutes: 16,
        summary: "The accounting equation and the debit and credit rule for every transaction.",
        notes: [
          {
            heading: "The accounting equation",
            paragraphs: [
              "Everything a business owns is financed by its owner or by outsiders. That is why the two sides of the equation always agree.",
            ],
            formula: "Assets = Capital + Liabilities",
          },
          {
            heading: "Debit and credit",
            paragraphs: [
              "Every transaction touches at least two accounts. One is debited and one is credited, for the same amount. Debit the account that receives value, credit the account that gives it.",
            ],
            points: ["Buy goods for cash: debit Purchases, credit Cash", "Owner adds cash: debit Cash, credit Capital", "Sell goods for cash: debit Cash, credit Sales"],
          },
        ],
        questions: [
          q("de1", "The accounting equation is", ["Assets = Capital + Liabilities", "Assets = Capital − Liabilities", "Capital = Assets + Liabilities", "Liabilities = Assets + Capital"], "A", "Assets are financed by capital and liabilities."),
          q("de2", "In double entry, every transaction affects", ["one account", "at least two accounts", "only the cash account", "only the debit side"], "B", "One account is debited and another credited."),
          q("de3", "Goods are bought for cash. Which account is debited?", ["Cash", "Purchases", "Sales", "Capital"], "B", "Purchases receives value, and Cash is credited."),
          q("de4", "The owner puts cash into the business. Which account is credited?", ["Cash", "Capital", "Drawings", "Bank loan"], "B", "Debit Cash, credit Capital."),
        ],
      },
      {
        id: "trial-balance",
        title: "The trial balance",
        minutes: 14,
        summary: "What it checks, what it cannot catch, and which balances sit on which side.",
        notes: [
          {
            heading: "What it checks",
            paragraphs: [
              "A trial balance lists every ledger balance and checks that total debits equal total credits. It checks arithmetic accuracy. It does not prove that the books are free of every error.",
            ],
            points: ["Debit balances: assets, expenses, drawings", "Credit balances: capital, liabilities, income"],
          },
          {
            heading: "Errors it will not reveal",
            paragraphs: [
              "An entry omitted completely, an entry posted to the wrong account of the same type, or an amount entered wrongly on both sides all leave the trial balance in agreement.",
            ],
          },
        ],
        questions: [
          q("tb1", "A trial balance is prepared to", ["find the profit", "check that total debits equal total credits", "record transactions", "value stock"], "B", "It tests the arithmetic of the ledger."),
          q("tb2", "Which account normally has a debit balance?", ["Sales", "Capital", "Cash", "Creditors"], "C", "Assets such as cash have debit balances."),
          q("tb3", "A trial balance that agrees proves that", ["no errors exist", "the books are arithmetically balanced", "profit is correct", "every transaction was recorded"], "B", "Some errors still leave it balanced."),
          q("tb4", "A transaction that was never recorded will", ["make the trial balance disagree", "not stop the trial balance from agreeing", "double the debit total", "double the credit total"], "B", "An omission affects neither side."),
        ],
      },
    ],
  },
  {
    id: "literature",
    name: "Literature in English",
    exam: "JAMB · WAEC",
    blurb: "The three genres and the devices examiners ask you to name.",
    group: "arts",
    photo: "/media/english.jpg",
    topics: [
      {
        id: "genres",
        title: "Prose, drama and poetry",
        minutes: 12,
        summary: "What separates the three genres and the terms that go with each.",
        notes: [
          {
            heading: "Three genres",
            paragraphs: [
              "Prose is ordinary written language in sentences and paragraphs, as in novels and short stories. Drama is written to be performed, so it is carried by dialogue and action. Poetry compresses language into lines, often arranged in stanzas, with attention to sound and rhythm.",
            ],
            points: ["Prose: narrator, plot, setting, characters", "Drama: acts, scenes, stage directions, dialogue", "Poetry: lines, stanzas, rhyme, rhythm, imagery"],
          },
          {
            heading: "Characters",
            paragraphs: [
              "The protagonist is the main character around whom the story turns. The antagonist opposes the protagonist.",
            ],
          },
        ],
        questions: [
          q("g1", "A play meant to be performed on stage belongs to the genre of", ["prose", "drama", "poetry", "essay"], "B", "Drama is written for performance."),
          q("g2", "Which form is arranged in lines and stanzas?", ["Prose", "Drama", "Poetry", "Biography"], "C", "Lines and stanzas mark poetry."),
          q("g3", "A novel is an example of", ["poetry", "drama", "prose fiction", "epic"], "C", "Novels are long prose fiction."),
          q("g4", "The main character around whom a story revolves is the", ["antagonist", "protagonist", "chorus", "narrator"], "B", "That is the protagonist."),
        ],
      },
      {
        id: "literary-devices",
        title: "Literary devices",
        minutes: 14,
        summary: "Simile, metaphor, personification, hyperbole and irony, with a test for each.",
        notes: [
          {
            heading: "Telling them apart",
            paragraphs: [
              "A simile compares two things using like or as. A metaphor says one thing is another. Personification gives human actions to non-human things. Hyperbole exaggerates for effect. Irony says or shows the opposite of what is expected.",
            ],
            points: ["Simile: as bright as the sun", "Metaphor: time is a thief", "Personification: the wind whispered", "Hyperbole: I have told you a million times"],
          },
        ],
        questions: [
          q("ld1", "\"Her smile was as bright as the morning sun\" is a", ["metaphor", "simile", "irony", "pun"], "B", "It compares using as."),
          q("ld2", "\"Time is a thief\" is a", ["simile", "hyperbole", "metaphor", "alliteration"], "C", "It states that one thing is another."),
          q("ld3", "\"The wind whispered through the trees\" is", ["personification", "irony", "hyperbole", "a simile"], "A", "The wind is given a human action."),
          q("ld4", "\"I have told you a million times\" is an example of", ["understatement", "hyperbole", "euphemism", "paradox"], "B", "It exaggerates for effect."),
        ],
      },
    ],
  },
  {
    id: "history",
    name: "History",
    exam: "JAMB · WAEC",
    blurb: "Nigerian history, from the old states to independence.",
    group: "arts",
    photo: "/media/government.jpg",
    topics: [
      {
        id: "pre-colonial",
        title: "Pre-colonial states",
        minutes: 14,
        summary: "The Hausa city-states, Oyo, and Benin, and what each is remembered for.",
        notes: [
          {
            heading: "Three centres of power",
            paragraphs: [
              "The Hausa city-states, including Kano and Katsina, grew rich on trade across the Sahara and on crafts such as leather and cloth. Oyo was a Yoruba empire ruled by the Alaafin. Benin was a kingdom ruled by the Oba, known for its bronze and brass work.",
            ],
            points: ["Hausa city-states: trade and crafts, ruled by a Sarki", "Oyo: Yoruba empire, ruler is the Alaafin", "Benin: kingdom, ruler is the Oba"],
          },
        ],
        questions: [
          q("pc1", "The Oyo Empire is associated with the", ["Yoruba", "Hausa", "Igbo", "Kanuri"], "A", "Oyo was a Yoruba empire."),
          q("pc2", "The ruler of the Benin Kingdom is called the", ["Alaafin", "Oba", "Emir", "Obi"], "B", "Benin's ruler is the Oba."),
          q("pc3", "The title of the ruler of Oyo was", ["Oba", "Alaafin", "Sarki", "Igwe"], "B", "Oyo was ruled by the Alaafin."),
          q("pc4", "Hausa city-states such as Kano were known for", ["trade across the Sahara and crafts such as leather and cloth", "deep-sea fishing", "rubber plantations", "oil refining"], "A", "Trans-Saharan trade and crafts built their wealth."),
        ],
      },
      {
        id: "amalgamation",
        title: "Amalgamation of 1914",
        minutes: 12,
        summary: "Who joined what, when, and the dates that follow it to independence.",
        notes: [
          {
            heading: "What happened in 1914",
            paragraphs: [
              "In 1914 the Northern and Southern Protectorates were joined into one colony and protectorate under Frederick Lugard, who became the Governor-General. The name Nigeria had been suggested earlier, in 1897, by Flora Shaw.",
            ],
            points: ["1914: amalgamation", "1960, 1 October: independence", "1963: republic"],
          },
        ],
        questions: [
          q("am1", "The Northern and Southern Protectorates were amalgamated in", ["1900", "1914", "1960", "1963"], "B", "The amalgamation took place in 1914."),
          q("am2", "The amalgamation was carried out by", ["Frederick Lugard", "Hugh Clifford", "Arthur Richards", "John Macpherson"], "A", "Lugard became the first Governor-General."),
          q("am3", "The name \"Nigeria\" was suggested by", ["Flora Shaw", "Mary Slessor", "Margery Perham", "Queen Victoria"], "A", "Flora Shaw proposed it in 1897."),
          q("am4", "Nigeria became independent on", ["1 January 1914", "1 October 1960", "1 October 1963", "15 January 1966"], "B", "Independence came on 1 October 1960."),
        ],
      },
    ],
  },
];

export const news = [
  {
    id: "n1",
    tag: "JAMB",
    title: "How to use the last six weeks before UTME",
    date: "12 Oct 2026",
    body: "Stop opening new textbooks. Close weak topics with timed sets of 20, then read only the explanations you missed. Speed comes from repetition, not from fresh notes the night before.",
  },
  {
    id: "n2",
    tag: "WAEC",
    title: "What the theory mark guide is actually scoring",
    date: "4 Oct 2026",
    body: "Points are awarded for named facts, labelled diagrams, and equations with units. A long paragraph that never names the part rarely scores. Write the point, then one clean sentence.",
  },
  {
    id: "n3",
    tag: "Study",
    title: "Topic blocks beat random past questions",
    date: "28 Sep 2026",
    body: "Forty mixed questions feel productive and hide the hole in one topic. Ten questions on one topic show it. Richmirabel is arranged that way on purpose.",
  },
  {
    id: "n4",
    tag: "CBT",
    title: "Three habits that save time in the hall",
    date: "19 Sep 2026",
    body: "Read the last line of a calculation question first. Skip and mark anything that needs more than ninety seconds. Never leave an option blank if guessing is allowed.",
  },
];

export const guides = [
  {
    id: "theory",
    title: "WAEC theory mark guide",
    detail: "How a 10-mark question is usually split, and how to write so each mark is visible.",
    points: [
      "Definition or statement — often 2 marks when the question asks for a definition. Use precise wording.",
      "Labelled diagram — marks only when the question asks for a diagram. Labels must touch the part.",
      "Explanation of the process — one clear sentence per stage the question asks for.",
      "Example, equation, or distinction — show the working when the question asks for it.",
    ],
  },
  {
    id: "objectives",
    title: "Objective paper habits",
    detail: "The difference between knowing the topic and finishing the paper.",
    points: [
      "First pass: answer everything you know in under a minute.",
      "Second pass: the ones you marked. Work them fully.",
      "Last three minutes: fill every remaining bubble with your best remaining option.",
      "Units and signs are part of the answer in calculation items.",
    ],
  },
  {
    id: "practical",
    title: "Practical and diagram checklist",
    detail: "For biology, physics, and chemistry papers that still want a drawing.",
    points: [
      "Pencil for the diagram, pen for labels.",
      "Title the diagram. Markers look for it.",
      "Magnification, if asked, is drawing size over real size.",
      "Do not shade unless the question says shade.",
    ],
  },
];

export function findSubject(id: string) {
  return subjects.find((s) => s.id === id);
}

export function findTopic(id: string) {
  for (const subject of subjects) {
    const topic = subject.topics.find((t) => t.id === id);
    if (topic) return { subject, topic };
  }
  return null;
}

export function allTopics() {
  return subjects.flatMap((s) => s.topics.map((t) => ({ subject: s, topic: t })));
}
