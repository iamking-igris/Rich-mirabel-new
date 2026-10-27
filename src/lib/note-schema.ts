export type NoteBlock =
  | { id: string; type: 'objectives'; items: string[] }
  | { id: string; type: 'heading'; text: string }
  | { id: string; type: 'paragraph'; text: string }
  | { id: string; type: 'formula'; latex: string }
  | { id: string; type: 'diagram'; imageUrl: string; caption: string };

export type BlockType = NoteBlock['type'];

export type NoteDocument = {
  subject: string;
  topic: string;
  title: string;
  subtitle: string;
  meta: string;
  blocks: NoteBlock[];
};
