import { useState } from 'react';
import { Bookmark, FileText, Trash2, Edit3, Check, BookOpen, ExternalLink, Calendar, Scale } from 'lucide-react';
import { Section, Act, Bookmark as BookmarkType, ResearchMemo } from '../types';
import MarkdownRenderer from './MarkdownRenderer';

interface NotebookProps {
  bookmarks: BookmarkType[];
  savedMemos: ResearchMemo[];
  onNavigateToSection: (sectionId: string) => void;
  onUpdateBookmarkNotes: (sectionId: string, notes: string) => void;
  onRemoveBookmark: (sectionId: string) => void;
  onDeleteMemo: (memoId: string) => void;
}

export default function Notebook({
  bookmarks,
  savedMemos,
  onNavigateToSection,
  onUpdateBookmarkNotes,
  onRemoveBookmark,
  onDeleteMemo
}: NotebookProps) {
  const [subTab, setSubTab] = useState<'bookmarks' | 'memos'>('bookmarks');
  
  // Track active notes being edited
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  // Track expanded memo ID for reading
  const [expandedMemoId, setExpandedMemoId] = useState<string | null>(null);

  const startEditing = (sectionId: string, currentNotes: string) => {
    setEditingSectionId(sectionId);
    setTempNotes(currentNotes || '');
  };

  const saveNotes = (sectionId: string) => {
    onUpdateBookmarkNotes(sectionId, tempNotes);
    setEditingSectionId(null);
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col h-full overflow-hidden" id="notebook-container">
      {/* Tab Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-3 select-none">
        <div>
          <h1 className="text-base font-bold text-slate-900 font-display">
            Personal Study Notebook
          </h1>
          <p className="text-[11px] text-slate-500 font-sans">
            Review your bookmarked clauses, custom annotations, and saved AI research memorandums.
          </p>
        </div>

        {/* Subtab selection slider */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            id="notebook-tab-bookmarks"
            onClick={() => setSubTab('bookmarks')}
            className={`px-4 py-1.5 rounded-lg text-xs font-sans font-medium transition cursor-pointer flex items-center gap-1.5 ${
              subTab === 'bookmarks'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bookmark className="h-3.5 w-3.5 text-amber-500" />
            Clauses ({bookmarks.length})
          </button>

          <button
            id="notebook-tab-memos"
            onClick={() => setSubTab('memos')}
            className={`px-4 py-1.5 rounded-lg text-xs font-sans font-medium transition cursor-pointer flex items-center gap-1.5 ${
              subTab === 'memos'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="h-3.5 w-3.5 text-blue-500" />
            AI Research ({savedMemos.length})
          </button>
        </div>
      </div>

      {/* Main Notebook Content Scrollpane */}
      <div className="flex-1 overflow-y-auto p-6" id="notebook-body">
        
        {/* CLAUSES / BOOKMARKS VIEW */}
        {subTab === 'bookmarks' && (
          bookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-24 bg-white border border-slate-200 rounded-2xl p-8 max-w-md mx-auto space-y-3">
              <Bookmark className="h-12 w-12 text-slate-300 stroke-[1.2]" />
              <h3 className="text-sm font-semibold text-slate-800 font-display">No Bookmarked Clauses Yet</h3>
              <p className="text-xs text-slate-500 font-sans leading-normal">
                As you browse the central and state legislation in the Code Explorer, bookmark key sections to write personal notes and annotations.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {bookmarks.map((bookmark) => {
                const isEditing = editingSectionId === bookmark.sectionId;

                return (
                  <div key={bookmark.sectionId} id={`bookmark-card-${bookmark.sectionId}`} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col justify-between">
                    
                    {/* Header */}
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] text-amber-700 font-bold font-mono">
                            {bookmark.sectionNumber}
                          </span>
                          <span className="text-slate-300 font-mono text-[10px]">•</span>
                          <span className="text-[9px] text-slate-400 font-medium truncate max-w-[150px]">
                            {bookmark.actTitle}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 leading-snug line-clamp-1 font-display">
                          {bookmark.sectionTitle}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          id={`jump-bookmark-${bookmark.sectionId}`}
                          onClick={() => onNavigateToSection(bookmark.sectionId)}
                          className="p-1.5 border border-slate-200 hover:border-amber-500 rounded-lg hover:bg-amber-50/10 text-slate-500 hover:text-amber-700 transition cursor-pointer"
                          title="View Literal Provision"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </button>

                        <button
                          id={`delete-bookmark-${bookmark.sectionId}`}
                          onClick={() => onRemoveBookmark(bookmark.sectionId)}
                          className="p-1.5 border border-slate-200 hover:border-red-300 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition cursor-pointer"
                          title="Remove Bookmark"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Annotations / Notes Section */}
                    <div className="p-4 flex-1 flex flex-col justify-between bg-white min-h-[100px]">
                      {isEditing ? (
                        <div className="space-y-2 flex-1 flex flex-col justify-between">
                          <textarea
                            id={`notes-textarea-${bookmark.sectionId}`}
                            className="w-full text-xs font-sans border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500 h-24 resize-none bg-slate-50"
                            placeholder="Type your research notes, case associations, or annotations..."
                            value={tempNotes}
                            onChange={(e) => setTempNotes(e.target.value)}
                          />
                          <div className="flex justify-end gap-1.5">
                            <button
                              id={`cancel-notes-${bookmark.sectionId}`}
                              onClick={() => setEditingSectionId(null)}
                              className="px-2.5 py-1 rounded text-[10px] font-sans text-slate-500 hover:bg-slate-100 transition cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              id={`save-notes-${bookmark.sectionId}`}
                              onClick={() => saveNotes(bookmark.sectionId)}
                              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[10px] font-sans font-semibold transition cursor-pointer flex items-center gap-1"
                            >
                              <Check className="h-3 w-3" /> Save Notes
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="space-y-2">
                            <h5 className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">
                              Your Study Annotation
                            </h5>
                            {bookmark.notes ? (
                              <p className="text-slate-700 text-[11px] leading-relaxed font-sans italic">
                                "{bookmark.notes}"
                              </p>
                            ) : (
                              <p className="text-slate-400 text-[10px] font-sans italic">
                                No annotations written yet. Click edit to add case benchmarks or notes.
                              </p>
                            )}
                          </div>

                          <div className="flex justify-end mt-4">
                            <button
                              id={`edit-notes-${bookmark.sectionId}`}
                              onClick={() => startEditing(bookmark.sectionId, bookmark.notes || '')}
                              className="text-[10px] font-sans font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1 transition cursor-pointer"
                            >
                              <Edit3 className="h-3 w-3" /> Edit Annotation
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bookmark Date Footer */}
                    <div className="px-4 py-2 bg-slate-50/20 border-t border-slate-50 text-[9px] text-slate-400 font-sans flex items-center gap-1 justify-end">
                      <Calendar className="h-3 w-3" />
                      Saved {new Date(bookmark.bookmarkedAt).toLocaleDateString()}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* AI RESEARCH MEMOS VIEW */}
        {subTab === 'memos' && (
          savedMemos.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-24 bg-white border border-slate-200 rounded-2xl p-8 max-w-md mx-auto space-y-3">
              <FileText className="h-12 w-12 text-slate-300 stroke-[1.2]" />
              <h3 className="text-sm font-semibold text-slate-800 font-display">No Research Memos Archived</h3>
              <p className="text-xs text-slate-500 font-sans leading-normal">
                Submit queries inside the AI Research Desk, then save your session to archive complete synthesized memoranda and cited provisions list here.
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-w-4xl mx-auto">
              {savedMemos.map((memo) => {
                const isExpanded = expandedMemoId === memo.id;

                return (
                  <div key={memo.id} id={`memo-card-${memo.id}`} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm transition">
                    
                    {/* Header Summary Trigger */}
                    <div
                      className="p-4 cursor-pointer hover:bg-slate-50/50 transition flex items-start gap-4"
                      onClick={() => setExpandedMemoId(isExpanded ? null : memo.id)}
                    >
                      <div className="p-2 bg-blue-50 text-blue-700 rounded-lg shadow-inner">
                        <Scale className="h-4.5 w-4.5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="text-[10px] text-blue-700 font-bold font-mono uppercase bg-blue-50 px-1.5 py-0.2 rounded">
                            Synthesis ID: {memo.id.replace('memo-', '')}
                          </span>
                          <span className="text-slate-300 font-mono text-[10px]">•</span>
                          <span className="text-[10px] text-slate-400 font-sans flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {new Date(memo.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <h3 className="text-xs font-bold text-slate-800 leading-snug font-display">
                          Query: {memo.query}
                        </h3>
                        <p className="text-[11px] text-slate-500 leading-normal line-clamp-1 mt-1 font-sans">
                          Findings: {memo.summary}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-center">
                        <button
                          id={`delete-memo-${memo.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteMemo(memo.id);
                          }}
                          className="p-1.5 hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-400 hover:text-red-600 rounded-lg transition cursor-pointer"
                          title="Delete Memoir"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Expandable Document Body */}
                    {isExpanded && (
                      <div className="border-t border-slate-100 bg-slate-50/20 p-5 space-y-6 select-text animate-fade-in">
                        
                        {/* Summary Callout */}
                        <div className="border border-blue-200 bg-blue-50/15 rounded-xl p-4 shadow-sm relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500" />
                          <h4 className="text-[10px] font-bold text-blue-800 font-mono uppercase tracking-wider mb-1">
                            Counsel Summary & Executive Conclusion
                          </h4>
                          <p className="text-slate-800 text-[11px] leading-relaxed font-sans font-medium">
                            {memo.summary}
                          </p>
                        </div>

                        {/* Complete markdown memoir */}
                        <div className="border border-slate-150 rounded-xl p-5 bg-white shadow-sm font-sans">
                          <MarkdownRenderer content={memo.memo} />
                        </div>

                        {/* Cited links in this saved memorandum */}
                        {memo.citedSections.length > 0 && (
                          <div className="space-y-2.5 pt-2">
                            <h4 className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                              <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                              Associated Cited Provisions
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {memo.citedSections.map((cite) => (
                                <button
                                  key={cite.sectionId}
                                  id={`notebook-cite-${cite.sectionId}`}
                                  onClick={() => onNavigateToSection(cite.sectionId)}
                                  className="text-left p-3 border border-slate-200 hover:border-amber-500 rounded-xl bg-white transition cursor-pointer flex items-center justify-between"
                                >
                                  <div className="min-w-0 font-sans">
                                    <span className="text-[9px] text-amber-700 font-bold font-mono">
                                      {cite.sectionNumber}
                                    </span>
                                    <span className="text-slate-300 font-mono text-[9px] mx-1.5">•</span>
                                    <span className="text-[9px] text-slate-400 font-medium font-sans">
                                      {cite.actTitle}
                                    </span>
                                    <h4 className="text-[10px] font-bold text-slate-800 leading-snug line-clamp-1 mt-0.5">
                                      {cite.sectionTitle}
                                    </h4>
                                  </div>
                                  <ExternalLink className="h-3 w-3 text-slate-400" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}
