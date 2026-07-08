import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

  // Simple, robust custom Markdown parser/renderer
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let listBuffer: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flushList = (key: number) => {
    if (!listBuffer) return null;
    const listType = listBuffer.type;
    const items = [...listBuffer.items];
    listBuffer = null;

    if (listType === 'ul') {
      return (
        <ul key={`list-${key}`} className="list-disc list-outside ml-6 mb-4 space-y-1 text-slate-700 leading-relaxed font-sans text-sm">
          {items.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: parseInline(item) }} />
          ))}
        </ul>
      );
    } else {
      return (
        <ol key={`list-${key}`} className="list-decimal list-outside ml-6 mb-4 space-y-1 text-slate-700 leading-relaxed font-sans text-sm">
          {items.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: parseInline(item) }} />
          ))}
        </ol>
      );
    }
  };

  const parseInline = (text: string): string => {
    // Escape simple HTML characters first to avoid injection
    let parsed = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Strong / Bold: **text** or __text__
    parsed = parsed.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>');
    parsed = parsed.replace(/__(.*?)__/g, '<strong class="font-semibold text-slate-900">$1</strong>');

    // Inline code: `code`
    parsed = parsed.replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 bg-slate-100 text-amber-700 font-mono text-xs rounded border border-slate-200">$1</code>');

    // Em/Italics: *text* or _text_
    parsed = parsed.replace(/\*(.*?)\*/g, '<em class="italic text-slate-800">$1</em>');
    parsed = parsed.replace(/_(.*?)_/g, '<em class="italic text-slate-800">$1</em>');

    return parsed;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check if we need to flush list buffer
    const isBulletList = line.startsWith('- ') || line.startsWith('* ');
    const isNumberedList = /^\d+\.\s/.test(line);

    if (!isBulletList && !isNumberedList && listBuffer) {
      elements.push(flushList(i));
    }

    if (line.startsWith('#### ')) {
      elements.push(
        <h4 key={i} className="text-sm font-semibold text-slate-800 mt-4 mb-2 font-display uppercase tracking-wider" dangerouslySetInnerHTML={{ __html: parseInline(line.substring(5)) }} />
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="text-base font-semibold text-slate-900 mt-5 mb-2.5 font-display border-b border-slate-100 pb-1" dangerouslySetInnerHTML={{ __html: parseInline(line.substring(4)) }} />
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-lg font-bold text-slate-900 mt-6 mb-3 font-display border-b border-slate-200 pb-1.5 flex items-center" dangerouslySetInnerHTML={{ __html: parseInline(line.substring(3)) }} />
      );
    } else if (line.startsWith('# ')) {
      elements.push(
        <h1 key={i} className="text-xl font-bold text-slate-900 mt-7 mb-4 font-display border-b-2 border-amber-500 pb-2 tracking-tight" dangerouslySetInnerHTML={{ __html: parseInline(line.substring(2)) }} />
      );
    } else if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={i} className="pl-4 border-l-4 border-amber-500 italic text-slate-600 my-4 bg-slate-50 py-2.5 pr-3 rounded-r text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: parseInline(line.substring(2)) }} />
      );
    } else if (isBulletList) {
      const itemText = line.startsWith('- ') ? line.substring(2) : line.substring(2);
      if (!listBuffer || listBuffer.type !== 'ul') {
        if (listBuffer) elements.push(flushList(i));
        listBuffer = { type: 'ul', items: [itemText] };
      } else {
        listBuffer.items.push(itemText);
      }
    } else if (isNumberedList) {
      const itemText = line.replace(/^\d+\.\s/, '');
      if (!listBuffer || listBuffer.type !== 'ol') {
        if (listBuffer) elements.push(flushList(i));
        listBuffer = { type: 'ol', items: [itemText] };
      } else {
        listBuffer.items.push(itemText);
      }
    } else if (line === '---' || line === '***') {
      elements.push(<hr key={i} className="my-6 border-slate-200" />);
    } else if (line === '') {
      // Empty line, add a tiny spacer
      elements.push(<div key={i} className="h-2" />);
    } else {
      // Standard paragraph
      elements.push(
        <p key={i} className="text-slate-700 text-sm leading-relaxed mb-3.5 font-sans" dangerouslySetInnerHTML={{ __html: parseInline(line) }} />
      );
    }
  }

  // Handle any remaining lists at the end
  if (listBuffer) {
    elements.push(flushList(lines.length));
  }

  return (
    <div className="prose max-w-none prose-slate antialiased">
      {elements}
    </div>
  );
}
