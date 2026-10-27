import { create } from 'zustand';
import { arrayMove } from '@dnd-kit/sortable';
import type { BlockType, NoteBlock, NoteDocument } from './note-schema';

export const initialMockDocument: NoteDocument = {
  subject: 'Physics',
  topic: 'WAVES',
  title: 'Waves',
  subtitle: 'Wavelength, amplitude, frequency, and the wave equation.',
  meta: '20 min · 4 questions · 2 theory',
  blocks: [
    {
      id: 'b-0',
      type: 'objectives',
      items: [
        'Define wavelength, amplitude, frequency, and period',
        'Apply the wave equation v = fλ to calculate velocity, frequency, or wavelength',
        'Distinguish between transverse and longitudinal wave motion',
      ],
    },
    {
      id: 'b-1',
      type: 'heading',
      text: '1. The Wave Equation',
    },
    {
      id: 'b-2',
      type: 'formula',
      latex: 'v = f \\lambda',
    },
    {
      id: 'b-3',
      type: 'paragraph',
      text: 'A wave is a disturbance that transfers energy through a medium or vacuum without permanently displacing the matter of the medium itself. The wave velocity depends on both frequency and wavelength.',
    },
    {
      id: 'b-4',
      type: 'diagram',
      imageUrl: '/media/physics.jpg',
      caption: 'Figure 1: Transverse wave profile displaying crests, troughs, wavelength (λ), and amplitude (A).',
    },
    {
      id: 'b-5',
      type: 'heading',
      text: '2. Characteristics and Classification',
    },
    {
      id: 'b-6',
      type: 'paragraph',
      text: 'Waves are categorized based on propagation characteristics into mechanical waves (requiring a material medium) and electromagnetic waves (which travel through free space). In transverse waves, particle oscillations are perpendicular to the wave propagation vector.',
    },
  ],
};

// Hardcoded mock extracted document for the AI extraction pipeline with auto-placed objectives
export const mockExtractedDocument: NoteDocument = {
  subject: 'Chemistry',
  topic: 'ELECTROLYSIS',
  title: 'Electrolysis & Ionic Theory',
  subtitle: 'Chemical decomposition produced by passing an electric current through an electrolyte.',
  meta: '18 min · 5 questions · 3 theory',
  blocks: [
    {
      id: 'ext-0',
      type: 'objectives',
      items: [
        'Define electrolysis, electrolytes, electrodes, and mobile ions',
        "State and apply Faraday's First Law of Electrolysis (m = zIt)",
        'Predict preferential discharge of cations and anions at electrodes',
      ],
    },
    {
      id: 'ext-1',
      type: 'heading',
      text: '1. Principles of Electrolysis',
    },
    {
      id: 'ext-2',
      type: 'paragraph',
      text: 'Electrolysis is the process whereby ionic substances are decomposed (broken down) into simpler substances when an electric current is passed through them. The liquid or solution conducting the current contains mobile ions and is termed the electrolyte.',
    },
    {
      id: 'ext-3',
      type: 'formula',
      latex: 'm = z \\cdot I \\cdot t = \\frac{M \\cdot I \\cdot t}{n \\cdot F}',
    },
    {
      id: 'ext-4',
      type: 'heading',
      text: "2. Faraday's First Law of Electrolysis",
    },
    {
      id: 'ext-5',
      type: 'paragraph',
      text: "Faraday's first law states that the mass (m) of an element liberated at an electrode during electrolysis is directly proportional to the quantity of electricity (Q = I × t) passed through the electrolyte.",
    },
    {
      id: 'ext-6',
      type: 'diagram',
      imageUrl: '/media/chemistry.jpg',
      caption: 'Figure 1: Diagrammatic representation of an electrolytic cell showing anode (+), cathode (-), and ionic migration.',
    },
    {
      id: 'ext-7',
      type: 'heading',
      text: '3. Preferential Discharge of Ions',
    },
    {
      id: 'ext-8',
      type: 'paragraph',
      text: 'When multiple cations or anions migrate to the electrodes, preferential discharge is governed by three factors: their relative position in the electrochemical series, concentration in solution, and the nature of the electrode.',
    },
  ],
};

interface NoteStoreState {
  currentTopicId: string | null;
  doc: NoteDocument;
  savedTopics: Record<string, NoteDocument>;
  loadTopic: (topicId: string, fallback?: Partial<NoteDocument>) => void;
  setDocument: (newDoc: NoteDocument) => void;
  updateMeta: (field: keyof Omit<NoteDocument, 'blocks'>, value: string) => void;
  addBlock: (type: BlockType, index?: number) => void;
  updateBlock: (id: string, updates: Partial<NoteBlock>) => void;
  removeBlock: (id: string) => void;
  moveBlock: (id: string, direction: 'up' | 'down') => void;
  reorderBlocks: (activeId: string, overId: string) => void;
  setBlocks: (blocks: NoteBlock[]) => void;
  resetToDefault: () => void;
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `block_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function createDefaultBlock(type: BlockType): NoteBlock {
  const id = generateId();
  switch (type) {
    case 'objectives':
      return {
        id,
        type: 'objectives',
        items: ['First learning objective...'],
      };
    case 'heading':
      return { id, type: 'heading', text: '' };
    case 'paragraph':
      return { id, type: 'paragraph', text: '' };
    case 'formula':
      return { id, type: 'formula', latex: '' };
    case 'diagram':
      return { id, type: 'diagram', imageUrl: '', caption: '' };
  }
}

export const useNoteStore = create<NoteStoreState>((set, get) => ({
  currentTopicId: null,
  doc: {
    subject: '',
    topic: '',
    title: '',
    subtitle: '',
    meta: '',
    blocks: [],
  },
  savedTopics: {},

  loadTopic: (topicId, fallback) => {
    const { savedTopics, currentTopicId, doc } = get();
    if (currentTopicId === topicId) return;

    // Save existing doc before switching
    const updatedSaved = { ...savedTopics };
    if (currentTopicId) {
      updatedSaved[currentTopicId] = doc;
    }

    if (updatedSaved[topicId]) {
      set({
        currentTopicId: topicId,
        doc: updatedSaved[topicId],
        savedTopics: updatedSaved,
      });
      return;
    }

    // Initialize note for this topic - blank with no mockup data unless explicitly provided
    const newDoc: NoteDocument = {
      subject: fallback?.subject ?? '',
      topic: fallback?.topic ?? '',
      title: fallback?.title ?? '',
      subtitle: fallback?.subtitle ?? '',
      meta: fallback?.meta ?? '',
      blocks: Array.isArray(fallback?.blocks) ? fallback.blocks : [],
    };

    updatedSaved[topicId] = newDoc;
    set({
      currentTopicId: topicId,
      doc: newDoc,
      savedTopics: updatedSaved,
    });
  },

  setDocument: (newDoc) => {
    set((state) => {
      const savedTopics = { ...state.savedTopics };
      if (state.currentTopicId) {
        savedTopics[state.currentTopicId] = newDoc;
      }
      return {
        doc: newDoc,
        savedTopics,
      };
    });
  },

  updateMeta: (field, value) => {
    set((state) => {
      const updatedDoc = {
        ...state.doc,
        [field]: value,
      };
      const savedTopics = { ...state.savedTopics };
      if (state.currentTopicId) {
        savedTopics[state.currentTopicId] = updatedDoc;
      }
      return {
        doc: updatedDoc,
        savedTopics,
      };
    });
  },

  addBlock: (type, index) => {
    set((state) => {
      const newBlock = createDefaultBlock(type);
      const newBlocks = [...state.doc.blocks];
      if (typeof index === 'number' && index >= 0 && index <= newBlocks.length) {
        newBlocks.splice(index, 0, newBlock);
      } else {
        newBlocks.push(newBlock);
      }
      const updatedDoc = {
        ...state.doc,
        blocks: newBlocks,
      };
      const savedTopics = { ...state.savedTopics };
      if (state.currentTopicId) {
        savedTopics[state.currentTopicId] = updatedDoc;
      }
      return {
        doc: updatedDoc,
        savedTopics,
      };
    });
  },

  updateBlock: (id, updates) => {
    set((state) => {
      const updatedBlocks = state.doc.blocks.map((block) =>
        block.id === id ? ({ ...block, ...updates } as NoteBlock) : block
      );
      const updatedDoc = {
        ...state.doc,
        blocks: updatedBlocks,
      };
      const savedTopics = { ...state.savedTopics };
      if (state.currentTopicId) {
        savedTopics[state.currentTopicId] = updatedDoc;
      }
      return {
        doc: updatedDoc,
        savedTopics,
      };
    });
  },

  removeBlock: (id) => {
    set((state) => {
      const updatedBlocks = state.doc.blocks.filter((block) => block.id !== id);
      const updatedDoc = {
        ...state.doc,
        blocks: updatedBlocks,
      };
      const savedTopics = { ...state.savedTopics };
      if (state.currentTopicId) {
        savedTopics[state.currentTopicId] = updatedDoc;
      }
      return {
        doc: updatedDoc,
        savedTopics,
      };
    });
  },

  moveBlock: (id, direction) => {
    set((state) => {
      const index = state.doc.blocks.findIndex((b) => b.id === id);
      if (index === -1) return state;

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= state.doc.blocks.length) return state;

      const newBlocks = [...state.doc.blocks];
      const [movedBlock] = newBlocks.splice(index, 1);
      newBlocks.splice(targetIndex, 0, movedBlock);

      const updatedDoc = {
        ...state.doc,
        blocks: newBlocks,
      };
      const savedTopics = { ...state.savedTopics };
      if (state.currentTopicId) {
        savedTopics[state.currentTopicId] = updatedDoc;
      }
      return {
        doc: updatedDoc,
        savedTopics,
      };
    });
  },

  reorderBlocks: (activeId, overId) => {
    set((state) => {
      const oldIndex = state.doc.blocks.findIndex((b) => b.id === activeId);
      const newIndex = state.doc.blocks.findIndex((b) => b.id === overId);
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return state;

      const updatedBlocks = arrayMove(state.doc.blocks, oldIndex, newIndex);
      const updatedDoc = {
        ...state.doc,
        blocks: updatedBlocks,
      };
      const savedTopics = { ...state.savedTopics };
      if (state.currentTopicId) {
        savedTopics[state.currentTopicId] = updatedDoc;
      }
      return {
        doc: updatedDoc,
        savedTopics,
      };
    });
  },

  setBlocks: (blocks) => {
    set((state) => {
      const updatedDoc = {
        ...state.doc,
        blocks,
      };
      const savedTopics = { ...state.savedTopics };
      if (state.currentTopicId) {
        savedTopics[state.currentTopicId] = updatedDoc;
      }
      return {
        doc: updatedDoc,
        savedTopics,
      };
    });
  },

  resetToDefault: () => {
    set((state) => {
      const emptyDoc: NoteDocument = {
        ...state.doc,
        blocks: [],
      };
      const savedTopics = { ...state.savedTopics };
      if (state.currentTopicId) {
        savedTopics[state.currentTopicId] = emptyDoc;
      }
      return {
        doc: emptyDoc,
        savedTopics,
      };
    });
  },
}));
