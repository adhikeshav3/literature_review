import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { NavigationTabs } from './components/NavigationTabs';
import type { TabType } from './components/NavigationTabs';
import { EvidenceMatrixTable } from './components/EvidenceMatrixTable';
import { PrismaFlowDiagram } from './components/PrismaFlowDiagram';
import { RiskOfBiasMatrix } from './components/RiskOfBiasMatrix';
import { SynthesisReportView } from './components/SynthesisReportView';
import { CitationGraphView } from './components/CitationGraphView';
import { AgentAuditTerminal } from './components/AgentAuditTerminal';
import { PaperDetailDrawer } from './components/PaperDetailDrawer';
import { ProtocolSetupModal } from './components/ProtocolSetupModal';
import { AddPaperModal } from './components/AddPaperModal';
import { api } from './services/api';
import type { Project, ProjectListItem, Paper, RiskOfBiasDetail } from './types';

export const App: React.FC = () => {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('evidence-matrix');
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  
  const [isProtocolModalOpen, setIsProtocolModalOpen] = useState(false);
  const [isAddPaperModalOpen, setIsAddPaperModalOpen] = useState(false);
  const [isPipelineRunning, setIsPipelineRunning] = useState(false);
  const [isResynthesizing, setIsResynthesizing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Load project list on mount
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async (preferredId?: string) => {
    try {
      const list = await api.getProjects();
      setProjects(list);
      if (list.length > 0) {
        const targetId = preferredId || list[0].id;
        loadProjectDetails(targetId);
      }
    } catch (e) {
      console.error('Failed to load projects:', e);
    }
  };

  const loadProjectDetails = async (id: string) => {
    try {
      const proj = await api.getProject(id);
      setCurrentProject(proj);
    } catch (e) {
      console.error(`Failed to load project details for ${id}:`, e);
    }
  };

  // Handle pipeline execution
  const handleRunPipeline = async (customQuery?: string) => {
    if (!currentProject) return;
    setIsPipelineRunning(true);
    showToast('Autonomous agents dispatched: Retrieving records and auditing PICO eligibility...');

    try {
      const updated = await api.runPipeline(currentProject.id, customQuery);
      setCurrentProject(updated);
      showToast(`Pipeline complete: ${Object.keys(updated.papers).length} papers indexed & synthesized.`);
      loadProjects(updated.id);
    } catch (e: any) {
      console.error('Pipeline error:', e);
      showToast('Error executing autonomous pipeline.');
    } finally {
      setIsPipelineRunning(false);
    }
  };

  // Handle Screening Status change (Included / Excluded)
  const handleUpdateStatus = async (
    paperId: string,
    status: 'included' | 'excluded' | 'flagged',
    reason?: string
  ) => {
    if (!currentProject) return;
    try {
      const updatedPaper = await api.updateScreening(currentProject.id, paperId, status, reason);
      const newPapers = { ...currentProject.papers, [paperId]: updatedPaper };
      
      const inc = Object.values(newPapers).filter((p) => p.screening.status === 'included').length;
      const exc = Object.values(newPapers).filter((p) => p.screening.status === 'excluded').length;

      setCurrentProject({
        ...currentProject,
        papers: newPapers,
        prisma: {
          ...currentProject.prisma,
          records_screened: Object.keys(newPapers).length,
          records_excluded: exc,
          fulltext_assessed: inc,
          included_qualitative: inc,
          included_quantitative: inc,
        },
      });

      if (selectedPaper && selectedPaper.id === paperId) {
        setSelectedPaper(updatedPaper);
      }
      showToast(`Study marked as ${status.toUpperCase()}`);
    } catch (e) {
      console.error('Update screening error:', e);
    }
  };

  // Handle Risk of Bias update
  const handleUpdateRiskOfBias = async (paperId: string, rob: RiskOfBiasDetail) => {
    if (!currentProject) return;
    try {
      const updated = await api.updateRiskOfBias(currentProject.id, paperId, rob);
      setCurrentProject({
        ...currentProject,
        papers: { ...currentProject.papers, [paperId]: updated },
      });
      if (selectedPaper && selectedPaper.id === paperId) {
        setSelectedPaper(updated);
      }
      showToast('Cochrane Risk of Bias appraisal updated.');
    } catch (e) {
      console.error('Update RoB error:', e);
    }
  };

  // Handle manual study ingestion
  const handleAddPaper = async (paperData: any) => {
    if (!currentProject) return;
    try {
      const newPaper = await api.addPaper(currentProject.id, paperData);
      const newPapers = { ...currentProject.papers, [newPaper.id]: newPaper };
      setCurrentProject({
        ...currentProject,
        papers: newPapers,
      });
      showToast('Study ingested with automated evidence extraction.');
    } catch (e) {
      console.error('Add paper error:', e);
    }
  };

  // Handle Re-synthesis
  const handleResynthesize = async () => {
    if (!currentProject) return;
    setIsResynthesizing(true);
    try {
      const newSynthesis = await api.resynthesize(currentProject.id);
      setCurrentProject({
        ...currentProject,
        synthesis: newSynthesis,
      });
      showToast('PRISMA manuscript & thematic clusters re-synthesized.');
    } catch (e) {
      console.error('Resynthesis error:', e);
    } finally {
      setIsResynthesizing(false);
    }
  };

  // Handle Export Download
  const handleExport = (type: 'bibtex' | 'ris' | 'csv' | 'prisma-svg') => {
    if (!currentProject) return;
    const url = api.getExportUrl(currentProject.id, type);
    window.open(url, '_blank');
  };

  const papersList = currentProject ? Object.values(currentProject.papers) : [];
  const includedCount = papersList.filter((p) => p.screening.status === 'included').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-4 sm:bottom-5 right-4 sm:right-5 left-4 sm:left-auto z-50 bg-slate-900 border border-slate-700 text-sky-300 text-xs px-4 py-2.5 rounded-lg shadow-2xl flex items-center space-x-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0"></span>
          <span className="truncate">{notification}</span>
        </div>
      )}

      {/* Header */}
      <Header
        currentProject={currentProject}
        projects={projects}
        onSelectProject={(id) => loadProjectDetails(id)}
        onOpenNewProtocol={() => setIsProtocolModalOpen(true)}
        onOpenAddPaper={() => setIsAddPaperModalOpen(true)}
        onExport={handleExport}
        onRunPipeline={() => handleRunPipeline()}
        isPipelineRunning={isPipelineRunning}
      />

      {/* Navigation Tabs */}
      <NavigationTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        includedCount={includedCount}
        totalCount={papersList.length}
        pipelineRunning={isPipelineRunning}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {currentProject ? (
          <>
            {activeTab === 'evidence-matrix' && (
              <EvidenceMatrixTable
                papers={papersList}
                onSelectPaper={(p) => setSelectedPaper(p)}
                onUpdateStatus={handleUpdateStatus}
              />
            )}

            {activeTab === 'prisma-flow' && (
              <PrismaFlowDiagram
                project={currentProject}
                onExportSvg={() => handleExport('prisma-svg')}
              />
            )}

            {activeTab === 'risk-of-bias' && (
              <RiskOfBiasMatrix
                papers={papersList}
                onUpdateRiskOfBias={handleUpdateRiskOfBias}
              />
            )}

            {activeTab === 'synthesis' && (
              <SynthesisReportView
                project={currentProject}
                onResynthesize={handleResynthesize}
                isResynthesizing={isResynthesizing}
              />
            )}

            {activeTab === 'citation-graph' && (
              <CitationGraphView
                papers={papersList}
                onSelectPaper={(p) => setSelectedPaper(p)}
              />
            )}

            {activeTab === 'audit-terminal' && (
              <AgentAuditTerminal
                logs={currentProject.audit_logs}
                onRunQuery={(q) => handleRunPipeline(q)}
                isRunning={isPipelineRunning}
                defaultQuery={currentProject.protocol.search_query_boolean}
              />
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
            Loading review intelligence workbench...
          </div>
        )}
      </main>

      {/* Paper Detail Drawer */}
      <PaperDetailDrawer
        paper={selectedPaper}
        onClose={() => setSelectedPaper(null)}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Protocol Registration Modal */}
      <ProtocolSetupModal
        isOpen={isProtocolModalOpen}
        onClose={() => setIsProtocolModalOpen(false)}
        onSubmit={async (data) => {
          try {
            const newProj = await api.createProject(data);
            await loadProjects(newProj.id);
            showToast('New systematic review protocol registered.');
          } catch (e) {
            console.error(e);
          }
        }}
      />

      {/* Add Study Modal */}
      <AddPaperModal
        isOpen={isAddPaperModalOpen}
        onClose={() => setIsAddPaperModalOpen(false)}
        onSubmit={handleAddPaper}
      />
    </div>
  );
};

export default App;
