import { useState } from 'react';
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

function App() {
  const [view, setView] = useState('landing');

  let activeComponent = null;

  if (view === 'login') {
    activeComponent = <LoginPage onNavigate={setView} />;
  } else if (view === 'signup') {
    activeComponent = <SignupPage onNavigate={setView} />;
  } else if (view === 'onboarding') {
    activeComponent = <FreelancerOnboarding onNavigate={setView} />;
  } else if (view === 'dashboard') {
    activeComponent = <FreelancerDashboard onNavigate={setView} />;
  } else if (view === 'client-dashboard') {
    activeComponent = <ClientWorkspace onNavigate={setView} />;
  } else if (view === 'project-feed') {
    activeComponent = <ProjectFeedWorkspace onNavigate={setView} />;
  } else if (view === 'skill-match') {
    activeComponent = <SkillMatchWorkspace onNavigate={setView} />;
  } else if (view === 'workspace') {
    activeComponent = (
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
  } else {
    activeComponent = <LandingPage onNavigate={setView} />;
  }

  const isDashboardView = ['dashboard', 'client-dashboard', 'project-feed', 'skill-match', 'workspace', 'onboarding'].includes(view);

  return (
    <div className={isDashboardView ? 'dashboard-theme text-slate-100 bg-slate-950 min-h-screen' : 'bg-slate-955 text-slate-100 min-h-screen'}>
      {activeComponent}
      <GlobalDemoController setView={setView} currentView={view} />
    </div>
  );
}

export default App;
