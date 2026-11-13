import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/common/Logo';
import { useToast } from '../../context/ToastContext';
import { Shield, Lock, Mail, ArrowRight, UserCheck, AlertCircle } from 'lucide-react';

export const StudentLoginPage: React.FC = () => {
  const { studentLogin, isStudentLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [email, setEmail] = useState('arjun.aspirant@example.com');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);

  // If already logged in, redirect
  React.useEffect(() => {
    if (isStudentLoggedIn) {
      navigate('/student/dashboard');
    }
  }, [isStudentLoggedIn, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    studentLogin(email);
    showToast('Signed in successfully to Student Portal Demo!', 'success');
    navigate('/student/dashboard');
  };

  const handleQuickDemo = () => {
    setEmail('arjun.aspirant@example.com');
    setPassword('password123');
    studentLogin('arjun.aspirant@example.com');
    showToast('Signed in with Demo Student Account', 'success');
    navigate('/student/dashboard');
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-hero-gradient pointer-events-none opacity-40 blur-3xl" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-6 relative z-10 px-4">
        {/* Logo and title */}
        <div className="text-center space-y-2">
          <Logo size="lg" />
          <h2 className="font-heading text-2xl font-bold text-brand-text pt-4">
            Aspirant Student Portal
          </h2>
          <p className="text-xs text-brand-textMuted font-mono">
            Access your practice centre, submissions, and mentor reviews.
          </p>
        </div>

        {/* Login Box */}
        <div className="rounded-2xl bg-brand-card border border-brand-border p-8 shadow-2xl space-y-6">
          
          {/* Demo account prompt button */}
          <div className="p-3.5 rounded-xl bg-brand-bgSecondary border border-brand-borderGold/40 text-xs space-y-2">
            <div className="flex items-center justify-between text-brand-gold font-mono uppercase font-semibold">
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5" />
                Demo Credentials Available
              </span>
              <span className="text-[10px]">Instant Access</span>
            </div>
            <p className="text-[11px] text-brand-textMuted">
              Click below to immediately log in with the preloaded demo aspirant account (Arjun Sharma, CDSE Repeater).
            </p>
            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full py-2 rounded-lg text-xs font-semibold bg-brand-gold hover:bg-brand-goldLight text-brand-lightText transition-colors shadow-gold-subtle"
            >
              1-Click Demo Login
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-brand-text font-medium mb-1.5 font-mono">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-brand-textMuted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-brand-bgSecondary border border-brand-border focus:border-brand-gold text-brand-text placeholder:text-brand-textMuted focus:outline-none"
                  placeholder="aspirant@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-brand-text font-medium font-mono">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => showToast('In demo mode, any password works!', 'info')}
                  className="text-[11px] text-brand-steelLight hover:text-brand-gold"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-brand-textMuted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-brand-bgSecondary border border-brand-border focus:border-brand-gold text-brand-text placeholder:text-brand-textMuted focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-brand-textMuted">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-brand-bgSecondary border-brand-border text-brand-gold focus:ring-0"
                />
                <span>Remember this device</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg text-xs font-semibold bg-brand-cardHover hover:bg-brand-gold hover:text-brand-lightText border border-brand-border text-brand-text transition-all duration-200 flex items-center justify-center gap-2"
            >
              Sign In to Portal
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
