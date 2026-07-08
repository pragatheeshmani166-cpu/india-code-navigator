import { useState, useEffect, FormEvent } from 'react';
import { Bookmark, Sparkles, Scale, BookOpen, AlertTriangle, HelpCircle, Check, Send, RotateCw, Globe } from 'lucide-react';
import { Section, Act, Bookmark as BookmarkType, StateAmendment } from '../types';
import { getStateAmendmentsForSection } from '../data/state_acts';
import MarkdownRenderer from './MarkdownRenderer';

interface MainExplorerProps {
  section: Section | null;
  act: Act | null;
  onSelectSectionById: (sectionId: string) => void;
  bookmarks: BookmarkType[];
  onToggleBookmark: (section: Section, act: Act, notes?: string) => void;
}

const LEGAL_QUOTES = [
  "Justice delayed is justice denied. — William E. Gladstone",
  "Ignorance of the law excuses no one (Ignorantia juris non excusat).",
  "The law is a shield of the innocent, not a sword of the oppressor.",
  "Let justice be done though the heavens fall (Fiat justitia ruat caelum).",
  "Analyzing federalism under Seventh Schedule (Concurrent List) powers...",
  "Cross-referencing substantive sections with investigative protocols...",
  "Synthesizing comparative 2023 legal reform frameworks..."
];

export default function MainExplorer({
  section,
  act,
  onSelectSectionById,
  bookmarks,
  onToggleBookmark
}: MainExplorerProps) {
  const [activeTab, setActiveTab] = useState<'text' | 'state' | 'ai'>('text');
  const [aiMode, setAiMode] = useState<'plain' | 'case-law' | 'comparison'>('plain');
  
  // Local cache for AI-generated explanations to prevent repeating server requests
  // key format: `${sectionId}-${mode}`
  const [aiCache, setAiCache] = useState<Record<string, string>>({});
  const [loadingAi, setLoadingAi] = useState(false);
  const [loadingQuote, setLoadingQuote] = useState('');
  
  // Custom grounded chat questions
  const [customQuestion, setCustomQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant'; text: string }[]>([]);
  const [sendingQuestion, setSendingQuestion] = useState(false);

  // State interaction analysis
  const [selectedAmendment, setSelectedAmendment] = useState<StateAmendment | null>(null);
  const [amendmentAnalysis, setAmendmentAnalysis] = useState<string>('');
  const [loadingAmendment, setLoadingAmendment] = useState(false);

  // Reset local interactive state when section changes
  useEffect(() => {
    setActiveTab('text');
    setAiMode('plain');
    setChatHistory([]);
    setCustomQuestion('');
    setSelectedAmendment(null);
    setAmendmentAnalysis('');
  }, [section]);

  if (!section || !act) {
    return (
      <div className="flex-1 bg-slate-50 flex flex-col items-center justify-center text-center p-8 h-full">
        <Scale className="h-16 w-16 text-slate-300 stroke-[1.2] mb-4" />
        <h3 className="text-lg font-semibold text-slate-800 font-display">Select a Provision to Begin</h3>
        <p className="text-xs text-slate-500 max-w-sm font-sans mt-2">
          Use the left Code Explorer panel to browse and search the curated India Code repository, or jump to the AI Research Desk.
        </p>
      </div>
    );
  }

  const isBookmarked = bookmarks.some(b => b.sectionId === section.id);
  const stateAmendments = getStateAmendmentsForSection(section.id);

  // Rotate legal quote while loading
  let quoteInterval: NodeJS.Timeout;
  const startQuoteRotation = () => {
    setLoadingQuote(LEGAL_QUOTES[Math.floor(Math.random() * LEGAL_QUOTES.length)]);
    quoteInterval = setInterval(() => {
      setLoadingQuote(LEGAL_QUOTES[Math.floor(Math.random() * LEGAL_QUOTES.length)]);
    }, 3500);
  };
  const stopQuoteRotation = () => {
    clearInterval(quoteInterval);
  };

  // Call API to explain section
  const fetchExplanation = async (mode: 'plain' | 'case-law' | 'comparison') => {
    const cacheKey = `${section.id}-${mode}`;
    if (aiCache[cacheKey]) {
      setAiMode(mode);
      setActiveTab('ai');
      return;
    }

    setLoadingAi(true);
    startQuoteRotation();
    try {
      const response = await fetch('/api/legal/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionId: section.id,
          sectionNumber: section.number,
          title: section.title,
          actTitle: act.title,
          sectionText: section.text,
          oldSectionMapping: section.oldSectionMapping,
          mode
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch explanation');
      }

      const data = await response.json();
      setAiCache(prev => ({ ...prev, [cacheKey]: data.explanation }));
      setAiMode(mode);
      setActiveTab('ai');
    } catch (err: any) {
      console.error(err);
      alert('AI explanation failed: ' + err.message);
    } finally {
      stopQuoteRotation();
      setLoadingAi(false);
    }
  };

  // Call API to analyze state-central interaction
  const fetchStateInteractionAnalysis = async (amendment: StateAmendment) => {
    setSelectedAmendment(amendment);
    setLoadingAmendment(true);
    try {
      const response = await fetch('/api/legal/cross-reference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          centralSectionId: section.id,
          stateName: amendment.stateName,
          centralText: section.text,
          amendmentText: amendment.details
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze interaction');
      }

      const data = await response.json();
      setAmendmentAnalysis(data.analysis);
    } catch (err: any) {
      console.error(err);
      alert('Failed to analyze interaction: ' + err.message);
    } finally {
      setLoadingAmendment(false);
    }
  };

  // Custom question chat handler (Grounded in section)
  const handleSendQuestion = async (e: FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim() || sendingQuestion) return;

    const userMsg = customQuestion.trim();
    setCustomQuestion('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setSendingQuestion(true);

    try {
      // Craft grounded query context
      const chatContextPrompt = `You are an elite legal counselor analyzing a specific provision of Indian Law.
ACT IN CONTEXT: ${act.title} (${act.year})
SECTION IN CONTEXT: ${section.number} - ${section.title}
TEXT OF LAW:
"${section.text}"
${section.oldSectionMapping ? `IPC/CrPC/Evidence Mapping: ${section.oldSectionMapping}` : ''}

The user has asked the following specific question about this section:
"${userMsg}"

Provide a concise, formal legal analysis or guidance answering their question directly. Back up your points with clear references to the text of the section.`;

      const response = await fetch('/api/legal/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: chatContextPrompt,
          activeCategory: act.category,
          curatedActsContext: [act] // ground it with this specific act
        })
      });

      if (!response.ok) {
        throw new Error('Chat analysis failed');
      }

      const data = await response.json();
      setChatHistory(prev => [...prev, { role: 'assistant', text: data.summary + '\n\n' + data.memo }]);
    } catch (err: any) {
      console.error(err);
      setChatHistory(prev => [...prev, { role: 'assistant', text: 'Error executing analysis: ' + err.message }]);
    } finally {
      setSendingQuestion(false);
    }
  };

  return (
    <div className="flex-1 bg-white flex flex-col h-full overflow-hidden" id="main-explorer-container">
      {/* 1. Header Details Panel */}
      <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[10px] text-slate-500 font-medium font-sans">
              {act.title}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-sans uppercase font-medium tracking-wide">
              {act.category}
            </span>
            {section.oldSectionMapping && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-100 px-1.5 py-0.5 rounded font-mono font-medium">
                  Formerly {section.oldSectionMapping}
                </span>
              </>
            )}
          </div>

          <h2 className="text-lg font-bold text-slate-900 leading-tight font-display flex items-center gap-2">
            <span className="text-amber-700 font-mono font-bold text-xl">{section.number}</span>
            {section.title}
          </h2>
        </div>

        {/* Header Actions */}
        <button
          id={`bookmark-btn-${section.id}`}
          onClick={() => onToggleBookmark(section, act)}
          className={`p-2 rounded-lg border transition duration-200 cursor-pointer ${
            isBookmarked
              ? 'bg-amber-50 border-amber-300 text-amber-600 hover:bg-amber-100'
              : 'border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600'
          }`}
          title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Section'}
        >
          <Bookmark className="h-5 w-5 fill-current" />
        </button>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="border-b border-slate-100 flex px-4 gap-4 bg-white select-none">
        <button
          id="tab-btn-text"
          onClick={() => setActiveTab('text')}
          className={`py-3 px-1 text-xs font-medium border-b-2 tracking-wide font-sans transition cursor-pointer ${
            activeTab === 'text'
              ? 'border-amber-600 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Literal Provisions
        </button>

        <button
          id="tab-btn-state"
          onClick={() => setActiveTab('state')}
          className={`py-3 px-1 text-xs font-medium border-b-2 tracking-wide font-sans transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'state'
              ? 'border-amber-600 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          State Amendments
          {stateAmendments.length > 0 && (
            <span className="bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.2 rounded-full font-bold">
              {stateAmendments.length}
            </span>
          )}
        </button>

        <button
          id="tab-btn-ai-explain"
          onClick={() => fetchExplanation('plain')}
          className={`py-3 px-1 text-xs font-medium border-b-2 tracking-wide font-sans transition cursor-pointer flex items-center gap-1 ${
            activeTab === 'ai'
              ? 'border-amber-600 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="h-3 w-3 text-amber-600" />
          AI Analysis Desk
        </button>
      </div>

      {/* 3. Panel Body (Dynamic scroll container) */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6" id="explorer-body">
        {/* LOADING SKELETON WITH LEGAL QUOTE ROTATOR */}
        {loadingAi && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 animate-fade-in">
            <div className="relative">
              <div className="h-12 w-12 rounded-full border-2 border-slate-100 border-t-amber-600 animate-spin flex items-center justify-center">
                <Scale className="h-4 w-4 text-amber-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-700 font-sans tracking-wide">Synthesizing AI Guidance...</p>
              <p className="text-[10px] text-slate-400 font-serif italic max-w-sm px-4">
                {loadingQuote}
              </p>
            </div>
          </div>
        )}

        {!loadingAi && activeTab === 'text' && (
          <div className="space-y-5">
            {/* Literal text code container */}
            <div className="border border-slate-200/60 bg-amber-50/10 rounded-xl p-5 shadow-[0_2px_4px_rgba(0,0,0,0.01)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-600" />
              <p className="text-slate-800 leading-relaxed font-sans text-xs whitespace-pre-line select-text font-medium">
                {section.text}
              </p>
            </div>

            {/* Keywords */}
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400 mr-1.5">Tags:</span>
              {section.keywords.map(kw => (
                <span key={kw} className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded font-sans">
                  {kw}
                </span>
              ))}
            </div>

            {/* CROSS REFERENCES SECTION */}
            {section.crossReferences.length > 0 && (
              <div className="border-t border-slate-100 pt-5 space-y-2.5">
                <h4 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                  India Code Cross-References
                </h4>
                <p className="text-[10px] text-slate-500 font-sans leading-relaxed">
                  These related sections codify associated criminal procedures, evidence rules, or constitutional overrides:
                </p>
                <div className="flex flex-wrap gap-2">
                  {section.crossReferences.map(refId => {
                    // Quick section/act lookups to format the label nicely
                    const parts = refId.split('-');
                    const actName = parts[0].toUpperCase();
                    const num = parts.slice(1).join(' ').toUpperCase();

                    return (
                      <button
                        key={refId}
                        id={`xref-btn-${refId}`}
                        onClick={() => onSelectSectionById(refId)}
                        className="bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/50 rounded-lg px-3 py-1.5 text-[10px] font-mono font-medium transition cursor-pointer flex items-center gap-1"
                      >
                        <span>{actName}</span>
                        <span className="text-amber-500">•</span>
                        <span>{num}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {!loadingAi && activeTab === 'state' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="h-4 w-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">
                State Variations & Repository Interactions
              </h3>
            </div>

            {stateAmendments.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-xl text-center space-y-1.5 border border-dashed border-slate-200">
                <AlertTriangle className="h-6 w-6 text-slate-400" />
                <p className="text-xs font-semibold text-slate-600 font-sans">Standard Central Jurisdiction</p>
                <p className="text-[10px] text-slate-400 font-sans max-w-xs">
                  No state-specific deviations or localized notifications are archived for {section.number} in our repository. The central mandate applies uniformly.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
                  Under the Concurrent List framework of the Indian Constitution, the following states have enacted specific amendments or rules modifying {section.number}:
                </p>

                {stateAmendments.map((amend) => {
                  const isSelected = selectedAmendment?.id === amend.id;

                  return (
                    <div key={amend.id} className="border border-slate-150 rounded-xl overflow-hidden shadow-sm bg-white" id={`amendment-card-${amend.id}`}>
                      <div className="p-4 bg-slate-50/50 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100">
                        <div>
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded font-sans">
                            {amend.stateName}
                          </span>
                          {amend.year && (
                            <span className="text-[10px] text-slate-400 font-sans ml-2">
                              Enacted Year {amend.year}
                            </span>
                          )}
                        </div>

                        <button
                          id={`analyze-amend-${amend.id}`}
                          onClick={() => fetchStateInteractionAnalysis(amend)}
                          className={`px-3 py-1 text-[10px] rounded-lg transition duration-200 flex items-center gap-1.5 cursor-pointer border ${
                            isSelected
                              ? 'bg-amber-50 border-amber-300 text-amber-700'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <Sparkles className="h-3 w-3 text-amber-500" />
                          Analyze Constitutional Interaction (AI)
                        </button>
                      </div>

                      <div className="p-4 space-y-2">
                        <h4 className="text-xs font-bold text-slate-800 font-sans">
                          {amend.text}
                        </h4>
                        <p className="text-[11px] text-slate-600 leading-relaxed font-sans bg-slate-50 p-2.5 rounded border border-slate-100">
                          {amend.details}
                        </p>
                      </div>

                      {isSelected && (
                        <div className="border-t-2 border-dashed border-slate-100 bg-amber-50/10 p-4 space-y-3">
                          <h5 className="text-[10px] font-bold text-amber-800 font-mono uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="h-3.5 w-3.5" />
                            Grounded Repugnancy & Concurrent Analysis
                          </h5>

                          {loadingAmendment ? (
                            <div className="flex items-center gap-2 py-3">
                              <RotateCw className="h-4 w-4 animate-spin text-amber-600" />
                              <span className="text-[11px] text-slate-500 font-sans">Refining federal legal analysis...</span>
                            </div>
                          ) : (
                            <div className="text-slate-700 text-xs leading-relaxed font-sans select-text border border-amber-100 bg-amber-50/5 p-3 rounded-lg">
                              <MarkdownRenderer content={amendmentAnalysis} />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {!loadingAi && activeTab === 'ai' && (
          <div className="space-y-6">
            {/* AI Menu selector */}
            <div className="flex border-b border-slate-100 text-slate-500 select-none">
              <button
                id="ai-subtab-plain"
                onClick={() => fetchExplanation('plain')}
                className={`flex-1 py-2 text-center text-[10px] font-bold uppercase tracking-wider transition cursor-pointer border-b-2 ${
                  aiMode === 'plain'
                    ? 'border-amber-600 text-slate-900 bg-slate-50/20'
                    : 'border-transparent hover:text-slate-800'
                }`}
              >
                Simple Citizen Explanation
              </button>

              <button
                id="ai-subtab-caselaw"
                onClick={() => fetchExplanation('case-law')}
                className={`flex-1 py-2 text-center text-[10px] font-bold uppercase tracking-wider transition cursor-pointer border-b-2 ${
                  aiMode === 'case-law'
                    ? 'border-amber-600 text-slate-900 bg-slate-50/20'
                    : 'border-transparent hover:text-slate-800'
                }`}
              >
                Case Law & Litigation Use
              </button>

              {section.oldSectionMapping && (
                <button
                  id="ai-subtab-comparison"
                  onClick={() => fetchExplanation('comparison')}
                  className={`flex-1 py-2 text-center text-[10px] font-bold uppercase tracking-wider transition cursor-pointer border-b-2 ${
                    aiMode === 'comparison'
                      ? 'border-amber-600 text-slate-900 bg-slate-50/20'
                      : 'border-transparent hover:text-slate-800'
                  }`}
                >
                  Reform Transition (2023 vs Old)
                </button>
              )}
            </div>

            {/* Generated AI Content Container */}
            <div className="border border-slate-150 rounded-xl p-5 shadow-sm bg-slate-50/20 select-text leading-relaxed font-sans text-sm animate-fade-in">
              <MarkdownRenderer content={aiCache[`${section.id}-${aiMode}`]} />
            </div>

            {/* SECTION GROUNDED Q&A CHAT */}
            <div className="border border-slate-200/80 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden bg-white">
              {/* Chat Header */}
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-1.5">
                  <HelpCircle className="h-4 w-4 text-amber-600" />
                  <span className="text-xs font-semibold text-slate-800 font-sans">
                    Ask Gemini About {section.number}
                  </span>
                </div>
                <span className="text-[9px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-medium">Grounded Work space</span>
              </div>

              {/* Chat Thread */}
              <div className="p-4 space-y-4 max-h-[250px] overflow-y-auto bg-slate-50/30">
                {chatHistory.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-[11px] text-slate-400 font-sans max-w-xs mx-auto">
                      Need clarification? Ask specific questions (e.g. "What is the bail process here?", "Is this cognizable?") and receive a custom analysis grounded in this provision.
                    </p>
                  </div>
                ) : (
                  chatHistory.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col max-w-[85%] ${
                        msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                      }`}
                    >
                      <span className="text-[9px] text-slate-400 font-mono uppercase mb-0.5">
                        {msg.role === 'user' ? 'You' : 'Gemini'}
                      </span>
                      <div
                        className={`rounded-xl px-3 py-2 text-[11px] leading-relaxed font-sans ${
                          msg.role === 'user'
                            ? 'bg-slate-900 text-white rounded-tr-none'
                            : 'bg-white text-slate-800 border border-slate-150 rounded-tl-none shadow-sm'
                        }`}
                      >
                        <MarkdownRenderer content={msg.text} />
                      </div>
                    </div>
                  ))
                )}

                {sendingQuestion && (
                  <div className="flex items-center gap-2 mr-auto bg-white border border-slate-150 rounded-xl px-3 py-2 text-[11px] text-slate-500 animate-pulse font-sans">
                    <RotateCw className="h-3 w-3 animate-spin text-amber-600" />
                    Gemini counsel is evaluating...
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendQuestion} className="border-t border-slate-100 flex p-2 bg-white">
                <input
                  id="chat-query-input"
                  type="text"
                  placeholder={`Ask a grounded question about ${section.number}...`}
                  className="flex-1 px-3 py-2 text-[11px] font-sans focus:outline-none bg-slate-50 rounded-lg border border-transparent focus:border-slate-100 transition"
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  disabled={sendingQuestion}
                />
                <button
                  id="send-chat-btn"
                  type="submit"
                  className="p-2 ml-1 text-amber-600 hover:text-amber-800 hover:bg-slate-50 rounded-lg transition cursor-pointer disabled:opacity-50"
                  disabled={!customQuestion.trim() || sendingQuestion}
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
