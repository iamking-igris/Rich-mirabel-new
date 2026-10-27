import type { Choice, Question } from "@/data/catalog";
const q = (id: string, prompt: string, options: [string, string, string, string], answer: Choice, explain: string, subjectId: string): Question & { subjectId: string } => ({
  id, prompt, options: (["A","B","C","D"] as Choice[]).map((key,i)=>({key,text:options[i]})), answer, explain, answerKeyStatus: "demo", subjectId,
});
export const demoJambBank: (Question & { subjectId: string })[] = [
  q("je1","Choose the option nearest in meaning to ‘candid’.",["secretive","frank","angry","lazy"],"B","Candid means frank.","english"),
  q("je2","Neither the boys nor the girl ___ present.",["were","are","is","have"],"C","Nearer subject.","english"),
  q("je3","The antonym of ‘scarce’ is",["rare","abundant","little","costly"],"B","Abundant.","english"),
  q("je4","‘Time is a thief’ is an example of",["simile","metaphor","irony","hyperbole"],"B","Metaphor.","english"),
  q("je5","She insisted ___ leaving early.",["on","to","for","at"],"A","Insist on.","english"),
  q("je6","The plural of ‘criterion’ is",["criterions","criteria","criterias","criterion"],"B","Criteria.","english"),
  q("je7","A ‘sparse’ population is",["dense","thinly distributed","wealthy","urban only"],"B","Sparse.","english"),
  q("je8","Choose the correctly punctuated sentence.",["Its raining outside.","It's raining outside.","Its' raining outside.","It raining outside."],"B","It's.","english"),
  q("je9","In ‘the plea was granted’, granted means",["refused","approved","delayed","written"],"B","Approved.","english"),
  q("je10","Each of the candidates ___ a form.",["have","has","are having","were given many"],"B","Each singular.","english"),
  q("jp1","v = fλ is the equation for",["force","wave speed","power","pressure"],"B","Wave equation.","physics"),
  q("jp2","SI unit of force is the",["joule","watt","newton","pascal"],"C","Newton.","physics"),
  q("jp3","Ohm’s law relates",["V, I and R","P, V and t","m, a and g","f and T only"],"A","V=IR.","physics"),
  q("jp4","Acceleration due to gravity is about",["9.8 m/s²","9.8 m/s","98 m/s²","0.98 m/s"],"A","g.","physics"),
  q("jp5","Work done is measured in",["watts","newtons","joules","amperes"],"C","Joule.","physics"),
  q("jp6","A body from rest: u equals",["g","0","1","∞"],"B","u=0.","physics"),
  q("jp7","Frequency is the reciprocal of",["wavelength","period","amplitude","speed"],"B","f=1/T.","physics"),
  q("jp8","Density unit is",["kg/m³","kg m/s","N/m","J/s"],"A","kg/m³.","physics"),
  q("jp9","Reflection: angle of incidence equals angle of",["refraction","reflection","diffraction","dispersion"],"B","Reflection.","physics"),
  q("jp10","KE of mass m speed v is",["mv","½mv²","mgh","mv²"],"B","½mv².","physics"),
  q("jm1","Quadratic formula for ax²+bx+c=0 is",["x = (−b ± √(b²−4ac)) / 2a","x = b ± √(b²−4ac) / 2a","x = −b ± √(b²+4ac) / 2a","x = −b / 2a only"],"A","Standard.","mathematics"),
  q("jm2","If 2x + 3 = 11, x is",["4","7","5","8"],"A","x=4.","mathematics"),
  q("jm3","Gradient of y = 3x − 2 is",["−2","3","2","0"],"B","3.","mathematics"),
  q("jm4","sin 30° is",["1","½","√3/2","0"],"B","1/2.","mathematics"),
  q("jm5","log₁₀ 1000 equals",["2","3","4","1"],"B","3.","mathematics"),
  q("jm6","Mean of 2, 4, 6, 8 is",["4","5","6","20"],"B","5.","mathematics"),
  q("jm7","If a∝b and a=6 when b=2, a when b=5 is",["15","10","12","30"],"A","15.","mathematics"),
  q("jm8","Factorise x² − 5x + 6",["(x−2)(x−3)","(x−1)(x−6)","(x+2)(x+3)","(x−2)(x+3)"],"A","(x-2)(x-3).","mathematics"),
  q("jm9","Range of 3, 7, 2, 9 is",["7","5","6","9"],"A","7.","mathematics"),
  q("jm10","2³ × 2² equals",["2⁵","2⁶","4⁵","2"],"A","2^5.","mathematics"),
  q("jc1","Atomic number is the number of",["neutrons","protons","electrons only in ions","nucleons always equal mass"],"B","Protons.","chemistry"),
  q("jc2","pH of a neutral solution at 25°C is",["0","7","14","1"],"B","7.","chemistry"),
  q("jc3","A mole contains Avogadro’s number of",["grams","particles","litres only","degrees"],"B","Particles.","chemistry"),
  q("jc4","Oxidation is",["gain of electrons","loss of electrons","gain of protons only","loss of neutrons"],"B","Loss of e-.","chemistry"),
  q("jc5","Gas from Zn + dilute HCl is",["O₂","H₂","CO₂","N₂"],"B","H2.","chemistry"),
  q("jc6","Isotopes have the same number of",["neutrons","protons","nucleons always","mass number"],"B","Protons.","chemistry"),
  q("jc7","An endothermic process",["releases heat","absorbs heat","has ΔH = 0","never occurs"],"B","Absorbs.","chemistry"),
  q("jc8","Formula of water is",["H₂O₂","H₂O","HO","H₃O"],"B","H2O.","chemistry"),
  q("jc9","A catalyst",["is used up","speeds a reaction without being consumed","always shifts equilibrium to products","raises activation energy"],"B","Not consumed.","chemistry"),
  q("jc10","Ionic bonding involves",["sharing of electrons","transfer of electrons","hydrogen bonds only","metallic lattices only"],"B","Transfer.","chemistry"),
];
export type JambPaperConfig = { id: string; title: string; subjectIds: string[]; perSubject: number; timerSeconds: number; label: string };
export const demoJambPaper: JambPaperConfig = { id: "jamb-demo-40", title: "Demo JAMB CBT (40 questions)", subjectIds: ["english","physics","mathematics","chemistry"], perSubject: 10, timerSeconds: 40*60, label: "DEMO — not an official JAMB paper" };
export function buildJambPaper(subjectFilter?: string[]): (Question & { subjectId: string })[] {
  const ids = subjectFilter?.length ? subjectFilter : demoJambPaper.subjectIds;
  const out: (Question & { subjectId: string })[] = [];
  for (const sid of ids) out.push(...demoJambBank.filter(x => x.subjectId === sid).slice(0, demoJambPaper.perSubject));
  return out;
}
