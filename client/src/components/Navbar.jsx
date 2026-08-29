import { HiSparkles, HiChatBubbleLeftRight, HiUser, HiMap, HiChartBar, HiSun, HiMoon } from 'react-icons/hi2';

export default function Navbar({ dark, onToggle, activeSection, setActiveSection, hasArtifact, toggleArtifactPanel }) {
  const navItems = [
    { id: 'intake', label: 'Intake Chat', icon: <HiChatBubbleLeftRight /> },
    { id: 'roadmap', label: 'Path Roadmap', icon: <HiMap /> },
    { id: 'profile', label: 'Learner Profile', icon: <HiUser /> },
    { id: 'dashboard', label: 'Trajectory', icon: <HiChartBar /> }
  ];

  return (
    <header className="nav-header">
      <div className="nav shell">
        <a className="brand" href="#top" aria-label="NeuroNova AI home">
          <span className="brand-logo"><HiSparkles /></span>
          <div className="brand-titles">
            <span className="brand-text">NeuroNova</span>
            <span className="brand-tag">AI Learning Advisor</span>
          </div>
        </a>

        <nav className="nav-links" aria-label="Main Navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item-btn ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="nav-right">
          {hasArtifact && (
            <button className="artifact-toggle-btn" onClick={toggleArtifactPanel}>
              <HiMap /> Side Artifact Panel
            </button>
          )}

          <button className="theme-toggle-btn" onClick={onToggle} aria-label="Toggle White/Black Theme">
            {dark ? <><HiSun className="theme-icon" /> White Mode</> : <><HiMoon className="theme-icon" /> Black Mode</>}
          </button>

          <span className="status-dot">Gemini 3.1</span>
        </div>
      </div>
    </header>
  );
}
