import { useState } from 'react';
import { Cpu, ArrowLeft, Mail, Lock, User, Briefcase, Code, AlertCircle, CheckCircle2 } from 'lucide-react';

const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const GoogleIcon = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...props}>
    <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.41 0-6.19-2.78-6.19-6.19s2.78-6.19 6.19-6.19c1.472 0 2.82.52 3.882 1.39l3.14-3.14C18.99 1.957 15.798 1 12.24 1 6.033 1 12.24 1 6.033 1 12.24s5.033 11.24 11.24 11.24c5.898 0 10.871-4.212 11.536-9.84H12.24z" />
  </svg>
);

function SignupPage({ onNavigate }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client'); // 'client' or 'developer'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    // Simulate API sign up
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen text-slate-100 bg-slate-950 font-sans relative flex flex-col justify-center items-center px-6 py-12 overflow-hidden selection:bg-violet-500/30 selection:text-violet-200">
      
      {/* Background Decorative Ambient Gradients */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-[100px] left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-600/8 blur-[150px] pointer-events-none animate-pulse-glow-reverse" />

      {/* Back button */}
      <div className="absolute top-8 left-6 md:left-12">
        <button 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to home</span>
        </button>
      </div>

      {/* Auth Card Container */}
      <div className="w-full max-w-md z-10 mt-6">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6">
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('landing'); }} className="flex items-center gap-2.5 group mb-3">
            <div className="relative w-9 h-9 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform duration-200">
              <Cpu className="w-5 h-5 text-white animate-pulse" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Freelance<span className="text-violet-400 font-extrabold">AI</span>
            </span>
          </a>
          <p className="text-xs text-slate-400 tracking-wider uppercase font-semibold">Join The Network</p>
        </div>

        {/* Card */}
        <div className="glass-panel p-8 rounded-2xl relative overflow-hidden bg-gradient-to-b from-slate-900/60 to-slate-950/60 shadow-2xl shadow-black/80">
          
          <div className="absolute -top-[1px] left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent blur-[1px]" />
          
          {success ? (
            <div className="text-center py-6 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Account Created!</h3>
              <p className="text-xs text-slate-400 mb-6">Your registration is complete. Welcome to the automated escrow builder network.</p>
              <button
                onClick={() => onNavigate('landing')}
                className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg text-sm font-semibold text-white shadow-lg shadow-violet-500/20 hover:brightness-110 active:scale-98 transition-all cursor-pointer"
              >
                Go to Workspace Dashboard
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-extrabold text-white mb-1">Create Account</h2>
              <p className="text-xs text-slate-400 mb-5">Set up your smart account to get started.</p>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-rose-950/30 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4.5">
                
                {/* Role Selector Tabs */}
                <div>
                  <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 select-none">
                    I want to
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('client')}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-all duration-300 ${
                        role === 'client'
                          ? 'bg-violet-600/10 border-violet-500/80 text-violet-300 shadow-md shadow-violet-500/5'
                          : 'bg-slate-950/60 border-slate-850 text-slate-450 hover:text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <Briefcase className="w-5 h-5 mb-0.5" />
                      <span className="text-xs font-bold">Hire Talent</span>
                      <span className="text-[9px] opacity-75">Deploy Escrows</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('developer')}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition-all duration-300 ${
                        role === 'developer'
                          ? 'bg-violet-600/10 border-violet-500/80 text-violet-300 shadow-md shadow-violet-500/5'
                          : 'bg-slate-950/60 border-slate-850 text-slate-450 hover:text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <Code className="w-5 h-5 mb-0.5" />
                      <span className="text-xs font-bold">Work as Dev</span>
                      <span className="text-[9px] opacity-75">Verify Commits</span>
                    </button>
                  </div>
                </div>

                {/* Name Field */}
                <div>
                  <label className="block text-slate-450 text-xs font-bold uppercase tracking-wider mb-1.5" htmlFor="name">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                      <User className="w-4.5 h-4.5" />
                    </span>
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-950/80 border border-slate-800 text-sm placeholder:text-slate-650 text-white focus:outline-none focus:border-violet-500/80 transition-colors"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-slate-450 text-xs font-bold uppercase tracking-wider mb-1.5" htmlFor="email">
                    Work Email
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                      <Mail className="w-4.5 h-4.5" />
                    </span>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-950/80 border border-slate-800 text-sm placeholder:text-slate-650 text-white focus:outline-none focus:border-violet-500/80 transition-colors"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-slate-450 text-xs font-bold uppercase tracking-wider mb-1.5" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                      <Lock className="w-4.5 h-4.5" />
                    </span>
                    <input
                      id="password"
                      type="password"
                      required
                      placeholder="Min 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-950/80 border border-slate-800 text-sm placeholder:text-slate-650 text-white focus:outline-none focus:border-violet-500/80 transition-colors"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 text-white text-sm font-semibold active:scale-95 disabled:scale-100 disabled:opacity-50 cursor-pointer transition-all duration-200 shadow-md shadow-violet-500/10 flex items-center justify-center gap-2 rounded-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Secure Register</span>
                    </>
                  )}
                </button>

              </form>

              {/* Divider */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-900"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-slate-500">
                  <span className="bg-slate-950 px-2 rounded-md">or register via</span>
                </div>
              </div>

              {/* OAuth buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => {
                    setIsLoading(true);
                    setTimeout(() => {
                      setIsLoading(false);
                      setSuccess(true);
                    }, 1200);
                  }}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-slate-850 hover:border-slate-700 hover:bg-slate-900/40 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer active:scale-98 transition-all"
                >
                  <GithubIcon />
                  <span>GitHub</span>
                </button>
                <button 
                  onClick={() => {
                    setIsLoading(true);
                    setTimeout(() => {
                      setIsLoading(false);
                      setSuccess(true);
                    }, 1200);
                  }}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-slate-850 hover:border-slate-700 hover:bg-slate-900/40 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer active:scale-98 transition-all"
                >
                  <GoogleIcon />
                  <span>Google</span>
                </button>
              </div>

              {/* Login toggle */}
              <p className="text-center text-xs text-slate-500 mt-5.5 select-none">
                Already have an account?{' '}
                <button 
                  onClick={() => onNavigate('login')} 
                  className="text-violet-400 hover:text-violet-300 font-bold underline transition-colors cursor-pointer"
                >
                  Log in here
                </button>
              </p>
            </>
          )}

        </div>

      </div>

    </div>
  );
}

export default SignupPage;
