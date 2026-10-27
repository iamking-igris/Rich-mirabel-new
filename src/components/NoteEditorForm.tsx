import React, { useState } from 'react';
import { useNoteStore } from '@/lib/useNoteStore';
import type { BlockType, NoteBlock } from '@/lib/note-schema';

interface NoteEditorFormProps {
  className?: string;
}

export function NoteEditorForm({ className = '' }: NoteEditorFormProps) {
  const doc = useNoteStore((s) => s.doc);
  const updateMeta = useNoteStore((s) => s.updateMeta);
  const addBlock = useNoteStore((s) => s.addBlock);
  const updateBlock = useNoteStore((s) => s.updateBlock);
  const removeBlock = useNoteStore((s) => s.removeBlock);
  const moveBlock = useNoteStore((s) => s.moveBlock);
  const resetToDefault = useNoteStore((s) => s.resetToDefault);

  const [collapsedMeta, setCollapsedMeta] = useState(false);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Document Meta Section */}
      <section className="rounded-2xl border border-line bg-surface p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-line/60 pb-3">
          <div>
            <h2 className="font-display text-xl sm:text-2xl text-ink">Lesson Header & Metadata</h2>
            <p className="font-sans text-xs text-muted mt-0.5">
              Subject, topic hierarchy, title and overview details
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetToDefault}
              title="Reset to default Waves lesson"
              className="px-3 py-1.5 rounded-full border border-line text-xs font-medium text-muted hover:text-ink hover:bg-paper transition-colors"
            >
              Reset Mock
            </button>
            <button
              type="button"
              onClick={() => setCollapsedMeta(!collapsedMeta)}
              className="p-1.5 rounded-lg border border-line text-muted hover:text-ink hover:bg-paper transition-colors"
              aria-label={collapsedMeta ? 'Expand metadata' : 'Collapse metadata'}
            >
              <svg className={`size-4 transition-transform duration-200 ${collapsedMeta ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {!collapsedMeta && (
          <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
            <div>
              <label htmlFor="meta-subject" className="block font-sans text-xs font-semibold text-muted mb-1">
                Subject (e.g. Physics)
              </label>
              <input
                id="meta-subject"
                type="text"
                value={doc.subject}
                onChange={(e) => updateMeta('subject', e.target.value)}
                placeholder="Physics"
                className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm text-ink font-sans focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="meta-topic" className="block font-sans text-xs font-semibold text-muted mb-1">
                Topic Code / Category (e.g. WAVES)
              </label>
              <input
                id="meta-topic"
                type="text"
                value={doc.topic}
                onChange={(e) => updateMeta('topic', e.target.value.toUpperCase())}
                placeholder="WAVES"
                className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm text-ink font-sans uppercase font-medium focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="meta-title" className="block font-sans text-xs font-semibold text-muted mb-1">
                Lesson Title (Fraunces Heading)
              </label>
              <input
                id="meta-title"
                type="text"
                value={doc.title}
                onChange={(e) => updateMeta('title', e.target.value)}
                placeholder="Waves"
                className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-base text-ink font-display focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="meta-subtitle" className="block font-sans text-xs font-semibold text-muted mb-1">
                Subtitle / Core Concept Summary
              </label>
              <input
                id="meta-subtitle"
                type="text"
                value={doc.subtitle}
                onChange={(e) => updateMeta('subtitle', e.target.value)}
                placeholder="Wavelength, amplitude, frequency, and the wave equation."
                className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm text-ink font-sans focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="meta-meta" className="block font-sans text-xs font-semibold text-muted mb-1">
                Estimated Reading & Assessment Meta
              </label>
              <input
                id="meta-meta"
                type="text"
                value={doc.meta}
                onChange={(e) => updateMeta('meta', e.target.value)}
                placeholder="20 min · 4 questions · 2 theory"
                className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm text-ink font-sans focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>
        )}
      </section>

      {/* Blocks Section Header & Top Insert Controls */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
          <div>
            <h3 className="font-display text-xl text-ink">Lesson Blocks ({doc.blocks.length})</h3>
            <p className="font-sans text-xs text-muted">
              Add, edit, and reorder content blocks freely
            </p>
          </div>

          {/* Quick Insert at Top */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted">
            <span className="hidden sm:inline font-sans text-[11px] text-muted mr-1">Insert at top:</span>
            <button
              type="button"
              onClick={() => addBlock('formula', 0)}
              className="px-2.5 py-1 rounded-lg border border-line bg-paper text-ink hover:border-primary hover:text-primary transition-colors flex items-center gap-1"
              title="Add a formula at the very top of the note"
            >
              <span className="text-primary font-bold">+</span> Top Formula
            </button>
            <button
              type="button"
              onClick={() => addBlock('heading', 0)}
              className="px-2.5 py-1 rounded-lg border border-line bg-paper text-ink hover:border-primary hover:text-primary transition-colors flex items-center gap-1"
              title="Add a heading at the very top of the note"
            >
              <span className="text-primary font-bold">+</span> Top Heading
            </button>
          </div>
        </div>

        {/* Blocks List */}
        {doc.blocks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-surface p-8 text-center">
            <p className="font-sans text-sm text-muted">No blocks in this lesson yet.</p>
            <p className="font-sans text-xs text-muted/80 mt-1">
              Use the block buttons below to construct the lesson.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {doc.blocks.map((block, index) => (
              <div
                key={block.id}
                className="rounded-2xl border border-line bg-surface p-4 sm:p-5 shadow-xs transition-shadow hover:border-line/90"
              >
                {/* Block Card Header with Order & Delete Controls */}
                <div className="flex items-center justify-between border-b border-line/60 pb-3 mb-3.5">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex size-6 items-center justify-center rounded-full bg-paper font-sans text-xs font-semibold text-muted">
                      {index + 1}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-md px-2.5 py-0.5 font-sans text-xs font-medium uppercase tracking-wide ${
                        block.type === 'objectives'
                          ? 'bg-[#1A4D2E]/10 text-[#1A4D2E]'
                          : block.type === 'heading'
                          ? 'bg-primary/10 text-primary'
                          : block.type === 'formula'
                          ? 'bg-[#1a2420] text-[#f4fbf8]'
                          : block.type === 'diagram'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-paper text-ink'
                      }`}
                    >
                      {block.type === 'objectives'
                        ? 'Objectives'
                        : block.type === 'heading'
                        ? 'Heading'
                        : block.type === 'paragraph'
                        ? 'Paragraph'
                        : block.type === 'formula'
                        ? 'Formula (LaTeX)'
                        : 'Diagram / Image'}
                    </span>
                  </div>

                  {/* Move Up, Down, and Delete SVG Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveBlock(block.id, 'up')}
                      aria-label="Move block up"
                      className="p-1.5 rounded-lg border border-line bg-paper text-ink hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move Up"
                    >
                      <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      disabled={index === doc.blocks.length - 1}
                      onClick={() => moveBlock(block.id, 'down')}
                      aria-label="Move block down"
                      className="p-1.5 rounded-lg border border-line bg-paper text-ink hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move Down"
                    >
                      <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={() => removeBlock(block.id)}
                      aria-label="Delete block"
                      className="p-1.5 rounded-lg border border-line bg-paper text-red-600 hover:border-red-400 hover:bg-red-50 transition-colors ml-1"
                      title="Remove Block"
                    >
                      <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Block Specific Form Fields */}
                {block.type === 'objectives' && (
                  <div>
                    <label className="block font-sans text-xs font-semibold text-muted mb-1">
                      Learning Objectives (one per line)
                    </label>
                    <textarea
                      rows={3}
                      value={block.items.join('\n')}
                      onChange={(e) => updateBlock(block.id, { items: e.target.value.split('\n') })}
                      placeholder="First learning objective...&#10;Second learning objective..."
                      className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm text-ink font-sans focus:border-primary focus:outline-none transition-colors resize-y"
                    />
                  </div>
                )}

                {block.type === 'heading' && (
                  <div>
                    <label className="block font-sans text-xs font-semibold text-muted mb-1">
                      Section Heading Text
                    </label>
                    <input
                      type="text"
                      value={block.text}
                      onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                      placeholder="e.g., 1. The Wave Equation"
                      className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm text-ink font-display focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                )}

                {block.type === 'paragraph' && (
                  <div>
                    <label className="block font-sans text-xs font-semibold text-muted mb-1">
                      Paragraph Body
                    </label>
                    <textarea
                      rows={3}
                      value={block.text}
                      onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                      placeholder="Write comprehensive lesson explanations here..."
                      className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm text-ink font-sans focus:border-primary focus:outline-none transition-colors resize-y"
                    />
                  </div>
                )}

                {block.type === 'formula' && (
                  <div className="space-y-2">
                    <label className="block font-sans text-xs font-semibold text-muted">
                      LaTeX Formula (rendered via KaTeX)
                    </label>
                    <input
                      type="text"
                      value={block.latex}
                      onChange={(e) => updateBlock(block.id, { latex: e.target.value })}
                      placeholder="v = f \lambda"
                      className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm font-mono text-ink focus:border-primary focus:outline-none transition-colors"
                    />
                    {/* LaTeX quick insert chips */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="font-sans text-[11px] text-muted">Quick formulas:</span>
                      {[
                        { label: 'v = fλ', val: 'v = f \\lambda' },
                        { label: 'T = 1/f', val: 'T = \\frac{1}{f}' },
                        { label: 'E = mc²', val: 'E = mc^2' },
                        { label: 'Quad formula', val: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}' },
                      ].map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => updateBlock(block.id, { latex: item.val })}
                          className="px-2 py-0.5 rounded-md border border-line/80 bg-paper text-[11px] font-sans text-muted hover:text-ink hover:border-primary transition-colors"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {block.type === 'diagram' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block font-sans text-xs font-semibold text-muted mb-1">
                        Diagram Image URL
                      </label>
                      <input
                        type="text"
                        value={block.imageUrl}
                        onChange={(e) => updateBlock(block.id, { imageUrl: e.target.value })}
                        placeholder="/media/physics.jpg or https://..."
                        className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm font-sans text-ink focus:border-primary focus:outline-none transition-colors"
                      />
                      {/* Image quick preset suggestions */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                        <span className="font-sans text-[11px] text-muted">Sample diagrams:</span>
                        {[
                          { label: 'Physics Wave', url: '/media/physics.jpg' },
                          { label: 'Chemistry Lab', url: '/media/chemistry.jpg' },
                          { label: 'Biology Cell', url: '/media/biology.jpg' },
                          { label: 'Geometry', url: '/media/mathematics.jpg' },
                        ].map((item) => (
                          <button
                            key={item.label}
                            type="button"
                            onClick={() => updateBlock(block.id, { imageUrl: item.url })}
                            className="px-2 py-0.5 rounded-md border border-line/80 bg-paper text-[11px] font-sans text-muted hover:text-ink hover:border-primary transition-colors"
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block font-sans text-xs font-semibold text-muted mb-1">
                        Figure Caption (displayed below divider line)
                      </label>
                      <input
                        type="text"
                        value={block.caption}
                        onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
                        placeholder="Figure 1: Diagram explanation..."
                        className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm font-sans text-ink focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add Block Controls at Bottom */}
        <div className="rounded-2xl border border-line bg-surface p-4 sm:p-5 shadow-xs">
          <p className="font-sans text-xs font-semibold uppercase tracking-wider text-muted mb-3">
            Add New Block To Bottom
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => addBlock('heading')}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-line bg-paper px-3.5 py-2.5 font-sans text-xs sm:text-sm font-semibold text-ink hover:border-primary hover:text-primary transition-colors"
            >
              <svg className="size-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
              + Heading
            </button>

            <button
              type="button"
              onClick={() => addBlock('paragraph')}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-line bg-paper px-3.5 py-2.5 font-sans text-xs sm:text-sm font-semibold text-ink hover:border-primary hover:text-primary transition-colors"
            >
              <svg className="size-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
              + Paragraph
            </button>

            <button
              type="button"
              onClick={() => addBlock('formula')}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-line bg-paper px-3.5 py-2.5 font-sans text-xs sm:text-sm font-semibold text-ink hover:border-primary hover:text-primary transition-colors"
            >
              <svg className="size-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
              + Formula
            </button>

            <button
              type="button"
              onClick={() => addBlock('diagram')}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-line bg-paper px-3.5 py-2.5 font-sans text-xs sm:text-sm font-semibold text-ink hover:border-primary hover:text-primary transition-colors"
            >
              <svg className="size-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
              + Diagram
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
