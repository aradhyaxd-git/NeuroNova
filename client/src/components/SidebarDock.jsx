import { HiHome, HiChatBubbleLeftRight, HiMap, HiUser, HiChartBar, HiAcademicCap, HiSun, HiMoon } from 'react-icons/hi2';
import logoPng from '../assets/logo.png';

export default function SidebarDock({ activeSection, setActiveSection, dark, onToggle }) {
  const dockItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: <HiHome /> },
    { id: 'roadmap', label: 'Path Roadmap Board', icon: <HiMap /> },
    { id: 'intake', label: 'Conversational Intake', icon: <HiChatBubbleLeftRight /> },
    { id: 'practice', label: 'Practice Studio & Flashcards', icon: <HiAcademicCap /> },
    { id: 'profile', label: 'Learner Profile', icon: <HiUser /> },
    { id: 'trajectory', label: 'Skill Trajectory', icon: <HiChartBar /> }
  ];

  return (
    <aside className="sidebar-dock card-surface">
      <div className="dock-brand" title="NeuroNova AI Learning Assistant" onClick={() => setActiveSection('overview')}>
        <img src={logoPng} alt="NeuroNova Logo" className="dock-logo-img" />
      </div>

      <nav className="dock-menu" aria-label="Sidebar Navigation">
        {dockItems.map((item) => (
          <button
            key={item.id}
            className={`dock-btn ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => setActiveSection(item.id)}
            title={item.label}
          >
            {item.icon}
            <span className="dock-tooltip">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="dock-footer">
        <button className="dock-btn theme-btn" onClick={onToggle} title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}>
          {dark ? <HiSun /> : <HiMoon />}
          <span className="dock-tooltip">{dark ? "Light Mode" : "Dark Mode"}</span>
        </button>
      </div>
    </aside>
  );
}
