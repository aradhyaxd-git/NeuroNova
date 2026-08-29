import { HiSparkles, HiMagnifyingGlass, HiSun, HiMoon, HiChevronDown, HiPlus } from 'react-icons/hi2';
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/clerk-react';

export default function WorkspaceHeader({
  profile,
  completedCount = 0,
  totalCount = 0,
  dark,
  onToggleTheme,
  onOpenCommandPalette,
  onOpenCreatePath
}) {
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 25;

  return (
    <header className="workspace-header card-surface">
      <div className="header-left">
        <div className="project-switcher" title={profile.goal || 'Active Learning Project'}>
          <span className="project-icon"><HiSparkles /></span>
          <div className="project-titles">
            <span className="workspace-name">NeuroNova Workspace</span>
            <h1 className="project-name">
              <span className="project-name-text">{profile.goal || 'Full-Stack AI Engineering'}</span>
              <HiChevronDown className="chevron" />
            </h1>
          </div>
        </div>

        <button className="btn-secondary btn-sm btn-new-path" onClick={onOpenCreatePath} title="Create New Learning Path">
          <HiPlus /> New Path
        </button>
      </div>

      <div className="header-center">
        <button className="command-palette-trigger" onClick={onOpenCommandPalette} title="Search modules & commands (Cmd + K)">
          <HiMagnifyingGlass className="search-icon" />
          <span className="trigger-text">Search modules or topics...</span>
          <kbd className="cmd-kbd">⌘K</kbd>
        </button>
      </div>

      <div className="header-right">
        <div className="progress-pill-badge" title="Overall Path Progress">
          <span className="badge-dot" />
          <span className="progress-text">{percent}% Complete</span>
        </div>

        <button className="header-btn theme-btn" onClick={onToggleTheme} title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}>
          {dark ? <HiSun /> : <HiMoon />}
        </button>

        <div className="header-user">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="btn-secondary btn-sm">Sign In</button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
