import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiCheckCircle, HiLockClosed, HiPlayCircle, HiLightBulb,
  HiAcademicCap, HiWrenchScrewdriver, HiTrophy, HiChevronDown,
  HiBookOpen, HiClock, HiSparkles, HiChatBubbleLeftEllipsis, HiArrowRight,
  HiViewColumns, HiQueueList, HiChartBar
} from 'react-icons/hi2';

export default function LearningPathRoadmap({ roadmap, onSelectModule, onAskAI, completedModules = [], toggleModuleComplete }) {
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'timeline' | 'list'
  const [expandedReason, setExpandedReason] = useState({});

  if (!roadmap || !roadmap.stages) {
    return (
      <div className="empty-roadmap card-surface glow-border text-center">
        <HiSparkles className="sparkle-empty pulse-sparkle" />
        <h3>No Learning Path Generated Yet</h3>
        <p>Use the conversational intake or click below to generate your custom learning path.</p>
      </div>
    );
  }

  const toggleExpand = (modId) => {
    setExpandedReason(prev => ({ ...prev, [modId]: !prev[modId] }));
  };

  const allModules = roadmap.stages.flatMap(s => s.modules || []);

  const kanbanColumns = [
    { id: 'to_learn', title: 'TO LEARN', color: 'muted' },
    { id: 'in_progress', title: 'IN PROGRESS', color: 'purple' },
    { id: 'mastered', title: 'MASTERED', color: 'emerald' }
  ];

  const getModuleCategory = (mod, isCompleted) => {
    if (isCompleted) return 'mastered';
    if (mod.status === 'in_progress' || mod.status === 'active') return 'in_progress';
    return 'to_learn';
  };

  const getModuleIcon = (type) => {
    switch (type) {
      case 'project': return <HiWrenchScrewdriver className="mod-type-icon project" />;
      case 'milestone': return <HiTrophy className="mod-type-icon milestone" />;
      case 'course': return <HiBookOpen className="mod-type-icon course" />;
      default: return <HiAcademicCap className="mod-type-icon concept" />;
    }
  };

  return (
    <div className="roadmap-wrapper">
      {/* Editorial Header Bar */}
      <div className="roadmap-header card-surface glow-border">
        <div className="header-top-row">
          <span className="badge-pill">
            <HiSparkles /> PATH ROADMAP BOARD
          </span>

          <div className="view-mode-selector">
            <button
              className={`view-pill-btn ${viewMode === 'kanban' ? 'active' : ''}`}
              onClick={() => setViewMode('kanban')}
              title="Kanban Board View"
            >
              <HiViewColumns /> Kanban
            </button>
            <button
              className={`view-pill-btn ${viewMode === 'timeline' ? 'active' : ''}`}
              onClick={() => setViewMode('timeline')}
              title="Sequential Timeline View"
            >
              <HiChartBar /> Timeline
            </button>
            <button
              className={`view-pill-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="Compact List View"
            >
              <HiQueueList /> List
            </button>
          </div>
        </div>

        <h2 className="roadmap-title">{roadmap.title}</h2>
        <p className="roadmap-summary">{roadmap.summary}</p>

        <div className="roadmap-meta-bar">
          <span><HiClock /> Est. {roadmap.targetDurationWeeks || 4} Weeks</span>
          <span><HiTrophy /> {roadmap.totalMilestones || 4} Milestones</span>
          <span><HiCheckCircle /> {completedModules.length} / {allModules.length} Modules Mastered</span>
        </div>
      </div>

      {/* VIEW 1: KANBAN BOARD */}
      {viewMode === 'kanban' && (
        <div className="kanban-board-grid">
          {kanbanColumns.map((col) => {
            const colModules = allModules.filter(m => getModuleCategory(m, completedModules.includes(m.id)) === col.id);

            return (
              <div key={col.id} className="kanban-column card-surface glow-border">
                <div className="column-header">
                  <span className={`col-dot ${col.color}`} />
                  <h4>{col.title}</h4>
                  <span className="col-count font-mono">{colModules.length}</span>
                </div>

                <div className="kanban-cards-stack">
                  {colModules.map((mod) => {
                    const isCompleted = completedModules.includes(mod.id);

                    return (
                      <motion.div
                        key={mod.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`kanban-module-card card-surface ${isCompleted ? 'completed' : ''}`}
                        onClick={() => onSelectModule(mod)}
                      >
                        <div className="kanban-card-top">
                          <span className="card-type-tag">{mod.type || 'Concept'}</span>
                          <span className="card-hours font-mono"><HiClock /> {mod.estimatedHours || 3}h</span>
                        </div>

                        <h5 className="kanban-card-title">{mod.title}</h5>

                        {mod.explainability?.topReason && (
                          <p className="kanban-card-reason">{mod.explainability.topReason}</p>
                        )}

                        <div className="kanban-card-footer">
                          <button
                            className="btn-status-toggle"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleModuleComplete(mod.id);
                            }}
                          >
                            {isCompleted ? <HiCheckCircle className="emerald" /> : <HiPlayCircle className="purple" />}
                            <span>{isCompleted ? 'Mastered' : 'Mark Complete'}</span>
                          </button>

                          <button
                            className="btn-mentor-icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAskAI(mod);
                            }}
                            title="Ask AI Mentor"
                          >
                            <HiChatBubbleLeftEllipsis />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: TIMELINE VIEW */}
      {viewMode === 'timeline' && (
        <div className="stages-timeline">
          {roadmap.stages.map((stage, sIdx) => (
            <div key={stage.id || sIdx} className="stage-block">
              <div className="stage-marker">
                <div className="stage-number font-mono">{sIdx + 1}</div>
                <div className="stage-title-wrap">
                  <h4>{stage.title}</h4>
                  <p>{stage.description}</p>
                </div>
              </div>

              <div className="modules-list">
                {stage.modules.map((mod) => {
                  const isCompleted = completedModules.includes(mod.id) || mod.status === 'completed';
                  const isInProgress = !isCompleted && mod.status !== 'locked';
                  const isExpanded = !!expandedReason[mod.id];

                  return (
                    <motion.div
                      key={mod.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`module-node-card card-surface glow-border ${isCompleted ? 'status-completed' : isInProgress ? 'status-active' : 'status-locked'}`}
                    >
                      <div className="node-top-bar">
                        <div className="node-type-label">
                          {getModuleIcon(mod.type)}
                          <span className="type-name">{mod.type.toUpperCase()}</span>
                        </div>

                        <div className="node-status-badge">
                          {isCompleted && <span className="status-pill completed"><HiCheckCircle /> Mastered</span>}
                          {isInProgress && <span className="status-pill active"><HiPlayCircle /> In Progress</span>}
                          {!isCompleted && !isInProgress && <span className="status-pill locked"><HiLockClosed /> To Learn</span>}
                        </div>
                      </div>

                      <h3 className="node-title">{mod.title}</h3>

                      {mod.explainability && (
                        <div className="explainability-inline-box">
                          <div className="reason-primary">
                            <HiLightBulb className="reason-bulb" />
                            <p><strong>Why recommended:</strong> {mod.explainability.topReason}</p>
                            <button className="btn-inline-toggle" onClick={() => toggleExpand(mod.id)}>
                              {isExpanded ? 'Less' : 'Why this node?'} <HiChevronDown className={`chevron ${isExpanded ? 'rotate' : ''}`} />
                            </button>
                          </div>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="reason-details-expanded"
                              >
                                <p className="detailed-why">{mod.explainability.detailedWhy}</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                      <div className="node-footer">
                        <span className="est-hours font-mono"><HiClock /> {mod.estimatedHours || 3} hrs</span>

                        <div className="node-actions">
                          <button className="btn-secondary btn-sm" onClick={() => onAskAI(mod)}>
                            <HiChatBubbleLeftEllipsis /> Ask Mentor
                          </button>
                          <button className="btn-vibrant-primary btn-sm" onClick={() => onSelectModule(mod)}>
                            Inspect Details <HiArrowRight />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 3: LIST VIEW */}
      {viewMode === 'list' && (
        <div className="compact-list-card card-surface glow-border">
          <div className="list-table-header">
            <span>MODULE TITLE</span>
            <span>TYPE</span>
            <span>EST. TIME</span>
            <span>STATUS</span>
            <span>ACTIONS</span>
          </div>

          <div className="list-table-body">
            {allModules.map((mod) => {
              const isCompleted = completedModules.includes(mod.id);

              return (
                <div key={mod.id} className="list-table-row" onClick={() => onSelectModule(mod)}>
                  <div className="title-col">
                    <strong>{mod.title}</strong>
                    <small>{mod.explainability?.topReason}</small>
                  </div>

                  <span className="type-col">{mod.type}</span>
                  <span className="time-col font-mono">{mod.estimatedHours || 3} hrs</span>

                  <div className="status-col">
                    <button
                      className={`btn-status-toggle ${isCompleted ? 'completed' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleModuleComplete(mod.id);
                      }}
                    >
                      {isCompleted ? <HiCheckCircle className="emerald" /> : <HiPlayCircle className="purple" />}
                      <span>{isCompleted ? 'Mastered' : 'To Learn'}</span>
                    </button>
                  </div>

                  <div className="actions-col">
                    <button className="btn-secondary btn-sm" onClick={(e) => { e.stopPropagation(); onAskAI(mod); }}>
                      Ask AI
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
