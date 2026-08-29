import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import LandingPage from './components/landing/LandingPage';
import WorkspaceHeader from './components/layout/WorkspaceHeader';
import CommandPalette from './components/layout/CommandPalette';
import SidebarDock from './components/SidebarDock';
import DashboardOverview from './components/overview/DashboardOverview';
import ConversationalIntake from './components/intake/ConversationalIntake';
import LearnerProfileCard from './components/profile/LearnerProfileCard';
import LearningPathRoadmap from './components/roadmap/LearningPathRoadmap';
import ModuleDetailDrawer from './components/roadmap/ModuleDetailDrawer';
import CreatePathModal from './components/roadmap/CreatePathModal';
import TrajectoryDashboard from './components/dashboard/TrajectoryDashboard';
import ExplainabilityModal from './components/explainability/ExplainabilityModal';
import ModuleStudyStudio from './components/studio/ModuleStudyStudio';
import NotesStudyStudio from './components/studio/NotesStudyStudio';
import Footer from './components/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { generateRoadmap, fetchUserData, updateModuleStatus } from './api/studyApi';
import {
  loadStoredProfile, saveStoredProfile,
  loadStoredRoadmap, saveStoredRoadmap,
  loadStoredCompleted, saveStoredCompleted,
  loadStoredMessages, saveStoredMessages,
  loadStoredSection, saveStoredSection
} from './utils/storage';

function MainAppContent() {
  let isSignedIn = false;
  let user = null;
  let isLoaded = true;

  try {
    const clerk = useUser();
    if (clerk) {
      isSignedIn = clerk.isSignedIn || false;
      user = clerk.user || null;
      isLoaded = clerk.isLoaded ?? true;
    }
  } catch (e) {
    console.warn("Clerk context notice:", e.message);
  }

  const [isDemoMode, setIsDemoMode] = useState(() => {
    return sessionStorage.getItem('neuronova_demo') === 'true';
  });

  const [dark, setDark] = useState(() => {
    return localStorage.getItem('neuronova_theme') === 'dark';
  });

  const [activeSection, setActiveSection] = useState(() => loadStoredSection('overview'));

  // Modals & Drawers
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isCreatePathOpen, setIsCreatePathOpen] = useState(false);
  const [selectedDrawerModule, setSelectedDrawerModule] = useState(null);

  // Persistent States
  const [profile, setProfile] = useState(() => loadStoredProfile({
    goal: 'Master Full-Stack Engineering & AI Applications',
    experienceLevel: 'Intermediate',
    interests: ['React', 'Node.js', 'LLM Integration', 'System Design'],
    weeklyHours: 6,
    targetOutcome: 'Build Production AI Applications'
  }));

  const [roadmap, setRoadmap] = useState(() => loadStoredRoadmap(null));
  const [completedModules, setCompletedModules] = useState(() => loadStoredCompleted(['mod_101']));
  const [messages, setMessages] = useState(() => loadStoredMessages([
    {
      role: 'assistant',
      content: "Hello! I am your NeuroNova AI Learning Advisor. Tell me: what specific skill or career objective are you aiming to master?"
    }
  ]));

  const [isGenerating, setIsGenerating] = useState(false);

  // Modals
  const [explainModule, setExplainModule] = useState(null);
  const [studioModule, setStudioModule] = useState(null);

  const currentUserId = user?.id || 'default_user';

  const handleEnableDemo = () => {
    setIsDemoMode(true);
    sessionStorage.setItem('neuronova_demo', 'true');
  };

  const handleToggleTheme = () => {
    setDark((prev) => {
      const next = !prev;
      localStorage.setItem('neuronova_theme', next ? 'dark' : 'light');
      return next;
    });
  };

  // Sync Data from SQLite DB when User Signs In
  useEffect(() => {
    if (isSignedIn && user?.id) {
      fetchUserData(user.id)
        .then((data) => {
          if (data.profile) setProfile(data.profile);
          if (data.roadmap) setRoadmap(data.roadmap);
          if (data.completedModules && data.completedModules.length > 0) setCompletedModules(data.completedModules);
          if (data.messages && data.messages.length > 0) setMessages(data.messages);
        })
        .catch((err) => console.warn('Using local storage fallback:', err.message));
    }
  }, [isSignedIn, user?.id]);

  // Local Storage Sync Effects
  useEffect(() => saveStoredProfile(profile), [profile]);
  useEffect(() => saveStoredRoadmap(roadmap), [roadmap]);
  useEffect(() => saveStoredCompleted(completedModules), [completedModules]);
  useEffect(() => saveStoredMessages(messages), [messages]);
  useEffect(() => saveStoredSection(activeSection), [activeSection]);

  const handleGenerateRoadmap = async (targetProfile) => {
    const profToUse = targetProfile || profile;
    setIsGenerating(true);
    try {
      const data = await generateRoadmap(profToUse, currentUserId);
      setRoadmap(data);
      if (targetProfile) setProfile(targetProfile);
      setActiveSection('roadmap');
      setIsCreatePathOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to generate learning roadmap. Please check backend service.");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleModuleComplete = (modId) => {
    setCompletedModules((prev) => {
      const isCompleted = prev.includes(modId);
      const next = isCompleted ? prev.filter((id) => id !== modId) : [...prev, modId];
      
      updateModuleStatus(modId, isCompleted ? 'in_progress' : 'completed', roadmap?.id, currentUserId)
        .catch((err) => console.warn('Failed to sync module status to server DB:', err.message));

      return next;
    });
  };

  // If user is not signed in and hasn't explicitly launched demo mode, show Landing Page with Theme Support
  if (isLoaded && !isSignedIn && !isDemoMode) {
    return (
      <div className={dark ? 'app dark' : 'app'}>
        <LandingPage
          onExploreDemo={handleEnableDemo}
          dark={dark}
          onToggleTheme={handleToggleTheme}
        />
      </div>
    );
  }

  const allModulesCount = (roadmap?.stages || []).flatMap(s => s.modules || []).length;

  return (
    <div className={dark ? 'app dark' : 'app'}>
      <div className="studio-app-shell">
        {/* Left Floating Dock Navigation */}
        <SidebarDock
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          dark={dark}
          onToggle={handleToggleTheme}
        />

        {/* Main Viewport */}
        <div className="studio-main-viewport">
          {/* Top Workspace Header */}
          <WorkspaceHeader
            profile={profile}
            completedCount={completedModules.length}
            totalCount={allModulesCount}
            dark={dark}
            onToggleTheme={handleToggleTheme}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            onOpenCreatePath={() => setIsCreatePathOpen(true)}
          />

          <div className="shell studio-container">
            <div className="main-workspace-panel">
              <AnimatePresence mode="wait">
                {activeSection === 'overview' && (
                  <motion.section
                    key="overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.16 }}
                  >
                    <DashboardOverview
                      profile={profile}
                      roadmap={roadmap}
                      completedModules={completedModules}
                      onNavigate={(sec) => setActiveSection(sec)}
                      onLaunchStudio={(mod) => setStudioModule(mod)}
                    />
                  </motion.section>
                )}

                {activeSection === 'roadmap' && (
                  <motion.section
                    key="roadmap"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.16 }}
                  >
                    {!roadmap ? (
                      <div className="empty-roadmap-cta card-surface glow-subtle text-center">
                        <h3>Ready to generate your custom learning path?</h3>
                        <p>NeuroNova will construct a multi-stage roadmap tailored to <strong>{profile.goal}</strong>.</p>
                        <button className="btn-primary btn-lg" onClick={() => handleGenerateRoadmap()} disabled={isGenerating}>
                          {isGenerating ? 'Generating Roadmap...' : 'Generate Learning Roadmap Now'}
                        </button>
                      </div>
                    ) : (
                      <LearningPathRoadmap
                        roadmap={roadmap}
                        completedModules={completedModules}
                        toggleModuleComplete={toggleModuleComplete}
                        onSelectModule={(mod) => setSelectedDrawerModule(mod)}
                        onAskAI={(mod) => setExplainModule(mod)}
                      />
                    )}
                  </motion.section>
                )}

                {activeSection === 'intake' && (
                  <motion.section
                    key="intake"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.16 }}
                  >
                    <ConversationalIntake
                      messages={messages}
                      setMessages={setMessages}
                      profile={profile}
                      setProfile={setProfile}
                      onGenerateRoadmap={() => handleGenerateRoadmap()}
                      isGenerating={isGenerating}
                    />
                  </motion.section>
                )}

                {activeSection === 'practice' && (
                  <motion.section
                    key="practice"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.16 }}
                  >
                    <NotesStudyStudio />
                  </motion.section>
                )}

                {activeSection === 'profile' && (
                  <motion.section
                    key="profile"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.16 }}
                  >
                    <LearnerProfileCard
                      profile={profile}
                      setProfile={setProfile}
                    />
                  </motion.section>
                )}

                {activeSection === 'trajectory' && (
                  <motion.section
                    key="trajectory"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.16 }}
                  >
                    <TrajectoryDashboard
                      profile={profile}
                      roadmap={roadmap}
                      completedModules={completedModules}
                      onNextActionClick={(mod) => setStudioModule(mod)}
                    />
                  </motion.section>
                )}
              </AnimatePresence>
            </div>
          </div>
          <Footer />
        </div>
      </div>

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        roadmap={roadmap}
        onNavigate={(sec) => setActiveSection(sec)}
        onSelectModule={(mod) => setSelectedDrawerModule(mod)}
      />

      {/* Create New Path Modal */}
      <CreatePathModal
        isOpen={isCreatePathOpen}
        onClose={() => setIsCreatePathOpen(false)}
        onCreatePath={(newProf) => handleGenerateRoadmap(newProf)}
        isGenerating={isGenerating}
      />

      {/* Module Detail Slide-Over Drawer */}
      <ModuleDetailDrawer
        module={selectedDrawerModule}
        onClose={() => setSelectedDrawerModule(null)}
        completedModules={completedModules}
        onToggleComplete={toggleModuleComplete}
        onLaunchStudio={(mod) => {
          setSelectedDrawerModule(null);
          setStudioModule(mod);
        }}
        onAskAI={(mod) => {
          setSelectedDrawerModule(null);
          setExplainModule(mod);
        }}
      />

      {/* Modals */}
      {explainModule && (
        <ExplainabilityModal
          module={explainModule}
          learnerGoal={profile.goal}
          onClose={() => setExplainModule(null)}
        />
      )}

      {studioModule && (
        <ModuleStudyStudio
          module={studioModule}
          onClose={() => setStudioModule(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainAppContent />
    </ErrorBoundary>
  );
}
