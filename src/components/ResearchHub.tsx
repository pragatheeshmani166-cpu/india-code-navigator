import { useState, useMemo, FormEvent } from 'react';
import { Search, Sparkles, Scale, BookOpen, Bookmark, Copy, Check, FileText, ArrowRight, RotateCw } from 'lucide-react';
import { Section, Act, ResearchMemo } from '../types';
import { CENTRAL_ACTS } from '../data/central_acts';
import { STATE_ACTS } from '../data/state_acts';
import MarkdownRenderer from './MarkdownRenderer';

interface ResearchHubProps {
  onNavigateToSection: (sectionId: string) => void;
  onSaveMemo: (memo: ResearchMemo) => void;
  savedMemos: ResearchMemo[];
}

const SUGGESTED_QUERIES = [
  {
    title: "Cybercrime FIR & Evidence",
    text: "How does the police record a cybercrime FIR electronically, and what digital evidence guidelines apply under the BNSS and BSA?"
  },
  {
    title: "Bail for Non-bailable Offense",
    text: "What is the procedure and judicial discretion for taking bail in case of a non-bailable offense under BNSS Section 480 and Article 21?"
  },
  {
    title: "Contract Breach & Damages Limit",
    text: "What are the remedies and damages guidelines for a breach of commercial contract under Contract Act Section 73, and are there state exceptions?"
  }
];

const LEGAL_QUOTES = [
  "Drafting Statement of Inquiry...",
  "Searching central statutes and historical mappings...",
  "Cross-referencing Concurrent List amendments...",
  "Evaluating Article 21 constitutional liberty thresholds...",
  "Formulating procedural litigation guidance...",
  "Verifying electronic evidence admissibility protocols under BSA Section 63...",
  "Reviewing Supreme Court precedents on Shreya Singhal (Article 19 vs IT Act)..."
];

export default function ResearchHub({
  onNavigateToSection,
  onSaveMemo,
  savedMemos
}: ResearchHubProps) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [loadingQuote, setLoadingQuote] = useState('');
  const [activeMemo, setActiveMemo] = useState<ResearchMemo | null>(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  // Combine all acts
  const allActs = useMemo(() => {
    return [...CENTRAL_ACTS, ...STATE_ACTS];
  }, []);

  // Pre-filter sections relevant to the query to pass as grounded context to Gemini
  const findLocalContext = (userQuery: string) => {
    const terms = userQuery.toLowerCase().split(' ');
    const matchedActs: Act[] = [];

    allActs.forEach(act => {
      const matchedChapters: typeof act.chapters = [];

      act.chapters.forEach(ch => {
        const matchedSections = ch.sections.filter(sec => {
          // Check if any word in query matches section number, title, text, old section, or keywords
          return terms.some(term => {
            if (term.length < 3) return false; // skip tiny words
            return sec.number.toLowerCase().includes(term) ||
                   sec.title.toLowerCase().includes(term) ||
                   sec.text.toLowerCase().includes(term) ||
                   (sec.oldSectionMapping && sec.oldSectionMapping.toLowerCase().includes(term)) ||
                   sec.keywords.some(kw => kw.toLowerCase().includes(term));
          });
        });

        if (matchedSections.length > 0) {
          matchedChapters.push({ ...ch, sections: matchedSections });
        }
      });

      if (matchedChapters.length > 0) {
        matchedActs.push({ ...act, chapters: matchedChapters });
      }
    });

    return matchedActs;
  };

  // Quote rotation during load
  let quoteInterval: NodeJS.Timeout;
  const startQuoteRotation = () => {
    setLoadingQuote(LEGAL_QUOTES[0]);
    quoteInterval = setInterval(() => {
      setLoadingQuote(LEGAL_QUOTES[Math.floor(Math.random() * LEGAL_QUOTES.length)]);
    }, 2800);
  };
  const stopQuoteRotation = () => {
    clearInterval(quoteInterval);
  };

  const handleSearch = async (e?: FormEvent, overrideQuery?: string) => {
    if (e) e.preventDefault();
    const searchQuery = overrideQuery || query;
    if (!searchQuery.trim() || isSearching) return;

    setQuery(searchQuery);
    setIsSearching(true);
    setSaved(false);
    setCopied(false);
    startQuoteRotation();

    try {
      // Find relevant curated sections to ground the AI search
      const groundedContext = findLocalContext(searchQuery);

      const response = await fetch('/api/legal/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          curatedActsContext: groundedContext
        })
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();

      // Resolve the cited sections in our local database for linking in the UI
      const citedSections: ResearchMemo['citedSections'] = [];
      if (data.citedSectionIds && Array.isArray(data.citedSectionIds)) {
        data.citedSectionIds.forEach((secId: string) => {
          for (const act of allActs) {
            for (const ch of act.chapters) {
              const sec = ch.sections.find(s => s.id === secId);
              if (sec) {
                citedSections.push({
                  actId: act.id,
                  sectionId: sec.id,
                  sectionNumber: sec.number,
                  actTitle: act.shortTitle,
                  sectionTitle: sec.title
                });
              }
            }
          }
        });
      }

      // If no cited sections were matched by id, let's auto-add any matched in the local context
      if (citedSections.length === 0 && groundedContext.length > 0) {
        groundedContext.forEach(act => {
          act.chapters.forEach(ch => {
            ch.sections.forEach(sec => {
              if (citedSections.length < 4) { // limit automatic additions
                citedSections.push({
                  actId: act.id,
                  sectionId: sec.id,
                  sectionNumber: sec.number,
                  actTitle: act.shortTitle,
                  sectionTitle: sec.title
                });
              }
            });
          });
        });
      }

      const newMemo: ResearchMemo = {
        id: `memo-${Date.now()}`,
        query: searchQuery,
        summary: data.summary,
        memo: data.memo,
        citedSections,
        createdAt: new Date().toISOString()
      };

      setActiveMemo(newMemo);
    } catch (err: any) {
      console.error(err);
      alert('AI Research generation failed: ' + err.message);
    } finally {
      stopQuoteRotation();
      setIsSearching(false);
    }
  };

  const handleCopy = () => {
    if (!activeMemo) return;
    navigator.clipboard.writeText(`${activeMemo.query}\n\nExecutive Summary:\n${activeMemo.summary}\n\n${activeMemo.memo}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (!activeMemo || saved) return;
    onSaveMemo(activeMemo);
    setSaved(true);
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col md:flex-row h-full overflow-hidden" id="research-hub-container">
      {/* LEFT MAIN COLUMN: Search & Memorandum Generator */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col bg-white border-r border-slate-200">
        
        {/* Desk Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-2.5 bg-amber-500 rounded-xl text-white shadow-sm shadow-amber-500/20">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 font-display flex items-center gap-1.5">
              AI Legal Research & Synthesis Desk
            </h1>
            <p className="text-[11px] text-slate-500 font-sans">
              Enter natural language inquiries. Gemini will synthesize a formal legal memorandum referencing Central laws and State variations.
            </p>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
              <input
                id="research-query-input"
                type="text"
                placeholder="Ask your legal query (e.g. 'What is the procedure for a cybercrime FIR and electronic records?')..."
                className="w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-xl text-xs font-sans focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition bg-slate-50 focus:bg-white shadow-[0_2px_4px_rgba(0,0,0,0.01)]"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isSearching}
              />
            </div>

            <button
              id="synthesize-btn"
              type="submit"
              disabled={isSearching || !query.trim()}
              className="px-5 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-sans text-xs font-semibold rounded-xl shadow-sm hover:shadow transition duration-200 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSearching ? (
                <RotateCw className="h-4 w-4 animate-spin text-amber-500" />
              ) : (
                <Sparkles className="h-4 w-4 text-amber-500" />
              )}
              Synthesize Memo
            </button>
          </div>

          {/* Quick Suggestions Cards */}
          {!activeMemo && !isSearching && (
            <div className="space-y-2.5 pt-2">
              <h4 className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">
                Select a Curated Research Query to Demonstrate AI Grounding
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {SUGGESTED_QUERIES.map((sq, idx) => (
                  <button
                    key={idx}
                    id={`suggested-query-${idx}`}
                    type="button"
                    onClick={() => handleSearch(undefined, sq.text)}
                    className="text-left p-3 border border-slate-200 rounded-xl hover:border-amber-500/50 hover:bg-amber-50/10 transition duration-200 cursor-pointer flex flex-col justify-between h-24 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                  >
                    <span className="text-[10px] font-semibold text-amber-800 font-sans tracking-wide">
                      {sq.title}
                    </span>
                    <p className="text-[9px] text-slate-500 leading-normal line-clamp-3 font-sans mt-1">
                      {sq.text}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>

        {/* LOADING SCREEN WITH DETAILED ROTATING SUB-PROCESS LOGS */}
        {isSearching && (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="h-14 w-14 rounded-full border-2 border-slate-100 border-t-amber-600 animate-spin flex items-center justify-center shadow-inner">
              <Scale className="h-5 w-5 text-amber-600" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-800 font-sans tracking-wide">Assembling Legal Memorandum...</p>
              <div className="h-6 overflow-hidden flex items-center justify-center max-w-sm px-6">
                <p className="text-[10px] text-amber-600 font-mono animate-pulse uppercase tracking-tight text-center">
                  {loadingQuote}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* COMPLETED RESEARCH MEMORANDUM DISPLAY */}
        {activeMemo && !isSearching && (
          <div className="flex-1 space-y-6 select-text animate-fade-in pt-2">
            
            {/* Memorandum Header Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase font-bold tracking-wider">
                  Document ID: {activeMemo.id}
                </span>
                <span className="text-slate-300 mx-2">•</span>
                <span className="text-[10px] text-slate-400 font-sans">
                  Compiled {new Date(activeMemo.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  id="copy-memo-btn"
                  onClick={handleCopy}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-[10px] font-sans font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied' : 'Copy Memorandum'}
                </button>

                <button
                  id="save-memo-btn"
                  onClick={handleSave}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-sans font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    saved
                      ? 'bg-emerald-50 border border-emerald-300 text-emerald-700'
                      : 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm shadow-amber-600/10'
                  }`}
                >
                  <Bookmark className="h-3.5 w-3.5 fill-current" />
                  {saved ? 'Saved to Notebook' : 'Save Session'}
                </button>
              </div>
            </div>

            {/* AI Executive Summary Box */}
            <div className="border border-amber-200 bg-amber-50/15 rounded-xl p-4 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500" />
              <div className="flex items-start gap-2.5">
                <Sparkles className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-[10px] font-bold text-amber-800 font-mono uppercase tracking-wider mb-1">
                    Counsel Summary & Findings
                  </h4>
                  <p className="text-slate-800 text-[11px] leading-relaxed font-sans font-medium">
                    {activeMemo.summary}
                  </p>
                </div>
              </div>
            </div>

            {/* Main Memorandum Legal Text */}
            <div className="border border-slate-150 rounded-xl p-6 shadow-sm bg-slate-50/10">
              <MarkdownRenderer content={activeMemo.memo} />
            </div>
          </div>
        )}
      </div>

      {/* RIGHT SIDE PANEL: Cited Provisions Sidebar */}
      {activeMemo && !isSearching && (
        <div className="w-full md:w-72 bg-slate-50/80 p-5 space-y-5 overflow-y-auto" id="citations-panel">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
            <BookOpen className="h-4 w-4 text-slate-500" />
            <h3 className="text-xs font-bold text-slate-700 font-display">
              Cited Legislation ({activeMemo.citedSections.length})
            </h3>
          </div>

          {activeMemo.citedSections.length === 0 ? (
            <p className="text-[10px] text-slate-400 font-sans leading-normal">
              No specific statuary links were cited. General jurisprudential standards apply.
            </p>
          ) : (
            <div className="space-y-3">
              <p className="text-[10px] text-slate-500 font-sans leading-relaxed">
                Gemini's memorandum draws upon the following curated sections of the India Code. Click any card to jump to its literal provision and run state analyses:
              </p>

              <div className="space-y-2.5">
                {activeMemo.citedSections.map((cite) => (
                  <button
                    key={cite.sectionId}
                    id={`cite-card-${cite.sectionId}`}
                    onClick={() => onNavigateToSection(cite.sectionId)}
                    className="w-full text-left p-3 border border-slate-200 hover:border-amber-500 rounded-xl bg-white transition duration-200 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.01)] flex items-start justify-between group"
                  >
                    <div className="flex-1 min-w-0 font-sans">
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <span className="text-[9px] text-amber-700 font-bold font-mono">
                          {cite.sectionNumber}
                        </span>
                        <span className="text-slate-300 font-mono text-[9px]">•</span>
                        <span className="text-[9px] text-slate-400 font-medium truncate max-w-[120px]">
                          {cite.actTitle}
                        </span>
                      </div>
                      <h4 className="text-[11px] font-semibold text-slate-800 leading-snug line-clamp-1">
                        {cite.sectionTitle}
                      </h4>
                    </div>

                    <ArrowRight className="h-3 w-3 text-slate-400 group-hover:text-amber-600 transition-transform duration-200 mt-1 ml-1 group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
