import { useState, useMemo } from 'react';
import { Search, Folder, BookOpen, ChevronRight, ChevronDown, Award, Globe } from 'lucide-react';
import { Act, Section } from '../types';
import { CENTRAL_ACTS } from '../data/central_acts';
import { STATE_ACTS } from '../data/state_acts';

interface SidebarProps {
  onSelectSection: (section: Section, act: Act) => void;
  selectedSection: Section | null;
  selectedAct: Act | null;
}

const CATEGORIES = ['All', 'Constitutional', 'Criminal', 'Civil', 'Corporate', 'Technology'] as const;

export default function Sidebar({ onSelectSection, selectedSection, selectedAct }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<typeof CATEGORIES[number]>('All');
  
  // Track expanded acts and chapters
  const [expandedActs, setExpandedActs] = useState<Record<string, boolean>>({
    "constitution-1950": true, // Expand constitution by default
    "bns-2023": true
  });
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({
    "const-ch3": true,
    "bns-ch6": true
  });

  const toggleAct = (actId: string) => {
    setExpandedActs(prev => ({ ...prev, [actId]: !prev[actId] }));
  };

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => ({ ...prev, [chapterId]: !prev[chapterId] }));
  };

  // Combine Central and State acts
  const allActs = useMemo(() => {
    return [...CENTRAL_ACTS, ...STATE_ACTS];
  }, []);

  // Filter acts and sections based on search query and category
  const filteredActs = useMemo(() => {
    return allActs.map(act => {
      // 1. Filter by category
      if (selectedCategory !== 'All' && act.category !== selectedCategory) {
        return null;
      }

      // 2. Filter by search query
      if (!searchQuery.trim()) {
        return act; // No search query, return full act
      }

      const query = searchQuery.toLowerCase();
      const actMatches = act.title.toLowerCase().includes(query) || 
                         act.shortTitle.toLowerCase().includes(query) || 
                         act.description.toLowerCase().includes(query);

      // Filter chapters & sections
      const matchingChapters = act.chapters.map(chapter => {
        const matchingSections = chapter.sections.filter(sec => {
          return sec.number.toLowerCase().includes(query) ||
                 sec.title.toLowerCase().includes(query) ||
                 sec.text.toLowerCase().includes(query) ||
                 (sec.oldSectionMapping && sec.oldSectionMapping.toLowerCase().includes(query)) ||
                 sec.keywords.some(kw => kw.toLowerCase().includes(query));
        });

        if (matchingSections.length > 0) {
          return { ...chapter, sections: matchingSections };
        }
        return null;
      }).filter((ch): ch is typeof act.chapters[0] => ch !== null);

      if (actMatches || matchingChapters.length > 0) {
        // If the search matches and there are matching chapters, we should auto-expand this act
        setTimeout(() => {
          setExpandedActs(prev => ({ ...prev, [act.id]: true }));
          matchingChapters.forEach(ch => {
            setExpandedChapters(prev => ({ ...prev, [ch.id]: true }));
          });
        }, 50);

        // If act matched but no specific sections matched, return full act, otherwise return filtered chapters
        return {
          ...act,
          chapters: matchingChapters.length > 0 ? matchingChapters : act.chapters
        };
      }

      return null;
    }).filter((act): act is Act => act !== null);
  }, [allActs, searchQuery, selectedCategory]);

  return (
    <div className="w-full md:w-80 border-r border-slate-200 bg-white flex flex-col h-full" id="sidebar-container">
      {/* Search Header */}
      <div className="p-4 border-b border-slate-100 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            id="search-input"
            type="text"
            placeholder="Search by keywords, sections, IPC maps..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs font-sans focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition bg-slate-50 focus:bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories Carousel */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              id={`cat-btn-${cat.toLowerCase()}`}
              className={`px-2.5 py-1 rounded-full text-[10px] font-sans font-medium tracking-wide whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Act Explorer List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {filteredActs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center px-4 space-y-2">
            <Folder className="h-8 w-8 text-slate-300 stroke-[1.5]" />
            <p className="text-xs font-medium text-slate-500 font-sans">No legislation matches your filters</p>
            <p className="text-[11px] text-slate-400 font-sans">Try searching other keywords or clearing the category filter.</p>
          </div>
        ) : (
          filteredActs.map((act) => {
            const isActExpanded = expandedActs[act.id];
            const isSelectedAct = selectedAct?.id === act.id;

            return (
              <div key={act.id} className="border border-slate-100 rounded-xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.02)] bg-slate-50/50" id={`act-card-${act.id}`}>
                {/* Act Main Header Accordion Toggle */}
                <button
                  id={`act-toggle-${act.id}`}
                  className={`w-full text-left p-3 flex items-start gap-2.5 transition cursor-pointer hover:bg-slate-50 ${
                    isSelectedAct ? 'border-l-4 border-amber-600 bg-amber-50/20' : ''
                  }`}
                  onClick={() => toggleAct(act.id)}
                >
                  <div className="mt-0.5 text-slate-400 transition-transform duration-200">
                    {isActExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono tracking-wider font-semibold uppercase ${
                        act.type === 'central' 
                          ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      }`}>
                        {act.type === 'central' ? 'Central' : 'State'}
                      </span>
                      <span className="text-[10px] font-medium text-slate-500 font-sans">
                        Year {act.year}
                      </span>
                      <span className="text-[9px] text-slate-400 bg-slate-100 px-1 py-0.5 rounded font-sans ml-auto">
                        {act.category}
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-slate-800 leading-tight font-display pr-1">
                      {act.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-1 truncate font-sans">
                      {act.description}
                    </p>
                  </div>
                </button>

                {/* Act Expandable Contents (Chapters & Sections) */}
                {isActExpanded && (
                  <div className="border-t border-slate-100 bg-white">
                    {act.chapters.map((chapter) => {
                      const isChExpanded = expandedChapters[chapter.id];

                      return (
                        <div key={chapter.id} className="border-b border-slate-50 last:border-0" id={`ch-container-${chapter.id}`}>
                          {/* Chapter Toggle Button */}
                          <button
                            id={`ch-toggle-${chapter.id}`}
                            className="w-full text-left px-4 py-2 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between transition text-slate-600 cursor-pointer"
                            onClick={() => toggleChapter(chapter.id)}
                          >
                            <span className="text-[10px] font-semibold tracking-wider text-slate-500 font-mono flex items-center gap-1">
                              <BookOpen className="h-3 w-3 text-slate-400" />
                              {chapter.number}: {chapter.title}
                            </span>
                            <div className="text-slate-400">
                              {isChExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                            </div>
                          </button>

                          {/* Chapter Sections List */}
                          {isChExpanded && (
                            <div className="py-1 bg-white space-y-0.5">
                              {chapter.sections.map((section) => {
                                const isSelectedSection = selectedSection?.id === section.id;

                                return (
                                  <button
                                    key={section.id}
                                    id={`sec-btn-${section.id}`}
                                    className={`w-full text-left px-5 py-2.5 transition flex items-start gap-2 cursor-pointer ${
                                      isSelectedSection
                                        ? 'bg-amber-50/30 text-slate-900 border-r-2 border-amber-500'
                                        : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                                    onClick={() => onSelectSection(section, act)}
                                  >
                                    <div className="flex-1 min-w-0 font-sans">
                                      <div className="flex items-center gap-1.5 mb-0.5">
                                        <span className="text-[11px] font-bold text-amber-700 whitespace-nowrap font-mono">
                                          {section.number}
                                        </span>
                                        {section.oldSectionMapping && (
                                          <span className="text-[9px] text-slate-400 bg-slate-50 px-1 py-0.2 rounded font-mono truncate max-w-[120px]">
                                            {section.oldSectionMapping}
                                          </span>
                                        )}
                                      </div>
                                      <h5 className="text-[11px] font-semibold text-slate-800 leading-normal line-clamp-1">
                                        {section.title}
                                      </h5>
                                      <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                                        {section.text}
                                      </p>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
