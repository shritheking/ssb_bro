import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/common/Logo';
import {
  LayoutDashboard, Users, BookOpen, Layers, CheckSquare,
  FileText, MessageSquare, Calendar, Compass, Bell, Settings,
  LogOut, Menu, X, ArrowLeft, Shield, Sliders
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { isAdminLoggedIn, adminUser, adminLogout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If not logged in, redirect to admin login
  if (!isAdminLoggedIn) {
    navigate('/admin/login');
    return null;
  }

  const menuItems = [
    { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Aspirants', path: '/admin/aspirants', icon: Users },
    { name: 'Programmes', path: '/admin/programmes', icon: BookOpen },
    { name: 'Batches', path: '/admin/batches', icon: Layers },
    { name: 'Assignments', path: '/admin/assignments', icon: CheckSquare },
    { name: 'Submissions', path: '/admin/submissions', icon: FileText },
    { name: 'Feedback Hub', path: '/admin/feedback', icon: MessageSquare },
    { name: 'Sessions', path: '/admin/sessions', icon: Calendar },
    { name: 'Resources', path: '/admin/resources', icon: Compass },
    { name: 'Notifications', path: '/admin/notifications', icon: Bell },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-brand-bgSecondary border-r border-brand-border flex flex-col transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand header */}
        <div className="p-5 border-b border-brand-border flex items-center justify-between">
          <Logo size="sm" withLink={false} />
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-brand-textMuted hover:text-brand-text p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin profile preview */}
        <div className="px-5 py-3.5 bg-brand-card/40 border-b border-brand-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-brand-gold/20 border border-brand-gold flex items-center justify-center text-brand-gold font-bold text-xs">
              VE
            </div>
            <div>
              <div className="text-xs font-semibold text-brand-text">
                {adminUser?.name || 'Lt. Vamshi E.'}
              </div>
              <div className="text-[10px] text-brand-steelLight">
                {adminUser?.role || 'Chief Mentor'}
              </div>
            </div>
          </div>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-brand-gold/15 text-brand-gold font-mono uppercase">
            Admin
          </span>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-brand-card text-brand-gold font-semibold border-l-2 border-brand-gold pl-2.5'
                    : 'text-brand-textMuted hover:text-brand-text hover:bg-brand-card/40'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-brand-gold' : 'text-brand-steelLight'}`} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-brand-border space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-xs text-brand-textMuted hover:text-brand-text hover:bg-brand-card/40 rounded-md transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-brand-steelLight" />
            <span>Public Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-brand-bgSecondary/60 backdrop-blur-md border-b border-brand-border flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-brand-textMuted hover:text-brand-text rounded-md"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded bg-brand-gold/15 text-brand-gold font-mono uppercase tracking-wider font-semibold">
                Admin Console
              </span>
              <span className="hidden sm:inline text-brand-textMuted">• Platform Management Preview</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-brand-steelLight font-mono hidden md:inline">
              Data Mode: Local Mock Demo
            </span>
            <Link
              to="/student/dashboard"
              className="px-3 py-1.5 rounded bg-brand-card hover:bg-brand-cardHover border border-brand-border text-xs text-brand-text font-medium transition-colors"
            >
              View Student Portal
            </Link>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
