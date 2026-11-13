import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/common/Logo';
import { useToast } from '../../context/ToastContext';
import { Shield, Lock, Mail, ArrowRight, UserCheck } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { adminLogin, isAdminLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [email, setEmail] = useState('mentor@ssbbro.concept');
  const [password, setPassword] = useState('adminpass');

  // If already logged in, redirect
  React.useEffect(() => {
    if (isAdminLoggedIn) {
      navigate('/admin/dashboard');
    }
  }, [isAdminLoggedIn, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    adminLogin(email, password);
    showToast('Signed in to Admin Dashboard Demo (Chief Mentor: Lt. Vamshi E.)', 'success');
    navigate('/admin/dashboard');
  };

  const handleQuickDemo = () => {
    adminLogin('mentor@ssbbro.concept', 'adminpass');
    showToast('Signed in with Demo Admin Account', 'success');
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-6 relative z-10 px-4">
        {/* Logo and title */}
        <div className="text-center space-y-2">
          <Logo size="lg" />
          <h2 className="font-heading text-2xl font-bold text-brand-text pt-4">
            Platform Admin Console
          </h2>
          <p className="text-xs text-brand-textMuted font-mono">
            Concept Administration & Mentor Management Interface
          </p>
        </div>

        {/* Login Box */}
        <div className="rounded-2xl bg-brand-card border border-brand-border p-8 shadow-2xl space-y-6">
          {/* Quick Demo Button */}
          <div className="p-3.5 rounded-xl bg-brand-bgSecondary border border-brand-borderGold/40 text-xs space-y-2">
            <div className="flex items-center justify-between text-brand-gold font-mono uppercase font-semibold">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                Mentor Demo Credentials
              </span>
              <span className="text-[10px]">Instant Access</span>
            </div>
            <p className="text-[11px] text-brand-textMuted">
              Click below to immediately log in as Chief Mentor (Lt. Vamshi E.) to explore the aspirant management features.
            </p>
            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full py-2 rounded-lg text-xs font-semibold bg-brand-gold hover:bg-brand-goldLight text-brand-lightText transition-colors shadow-gold-subtle"
            >
              1-Click Admin Demo Login
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-brand-text font-medium mb-1.5 font-mono">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-brand-textMuted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-brand-bgSecondary border border-brand-border focus:border-brand-gold text-brand-text placeholder:text-brand-textMuted focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-brand-text font-medium mb-1.5 font-mono">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-brand-textMuted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-brand-bgSecondary border border-brand-border focus:border-brand-gold text-brand-text placeholder:text-brand-textMuted focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg text-xs font-semibold bg-brand-cardHover hover:bg-brand-gold hover:text-brand-lightText border border-brand-border text-brand-text transition-all duration-200 flex items-center justify-center gap-2"
            >
              Access Admin Console
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="pt-4 border-t border-brand-border text-center text-xs text-brand-textMuted">
            <Link to="/" className="text-brand-steelLight hover:text-brand-text transition-colors">
              ← Return to SSB BRO Public Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
