import React, { useState, useRef, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { useNoteStore } from '@/lib/useNoteStore';
import type { NoteBlock } from '@/lib/note-schema';

interface NotePreviewRendererProps {
  className?: string;
  readOnly?: boolean;
}

export function NotePreviewRenderer({ className = '', readOnly = false }: NotePreviewRendererProps) {
  const doc = useNoteStore((s) => s.doc);
  const updateMeta = useNoteStore((s) => s.updateMeta);
  const updateBlock = useNoteStore((s) => s.updateBlock);
  const removeBlock = useNoteStore((s) => s.removeBlock);
  const moveBlock = useNoteStore((s) => s.moveBlock);
  const addBlock = useNoteStore((s) => s.addBlock);
  const reorderBlocks = useNoteStore((s) => s.reorderBlocks);

  // Setup DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderBlocks(String(active.id), String(over.id));
    }
  }

  return (
    <div className={`w-full max-w-3xl mx-auto bg-[#FDFBF7] text-[#2A2422] p-6 sm:p-12 transition-all ${className}`}>
      {/* 1. Header */}
      {readOnly ? (
        <header className="mb-10 border-b border-[#E5E0D8] pb-8 space-y-3">
          {doc.subject && (
            <p className="font-sans text-sm font-medium text-[#1A4D2E]">{doc.subject}</p>
          )}
          {doc.topic && (
            <p className="font-sans text-xs font-bold uppercase tracking-wider text-[#1A4D2E]">{doc.topic}</p>
          )}
          <h1 className="font-serif text-4xl sm:text-5xl text-[#2A2422] tracking-tight leading-tight">
            {doc.title || 'Untitled Note'}
          </h1>
          {doc.subtitle && (
            <p className="font-sans text-base sm:text-lg text-[#6B6B6B] leading-relaxed">{doc.subtitle}</p>
          )}
          {doc.meta && (
            <p className="font-sans text-xs sm:text-sm text-[#8C827A]">{doc.meta}</p>
          )}
        </header>
      ) : (
        <header className="mb-10 border-b border-[#E5E0D8] pb-8 space-y-3">
          {/* Subject */}
          <div>
            <input
              type="text"
              value={doc.subject}
              onChange={(e) => updateMeta('subject', e.target.value)}
              placeholder="Subject (e.g. Physics)"
              className="w-full bg-transparent outline-none border-none p-0 text-sm font-sans font-medium text-[#1A4D2E] placeholder:text-[#1A4D2E]/40"
            />
          </div>

          {/* Topic - uppercase, bold, letter-spacing */}
          <div>
            <input
              type="text"
              value={doc.topic}
              onChange={(e) => updateMeta('topic', e.target.value.toUpperCase())}
              placeholder="TOPIC CODE"
              className="w-full bg-transparent outline-none border-none p-0 text-xs font-sans font-bold uppercase tracking-wider text-[#1A4D2E] placeholder:text-[#1A4D2E]/40"
            />
          </div>

          {/* Title - Fraunces serif font */}
          <div>
            <input
              type="text"
              value={doc.title}
              onChange={(e) => updateMeta('title', e.target.value)}
              placeholder="Lesson Title"
              className="w-full bg-transparent outline-none border-none p-0 text-4xl sm:text-5xl font-serif text-[#2A2422] tracking-tight placeholder:text-[#2A2422]/30 leading-tight"
            />
          </div>

          {/* Subtitle - Standard Outfit text */}
          <div>
            <AutoResizeTextarea
              value={doc.subtitle}
              onChange={(val) => updateMeta('subtitle', val)}
              placeholder="Add a one-line summary..."
              className="w-full bg-transparent outline-none border-none p-0 text-base sm:text-lg font-sans text-[#6B6B6B] placeholder:text-[#6B6B6B]/40 leading-relaxed"
            />
          </div>

          {/* Meta - Small, muted, sans-serif text */}
          <div>
            <input
              type="text"
              value={doc.meta}
              onChange={(e) => updateMeta('meta', e.target.value)}
              placeholder="20 min · 4 questions · 2 theory"
              className="w-full bg-transparent outline-none border-none p-0 text-xs sm:text-sm font-sans text-[#8C827A] placeholder:text-[#8C827A]/40"
            />
          </div>
        </header>
      )}

      {/* 2. Block List */}
      {readOnly ? (
        <div className="space-y-6">
          {doc.blocks.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#E5E0D8] bg-[#F7F4EE]/50 p-10 text-center text-[#6B6B6B]">
              <p className="font-serif text-lg text-[#2A2422]">This note is currently blank.</p>
              <p className="font-sans text-xs text-[#8C827A] mt-1">
                Content will appear here once blocks are added in Note Studio or extracted from source files.
              </p>
            </div>
          ) : (
            doc.blocks.map((block) => (
              <ReadOnlyBlockContent key={block.id} block={block} />
            ))
          )}
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={doc.blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-6">
              {doc.blocks.length === 0 ? (
                <div className="rounded-3xl border-2 border-dashed border-[#E5E0D8] bg-[#F7F4EE]/50 p-8 sm:p-12 text-center">
                  <div className="mx-auto size-12 rounded-2xl bg-[#1A4D2E]/10 text-[#1A4D2E] flex items-center justify-center mb-3.5">
                    <svg className="size-6 text-[#1A4D2E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="12" y1="18" x2="12" y2="12" />
                      <line x1="9" y1="15" x2="15" y2="15" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#2A2422] font-medium">
                    This note is currently blank
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-[#6B6B6B] mt-1.5 max-w-md mx-auto">
                    No mockup data added. Start building your lesson with blocks below or upload source materials in the Source tab.
                  </p>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => addBlock('objectives', 0)}
                      className="px-3.5 py-2 rounded-xl border border-[#1A4D2E]/30 bg-[#1A4D2E]/10 text-[#1A4D2E] font-sans text-xs font-semibold hover:bg-[#1A4D2E]/15 shadow-2xs transition-all flex items-center gap-1.5"
                    >
                      <span className="font-bold text-sm">+</span> Objectives
                    </button>
                    <button
                      type="button"
                      onClick={() => addBlock('heading')}
                      className="px-3.5 py-2 rounded-xl border border-[#E5E0D8] bg-white text-[#2A2422] font-sans text-xs font-semibold hover:border-[#1A4D2E] hover:text-[#1A4D2E] shadow-2xs transition-all flex items-center gap-1.5"
                    >
                      <span className="text-[#1A4D2E] font-bold text-sm">+</span> Heading
                    </button>
                    <button
                      type="button"
                      onClick={() => addBlock('paragraph')}
                      className="px-3.5 py-2 rounded-xl border border-[#E5E0D8] bg-white text-[#2A2422] font-sans text-xs font-semibold hover:border-[#1A4D2E] hover:text-[#1A4D2E] shadow-2xs transition-all flex items-center gap-1.5"
                    >
                      <span className="text-[#1A4D2E] font-bold text-sm">+</span> Paragraph
                    </button>
                    <button
                      type="button"
                      onClick={() => addBlock('formula')}
                      className="px-3.5 py-2 rounded-xl border border-[#E5E0D8] bg-white text-[#2A2422] font-sans text-xs font-semibold hover:border-[#1A4D2E] hover:text-[#1A4D2E] shadow-2xs transition-all flex items-center gap-1.5"
                    >
                      <span className="text-[#1A4D2E] font-bold text-sm">+</span> Formula
                    </button>
                    <button
                      type="button"
                      onClick={() => addBlock('diagram')}
                      className="px-3.5 py-2 rounded-xl border border-[#E5E0D8] bg-white text-[#2A2422] font-sans text-xs font-semibold hover:border-[#1A4D2E] hover:text-[#1A4D2E] shadow-2xs transition-all flex items-center gap-1.5"
                    >
                      <span className="text-[#1A4D2E] font-bold text-sm">+</span> Diagram
                    </button>
                  </div>
                </div>
              ) : (
                doc.blocks.map((block, index) => (
                  <SortableBlockItem
                    key={block.id}
                    block={block}
                    index={index}
                    total={doc.blocks.length}
                    onUpdate={(updates) => updateBlock(block.id, updates)}
                    onRemove={() => removeBlock(block.id)}
                    onMove={(dir) => moveBlock(block.id, dir)}
                  />
                ))
              )}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* 3. Notion-Style Inline Block Adder Bar (Only in Editable Note Mode) */}
      {!readOnly && (
        <div className="mt-10 pt-6 border-t border-[#E5E0D8]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FDFBF7] p-3 rounded-2xl border border-[#E5E0D8]">
            <span className="font-sans text-xs font-semibold uppercase tracking-wider text-[#8C827A] px-1">
              + Add Content Block
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => addBlock('objectives', 0)}
                className="px-3 py-1.5 rounded-xl border border-[#1A4D2E]/30 bg-[#1A4D2E]/10 text-[#1A4D2E] font-sans text-xs font-semibold hover:bg-[#1A4D2E]/15 shadow-2xs transition-all flex items-center gap-1.5"
                title="Add Learning Objectives block"
              >
                <span className="font-bold text-sm">+</span> Objectives
              </button>
              <button
                type="button"
                onClick={() => addBlock('heading')}
                className="px-3 py-1.5 rounded-xl border border-[#E5E0D8] bg-white text-[#2A2422] font-sans text-xs font-semibold hover:border-[#1A4D2E] hover:text-[#1A4D2E] shadow-2xs transition-all flex items-center gap-1.5"
              >
                <span className="text-[#1A4D2E] font-bold text-sm">+</span> Heading
              </button>
              <button
                type="button"
                onClick={() => addBlock('paragraph')}
                className="px-3 py-1.5 rounded-xl border border-[#E5E0D8] bg-white text-[#2A2422] font-sans text-xs font-semibold hover:border-[#1A4D2E] hover:text-[#1A4D2E] shadow-2xs transition-all flex items-center gap-1.5"
              >
                <span className="text-[#1A4D2E] font-bold text-sm">+</span> Paragraph
              </button>
              <button
                type="button"
                onClick={() => addBlock('formula')}
                className="px-3 py-1.5 rounded-xl border border-[#E5E0D8] bg-white text-[#2A2422] font-sans text-xs font-semibold hover:border-[#1A4D2E] hover:text-[#1A4D2E] shadow-2xs transition-all flex items-center gap-1.5"
              >
                <span className="text-[#1A4D2E] font-bold text-sm">+</span> Formula
              </button>
              <button
                type="button"
                onClick={() => addBlock('diagram')}
                className="px-3 py-1.5 rounded-xl border border-[#E5E0D8] bg-white text-[#2A2422] font-sans text-xs font-semibold hover:border-[#1A4D2E] hover:text-[#1A4D2E] shadow-2xs transition-all flex items-center gap-1.5"
              >
                <span className="text-[#1A4D2E] font-bold text-sm">+</span> Diagram
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Read-Only Renderer Component (Clean Typography, No Inputs, No Drag Handles)
function ReadOnlyBlockContent({ block }: { block: NoteBlock }) {
  switch (block.type) {
    case 'objectives':
      return (
        <div className="mb-6 rounded-2xl border border-[#1A4D2E]/25 bg-[#F4F8F5] p-6 sm:p-7 shadow-xs">
          <h3 className="font-serif text-xl sm:text-2xl text-[#1A4D2E] font-medium tracking-tight mb-3.5 flex items-center gap-2.5">
            <span className="inline-flex size-6 rounded-full bg-[#1A4D2E] text-white items-center justify-center shadow-2xs">
              <svg className="size-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            Learning Objectives
          </h3>
          <ul className="space-y-2.5">
            {block.items.filter((item) => item.trim()).map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="inline-flex size-5 shrink-0 rounded-full bg-[#1A4D2E]/15 text-[#1A4D2E] items-center justify-center mt-0.5">
                  <svg className="size-3 text-[#1A4D2E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="font-sans text-base text-[#2A2422] leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      );

    case 'heading':
      return (
        <div className="mb-6">
          <div className="inline-flex flex-col items-start max-w-full">
            <h2 className="font-serif text-3xl text-[#2A2422] tracking-tight">
              {block.text}
            </h2>
            <span className="h-[2.5px] w-10 bg-[#1A4D2E] mt-1.5 inline-block" aria-hidden="true" />
          </div>
        </div>
      );

    case 'paragraph':
      return (
        <div className="mb-6">
          <p className="font-sans text-lg text-[#4A4A4A] leading-relaxed whitespace-pre-line">
            {block.text}
          </p>
        </div>
      );

    case 'formula':
      return (
        <div className="mb-6 bg-[#2A2422] rounded-2xl p-8 flex justify-center items-center shadow-sm text-center">
          {block.latex ? (
            <div className="text-white text-2xl sm:text-3xl tracking-wide max-w-full overflow-x-auto">
              <BlockMath
                math={block.latex}
                renderError={() => (
                  <span className="text-red-400 font-sans text-sm">
                    Invalid LaTeX
                  </span>
                )}
              />
            </div>
          ) : (
            <span className="text-white/40 italic font-sans text-sm">
              Empty formula
            </span>
          )}
        </div>
      );

    case 'diagram':
      return (
        <div className="mb-6 border border-[#E5E0D8] bg-[#FDFBF7] rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 flex justify-center">
            {block.imageUrl ? (
              <img
                src={block.imageUrl}
                alt={block.caption || 'Lesson Diagram'}
                className="max-h-64 object-contain rounded-md"
              />
            ) : (
              <div className="py-8 text-center text-[#8C827A] font-sans text-sm italic">
                Diagram
              </div>
            )}
          </div>
          {block.caption && (
            <div className="border-t border-[#E5E0D8] p-3 text-sm font-sans text-[#6B6B6B]">
              {block.caption}
            </div>
          )}
        </div>
      );
  }
}

interface SortableBlockItemProps {
  block: NoteBlock;
  index: number;
  total: number;
  onUpdate: (updates: Partial<NoteBlock>) => void;
  onRemove: () => void;
  onMove: (dir: 'up' | 'down') => void;
}

function SortableBlockItem({
  block,
  index,
  total,
  onUpdate,
  onRemove,
  onMove,
}: SortableBlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group pl-8 -ml-8 rounded-xl transition-all duration-200 ${
        isDragging
          ? 'z-50 opacity-60 scale-[0.99] shadow-2xl ring-2 ring-[#1A4D2E]'
          : 'hover:shadow-2xs'
      }`}
    >
      {/* Drag handle & Actions on hover (positioned in the left gutter) */}
      <div className="absolute left-0 top-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 z-20 bg-[#FDFBF7] px-1 py-0.5 rounded-lg border border-[#E5E0D8] shadow-xs">
        {/* 6-dot Drag Handle */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
          className="p-1 text-[#8C827A] hover:text-[#2A2422] cursor-grab active:cursor-grabbing transition-colors"
          title="Drag to reorder block"
        >
          <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="8" cy="6" r="1.8" />
            <circle cx="16" cy="6" r="1.8" />
            <circle cx="8" cy="12" r="1.8" />
            <circle cx="16" cy="12" r="1.8" />
            <circle cx="8" cy="18" r="1.8" />
            <circle cx="16" cy="18" r="1.8" />
          </svg>
        </button>

        {/* Up arrow */}
        <button
          type="button"
          disabled={index === 0}
          onClick={() => onMove('up')}
          aria-label="Move up"
          className="p-1 text-[#8C827A] hover:text-[#1A4D2E] disabled:opacity-20 transition-colors"
          title="Move up"
        >
          <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Down arrow */}
        <button
          type="button"
          disabled={index === total - 1}
          onClick={() => onMove('down')}
          aria-label="Move down"
          className="p-1 text-[#8C827A] hover:text-[#1A4D2E] disabled:opacity-20 transition-colors"
          title="Move down"
        >
          <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Delete button */}
        <button
          type="button"
          onClick={onRemove}
          aria-label="Delete block"
          className="p-1 text-[#8C827A] hover:text-red-600 transition-colors"
          title="Delete block"
        >
          <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Block Content Component */}
      <EditableBlockContent block={block} onUpdate={onUpdate} />
    </div>
  );
}

function EditableBlockContent({
  block,
  onUpdate,
}: {
  block: NoteBlock;
  onUpdate: (updates: Partial<NoteBlock>) => void;
}) {
  const [editingDiagramUrl, setEditingDiagramUrl] = useState(false);

  switch (block.type) {
    case 'objectives':
      return (
        <div className="mb-6 rounded-2xl border border-[#1A4D2E]/25 bg-[#F4F8F5] p-6 sm:p-7 shadow-xs">
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="font-serif text-xl sm:text-2xl text-[#1A4D2E] font-medium tracking-tight flex items-center gap-2.5">
              <span className="inline-flex size-6 rounded-full bg-[#1A4D2E] text-white items-center justify-center shadow-2xs">
                <svg className="size-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              Learning Objectives
            </h3>
            <span className="text-[11px] font-sans text-[#1A4D2E]/70">
              Type items below (new line for each objective)
            </span>
          </div>

          <div className="space-y-2">
            <AutoResizeTextarea
              value={block.items.join('\n')}
              onChange={(val) => onUpdate({ items: val.split('\n') })}
              placeholder="Define core concepts...&#10;Apply key formulas...&#10;Solve exam-level problems..."
              className="w-full bg-transparent outline-none font-sans text-base text-[#2A2422] leading-relaxed border-l-2 border-[#1A4D2E]/40 pl-3.5 focus:border-[#1A4D2E] placeholder:text-[#1A4D2E]/30"
            />
          </div>
        </div>
      );

    case 'heading':
      return (
        <div className="mb-6 group">
          <div className="inline-flex flex-col items-start max-w-full">
            <input
              type="text"
              value={block.text}
              onChange={(e) => onUpdate({ text: e.target.value })}
              placeholder="Heading text..."
              className="bg-transparent outline-none font-serif text-3xl text-[#2A2422] tracking-tight placeholder:text-[#2A2422]/30 w-full"
            />
            {/* 40px short green underline right below heading text */}
            <span className="h-[2.5px] w-10 bg-[#1A4D2E] mt-1.5" aria-hidden="true" />
          </div>
        </div>
      );

    case 'paragraph':
      return (
        <div className="mb-6">
          <AutoResizeTextarea
            value={block.text}
            onChange={(val) => onUpdate({ text: val })}
            placeholder="Write lesson paragraphs here..."
            className="w-full bg-transparent outline-none resize-none font-sans text-lg text-[#4A4A4A] leading-relaxed placeholder:text-[#6B6B6B]/40"
          />
        </div>
      );

    case 'formula':
      return (
        <div className="mb-6 bg-[#2A2422] rounded-2xl p-8 flex flex-col justify-center items-center shadow-sm text-center relative group/formula transition-all">
          {/* Live KaTeX Render */}
          <div className="w-full flex justify-center items-center py-1">
            {block.latex ? (
              <div className="text-white text-2xl sm:text-3xl tracking-wide max-w-full overflow-x-auto">
                <BlockMath
                  math={block.latex}
                  renderError={() => (
                    <span className="text-red-400 font-sans text-sm">
                      Invalid LaTeX: {block.latex}
                    </span>
                  )}
                />
              </div>
            ) : (
              <span className="text-white/40 italic font-sans text-sm">
                Empty formula
              </span>
            )}
          </div>

          {/* Inline editable LaTeX input right inside the dark box */}
          <div className="mt-4 pt-3 border-t border-white/10 w-full max-w-md flex flex-col items-center">
            <input
              type="text"
              value={block.latex}
              onChange={(e) => onUpdate({ latex: e.target.value })}
              placeholder="e.g. v = f \lambda"
              className="bg-transparent text-white/90 text-center outline-none w-full font-serif text-lg tracking-wide border-b border-transparent focus:border-[#1A4D2E] pb-0.5 placeholder:text-white/30"
              title="Edit LaTeX equation"
            />
            <span className="text-[10px] font-sans text-white/40 mt-1">
              Click formula text above to edit LaTeX code directly
            </span>
          </div>
        </div>
      );

    case 'diagram':
      return (
        <div className="mb-6 border border-[#E5E0D8] bg-[#FDFBF7] rounded-xl overflow-hidden shadow-sm">
          {/* Diagram image container */}
          <div className="p-4 flex flex-col items-center justify-center relative group/img">
            {block.imageUrl ? (
              <img
                src={block.imageUrl}
                alt={block.caption || 'Lesson Diagram'}
                className="max-h-64 object-contain rounded-md"
              />
            ) : (
              <div className="py-8 text-center text-[#8C827A]">
                <p className="font-sans text-sm">No image selected</p>
                <button
                  type="button"
                  onClick={() => setEditingDiagramUrl(true)}
                  className="mt-2 text-xs font-semibold text-[#1A4D2E] underline"
                >
                  Enter Image URL
                </button>
              </div>
            )}

            {/* Change URL overlay button on hover */}
            <div className="absolute top-2 right-2 opacity-0 group-hover/img:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => setEditingDiagramUrl(!editingDiagramUrl)}
                className="text-[11px] font-sans text-[#2A2422] bg-[#FDFBF7] border border-[#E5E0D8] px-2 py-1 rounded-md shadow-2xs hover:border-[#1A4D2E]"
              >
                {editingDiagramUrl ? 'Close URL' : 'Change Image'}
              </button>
            </div>

            {/* Editable Image URL Drawer */}
            {editingDiagramUrl && (
              <div className="mt-3 w-full max-w-md bg-white border border-[#E5E0D8] rounded-xl p-3 shadow-xs space-y-2">
                <label className="block text-[11px] font-semibold text-[#8C827A] uppercase">
                  Image URL / Asset Path:
                </label>
                <input
                  type="text"
                  value={block.imageUrl}
                  onChange={(e) => onUpdate({ imageUrl: e.target.value })}
                  placeholder="/media/physics.jpg or https://..."
                  className="w-full text-xs font-sans text-[#2A2422] border border-[#E5E0D8] rounded-lg px-2.5 py-1.5 outline-none focus:border-[#1A4D2E]"
                />
                <div className="flex flex-wrap gap-1 text-[10px] text-[#8C827A]">
                  <span>Presets:</span>
                  {[
                    { l: 'Physics', u: '/media/physics.jpg' },
                    { l: 'Chemistry', u: '/media/chemistry.jpg' },
                    { l: 'Biology', u: '/media/biology.jpg' },
                    { l: 'Math', u: '/media/mathematics.jpg' },
                  ].map((p) => (
                    <button
                      key={p.l}
                      type="button"
                      onClick={() => onUpdate({ imageUrl: p.u })}
                      className="underline text-[#1A4D2E]"
                    >
                      {p.l}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Caption with border-t separation */}
          <div className="border-t border-[#E5E0D8] p-3 text-sm font-sans text-[#6B6B6B]">
            <input
              className="w-full bg-transparent outline-none font-sans text-sm text-[#6B6B6B] placeholder:text-[#8C827A]/50"
              value={block.caption}
              onChange={(e) => onUpdate({ caption: e.target.value })}
              placeholder="Add caption..."
            />
          </div>
        </div>
      );
  }
}

function AutoResizeTextarea({
  value,
  onChange,
  className,
  placeholder,
}: {
  value: string;
  onChange: (val: string) => void;
  className?: string;
  placeholder?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={1}
      className={className}
    />
  );
}
