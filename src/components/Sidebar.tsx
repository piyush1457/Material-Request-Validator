import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, FolderKanban, History, Menu, X } from 'lucide-react';

interface SidebarProps {
  className?: string;
}

const navigation = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/projects', label: 'Projects', icon: FolderKanban },
  { path: '/requests', label: 'Material Requests', icon: ClipboardList },
  { path: '/recent', label: 'Recent Requests', icon: History },
];

export function Sidebar({ className = '' }: SidebarProps) {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleMobileToggle = () => setIsMobileOpen(!isMobileOpen);
  const handleCloseMobile = () => setIsMobileOpen(false);

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-page-ink/80 lg:hidden"
          onClick={handleCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Mobile hamburger button - only visible on mobile */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-card-carbon border border-steel-border rounded-[8px] text-white hover:bg-deep-coal transition-colors"
        onClick={handleMobileToggle}
        aria-label="Open navigation menu"
        aria-expanded={isMobileOpen}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <aside
        className={`
          w-64 bg-card-carbon border-r border-steel-border fixed inset-y-0 left-0 z-40 flex flex-col transition-all duration-300 ease-out lg:translate-x-0 ${className}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        aria-label="Main navigation"
      >
        <div className="p-4 border-b border-steel-border">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-2 bg-blue-cornflower/10 rounded-[8px] flex-shrink-0">
              <svg className="h-5 w-5 text-blue-cornflower" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-subheading font-semibold text-white truncate">Material Request Validator</h1>
              <p className="text-caption text-ash truncate">Retail Fit-Out</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto" aria-label="Main navigation">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => handleCloseMobile()}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-body-sm font-medium transition-all duration-200 ${className}
                  ${isActive
                    ? 'bg-white/5 text-blue-cornflower border border-blue-cornflower/20'
                    : 'text-ash hover:text-white hover:bg-white/5'}
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0 text-blue-cornflower" aria-hidden="true" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-steel-border overflow-hidden">
          <div className="text-caption text-ash flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
            <span>Demo Mode</span>
          </div>
          <p className="text-caption text-ash mt-2 leading-relaxed break-words">
            Data persists in localStorage.
          </p>
          <button
            className="mt-2 text-caption text-blue-cornflower hover:underline"
            onClick={() => { localStorage.clear(); window.location.reload(); }}
          >
            Reset Demo Data
          </button>
        </div>
      </aside>
    </>
  );
}