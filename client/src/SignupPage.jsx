import { useState, useMemo } from 'react';
import {
  Cpu, ArrowLeft, Mail, Lock, User, Briefcase, Sparkles,
  Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight,
  Check, UserCheck,
} from 'lucide-react';
import { authService } from './api';

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

// ─── Password strength hook ────────────────────────────────────────────────────
function usePasswordStrength(password) {
  return useMemo(() => {
    if (!password) return { score: 0, label: '', color: '' };
    let score = 0;
    if (password.length >= 8)            score++;
    if (password.length >= 12)           score++;
    if (/[A-Z]/.test(password))          score++;
    if (/[0-9]/.test(password))          score++;
    if (/[^A-Za-z0-9]/.test(password))  score++;
    if (score <= 1) return { score, label: 'Weak',      color: 'bg-red-700' };
    if (score <= 2) return { score, label: 'Fair',      color: 'bg-red-500' };
    if (score <= 3) return { score, label: 'Good',      color: 'bg-amber-600' };
    if (score <= 4) return { score, label: 'Strong',    color: 'bg-emerald-600' };
    return             { score, label: 'Excellent', color: 'bg-emerald-400' };
  }, [password]);
}

// ─── Reusable premium input ────────────────────────────────────────────────────
function AuthInput({ id, label, type, placeholder, value, onChange, icon: Icon, rightSlot, autoComplete }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[10px] font-bold uppercase tracking-wider text-slate-405 select-none"
      >
        {label}
      </label>
      <div className="relative group">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 group-focus-within:text-red-500 transition-colors duration-200 pointer-events-none">
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
            bg-slate-950 border border-[#22222a]
            text-sm text-white placeholder:text-slate-600
            focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30
            hover:border-slate-800
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

// ─── Role definitions ─────────────────────────────────────────────────────────
const ROLES = [
  {
    id: 'freelancer',
    icon: UserCheck,
    title: 'Freelancer',
    description: 'Get matched with projects & earn with smart escrow protection',
    accentFrom: 'from-red-950/20',
    accentTo: 'to-red-900/10',
    border: 'border-red-500/70',
    glow: 'shadow-red-500/10',
    iconColor: 'text-red-400',
    badgeBg: 'bg-[#e50914]',
  },
  {
    id: 'client',
    icon: Briefcase,
    title: 'Client',
    description: 'Post projects, hire top talent & deploy on-chain escrows seamlessly',
    accentFrom: 'from-red-950/20',
    accentTo: 'to-red-900/10',
    border: 'border-red-500/70',
    glow: 'shadow-red-500/10',
    iconColor: 'text-red-400',
    badgeBg: 'bg-[#e50914]',
  },
  {
    id: 'dual',
    icon: Sparkles,
    title: 'Dual Account',
    description: 'Full access — hire talent and take on projects simultaneously',
    accentFrom: 'from-red-950/20',
    accentTo: 'to-red-900/10',
    border: 'border-red-500/70',
    glow: 'shadow-red-500/10',
    iconColor: 'text-red-400',
    badgeBg: 'bg-[#e50914]',
  },
];

// ─── Role card component ──────────────────────────────────────────────────────
function RoleCard({ role, selected, onClick }) {
  const { icon: Icon, title, description, accentFrom, accentTo, border, glow, iconColor, badgeBg } = role;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative flex flex-col items-center text-center gap-2.5
        py-5 px-3.5 rounded-2xl border cursor-pointer
        overflow-hidden transition-all duration-300 group
        ${selected
          ? `${border} bg-gradient-to-b ${accentFrom} ${accentTo} shadow-lg ${glow}`
          : 'border-slate-850 bg-slate-950 hover:border-slate-800 hover:bg-slate-900'
        }
      `}
      aria-pressed={selected}
    >
      {/* Inner top sheen when active */}
      {selected && (
        <span className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none rounded-2xl" />
      )}

      {/* Hover shimmer when inactive */}
      {!selected && (
        <span className="absolute inset-0 bg-gradient-to-b from-white/[0.015] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl pointer-events-none" />
      )}

      {/* Checkmark badge — appears when selected */}
      <span
        className={`
          absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center
          transition-all duration-300
          ${selected
            ? `${badgeBg} scale-100 opacity-100 shadow-sm`
            : 'bg-slate-900 scale-75 opacity-0'
          }
        `}
      >
        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3.5} />
      </span>

      {/* Icon container */}
      <div className={`
        w-10 h-10 rounded-xl flex items-center justify-center
        transition-all duration-300
        ${selected
          ? `${iconColor} bg-white/10 shadow-sm`
          : 'text-slate-500 bg-slate-900 group-hover:text-slate-400'
        }
      `}>
        <Icon className="w-5 h-5" strokeWidth={selected ? 2.2 : 1.8} />
      </div>

      {/* Title */}
      <span className={`text-xs font-bold tracking-tight transition-colors duration-200 ${selected ? 'text-white' : 'text-slate-400 group-hover:text-slate-350'}`}>
        {title}
      </span>

      {/* Micro description */}
      <span className={`text-[10px] leading-relaxed font-medium transition-colors duration-200 ${selected ? 'text-slate-300' : 'text-slate-500 group-hover:text-slate-450'}`}>
        {description}
      </span>
    </button>
  );
}

// ─── Main SignupPage component ────────────────────────────────────────────────
function SignupPage({ onNavigate }) {
  const [name, setName]                       = useState('');
  const [email, setEmail]                     = useState('');
  const [password, setPassword]               = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword]       = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);
  const [role, setRole]                       = useState('freelancer');
  const [agreed, setAgreed]                   = useState(false);
  const [isLoading, setIsLoading]             = useState(false);
  const [oauthLoading, setOauthLoading]       = useState('');
  const [error, setError]                     = useState('');
  const [success, setSuccess]                 = useState(false);

  const strength = usePasswordStrength(password);
  const selectedRole = ROLES.find((r) => r.id === role);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields to continue.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please check and try again.');
      return;
    }
    if (!agreed) {
      setError('Please accept the Terms of Service to create your account.');
      return;
    }

    setIsLoading(true);
    const apiRole = role === 'client' ? 'CLIENT' : role === 'dual' ? 'BOTH' : 'FREELANCER';
    const result = await authService.signup(email.trim(), password, apiRole);

    if (result.success) {
      // Create user profile details
      await authService.updateProfile({ fullName: name.trim() });
      
      // Auto login on successful signup
      const loginResult = await authService.login(email.trim(), password);
      setIsLoading(false);
      if (loginResult.success) {
        setSuccess(true);
      } else {
        setError('Account created, but automatic sign-in failed. Please go to Login page.');
      }
    } else {
      setIsLoading(false);
      setError(result.error?.message || 'Registration failed. Please try again.');
    }
  };

  const handleOAuth = (provider) => {
    setError('');
    setOauthLoading(provider);
    setTimeout(() => {
      setOauthLoading('');
      setSuccess(true);
    }, 1400);
  };

  // ── Success / confirmation state ──────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-[#08080a] flex items-center justify-center px-6 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-red-950/15 blur-[150px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-slate-950/10 blur-[100px]" />
        </div>

        <div className="relative z-10 w-full max-w-md text-center">
          <div className="relative rounded-2xl overflow-hidden backdrop-blur-xl bg-[#121216]/50 border border-[#22222a] shadow-2xl shadow-black/60 p-10">
            {/* Accent line */}
            <div className="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-[#e50914] to-transparent" />
            {/* Inner sheen */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/[0.012] to-transparent pointer-events-none" />

            {/* Animated success icon */}
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 rounded-2xl bg-red-500/10 animate-ping opacity-35" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600/20 to-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-slate-100 mb-2">
              You're in. 🎉
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-1 max-w-xs mx-auto">
              Account created as a{' '}
              <span className={`font-bold ${selectedRole?.iconColor ?? 'text-red-400'}`}>
                {selectedRole?.title ?? role}
              </span>.
            </p>
            <p className="text-xs text-slate-500 mb-8">
              Welcome to the TalentStage smart-escrow network.
            </p>

            <button
              onClick={() => onNavigate((role === 'freelancer' || role === 'dual') ? 'onboarding' : 'client-dashboard')}
              className="w-full py-3.5 rounded-xl bg-[#e50914] hover:bg-[#b80710] active:scale-[0.98] text-white text-sm font-bold tracking-tight shadow-lg shadow-red-950/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border-none"
            >
              <span>{(role === 'freelancer' || role === 'dual') ? 'Setup Professional Profile' : 'Go to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main signup view ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#08080a] text-slate-100 font-sans relative flex flex-col justify-center items-center px-6 py-14 overflow-hidden selection:bg-red-500/30 selection:text-red-200">

      {/* ── Layered ambient radial glows ── */}
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute -top-10 right-[-60px] w-[540px] h-[540px] rounded-full bg-red-955/15 blur-[130px] animate-pulse-glow" />
        <div className="absolute bottom-[-60px] left-[-40px] w-[500px] h-[480px] rounded-full bg-slate-955/10 blur-[110px] animate-pulse-glow-reverse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[280px] rounded-full bg-red-955/5 blur-[80px]" />
      </div>

      {/* ── Back to home ── */}
      <div className="absolute top-7 left-6 md:left-10 z-20">
        <button
          onClick={() => onNavigate('landing')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors duration-200 group cursor-pointer bg-transparent border-none"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" />
          <span>Back to home</span>
        </button>
      </div>

      {/* ── Card wrapper ── */}
      <div className="relative z-10 w-full max-w-[460px]">

        {/* Brand lockup */}
        <div className="flex flex-col items-center mb-7">
          <button
            onClick={() => onNavigate('landing')}
            className="inline-flex items-center gap-2.5 group mb-4 cursor-pointer bg-transparent border-none"
            aria-label="TalentStage — home"
          >
            <div className="w-9 h-9 rounded-xl bg-[#e50914] flex items-center justify-center shadow-lg shadow-red-500/10 group-hover:scale-105 transition-transform duration-200">
              <Cpu className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-[1.15rem] font-bold tracking-tight text-slate-100">
              Talent<span className="text-red-500 font-extrabold">Stage</span>
            </span>
          </button>

          <h2 className="text-2xl font-bold tracking-tight text-slate-100 leading-tight">
            Create your account
          </h2>
          <p className="text-sm text-slate-400 mt-1.5 text-center">
            Join the AI-powered talent network in under 60 seconds.
          </p>
        </div>

        {/* ── Glass card ── */}
        <div className="relative rounded-2xl overflow-hidden backdrop-blur-xl bg-[#121216]/50 border border-[#22222a] shadow-2xl shadow-black/60">

          {/* Violet hairline top accent */}
          <div className="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-[#e50914]/50 to-transparent" />
          {/* Inner sheen */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/[0.012] to-transparent pointer-events-none" />

          <div className="relative p-7 sm:p-8">

            {/* Error banner */}
            {error && (
              <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/25 text-xs text-rose-350 leading-relaxed animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-455" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-5">

              {/* ══ ROLE SELECTOR ════════════════════════════════════════════════ */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3 select-none">
                  I am joining as
                </p>
                <div className="grid grid-cols-3 gap-2.5">
                  {ROLES.map((r) => (
                    <RoleCard
                      key={r.id}
                      role={r}
                      selected={role === r.id}
                      onClick={() => setRole(r.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Soft separator */}
              <div className="h-px bg-slate-900" />

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

              {/* ── Email ── */}
              <AuthInput
                id="signup-email"
                label="Email Address"
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
                    className="text-[10px] font-bold uppercase tracking-wider text-slate-400 select-none"
                  >
                    Password
                  </label>
                  {password && (
                    <span
                      className={`text-xs font-bold tracking-wide transition-colors duration-300 ${
                        strength.score <= 1 ? 'text-red-400'
                        : strength.score <= 2 ? 'text-red-450'
                        : strength.score <= 3 ? 'text-amber-500'
                        : 'text-emerald-400'
                      }`}
                    >
                      {strength.label}
                    </span>
                  )}
                </div>

                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-600 group-focus-within:text-red-500 transition-colors duration-200 pointer-events-none">
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
                      bg-slate-955 border border-[#22222a]
                      text-sm text-white placeholder:text-slate-600
                      focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30
                      hover:border-slate-800
                      transition-all duration-200
                    "
                  />
                  <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="text-slate-500 hover:text-slate-300 transition-colors duration-200 cursor-pointer bg-transparent border-none"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </span>
                </div>

                {/* Strength bar */}
                {password && (
                  <div className="flex gap-1 mt-0.5">
                    {[1, 2, 3, 4, 5].map((seg) => (
                      <div
                        key={seg}
                        className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${
                          seg <= strength.score ? strength.color : 'bg-slate-900'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* ── Confirm Password ── */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="signup-confirm-password"
                  className="text-[10px] font-bold uppercase tracking-wider text-slate-400 select-none"
                >
                  Confirm Password
                </label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-600 group-focus-within:text-red-500 transition-colors duration-200 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    id="signup-confirm-password"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    className={`
                      w-full pl-10 pr-10 py-3 rounded-xl
                      bg-slate-955 border
                      text-sm text-white placeholder:text-slate-600
                      focus:outline-none focus:ring-1
                      hover:border-slate-800
                      transition-all duration-200
                      ${confirmPassword && password !== confirmPassword
                        ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/40'
                        : confirmPassword && password === confirmPassword
                          ? 'border-emerald-500/60 focus:border-emerald-500 focus:ring-emerald-500/40'
                          : 'border-[#22222a] focus:border-red-500 focus:ring-red-500/30'
                      }
                    `}
                  />
                  <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
                    {confirmPassword ? (
                      password === confirmPassword ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowConfirm((v) => !v)}
                          className="text-slate-500 hover:text-slate-350 transition-colors duration-200 cursor-pointer bg-transparent border-none"
                          aria-label={showConfirm ? 'Hide password' : 'Show password'}
                        >
                          {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      )
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        className="text-slate-500 hover:text-slate-350 transition-colors duration-200 cursor-pointer bg-transparent border-none"
                        aria-label={showConfirm ? 'Hide password' : 'Show password'}
                      >
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    )}
                  </span>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-rose-455 font-medium mt-0.5">
                    Passwords don\'t match.
                  </p>
                )}
              </div>

              {/* ── Terms checkbox ── */}
              <div className="flex items-start gap-2.5 pt-0.5">
                <button
                  type="button"
                  onClick={() => setAgreed((v) => !v)}
                  className={`
                    mt-0.5 w-4 h-4 rounded-[5px] flex items-center justify-center flex-shrink-0
                    border transition-all duration-200 cursor-pointer
                    ${agreed
                      ? 'bg-[#e50914] border-red-500 shadow-md shadow-red-550/10'
                      : 'bg-slate-955 border-slate-800 hover:border-slate-700'
                    }
                  `}
                  aria-checked={agreed}
                  role="checkbox"
                  aria-label="Accept terms of service"
                >
                  {agreed && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                </button>
                <span className="text-xs text-slate-400 leading-relaxed">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={(e) => e.preventDefault()}
                    className="text-red-400 hover:text-red-300 font-semibold transition-colors cursor-pointer bg-transparent border-none"
                  >
                    Terms of Service
                  </button>
                  {' '}and{' '}
                  <button
                    type="button"
                    onClick={(e) => e.preventDefault()}
                    className="text-red-400 hover:text-red-300 font-semibold transition-colors cursor-pointer bg-transparent border-none"
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
                  bg-[#e50914] hover:bg-[#b80710]
                  hover:brightness-110 active:scale-[0.98]
                  disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed
                  text-white text-sm font-bold tracking-tight
                  shadow-lg shadow-red-950/20 hover:shadow-red-950/30
                  flex items-center justify-center gap-2.5
                  transition-all duration-200 cursor-pointer border-none
                "
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/25 border-t-white animate-spin" />
                    <span>Creating account…</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* ── Divider ── */}
            <div className="relative my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-900" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 shrink-0">
                or sign up with
              </span>
              <div className="flex-1 h-px bg-slate-900" />
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
                  bg-slate-955 border border-[#22222a]
                  hover:bg-slate-900 hover:border-slate-800
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
                  ? <span className="w-4 h-4 rounded-full border-2 border-slate-650 border-t-slate-200 animate-spin" />
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
                  bg-slate-955 border border-[#22222a]
                  hover:bg-slate-900 hover:border-slate-800
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
                  ? <span className="w-4 h-4 rounded-full border-2 border-slate-650 border-t-slate-200 animate-spin" />
                  : <GithubIcon />}
                <span>GitHub</span>
              </button>
            </div>

            {/* ── Login nudge ── */}
            <p className="text-center text-sm text-slate-400 mt-6 leading-relaxed">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="font-bold text-red-400 hover:text-red-300 transition-colors duration-200 cursor-pointer bg-transparent border-none"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>

        {/* Trust micro-copy */}
        <p className="mt-5 text-center text-xs font-medium text-slate-500 tracking-wide">
          Protected by end-to-end encryption &middot; SOC 2 Type II compliant
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
