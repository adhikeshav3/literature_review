import React from 'react';
import { 
  Table, 
  GitBranch, 
  ShieldAlert, 
  FileText, 
  Share2, 
  TerminalSquare 
} from 'lucide-react';

export type TabType = 'evidence-matrix' | 'prisma-flow' | 'risk-of-bias' | 'synthesis' | 'citation-graph' | 'audit-terminal';

interface NavigationTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  includedCount: number;
  totalCount: number;
  pipelineRunning: boolean;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onTabChange,
  includedCount,
  totalCount,
  pipelineRunning,
}) => {
  const tabs = [
    {
      id: 'evidence-matrix' as TabType,
      label: 'Evidence Matrix',
      icon: Table,
      badge: `${includedCount}/${totalCount}`,
    },
    {
      id: 'prisma-flow' as TabType,
      label: 'PRISMA 2020 Flow',
      icon: GitBranch,
    },
    {
      id: 'risk-of-bias' as TabType,
      label: 'Risk of Bias (RoB 2)',
      icon: ShieldAlert,
    },
    {
      id: 'synthesis' as TabType,
      label: 'Synthesis & Manuscript',
      icon: FileText,
    },
    {
      id: 'citation-graph' as TabType,
      label: 'Citation Network',
      icon: Share2,
    },
    {
      id: 'audit-terminal' as TabType,
      label: 'Agent Telemetry',
      icon: TerminalSquare,
      pulse: pipelineRunning,
    },
  ];

  return (
    <div className="bg-white border-b border-slate-200 sticky top-14 sm:top-16 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-3 overflow-x-auto py-2 no-scrollbar" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-1.5 py-1.5 px-2.5 sm:py-2 sm:px-3 rounded-md text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                  isActive
                    ? 'bg-slate-100 text-slate-900 border border-slate-300 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-0.5 text-[10px] sm:text-[11px] font-mono px-1 sm:px-1.5 py-0.2 rounded ${
                      isActive ? 'bg-white text-slate-900 border border-slate-300 font-bold' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
                {tab.pulse && (
                  <span className="relative flex h-2 w-2 ml-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
