import { demoPhysicsTopics } from "./physics";
import { demoJambBank, demoJambPaper, buildJambPaper } from "./jamb";
import { demoWaecPapers, findWaecPaper } from "./waec";
import type { Topic } from "@/data/catalog";
export { demoPhysicsTopics, demoJambBank, demoJambPaper, buildJambPaper, demoWaecPapers, findWaecPaper };
export function withDemoPhysicsTopics(topics: Topic[]): Topic[] {
  const ids = new Set(topics.map(t => t.id));
  return [...topics, ...demoPhysicsTopics.filter(t => !ids.has(t.id))];
}
export function demoInventory() {
  return {
    physicsDemoTopics: demoPhysicsTopics.length,
    physicsDemoMcq: demoPhysicsTopics.reduce((n,t)=>n+t.questions.length,0),
    physicsDemoTheory: demoPhysicsTopics.reduce((n,t)=>n+(t.theory?.length??0),0),
    jambBank: demoJambBank.length,
    jambPaperQuestions: buildJambPaper().length,
    waecPapers: demoWaecPapers.length,
    waecObjectiveItems: demoWaecPapers.reduce((n,p)=>n+p.objectives.length,0),
    waecTheoryItems: demoWaecPapers.reduce((n,p)=>n+p.theory.length,0),
  };
}
