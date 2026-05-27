import { useState, useEffect } from 'react';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import FreelancerOnboarding from './FreelancerOnboarding';
import FreelancerDashboard from './FreelancerDashboard';
import ClientWorkspace from './ClientWorkspace';
import ProjectFeedWorkspace from './ProjectFeedWorkspace';
import SkillMatchWorkspace from './SkillMatchWorkspace';
import WorkspaceMessagesAndContracts from './WorkspaceMessagesAndContracts';
import GlobalDemoController from './GlobalDemoController';
import { authStorage } from './api';

function App() {
  const [view, setView] = useState('landing');

  useEffect(() => {
    // 1. Auto-login and route check on startup
    if (authStorage.isAuthenticated()) {
      const user = authStorage.getUser();
      setTimeout(() => {
        if (user?.role === 'CLIENT') {
          setView('client-dashboard');
        } else {
          setView('dashboard');
        }
      }, 0);
    } else {
      setTimeout(() => setView('landing'), 0);
    }

    // 2. Global event listener to capture session expirations (e.g. 401 response interceptors)
    const handleUnauthorized = () => {
      setView('login');
    };

    // 3. Global event listener for manual logout
    const handleLogout = () => {
      setView('landing');
    };

    window.addEventListener('talentstage-unauthorized', handleUnauthorized);
    window.addEventListener('talentstage-logout', handleLogout);

    return () => {
      window.removeEventListener('talentstage-unauthorized', handleUnauthorized);
      window.removeEventListener('talentstage-logout', handleLogout);
    };
  }, []);

  const getActiveComponent = () => {
    if (view === 'login') return <LoginPage onNavigate={setView} />;
    if (view === 'signup') return <SignupPage onNavigate={setView} />;
    if (view === 'onboarding') return <FreelancerOnboarding onNavigate={setView} />;
    if (view === 'dashboard') return <FreelancerDashboard onNavigate={setView} />;
    if (view === 'client-dashboard') return <ClientWorkspace onNavigate={setView} />;
    if (view === 'project-feed') return <ProjectFeedWorkspace onNavigate={setView} />;
    if (view === 'skill-match') return <SkillMatchWorkspace onNavigate={setView} />;
    if (view === 'workspace') return (
      <div className="min-h-screen bg-slate-950 p-8 lg:p-10 select-none relative overflow-hidden flex flex-col">
        {/* Glowing background highlights */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute top-[-80px] right-[-60px] w-[500px] h-[500px] rounded-full bg-indigo-950/20 blur-[120px] animate-pulse-glow" />
          <div className="absolute bottom-[-100px] left-[200px] w-[450px] h-[450px] rounded-full bg-violet-950/15 blur-[100px] animate-pulse-glow-reverse" />
        </div>
        <div className="relative z-10 flex-1 flex flex-col justify-start animate-fadeIn">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setView('dashboard')}
              className="text-xs font-bold text-slate-500 hover:text-indigo-650 cursor-pointer transition-colors flex items-center gap-1.5"
            >
              &larr; Back to Freelancer Dashboard
            </button>
            <button
              onClick={() => setView('client-dashboard')}
              className="text-xs font-bold text-slate-500 hover:text-indigo-650 cursor-pointer transition-colors flex items-center gap-1.5"
            >
              Back to Client Workspace &rarr;
            </button>
          </div>
          <WorkspaceMessagesAndContracts onNavigate={setView} />
        </div>
      </div>
    );
    return <LandingPage onNavigate={setView} />;
  };

  const isDashboardView = ['dashboard', 'client-dashboard', 'project-feed', 'skill-match', 'workspace', 'onboarding'].includes(view);

  return (
    <div className={isDashboardView ? 'dashboard-theme text-slate-100 bg-slate-950 min-h-screen' : 'bg-slate-955 text-slate-100 min-h-screen'}>
      {getActiveComponent()}
      <GlobalDemoController setView={setView} currentView={view} />
    </div>
  );
}

export default App;
