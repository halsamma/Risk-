import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard, Shield, LogOut, ChevronDown,
  Building2, Menu, X,
} from 'lucide-react';
import clsx from 'clsx';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-800 shrink-0">
        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
          <Shield className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="text-sm font-bold text-white">TechRisk</div>
          <div className="text-xs text-gray-500">Technology Risk Assessment</div>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="ml-auto lg:hidden text-gray-500 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <NavItem
          to="/dashboard"
          icon={<LayoutDashboard className="w-4 h-4" />}
          label="Dashboard"
          onClick={() => setSidebarOpen(false)}
        />
      </nav>

      {/* User */}
      <div className="p-4 border-t border-gray-800 shrink-0">
        <button
          onClick={() => setProfileOpen(o => !o)}
          className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <div className="w-8 h-8 bg-brand-700 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0">
            {user?.firstName?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="text-sm font-medium text-white truncate">{user?.firstName} {user?.lastName}</div>
            <div className="text-xs text-gray-500 truncate">{user?.email}</div>
          </div>
          <ChevronDown className={clsx('w-4 h-4 text-gray-500 transition-transform shrink-0', profileOpen && 'rotate-180')} />
        </button>

        {profileOpen && (
          <div className="mt-1 bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
            {user?.companyName && (
              <div className="flex items-center gap-2 px-3 py-2 text-xs text-gray-400">
                <Building2 className="w-3 h-3" />
                {user.companyName}
              </div>
            )}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-gray-950">

      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex w-64 bg-gray-900 border-r border-gray-800 flex-col shrink-0">
        <SidebarContent />
      </aside>

      {/* ── Mobile sidebar overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Mobile sidebar drawer ── */}
      <aside className={clsx(
        'fixed inset-y-0 left-0 z-50 w-72 bg-gray-900 border-r border-gray-800 flex flex-col lg:hidden transition-transform duration-200',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <SidebarContent />
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden h-14 bg-gray-900 border-b border-gray-800 flex items-center gap-3 px-4 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-400 hover:text-white p-1"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brand-600 rounded flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-white">TechRisk</span>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function NavItem({ to, icon, label, onClick }: {
  to: string; icon: React.ReactNode; label: string; onClick?: () => void;
}) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => clsx(
        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
        isActive
          ? 'bg-brand-600/20 text-brand-400 font-medium'
          : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
      )}
    >
      {icon}
      {label}
    </NavLink>
  );
}
