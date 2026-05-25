import { useState, useMemo } from 'react';
import {
  Cpu, ArrowLeft, Mail, Lock, User, Briefcase, Code2,
  Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight, Check,
} from 'lucide-react';

// ─── Realistic multi-colour Google icon ───────────────────────────────────────
const GoogleIcon = (props) => (
  <svg viewBox="0 0 48 48" width="18" height="18" {...props}>
    <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.85l6.09-6.09C34.46 2.99 29.56 1 24 1 14.82 1 7.02 6.48 3.48 14.27l7.1 5.51C12.27 13.52 17.67 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.5 24.5c0-1.62-.15-3.18-.42-4.68H24v8.86h12.65c-.55 2.95-2.2 5.45-4.68 7.13l7.17 5.57C43.07 37.27 46.5 31.36 46.5 24.5z" />
    <path fill="#FBBC05" d="M10.58 28.22A14.57 14.57 0 0 1 9.5 24c0-1.47.22-2.9.62-4.22l-7.1-5.51A23.45 23.45 0 0 0 .5 24c0 3.77.87 7.34 2.52 10.52l7.56-6.3z" />
    <path fill="#34A853" d="M24 47c5.56 0 10.23-1.84 13.64-5l-7.17-5.57c-1.85 1.25-4.22 1.99-6.47 1.99-6.33 0-11.7-4.02-13.42-9.65l-7.56 6.3C7.02 41.52 14.82 47 24 47z" />
    <path fill="none" d="M0 0h48v48H0z" />
  </svg>
);

// ─── GitHub icon ──────────────────────────────────────────────────────────────
const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

// ─── Password strength logic ───────────────────────────────────────────────────
function usePasswordStrength(password) {
  return useMemo(() => {
    if (!password) return { score: 0, label: '', color: '' };
    let score = 0;
    if (password.length >= 8)               score++;
    if (password.length >= 12)              score++;
    if (/[A-Z]/.test(password))            score++;
    if (/[0-9]/.test(password))            score++;
    if (/[^A-Za-z0-9]/.test(password))    score++;

    if (score <= 1) return { score, label: 'Weak',   color: 'bg-rose-500' };
    if (score <= 2) return { score, label: 'Fair',   color: 'bg-amber-500' };
    if (score <= 3) return { score, label: 'Good',   color: 'bg-yellow-400' };
    if (score <= 4) return { score, label: 'Strong', color: 'bg-emerald-500' };
    return            { score, label: 'Excellent', color: 'bg-emerald-400' };
  }, [password]);
}

// ─── Reusable premium input ────────────────────────────────────────────────────
function AuthInput({ id, label, type, placeholder, value, onChange, icon: Icon, rightSlot, autoComplete }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 select-none"
      >
        {label}
      </label>
      <div className="relative group">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-600 group-focus-within:text-indigo-400 transition-colors duration-200 pointer-events-none">
          <Icon className="w-4 h-4" />
        </span>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required
          className="
            w-full pl-10 pr-10 py-3 rounded-xl
            bg-slate-950 border border-slate-800
            text-sm text-white placeholder:text-slate-700
            focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/60
            hover:border-slate-700
            transition-all duration-200
          "
        />
        {rightSlot && (
          <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
            {rightSlot}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Role card ────────────────────────────────────────────────────────────────
function RoleCard({ selected, onClick, icon: Icon, title, subtitle, accentColor }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative flex flex-col items-center gap-1.5 py-4 px-3 rounded-xl border
        cursor-pointer transition-all duration-250 overflow-hidden group
        ${selected
          ? `${accentColor.border} ${accentColor.bg} ${accentColor.text} shadow-lg ${accentColor.shadow}`
          : 'border-slate-800 bg-slate-950/60 text-slate-500 hover:border-slate-700 hover:text-slate-300 hover:bg-slate-900/40'
        }
      `}
    >
      {/* Inner shine on selected */}
      {selected && (
        <span className="absolute inset-0 bg-gradient-to-b from-white/[0.06] to-transparent pointer-events-none rounded-xl" />
      )}
      {/* Active indicator dot */}
      {selected && (
        <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      )}
      <Icon className="w-5 h-5" strokeWidth={selected ? 2.2 : 1.8} />
      <span className="text-[11px] font-bold tracking-tight">{title}</span>
      <span className="text-[9px] font-medium opacity-60 leading-tight text-center">{subtitle}</span>
    </button>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
function SignupPage({ onNavigate }) {
  const [name, setName]                   = useState('');
  const [email, setEmail]                 = useState('');
  const [password, setPassword]           = useState('');
  const [showPassword, setShowPassword]   = useState(false);
  const [role, setRole]                   = useState('client'); // 'client' | 'developer'
  const [agreed, setAgreed]              = useState(false);
  const [isLoading, setIsLoading]         = useState(false);
  const [oauthLoading, setOauthLoading]   = useState(''); // 'google' | 'github' | ''
  const [error, setError]                 = useState('');
  const [success, setSuccess]             = useState(false);

  const strength = usePasswordStrength(password);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields to continue.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (!agreed) {
      setError('Please accept the terms of service to create your account.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
    }, 1600);
  };

  const handleOAuth = (provider) => {
    setError('');
    setOauthLoading(provider);
    setTimeout(() => {
      setOauthLoading('');
      setSuccess(true);
    }, 1400);
  };

  // ── Success state ─────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-violet-600/5 blur-[140px]" />
        </div>

        <div className="relative z-10 w-full max-w-md text-center">
          <div className="relative rounded-2xl overflow-hidden backdrop-blur-lg bg-slate-900/50 border border-slate-800 shadow-2xl shadow-black/70 p-10">
            <div className="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />

            {/* Animated checkmark ring */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600/20 to-indigo-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 mx-auto mb-5 shadow-lg shadow-violet-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-extrabold tracking-tight text-white mb-2">
              You're in.
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-2 max-w-xs mx-auto">
              Your account is live. You're registered as a{' '}
              <span className="text-violet-400 font-semibold">
                {role === 'client' ? 'Client' : 'Developer'}
              </span>.
            </p>
            <p className="text-xs text-slate-600 mb-8">Welcome to the FreelanceAI smart-escrow network.</p>

            <button
              onClick={() => onNavigate('landing')}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 active:scale-[0.98] text-white text-sm font-bold tracking-tight shadow-lg shadow-violet-500/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main signup view ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative flex flex-col justify-center items-center px-6 py-14 overflow-hidden selection:bg-violet-500/30 selection:text-violet-200">

      {/* ── Ambient radial glows ── */}
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute -top-10 right-[-60px] w-[540px] h-[540px] rounded-full bg-violet-700/8 blur-[130px] animate-pulse-glow" />
        <div className="absolute bottom-[-60px] left-[-40px] w-[500px] h-[480px] rounded-full bg-indigo-700/7 blur-[110px] animate-pulse-glow-reverse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[280px] rounded-full bg-violet-600/4 blur-[80px]" />
      </div>

      {/* ── Back to home ── */}
      <div className="absolute top-7 left-6 md:left-10 z-20">
        <button
          onClick={() => onNavigate('landing')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-white transition-colors duration-200 group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" />
          <span>Back to home</span>
        </button>
      </div>

      {/* ── Card ── */}
      <div className="relative z-10 w-full max-w-[440px]">

        {/* Brand lockup */}
        <div className="flex flex-col items-center mb-7">
          <button
            onClick={() => onNavigate('landing')}
            className="inline-flex items-center gap-2.5 group mb-4 cursor-pointer"
            aria-label="FreelanceAI — home"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:scale-105 transition-transform duration-200">
              <Cpu className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-[1.15rem] font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Freelance<span className="text-violet-400 font-extrabold">AI</span>
            </span>
          </button>

          <h1 className="text-2xl font-extrabold tracking-tight text-white leading-tight">
            Create your account
          </h1>
          <p className="text-sm text-slate-500 mt-1.5 text-center">
            Join the AI-powered freelance network in under 60 seconds.
          </p>
        </div>

        {/* Glass card */}
        <div className="relative rounded-2xl overflow-hidden backdrop-blur-lg bg-slate-900/50 border border-slate-800 shadow-2xl shadow-black/70">

          {/* Violet top accent line */}
          <div className="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
          {/* Inner sheen */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/[0.025] to-transparent pointer-events-none" />

          <div className="relative p-7 sm:p-8">

            {/* Error banner */}
            {error && (
              <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/25 text-xs text-rose-300 leading-relaxed">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">

              {/* ── Role selector ── */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 mb-2.5 select-none">
                  I want to
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <RoleCard
                    selected={role === 'client'}
                    onClick={() => setRole('client')}
                    icon={Briefcase}
                    title="Hire Talent"
                    subtitle="Post projects & deploy escrows"
                    accentColor={{
                      border: 'border-violet-500/70',
                      bg: 'bg-violet-600/10',
                      text: 'text-violet-300',
                      shadow: 'shadow-violet-500/10',
                    }}
                  />
                  <RoleCard
                    selected={role === 'developer'}
                    onClick={() => setRole('developer')}
                    icon={Code2}
                    title="Work as Dev"
                    subtitle="Get matched & earn on-chain"
                    accentColor={{
                      border: 'border-indigo-500/70',
                      bg: 'bg-indigo-600/10',
                      text: 'text-indigo-300',
                      shadow: 'shadow-indigo-500/10',
                    }}
                  />
                </div>
              </div>

              {/* ── Full Name ── */}
              <AuthInput
                id="signup-name"
                label="Full Name"
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={User}
                autoComplete="name"
              />

              {/* ── Work Email ── */}
              <AuthInput
                id="signup-email"
                label="Work Email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={Mail}
                autoComplete="email"
              />

              {/* ── Password with strength meter ── */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="signup-password"
                    className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 select-none"
                  >
                    Password
                  </label>
                  {password && (
                    <span
                      className={`text-[10px] font-bold tracking-wide transition-colors duration-300 ${
                        strength.score <= 1 ? 'text-rose-400'
                        : strength.score <= 2 ? 'text-amber-400'
                        : strength.score <= 3 ? 'text-yellow-400'
                        : 'text-emerald-400'
                      }`}
                    >
                      {strength.label}
                    </span>
                  )}
                </div>

                {/* Input */}
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-600 group-focus-within:text-indigo-400 transition-colors duration-200 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    className="
                      w-full pl-10 pr-10 py-3 rounded-xl
                      bg-slate-950 border border-slate-800
                      text-sm text-white placeholder:text-slate-700
                      focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/60
                      hover:border-slate-700
                      transition-all duration-200
                    "
                  />
                  <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="text-slate-600 hover:text-slate-300 transition-colors duration-200 cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </span>
                </div>

                {/* Strength bar */}
                {password && (
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((seg) => (
                      <div
                        key={seg}
                        className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${
                          seg <= strength.score ? strength.color : 'bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* ── Terms checkbox ── */}
              <div className="flex items-start gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setAgreed((v) => !v)}
                  className={`
                    mt-0.5 w-4 h-4 rounded-[5px] flex items-center justify-center flex-shrink-0
                    border transition-all duration-200 cursor-pointer
                    ${agreed
                      ? 'bg-indigo-600 border-indigo-600 shadow-md shadow-indigo-500/20'
                      : 'bg-slate-950 border-slate-700 hover:border-slate-500'
                    }
                  `}
                  aria-checked={agreed}
                  role="checkbox"
                  aria-label="Accept terms of service"
                >
                  {agreed && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                </button>
                <span className="text-[11px] text-slate-500 leading-relaxed">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={(e) => e.preventDefault()}
                    className="text-violet-400 hover:text-violet-300 font-semibold transition-colors cursor-pointer"
                  >
                    Terms of Service
                  </button>
                  {' '}and{' '}
                  <button
                    type="button"
                    onClick={(e) => e.preventDefault()}
                    className="text-violet-400 hover:text-violet-300 font-semibold transition-colors cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                  .
                </span>
              </div>

              {/* ── Primary CTA ── */}
              <button
                type="submit"
                disabled={isLoading}
                className="
                  w-full py-3.5 mt-1 rounded-xl
                  bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-700
                  hover:brightness-110 active:scale-[0.98]
                  disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed
                  text-white text-sm font-bold tracking-tight
                  shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30
                  flex items-center justify-center gap-2.5
                  transition-all duration-200 cursor-pointer
                "
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/25 border-t-white animate-spin" />
                    <span>Creating account…</span>
                  </>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* ── Divider ── */}
            <div className="relative my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600 shrink-0">
                or sign up with
              </span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            {/* ── OAuth buttons ── */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleOAuth('google')}
                disabled={!!oauthLoading}
                className="
                  relative flex items-center justify-center gap-2.5
                  py-2.5 px-4 rounded-xl
                  bg-white/[0.04] border border-slate-800
                  hover:bg-white/[0.08] hover:border-slate-700
                  active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed
                  text-slate-300 hover:text-white
                  text-xs font-semibold tracking-tight
                  transition-all duration-200 cursor-pointer
                  group overflow-hidden
                "
                aria-label="Sign up with Google"
              >
                <span className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl pointer-events-none" />
                {oauthLoading === 'google'
                  ? <span className="w-4 h-4 rounded-full border-2 border-slate-600 border-t-slate-200 animate-spin" />
                  : <GoogleIcon />}
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleOAuth('github')}
                disabled={!!oauthLoading}
                className="
                  relative flex items-center justify-center gap-2.5
                  py-2.5 px-4 rounded-xl
                  bg-white/[0.04] border border-slate-800
                  hover:bg-white/[0.08] hover:border-slate-700
                  active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed
                  text-slate-300 hover:text-white
                  text-xs font-semibold tracking-tight
                  transition-all duration-200 cursor-pointer
                  group overflow-hidden
                "
                aria-label="Sign up with GitHub"
              >
                <span className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl pointer-events-none" />
                {oauthLoading === 'github'
                  ? <span className="w-4 h-4 rounded-full border-2 border-slate-600 border-t-slate-200 animate-spin" />
                  : <GithubIcon />}
                <span>GitHub</span>
              </button>
            </div>

            {/* ── Login nudge ── */}
            <p className="text-center text-[12px] text-slate-600 mt-6 leading-relaxed">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="font-bold text-violet-400 hover:text-violet-300 transition-colors duration-200 cursor-pointer"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>

        {/* Trust micro-copy */}
        <p className="mt-5 text-center text-[10px] font-medium text-slate-700 tracking-wide">
          Protected by end-to-end encryption &middot; SOC 2 Type II compliant
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
