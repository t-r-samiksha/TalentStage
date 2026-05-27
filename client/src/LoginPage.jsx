import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, ArrowLeft, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { authService, authStorage } from './api';

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

// ─── Reusable premium input field ─────────────────────────────────────────────
function AuthInput({ id, label, type, placeholder, value, onChange, icon: Icon, rightSlot, autoComplete }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-450 select-none"
      >
        {label}
      </label>
      <div className="relative group">
        {/* Left icon */}
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

        {/* Right slot */}
        {rightSlot && (
          <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
            {rightSlot}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]   = useState(false);
  const [oauthLoading, setOauthLoading] = useState(''); // 'google' | 'github' | ''
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState(false);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in both email and password to continue.');
      return;
    }

    setIsLoading(true);
    const result = await authService.login(email.trim(), password);
    setIsLoading(false);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error?.message || 'Authentication failed. Please verify your email and password.');
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

  // ── Success state ─────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-[#08080a] flex items-center justify-center px-6 relative overflow-hidden">
        {/* Ambient glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-red-950/10 blur-[140px]" />
        </div>

        <div className="relative z-10 w-full max-w-md text-center animate-scaleUp">
          <div className="rounded-2xl p-10 border border-[#22222a] bg-[#121216]/50 backdrop-blur-xl shadow-2xl shadow-black/60">
            {/* Glow accent line */}
            <div className="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-[#e50914] to-transparent" />

            <div className="w-14 h-14 rounded-2xl bg-red-950/20 border border-red-550/30 flex items-center justify-center text-red-400 mx-auto mb-5 shadow-lg shadow-red-500/10">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-100 mb-2">
              Welcome back.
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-8 max-w-xs mx-auto">
              You\'ve authenticated successfully. Your workspace is ready.
            </p>
            <button
              onClick={() => {
                const user = authStorage.getUser();
                if (user?.role === 'CLIENT') {
                  navigate('/client-dashboard');
                } else {
                  navigate('/dashboard');
                }
              }}
              className="w-full py-3.5 rounded-xl bg-[#e50914] hover:bg-[#b80710] active:scale-[0.98] text-white text-sm font-bold tracking-tight shadow-lg shadow-red-950/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border-none"
            >
              <span>Enter Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main login view ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#08080a] text-slate-100 font-sans relative flex flex-col justify-center items-center px-6 overflow-hidden selection:bg-red-500/30 selection:text-red-205 animate-fadeIn">

      {/* ── Layered ambient radial glows ── */}
      <div className="pointer-events-none absolute inset-0 -z-0">
        {/* Primary top-left red bloom */}
        <div className="absolute -top-20 -left-10 w-[560px] h-[560px] rounded-full bg-red-950/15 blur-[130px] animate-pulse-glow" />
        {/* Secondary bottom-right gray bloom */}
        <div className="absolute bottom-[-80px] right-[-40px] w-[500px] h-[480px] rounded-full bg-slate-950/10 blur-[110px] animate-pulse-glow-reverse" />
        {/* Central soft undercard glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[300px] rounded-full bg-red-950/5 blur-[80px]" />
      </div>

      {/* ── Back to home ── */}
      <div className="absolute top-7 left-6 md:left-10 z-20">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors duration-200 group cursor-pointer bg-transparent border-none"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" />
          <span>Back to home</span>
        </button>
      </div>

      {/* ── Card ── */}
      <div className="relative z-10 w-full max-w-[420px]">

        {/* Brand lockup above card */}
        <div className="flex flex-col items-center mb-7 select-none">
          <button
            onClick={() => navigate('/')}
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

          <h2 className="text-2xl font-bold tracking-tight text-slate-100 leading-tight">Welcome back</h2>
          <p className="text-sm text-slate-400 mt-1.5 text-center">
            Sign in to access your workspace and escrow protection.
          </p>
        </div>

        {/* Glass card */}
        <div className="relative rounded-2xl overflow-hidden backdrop-blur-lg bg-[#121216]/50 border border-[#22222a] shadow-2xl shadow-black/60">

          {/* Red hairline accent on top edge */}
          <div className="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-[#e50914]/50 to-transparent" />
          {/* Soft inner top sheen */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/[0.012] to-transparent pointer-events-none" />

          <div className="relative p-7 sm:p-8">

            {/* Error banner */}
            {error && (
              <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-red-950/40 border border-red-900/40 text-xs text-red-350 leading-relaxed animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">

              {/* Email */}
              <AuthInput
                id="login-email"
                label="Work Email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={Mail}
                autoComplete="email"
              />

              {/* Password */}
              <AuthInput
                id="login-password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={Lock}
                autoComplete="current-password"
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-slate-500 hover:text-slate-300 transition-colors duration-200 cursor-pointer bg-transparent border-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword
                      ? <EyeOff className="w-4 h-4" />
                      : <Eye className="w-4 h-4" />}
                  </button>
                }
              />

              {/* Forgot password */}
              <div className="flex justify-end -mt-1">
                <button
                  type="button"
                  onClick={(e) => e.preventDefault()}
                  className="text-[11px] font-semibold text-red-400 hover:text-red-300 transition-colors duration-200 cursor-pointer bg-transparent border-none"
                >
                  Forgot password?
                </button>
              </div>

              {/* Primary CTA */}
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
                    <span>Authenticating…</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-900" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 shrink-0">
                or continue with
              </span>
              <div className="flex-1 h-px bg-slate-900" />
            </div>

            {/* OAuth buttons */}
            <div className="grid grid-cols-2 gap-3">

              {/* Google */}
              <button
                type="button"
                onClick={() => handleOAuth('google')}
                disabled={!!oauthLoading}
                className="
                  relative flex items-center justify-center gap-2.5
                  py-2.5 px-4 rounded-xl
                  bg-slate-950 border border-[#22222a]
                  hover:bg-slate-900 hover:border-slate-800
                  active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed
                  text-slate-300 hover:text-white
                  text-xs font-semibold tracking-tight
                  transition-all duration-200 cursor-pointer
                  group overflow-hidden
                "
                aria-label="Sign in with Google"
              >
                <span className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl pointer-events-none" />
                {oauthLoading === 'google' ? (
                  <span className="w-4 h-4 rounded-full border-2 border-slate-650 border-t-slate-200 animate-spin" />
                ) : (
                  <GoogleIcon />
                )}
                <span>Google</span>
              </button>

              {/* GitHub */}
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
                aria-label="Sign in with GitHub"
              >
                <span className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl pointer-events-none" />
                {oauthLoading === 'github' ? (
                  <span className="w-4 h-4 rounded-full border-2 border-slate-650 border-t-slate-200 animate-spin" />
                ) : (
                  <GithubIcon />
                )}
                <span>GitHub</span>
              </button>
            </div>

            {/* Sign-up nudge */}
            <p className="text-center text-[12px] text-slate-400 mt-6 leading-relaxed">
              Don\'t have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="font-bold text-red-400 hover:text-red-300 transition-colors duration-200 cursor-pointer bg-transparent border-none"
              >
                Create one free
              </button>
            </p>
          </div>
        </div>

        {/* Trust micro-copy below card */}
        <p className="mt-5 text-center text-[10px] font-medium text-slate-500 tracking-wide">
          Protected by end-to-end encryption &middot; SOC 2 Type II compliant
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
