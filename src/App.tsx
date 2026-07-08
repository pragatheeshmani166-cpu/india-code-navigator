import { useState, useEffect, useMemo } from 'react';
import { Scale, FolderOpen, SearchCode, BookmarkCheck, FileText, Globe, HelpCircle } from 'lucide-react';
import Sidebar from './components/Sidebar';
import MainExplorer from './components/MainExplorer';
import ResearchHub from './components/ResearchHub';
import Notebook from './components/Notebook';
import { Section, Act, Bookmark, ResearchMemo } from './types';
import { CENTRAL_ACTS } from './data/central_acts';
import { STATE_ACTS } from './data/state_acts';

type Tab = 'explorer' | 'research' | 'notebook';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('explorer');
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [selectedAct, setSelectedAct] = useState<Act | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [savedMemos, setSavedMemos] = useState<ResearchMemo[]>([]);

  // Initialize selected section to Article 21 of the Constitution so the layout is populated on load
  useEffect(() => {
    const defaultAct = CENTRAL_ACTS[0]; // Constitution of India
    const defaultChapter = defaultAct.chapters[0]; // Part III Fundamental Rights
    const defaultSec = defaultChapter.sections.find(s => s.id === 'const-art21') || defaultChapter.sections[0];
    
    setSelectedAct(defaultAct);
    setSelectedSection(defaultSec);
  }, []);

  // Load bookmarks and memos from localStorage
  useEffect(() => {
    try {
      const storedBookmarks = localStorage.getItem('india_code_bookmarks');
      if (storedBookmarks) {
        setBookmarks(JSON.parse(storedBookmarks));
      }

      const storedMemos = localStorage.getItem('india_code_research_memos');
      if (storedMemos) {
        setSavedMemos(JSON.parse(storedMemos));
      }
    } catch (e) {
      console.error('Failed to load storage data:', e);
    }
  }, []);

  // Combine all acts for quick lookups
  const allActs = useMemo(() => {
    return [...CENTRAL_ACTS, ...STATE_ACTS];
  }, []);

  // Helper: jump/navigate to a specific section by its ID from anywhere
  const handleNavigateToSection = (sectionId: string) => {
    let foundSection: Section | null = null;
    let foundAct: Act | null = null;

    for (const act of allActs) {
      for (const chapter of act.chapters) {
        const sec = chapter.sections.find(s => s.id === sectionId);
        if (sec) {
          foundSection = sec;
          foundAct = act;
          break;
        }
      }
      if (foundSection) break;
    }

    if (foundSection && foundAct) {
      setSelectedAct(foundAct);
      setSelectedSection(foundSection);
      setActiveTab('explorer');

      // Scroll explorer body back to top on navigation jump
      setTimeout(() => {
        const explorerBody = document.getElementById('explorer-body');
        if (explorerBody) explorerBody.scrollTop = 0;
      }, 50);
    }
  };

  // Toggle bookmark section
  const handleToggleBookmark = (section: Section, act: Act, notes?: string) => {
    setBookmarks(prev => {
      const exists = prev.some(b => b.sectionId === section.id);
      let updated: Bookmark[];

      if (exists) {
        updated = prev.filter(b => b.sectionId !== section.id);
      } else {
        const newBookmark: Bookmark = {
          actId: act.id,
          sectionId: section.id,
          actTitle: act.shortTitle,
          sectionNumber: section.number,
          sectionTitle: section.title,
          bookmarkedAt: new Date().toISOString(),
          notes: notes || ''
        };
        updated = [...prev, newBookmark];
      }

      localStorage.setItem('india_code_bookmarks', JSON.stringify(updated));
      return updated;
    });
  };

  // Update notes/annotation on a bookmark
  const handleUpdateBookmarkNotes = (sectionId: string, notes: string) => {
    setBookmarks(prev => {
      const updated = prev.map(b => {
        if (b.sectionId === sectionId) {
          return { ...b, notes };
        }
        return b;
      });
      localStorage.setItem('india_code_bookmarks', JSON.stringify(updated));
      return updated;
    });
  };

  // Remove a bookmark from the Notebook
  const handleRemoveBookmark = (sectionId: string) => {
    setBookmarks(prev => {
      const updated = prev.filter(b => b.sectionId !== sectionId);
      localStorage.setItem('india_code_bookmarks', JSON.stringify(updated));
      return updated;
    });
  };

  // Save an AI Research Memorandum to storage
  const handleSaveMemo = (memo: ResearchMemo) => {
    setSavedMemos(prev => {
      // Avoid duplicates
      const exists = prev.some(m => m.id === memo.id || m.query === memo.query);
      if (exists) return prev;

      const updated = [...prev, memo];
      localStorage.setItem('india_code_research_memos', JSON.stringify(updated));
      return updated;
    });
  };

  // Delete a saved AI Research Memorandum from storage
  const handleDeleteMemo = (memoId: string) => {
    setSavedMemos(prev => {
      const updated = prev.filter(m => m.id !== memoId);
      localStorage.setItem('india_code_research_memos', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100 text-slate-800 font-sans" id="app-root">
      {/* 1. Header Navigation Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4 shrink-0 select-none shadow-md">
        {/* Brand details */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-600 rounded-lg text-white shadow-sm shadow-amber-600/30">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-tight font-display text-slate-100">
                India Code Navigator
              </h1>
              <span className="bg-slate-800 border border-slate-700 text-slate-400 text-[8px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded">
                v2.1 Repository
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans leading-tight mt-0.5">
              Advanced Cross-Referenced Search Tool & AI Research Companion
            </p>
          </div>
        </div>

        {/* Tab switcher buttons */}
        <nav className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700/50">
          <button
            id="nav-tab-explorer"
            onClick={() => setActiveTab('explorer')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide font-sans transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'explorer'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderOpen className="h-3.5 w-3.5" />
            Code Explorer
          </button>

          <button
            id="nav-tab-research"
            onClick={() => setActiveTab('research')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide font-sans transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'research'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <SearchCode className="h-3.5 w-3.5" />
            AI Research Desk
          </button>

          <button
            id="nav-tab-notebook"
            onClick={() => setActiveTab('notebook')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide font-sans transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'notebook'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookmarkCheck className="h-3.5 w-3.5" />
            Study Notebook
            {bookmarks.length > 0 && (
              <span className="bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[9px] font-bold px-1.5 py-0.2 rounded-full font-mono">
                {bookmarks.length}
              </span>
            )}
          </button>
        </nav>

        {/* Global metadata credentials */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="text-right">
            <span className="text-[9px] text-slate-500 font-mono block">SECURE CONNECTIONS</span>
            <span className="text-[10px] text-emerald-400 font-semibold font-sans flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Gemini AI Active
            </span>
          </div>
        </div>
      </header>

      {/* 2. Main content container */}
      <main className="flex-1 overflow-hidden" id="main-content-pane">
        {activeTab === 'explorer' && (
          <div className="flex flex-col md:flex-row h-full overflow-hidden">
            <Sidebar
              onSelectSection={(section, act) => {
                setSelectedAct(act);
                setSelectedSection(section);
              }}
              selectedSection={selectedSection}
              selectedAct={selectedAct}
            />
            <MainExplorer
              section={selectedSection}
              act={selectedAct}
              onSelectSectionById={handleNavigateToSection}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
            />
          </div>
        )}

        {activeTab === 'research' && (
          <ResearchHub
            onNavigateToSection={handleNavigateToSection}
            onSaveMemo={handleSaveMemo}
            savedMemos={savedMemos}
          />
        )}

        {activeTab === 'notebook' && (
          <Notebook
            bookmarks={bookmarks}
            savedMemos={savedMemos}
            onNavigateToSection={handleNavigateToSection}
            onUpdateBookmarkNotes={handleUpdateBookmarkNotes}
            onRemoveBookmark={handleRemoveBookmark}
            onDeleteMemo={handleDeleteMemo}
          />
        )}
      </main>
    </div>
  );
}
