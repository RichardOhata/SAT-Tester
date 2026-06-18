import type { Question } from '../types'

/**
 * Questions transcribed from the College Board "Digital SAT — Sample Questions
 * and Answer Explanations" booklet. Reading & Writing questions 1-15 and Math
 * questions 1-18. Math grid-in questions store every accepted answer form
 * (already normalized) in `acceptedAnswers`.
 */
export const questions: Question[] = [
  // ---------------------------------------------------------------------------
  // READING & WRITING
  // ---------------------------------------------------------------------------
  {
    id: 'rw-1',
    section: 'reading-writing',
    number: 1,
    type: 'multiple-choice',
    passage:
      'To dye wool, Navajo (Diné) weaver Lillie Taylor uses plants and vegetables from Arizona, where she lives. For example, she achieved the deep reds and browns featured in her 2003 rug In the Path of the Four Seasons by using Arizona dock roots, drying and grinding them before mixing the powder with water to create a dye bath. To intensify the appearance of certain colors, Taylor also sometimes mixes in clay obtained from nearby soil.',
    prompt: 'Which choice best states the main idea of the text?',
    choices: [
      { label: 'A', text: 'Reds and browns are not commonly featured in most of Taylor’s rugs.' },
      { label: 'B', text: 'In the Path of the Four Seasons is widely acclaimed for its many colors and innovative weaving techniques.' },
      { label: 'C', text: 'Taylor draws on local resources in the approach she uses to dye wool.' },
      { label: 'D', text: 'Taylor finds it difficult to locate Arizona dock root in the desert.' },
    ],
    correctAnswer: 'C',
    domain: 'Information and Ideas',
    skill: 'Central Ideas and Details',
    explanation:
      'Choice C is the best answer. The passage focuses on the idea that the artist Lillie Taylor uses resources such as plants and vegetables from where she lives in Arizona to make dyes for wool. Choice A is incorrect because the passage offers no evidence that reds and browns are unusual colors in Taylor’s rugs. Choice B is incorrect because the passage offers no indication that the rug is widely acclaimed. Choice D is incorrect because the passage offers no evidence that Taylor has a hard time finding Arizona dock root.',
  },
  {
    id: 'rw-2',
    section: 'reading-writing',
    number: 2,
    type: 'multiple-choice',
    passage:
      'Jan Gimsa, Robert Sleigh, and Ulrike Gimsa have hypothesized that the sail-like structure running down the back of the dinosaur Spinosaurus aegyptiacus improved the animal’s success in underwater pursuits of prey species capable of making quick, evasive movements. To evaluate their hypothesis, a second team of researchers constructed two battery-powered mechanical models of S. aegyptiacus, one with a sail and one without, and subjected the models to a series of identical tests in a water-filled tank.',
    prompt:
      'Which finding from the model tests, if true, would most strongly support Gimsa and colleagues’ hypothesis?',
    choices: [
      { label: 'A', text: 'The model with a sail took significantly longer to travel a specified distance while submerged than the model without a sail did.' },
      { label: 'B', text: 'The model with a sail displaced significantly more water while submerged than the model without a sail did.' },
      { label: 'C', text: 'The model with a sail had significantly less battery power remaining after completing the tests than the model without a sail did.' },
      { label: 'D', text: 'The model with a sail took significantly less time to complete a sharp turn while submerged than the model without a sail did.' },
    ],
    correctAnswer: 'D',
    domain: 'Information and Ideas',
    skill: 'Command of Evidence (Textual)',
    explanation:
      'Choice D is the best answer. The hypothesis was that the sail enhanced the dinosaur’s ability to hunt prey capable of quick, evasive movements; a finding that the sailed model maneuvered (turned) more quickly would support it. Choice A contradicts the hypothesis. Choices B and C describe relationships (water displaced, battery used) with no clear connection to the hypothesis.',
  },
  {
    id: 'rw-3',
    section: 'reading-writing',
    number: 3,
    type: 'multiple-choice',
    passage:
      '“Ghosts of the Old Year” is an early 1900s poem by James Weldon Johnson. In the poem, the speaker describes experiencing an ongoing cycle of anticipation followed by regretful reflection: ______',
    prompt:
      'Which quotation from “Ghosts of the Old Year” most effectively illustrates the claim?',
    choices: [
      { label: 'A', text: '“The snow has ceased its fluttering flight, / The wind sunk to a whisper light, / An ominous stillness fills the night, / A pause—a hush.”' },
      { label: 'B', text: '“And so the years go swiftly by, / Each, coming, brings ambitions high, / And each, departing, leaves a sigh / Linked to the past.”' },
      { label: 'C', text: '“What does this brazen tongue declare, / That falling on the midnight air / Brings to my heart a sense of care / Akin to fright?”' },
      { label: 'D', text: '“It tells of many a squandered day, / Of slighted gems and treasured clay, / Of precious stores not laid away, / Of fields unreaped.”' },
    ],
    correctAnswer: 'B',
    domain: 'Information and Ideas',
    skill: 'Command of Evidence (Textual)',
    explanation:
      'Choice B is the best answer. The quotation addresses both aspects of the claim: anticipation (“Each, coming, brings ambitions high”) and regretful reflection (“And each, departing, leaves a sigh / Linked to the past”). Choice A focuses on anticipation only, Choice C on worry and anxiety, and Choice D on regretful reflection only.',
  },
  {
    id: 'rw-4',
    section: 'reading-writing',
    number: 4,
    type: 'multiple-choice',
    passage:
      'Georgia Tech roboticists De’Aira Bryant and Ayanna Howard, along with ethicist Jason Borenstein, were interested in people’s perceptions of robots’ competence. They recruited participants and asked them how likely they think it is that a robot could do the work required in various occupations. Participants’ evaluations varied widely depending on which occupation was being considered; for example, ______',
    table: {
      caption:
        'Participants’ Evaluation of the Likelihood That Robots Can Work Effectively in Different Occupations',
      headers: ['Occupation', 'Somewhat or very unlikely (%)', 'Neutral (%)', 'Somewhat or very likely (%)'],
      rows: [
        ['television news anchor', '24', '9', '67'],
        ['teacher', '37', '16', '47'],
        ['firefighter', '62', '9', '30'],
        ['surgeon', '74', '9', '16'],
        ['tour guide', '10', '8', '82'],
      ],
      note: 'Rows in table may not add up to 100 due to rounding.',
    },
    prompt: 'Which choice most effectively uses data from the table to complete the example?',
    choices: [
      { label: 'A', text: '82% of participants believe that it is somewhat or very likely that a robot could work effectively as a tour guide, but only 16% believe that it is somewhat or very likely that a robot could work as a surgeon.' },
      { label: 'B', text: '47% of participants believe that it is somewhat or very likely that a robot could work effectively as a teacher, but 37% of respondents believe that it is somewhat or very unlikely that a robot could do so.' },
      { label: 'C', text: '9% of participants were neutral about whether a robot could work effectively as a television news anchor, which is the same percent of participants who were neutral when asked about a robot working as a surgeon.' },
      { label: 'D', text: '62% of participants believe that it is somewhat or very unlikely that a robot could work effectively as a firefighter.' },
    ],
    correctAnswer: 'A',
    domain: 'Information and Ideas',
    skill: 'Command of Evidence (Quantitative)',
    explanation:
      'Choice A is the best answer. It supports the claim by contrasting two occupations with widely divergent results: tour guide (82%) and surgeon (16%). Choices B and D focus on a single occupation. Choice C compares two occupations whose percentages are the same, not widely varied.',
  },
  {
    id: 'rw-5',
    section: 'reading-writing',
    number: 5,
    type: 'multiple-choice',
    passage:
      'Many animals, including humans, must sleep, and sleep is known to have a role in everything from healing injuries to encoding information in long-term memory. But some scientists claim that, from an evolutionary standpoint, deep sleep for hours at a time leaves an animal so vulnerable that the known benefits of sleeping seem insufficient to explain why it became so widespread in the animal kingdom. These scientists therefore imply that ______',
    prompt: 'Which choice most logically completes the text?',
    choices: [
      { label: 'A', text: 'it is more important to understand how widespread prolonged deep sleep is than to understand its function.' },
      { label: 'B', text: 'prolonged deep sleep is likely advantageous in ways that have yet to be discovered.' },
      { label: 'C', text: 'many traits that provide significant benefits for an animal also likely pose risks to that animal.' },
      { label: 'D', text: 'most traits perform functions that are hard to understand from an evolutionary standpoint.' },
    ],
    correctAnswer: 'B',
    domain: 'Information and Ideas',
    skill: 'Inferences',
    explanation:
      'Choice B is the best answer. Because the known benefits seem insufficient to justify how risky and widespread deep sleep is, the scientists imply there must be some so-far-undiscovered advantage. Choices A, C, and D introduce claims the passage does not support.',
  },
  {
    id: 'rw-6',
    section: 'reading-writing',
    number: 6,
    type: 'multiple-choice',
    passage:
      'In recommending Bao Phi’s collection Sông I Sing, a librarian noted that pieces by the spoken-word poet don’t lose their ______ nature when printed: the language has the same pleasant musical quality on the page as it does when performed by Phi.',
    prompt: 'Which choice completes the text with the most logical and precise word or phrase?',
    choices: [
      { label: 'A', text: 'jarring' },
      { label: 'B', text: 'scholarly' },
      { label: 'C', text: 'melodic' },
      { label: 'D', text: 'personal' },
    ],
    correctAnswer: 'C',
    domain: 'Craft and Structure',
    skill: 'Words in Context',
    explanation:
      'Choice C is the best answer. “Melodic,” referring to a pleasant arrangement of sounds, signals the later “pleasant musical quality.” “Jarring” means the opposite; “scholarly” and “personal” do not connect to the musical quality described.',
  },
  {
    id: 'rw-7',
    section: 'reading-writing',
    number: 7,
    type: 'multiple-choice',
    passage:
      'The following text is from F. Scott Fitzgerald’s 1925 novel The Great Gatsby.\n\n[Jay Gatsby] was balancing himself on the dashboard of his car with that resourcefulness of movement that is so peculiarly American—that comes, I suppose, with the absence of lifting work in youth and, even more, with the formless grace of our nervous, sporadic games. This quality was continually breaking through his punctilious manner in the shape of restlessness.',
    prompt: 'As used in the text, what does the word “quality” most nearly mean?',
    choices: [
      { label: 'A', text: 'Characteristic' },
      { label: 'B', text: 'Standard' },
      { label: 'C', text: 'Prestige' },
      { label: 'D', text: 'Accomplishment' },
    ],
    correctAnswer: 'A',
    domain: 'Craft and Structure',
    skill: 'Words in Context',
    explanation:
      'Choice A is the best answer. “Quality” refers to a trait or attribute (“characteristic”)—Gatsby’s “resourcefulness of movement,” which manifested as restlessness. “Standard,” “prestige,” and “accomplishment” do not fit the context.',
  },
  {
    id: 'rw-8',
    section: 'reading-writing',
    number: 8,
    type: 'multiple-choice',
    passage:
      'The work of molecular biophysicist Enrique M. De La Cruz is known for ______ traditional boundaries between academic disciplines. The university laboratory that De La Cruz runs includes engineers, biologists, chemists, and physicists, and the research the lab produces makes use of insights and techniques from all those fields.',
    prompt: 'Which choice completes the text with the most logical and precise word or phrase?',
    choices: [
      { label: 'A', text: 'reinforcing' },
      { label: 'B', text: 'anticipating' },
      { label: 'C', text: 'epitomizing' },
      { label: 'D', text: 'transcending' },
    ],
    correctAnswer: 'D',
    domain: 'Craft and Structure',
    skill: 'Words in Context',
    explanation:
      'Choice D is the best answer. “Transcending” (rising above or going beyond limits) signals that De La Cruz broke down disciplinary boundaries by drawing on many fields. “Reinforcing” and “epitomizing” suggest the opposite, and “anticipating” does not fit.',
  },
  {
    id: 'rw-9',
    section: 'reading-writing',
    number: 9,
    type: 'multiple-choice',
    passage:
      'Some studies have suggested that posture can influence cognition, but we should not overstate this phenomenon. A case in point: In a 2014 study, Megan O’Brien and Alaa Ahmed had subjects stand or sit while making risky simulated economic decisions. Standing is more physically unstable and cognitively demanding than sitting; accordingly, O’Brien and Ahmed hypothesized that standing subjects would display more risk aversion during the decision-making tasks than sitting subjects did, since they would want to avoid further feelings of discomfort and complicated risk evaluations. But O’Brien and Ahmed actually found no difference in the groups’ performance.',
    prompt: 'Which choice best states the main purpose of the text?',
    choices: [
      { label: 'A', text: 'It presents the study by O’Brien and Ahmed to critique the methods and results reported in previous studies of the effects of posture on cognition.' },
      { label: 'B', text: 'It argues that research findings about the effects of posture on cognition are often misunderstood, as in the case of O’Brien and Ahmed’s study.' },
      { label: 'C', text: 'It explains a significant problem in the emerging understanding of posture’s effects on cognition and how O’Brien and Ahmed tried to solve that problem.' },
      { label: 'D', text: 'It discusses the study by O’Brien and Ahmed to illustrate why caution is needed when making claims about the effects of posture on cognition.' },
    ],
    correctAnswer: 'D',
    domain: 'Craft and Structure',
    skill: 'Text Structure and Purpose',
    explanation:
      'Choice D is the best answer. The passage says “we should not overstate” the effect of posture on cognition and uses the O’Brien and Ahmed study as a “case in point.” The other choices describe purposes (critiquing methods, claiming misunderstanding, solving a stated problem) the passage does not support.',
  },
  {
    id: 'rw-10',
    section: 'reading-writing',
    number: 10,
    type: 'multiple-choice',
    passage:
      'The following text is from Herman Melville’s 1854 short story “The Lightning-Rod Man.”\n\nThe stranger still stood in the exact middle of the cottage, where he had first planted himself. His singularity impelled a closer scrutiny. A lean, gloomy figure. Hair dark and lank, mattedly streaked over his brow. His sunken pitfalls of eyes were ringed by indigo halos, and played with an innocuous sort of lightning: the gleam without the bolt. The whole man was dripping. He stood in a puddle on the bare oak floor: his strange walking-stick vertically resting at his side.\n\n(The underlined sentence is: “His singularity impelled a closer scrutiny.”)',
    prompt:
      'Which choice best states the function of the underlined sentence in the text as a whole?',
    choices: [
      { label: 'A', text: 'It sets up the character description presented in the sentences that follow.' },
      { label: 'B', text: 'It establishes a contrast with the description in the previous sentence.' },
      { label: 'C', text: 'It elaborates on the previous sentence’s description of the character.' },
      { label: 'D', text: 'It introduces the setting that is described in the sentences that follow.' },
    ],
    correctAnswer: 'A',
    domain: 'Craft and Structure',
    skill: 'Text Structure and Purpose',
    explanation:
      'Choice A is the best answer. The underlined sentence—that the stranger’s uniqueness invited careful examination—sets up the following description of his distinctive features. Choice B is wrong (no contrast), Choice C is wrong (the previous sentence doesn’t describe him), and Choice D is wrong (it introduces a person, not a setting).',
  },
  {
    id: 'rw-11',
    section: 'reading-writing',
    number: 11,
    type: 'multiple-choice',
    passage:
      'Text 1\nWhat factors influence the abundance of species in a given ecological community? Some theorists have argued that historical diversity is a major driver of how diverse an ecological community eventually becomes: differences in community diversity across otherwise similar habitats, in this view, are strongly affected by the number of species living in those habitats at earlier times.\n\nText 2\nIn 2010, a group of researchers including biologist Carla Cáceres created artificial pools in a New York forest. They stocked some pools with a diverse mix of zooplankton species and others with a single zooplankton species and allowed the pool communities to develop naturally thereafter. Over the course of four years, Cáceres and colleagues periodically measured the species diversity of the pools, finding—contrary to their expectations—that by the end of the study there was little to no difference in the pools’ species diversity.',
    prompt:
      'Based on the texts, how would Cáceres and colleagues (Text 2) most likely describe the view of the theorists presented in Text 1?',
    choices: [
      { label: 'A', text: 'It is largely correct, but it requires a minor refinement in light of the research team’s results.' },
      { label: 'B', text: 'It is not compelling as a theory regardless of any experimental data collected by the research team.' },
      { label: 'C', text: 'It may seem plausible, but it is not supported by the research team’s findings.' },
      { label: 'D', text: 'It probably holds true only in conditions like those in the research team’s study.' },
    ],
    correctAnswer: 'C',
    domain: 'Craft and Structure',
    skill: 'Cross-Text Connections',
    explanation:
      'Choice C is the best answer. Cáceres and colleagues expected the multi-species pools to end up more diverse, but found little to no difference—undermining Text 1’s view. Choice A overstates support, Choice B ignores that they initially assumed the view was correct, and Choice D wrongly suggests their findings support the view under some conditions.',
  },
  {
    id: 'rw-12',
    section: 'reading-writing',
    number: 12,
    type: 'multiple-choice',
    passage:
      'While researching a topic, a student has taken the following notes:\n• Maika’i Tubbs is a Native Hawaiian sculptor and installation artist.\n• His work has been shown in the United States, Canada, Japan, and Germany, among other places.\n• Many of his sculptures feature discarded objects.\n• His work Erasure (2008) includes discarded audiocassette tapes and magnets.\n• His work Home Grown (2009) includes discarded pushpins, plastic plates and forks, and wood.\n\nThe student wants to emphasize a similarity between the two works.',
    prompt:
      'Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    choices: [
      { label: 'A', text: 'Erasure (2008) uses discarded objects such as audiocassette tapes and magnets; Home Grown (2009), however, includes pushpins, plastic plates and forks, and wood.' },
      { label: 'B', text: 'Like many of Tubbs’s sculptures, both Erasure and Home Grown include discarded objects: Erasure uses audiocassette tapes, and Home Grown uses plastic forks.' },
      { label: 'C', text: 'Tubbs’s work, which often features discarded objects, has been shown both within the United States and abroad.' },
      { label: 'D', text: 'Tubbs completed Erasure in 2008 and Home Grown in 2009.' },
    ],
    correctAnswer: 'B',
    domain: 'Expression of Ideas',
    skill: 'Rhetorical Synthesis',
    explanation:
      'Choice B is the best answer. “Like many of Tubbs’s sculptures” and “both” emphasize the similarity that both works use discarded objects. Choice A emphasizes a contrast (“however”), Choice C mentions no specific works, and Choice D states facts without showing a relationship.',
  },
  {
    id: 'rw-13',
    section: 'reading-writing',
    number: 13,
    type: 'multiple-choice',
    passage:
      'Iraqi artist Nazik Al-Malaika, celebrated as the first Arabic poet to write in free verse, didn’t reject traditional forms entirely; her poem “Elegy for a Woman of No Importance” consists of two ten-line stanzas and a standard number of syllables. Even in this superficially traditional work, ______ Al-Malaika was breaking new ground by memorializing an anonymous woman rather than a famous man.',
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: [
      { label: 'A', text: 'in fact,' },
      { label: 'B', text: 'though,' },
      { label: 'C', text: 'therefore,' },
      { label: 'D', text: 'moreover,' },
    ],
    correctAnswer: 'B',
    domain: 'Expression of Ideas',
    skill: 'Transitions',
    explanation:
      'Choice B is the best answer. Along with “even,” “though” signals that Al-Malaika subverted traditional forms even while using them (a nontraditional subject for an elegy). “In fact,” “therefore,” and “moreover” all signal the wrong logical relationship.',
  },
  {
    id: 'rw-14',
    section: 'reading-writing',
    number: 14,
    type: 'multiple-choice',
    passage:
      'According to Naomi Nakayama of the University of Edinburgh, the reason seeds from a dying dandelion appear to float in the air while ______ is that their porous plumes enhance drag, allowing the seeds to stay airborne long enough for the wind to disperse them throughout the surrounding area.',
    prompt:
      'Which choice completes the text so that it conforms to the conventions of Standard English?',
    choices: [
      { label: 'A', text: 'falling,' },
      { label: 'B', text: 'falling:' },
      { label: 'C', text: 'falling;' },
      { label: 'D', text: 'falling' },
    ],
    correctAnswer: 'D',
    domain: 'Standard English Conventions',
    skill: 'Boundaries',
    explanation:
      'Choice D is the best answer. No punctuation is needed. Choices A, B, and C each insert unnecessary punctuation between the sentence’s subject (“the reason . . . falling”) and the verb “is.”',
  },
  {
    id: 'rw-15',
    section: 'reading-writing',
    number: 15,
    type: 'multiple-choice',
    passage:
      'Rabinal Achí is a precolonial Maya dance drama performed annually in Rabinal, a town in the Guatemalan highlands. Based on events that occurred when Rabinal was a city-state ruled by a king, ______ had once been an ally of the king but was later captured while leading an invading force against him.',
    prompt:
      'Which choice completes the text so that it conforms to the conventions of Standard English?',
    choices: [
      { label: 'A', text: 'Rabinal Achí tells the story of K’iche’ Achí, a military leader who' },
      { label: 'B', text: 'K’iche’ Achí, the military leader in the story of Rabinal Achí,' },
      { label: 'C', text: 'there was a military leader, K’iche’ Achí, who in Rabinal Achí' },
      { label: 'D', text: 'the military leader whose story is told in Rabinal Achí, K’iche’ Achí,' },
    ],
    correctAnswer: 'A',
    domain: 'Standard English Conventions',
    skill: 'Form, Structure, and Sense',
    explanation:
      'Choice A is the best answer. It places the introductory participial phrase (“Based on events . . . ruled by a king”) immediately before the noun it modifies, “Rabinal Achí.” Choices B, C, and D create dangling modifiers.',
  },

  // ---------------------------------------------------------------------------
  // MATH
  // ---------------------------------------------------------------------------
  {
    id: 'math-1',
    section: 'math',
    number: 1,
    type: 'multiple-choice',
    passage: 'If f(x) = x + 7 and g(x) = 7x, what is the value of 4f(2) − g(2)?',
    prompt: 'Select the correct value.',
    choices: [
      { label: 'A', text: '−5' },
      { label: 'B', text: '1' },
      { label: 'C', text: '22' },
      { label: 'D', text: '28' },
    ],
    correctAnswer: 'C',
    domain: 'Algebra',
    skill: 'Linear functions',
    explanation:
      'Choice C is correct. f(2) = 2 + 7 = 9 and g(2) = 7(2) = 14. So 4f(2) − g(2) = 4(9) − 14 = 36 − 14 = 22.',
  },
  {
    id: 'math-2',
    section: 'math',
    number: 2,
    type: 'grid-in',
    passage:
      'The y-intercept of the graph of y = −6x − 32 in the xy-plane is (0, y). What is the value of y?',
    prompt: 'Enter your answer.',
    correctAnswer: '−32',
    acceptedAnswers: ['-32'],
    domain: 'Algebra',
    skill: 'Linear equations in two variables',
    explanation:
      'The correct answer is −32. Substituting 0 for x in y = −6x − 32 yields y = −6(0) − 32 = −32.',
  },
  {
    id: 'math-3',
    section: 'math',
    number: 3,
    type: 'multiple-choice',
    passage:
      'The graph of the function f, where y = f(x), models the total cost y, in dollars, for a certain video game system and x games.',
    figureNote:
      'The graph is a straight line. At x = 0 (no games), the total cost y is $100. The line rises steadily, passing through (1, 125), so the cost increases by $25 for each additional game.',
    prompt: 'What is the best interpretation of the slope of the graph in this context?',
    choices: [
      { label: 'A', text: 'Each game costs $25.' },
      { label: 'B', text: 'The video game system costs $100.' },
      { label: 'C', text: 'The video game system costs $25.' },
      { label: 'D', text: 'Each game costs $100.' },
    ],
    correctAnswer: 'A',
    domain: 'Algebra',
    skill: 'Linear functions',
    explanation:
      'Choice A is correct. The slope is the change in total cost per additional game. As x increases from 0 to 1, y increases from 100 to 125, so the slope is 25 — each game costs $25. Choice B interprets the y-intercept, not the slope.',
  },
  {
    id: 'math-4',
    section: 'math',
    number: 4,
    type: 'multiple-choice',
    passage: 'y < −4x + 4',
    prompt: 'Which point (x, y) is a solution to the given inequality in the xy-plane?',
    choices: [
      { label: 'A', text: '(2, −1)' },
      { label: 'B', text: '(2, 1)' },
      { label: 'C', text: '(0, 5)' },
      { label: 'D', text: '(−4, 0)' },
    ],
    correctAnswer: 'D',
    domain: 'Algebra',
    skill: 'Linear inequalities in one or two variables',
    explanation:
      'Choice D is correct. For (−4, 0): 0 < −4(−4) + 4, i.e. 0 < 20, which is true. Each of the other points has a y-coordinate that is not less than −4x + 4.',
  },
  {
    id: 'math-5',
    section: 'math',
    number: 5,
    type: 'multiple-choice',
    passage:
      'Figure A and figure B are both regular polygons. The sum of the perimeter of figure A and the perimeter of figure B is 63 inches. The equation 3x + 6y = 63 represents this situation, where x is the number of sides of figure A and y is the number of sides of figure B.',
    prompt: 'Which statement is the best interpretation of 6 in this context?',
    choices: [
      { label: 'A', text: 'Each side of figure B has a length of 6 inches.' },
      { label: 'B', text: 'The number of sides of figure B is 6.' },
      { label: 'C', text: 'Each side of figure A has a length of 6 inches.' },
      { label: 'D', text: 'The number of sides of figure A is 6.' },
    ],
    correctAnswer: 'A',
    domain: 'Algebra',
    skill: 'Linear equations in two variables',
    explanation:
      'Choice A is correct. 3x and 6y represent the perimeters of figures A and B. Since 6y is figure B’s perimeter and y is its number of sides, each side of figure B has length 6 inches.',
  },
  {
    id: 'math-6',
    section: 'math',
    number: 6,
    type: 'multiple-choice',
    passage:
      'Store A sells raspberries for $5.50 per pint and blackberries for $3.00 per pint. Store B sells raspberries for $6.50 per pint and blackberries for $8.00 per pint. A certain purchase of raspberries and blackberries would cost $37.00 at store A or $66.00 at store B.',
    prompt: 'How many pints of blackberries are in this purchase?',
    choices: [
      { label: 'A', text: '12' },
      { label: 'B', text: '8' },
      { label: 'C', text: '5' },
      { label: 'D', text: '4' },
    ],
    correctAnswer: 'C',
    domain: 'Algebra',
    skill: 'Systems of two linear equations in two variables',
    explanation:
      'Choice C is correct. With r pints of raspberries and b pints of blackberries: 5.50r + 3.00b = 37.00 and 6.50r + 8.00b = 66.00. Solving the system by elimination gives b = 5. (Choice D, 4, is the number of raspberry pints.)',
  },
  {
    id: 'math-7',
    section: 'math',
    number: 7,
    type: 'multiple-choice',
    passage: 'g(x) = x² + 55',
    prompt: 'What is the minimum value of the given function?',
    choices: [
      { label: 'A', text: '3,025' },
      { label: 'B', text: '110' },
      { label: 'C', text: '55' },
      { label: 'D', text: '0' },
    ],
    correctAnswer: 'C',
    domain: 'Advanced Math',
    skill: 'Nonlinear functions',
    explanation:
      'Choice C is correct. Written as g(x) = 1(x − 0)² + 55, the function has its minimum value k = 55 at x = 0. (Choice D, 0, is the x-value where the minimum occurs.)',
  },
  {
    id: 'math-8',
    section: 'math',
    number: 8,
    type: 'multiple-choice',
    passage:
      'The function h is defined by h(x) = aˣ + b, where a and b are positive constants. The graph of y = h(x) in the xy-plane passes through the points (0, 10) and (−2, 325/36).',
    prompt: 'What is the value of ab?',
    choices: [
      { label: 'A', text: '1/4' },
      { label: 'B', text: '1/2' },
      { label: 'C', text: '54' },
      { label: 'D', text: '60' },
    ],
    correctAnswer: 'C',
    domain: 'Advanced Math',
    skill: 'Nonlinear functions',
    explanation:
      'Choice C is correct. From (0, 10): 10 = a⁰ + b = 1 + b, so b = 9. From (−2, 325/36): 325/36 = a⁻² + 9, so a⁻² = 1/36, giving a² = 36 and (since a is positive) a = 6. Thus ab = 6 × 9 = 54.',
  },
  {
    id: 'math-9',
    section: 'math',
    number: 9,
    type: 'multiple-choice',
    passage: '(x − 1)² = −4',
    prompt: 'How many distinct real solutions does the given equation have?',
    choices: [
      { label: 'A', text: 'Exactly one' },
      { label: 'B', text: 'Exactly two' },
      { label: 'C', text: 'Infinitely many' },
      { label: 'D', text: 'Zero' },
    ],
    correctAnswer: 'D',
    domain: 'Advanced Math',
    skill: 'Nonlinear equations in one variable and systems of equations in two variables',
    explanation:
      'Choice D is correct. The left side, a square, is always ≥ 0 for real x, but the right side is negative. No real value of x satisfies the equation, so there are zero real solutions.',
  },
  {
    id: 'math-10',
    section: 'math',
    number: 10,
    type: 'multiple-choice',
    passage: 'Which expression is equivalent to 4/(4x − 5) − 1/(x + 1)?',
    prompt: 'Select the equivalent expression.',
    choices: [
      { label: 'A', text: '9 / ((x + 1)(4x − 5))' },
      { label: 'B', text: '3 / (3x − 6)' },
      { label: 'C', text: '1 / ((x + 1)(4x − 5))' },
      { label: 'D', text: '−1 / ((x + 1)(4x − 5))' },
    ],
    correctAnswer: 'A',
    domain: 'Advanced Math',
    skill: 'Equivalent expressions',
    explanation:
      'Choice A is correct. Using the common denominator (x + 1)(4x − 5): [4(x + 1) − (4x − 5)] / ((x + 1)(4x − 5)) = (4x + 4 − 4x + 5) / ((x + 1)(4x − 5)) = 9 / ((x + 1)(4x − 5)).',
  },
  {
    id: 'math-11',
    section: 'math',
    number: 11,
    type: 'grid-in',
    passage:
      'For the function f, f(0) = 86, and for each increase in x by 1, the value of f(x) decreases by 80%. What is the value of f(2)?',
    prompt: 'Enter your answer (e.g. 3.44 or 86/25).',
    correctAnswer: '3.44',
    acceptedAnswers: ['3.44', '86/25'],
    domain: 'Advanced Math',
    skill: 'Nonlinear functions',
    explanation:
      'The correct answer is 3.44 (or 86/25). The function is f(x) = 86(0.2)ˣ, since it decays to 20% of its value each step. So f(2) = 86(0.2)² = 86(0.04) = 3.44.',
  },
  {
    id: 'math-12',
    section: 'math',
    number: 12,
    type: 'grid-in',
    passage:
      'In the xy-plane, a line with equation 2y = 4.5 intersects a parabola at exactly one point. If the parabola has equation y = −4x² + bx, where b is a positive constant, what is the value of b?',
    prompt: 'Enter your answer.',
    correctAnswer: '6',
    acceptedAnswers: ['6'],
    domain: 'Advanced Math',
    skill: 'Nonlinear equations in one variable and systems of equations in two variables',
    explanation:
      'The correct answer is 6. The line is y = 2.25. Setting 2.25 = −4x² + bx gives 4x² − bx + 2.25 = 0. For exactly one solution, the discriminant b² − 4(4)(2.25) = b² − 36 = 0, so b² = 36 and (since b is positive) b = 6.',
  },
  {
    id: 'math-13',
    section: 'math',
    number: 13,
    type: 'multiple-choice',
    passage:
      'The scatterplot shows the relationship between two variables, x and y. A line of best fit for the data is also shown.',
    figureNote:
      'The line of best fit slopes downward from left to right. Near x = 24 the line is at about y = 10, and it falls steadily to about y = 1 near x = 35. At x = 32, the line of best fit has a y-value between 2 and 3.',
    prompt:
      'At x = 32, which of the following is closest to the y-value predicted by the line of best fit?',
    choices: [
      { label: 'A', text: '0.4' },
      { label: 'B', text: '1.5' },
      { label: 'C', text: '2.4' },
      { label: 'D', text: '3.3' },
    ],
    correctAnswer: 'C',
    domain: 'Problem-Solving and Data Analysis',
    skill: 'Two-variable data: Models and scatterplots',
    explanation:
      'Choice C is correct. At x = 32 the line of best fit has a y-value between 2 and 3; the only choice in that range is 2.4.',
  },
  {
    id: 'math-14',
    section: 'math',
    number: 14,
    type: 'multiple-choice',
    passage:
      'In a group, 40% of the items are red. Of all the red items in the group, 30% also have stripes.',
    prompt: 'What percentage of the items in the group are red and have stripes?',
    choices: [
      { label: 'A', text: '10%' },
      { label: 'B', text: '12%' },
      { label: 'C', text: '70%' },
      { label: 'D', text: '75%' },
    ],
    correctAnswer: 'B',
    domain: 'Problem-Solving and Data Analysis',
    skill: 'Percentages',
    explanation:
      'Choice B is correct. The red-and-striped items are 0.3 × 0.4x = 0.12x, i.e. 12% of the total. (Choice A subtracts the percentages; Choice C adds them.)',
  },
  {
    id: 'math-15',
    section: 'math',
    number: 15,
    type: 'multiple-choice',
    passage:
      'The density of a certain type of wood is 353 kilograms per cubic meter. A sample of this type of wood is in the shape of a cube and has a mass of 345 kilograms.',
    prompt:
      'To the nearest hundredth of a meter, what is the length of one edge of this sample?',
    choices: [
      { label: 'A', text: '0.98' },
      { label: 'B', text: '0.99' },
      { label: 'C', text: '1.01' },
      { label: 'D', text: '1.02' },
    ],
    correctAnswer: 'B',
    domain: 'Problem-Solving and Data Analysis',
    skill: 'Ratios, rates, proportional relationships, and units',
    explanation:
      'Choice B is correct. Volume = mass / density = 345/353 m³. For a cube, edge = ∛(345/353) ≈ 0.99 meters.',
  },
  {
    id: 'math-16',
    section: 'math',
    number: 16,
    type: 'multiple-choice',
    passage:
      'Two nearby trees are perpendicular to the ground, which is flat. One of these trees is 10 feet tall and has a shadow that is 5 feet long. At the same time, the shadow of the other tree is 2 feet long.',
    prompt: 'How tall, in feet, is the other tree?',
    choices: [
      { label: 'A', text: '3' },
      { label: 'B', text: '4' },
      { label: 'C', text: '8' },
      { label: 'D', text: '27' },
    ],
    correctAnswer: 'B',
    domain: 'Geometry and Trigonometry',
    skill: 'Lines, angles, and triangles',
    explanation:
      'Choice B is correct. The trees and shadows form similar right triangles: 10/5 = x/2, so x = 4. The other tree is 4 feet tall.',
  },
  {
    id: 'math-17',
    section: 'math',
    number: 17,
    type: 'multiple-choice',
    passage:
      'The length of a rectangle’s diagonal is 5√17, and the length of the rectangle’s shorter side is 5.',
    prompt: 'What is the length of the rectangle’s longer side?',
    choices: [
      { label: 'A', text: '√17' },
      { label: 'B', text: '20' },
      { label: 'C', text: '15√2' },
      { label: 'D', text: '400' },
    ],
    correctAnswer: 'B',
    domain: 'Geometry and Trigonometry',
    skill: 'Right triangles and trigonometry',
    explanation:
      'Choice B is correct. By the Pythagorean theorem, 5² + b² = (5√17)², i.e. 25 + b² = 425, so b² = 400 and b = 20. (Choice D, 400, is b².)',
  },
  {
    id: 'math-18',
    section: 'math',
    number: 18,
    type: 'multiple-choice',
    passage:
      'A circle has center O, and points A and B lie on the circle. The measure of arc AB is 45° and the length of arc AB is 3 inches.',
    prompt: 'What is the circumference, in inches, of the circle?',
    choices: [
      { label: 'A', text: '3' },
      { label: 'B', text: '6' },
      { label: 'C', text: '9' },
      { label: 'D', text: '24' },
    ],
    correctAnswer: 'D',
    domain: 'Geometry and Trigonometry',
    skill: 'Circles',
    explanation:
      'Choice D is correct. The arc is 45/360 = 1/8 of the circle. So 1/8 = 3/x, giving x = 24 inches for the circumference.',
  },
]
