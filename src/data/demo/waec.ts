import type { Choice, Question, TheoryQuestion } from "@/data/catalog";
const q = (id: string, prompt: string, options: [string, string, string, string], answer: Choice, explain: string): Question => ({
  id, prompt, options: (["A","B","C","D"] as Choice[]).map((key,i)=>({key,text:options[i]})), answer, explain, answerKeyStatus: "demo",
});
export type DemoWaecPaper = { id: string; subjectId: string; subjectName: string; title: string; component: string; label: string; objectives: Question[]; theory: TheoryQuestion[]; timerSeconds: number };
export const demoWaecPapers: DemoWaecPaper[] = [
  {
    id: "waec-phy-demo-obj", subjectId: "physics", subjectName: "Physics", title: "Physics Paper 1 (Objective) — Demo", component: "Objective",
    label: "DEMO paper — not an official WAEC examination", timerSeconds: 30*60,
    objectives: [
      q("wo1","The S.I. unit of pressure is the",["newton","joule","pascal","watt"],"C","Pa."),
      q("wo2","A machine with velocity ratio 4 and efficiency 80% has mechanical advantage",["3.2","5","4","0.2"],"A","MA=VR×η."),
      q("wo3","Sound cannot travel through",["steel","water","vacuum","air"],"C","Needs medium."),
      q("wo4","The image in a plane mirror is",["real and inverted","virtual and erect","real and erect","virtual and inverted"],"B","Virtual erect."),
      q("wo5","Electrical power is",["VI","V/I","I/V","QV"],"A","P=VI."),
      q("wo6","Heat capacity of a body is",["mc","c only","m/c","Q/Δθ for c"],"A","C=mc."),
      q("wo7","A scalar quantity has",["magnitude only","direction only","magnitude and direction","no magnitude"],"A","Scalar."),
      q("wo8","Period of a simple pendulum depends mainly on",["mass of bob","length of string","colour of bob","amplitude only for large swings always"],"B","Length."),
      q("wo9","In series, total resistance",["decreases","is product of resistances","is sum of resistances","is average"],"C","Sum."),
      q("wo10","The wave equation is",["v = fλ","v = f/λ","E = mc²","F = ma"],"A","v=fλ."),
    ],
    theory: [
      { id: "wt1", prompt: "(a) Define wavelength. (b) A wave of frequency 50 Hz travels at 10 m/s. Calculate its wavelength. [Demo]", modelAnswer: "(a) Distance between successive crests. (b) λ=v/f=10/50=0.2 m.", marks: 6 },
      { id: "wt2", prompt: "State Ohm’s law and describe a V–I graph for an ohmic conductor. [Demo]", modelAnswer: "V∝I at constant T. Straight line through origin.", marks: 5 },
      { id: "wt3", prompt: "List three methods of heat transfer with one example each. [Demo]", modelAnswer: "Conduction (metal spoon); convection (heater); radiation (sun).", marks: 6 },
    ],
  },
  {
    id: "waec-phy-demo-theory", subjectId: "physics", subjectName: "Physics", title: "Physics Paper 2 (Theory) — Demo", component: "Theory",
    label: "DEMO paper — not an official WAEC examination", timerSeconds: 45*60, objectives: [],
    theory: [
      { id: "wtt1", prompt: "Explain the difference between mass and weight. State the S.I. unit of each.", modelAnswer: "Mass is quantity of matter (kg). Weight is gravitational force (N). W=mg.", marks: 4 },
      { id: "wtt2", prompt: "A force of 20 N moves a body 5 m in the direction of the force. Calculate the work done.", modelAnswer: "W=Fs=20×5=100 J.", marks: 3 },
      { id: "wtt3", prompt: "Describe how you would determine the focal length of a converging lens. [Demo outline]", modelAnswer: "Mount lens, object and screen; adjust for sharp image; use lens formula.", marks: 8 },
      { id: "wtt4", prompt: "State two advantages of a parallel circuit over a series circuit in household wiring.", modelAnswer: "Full voltage to each appliance; one failure does not break whole circuit.", marks: 4 },
    ],
  },
];
export function findWaecPaper(id: string) { return demoWaecPapers.find(p => p.id === id) ?? null; }
