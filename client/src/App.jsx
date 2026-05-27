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
  const [view, setView] = useState('skill-match');

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
          <div className="absolute top-[-80px] right-[-60px] w-[500px] h-[500px] rounded-full bg-indigo-700/5 blur-[120px]" />
          <div className="absolute bottom-[-100px] left-[200px] w-[450px] h-[450px] rounded-full bg-violet-700/4 blur-[100px]" />
        </div>
        <div className="relative z-10 flex-1 flex flex-col justify-start">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setView('dashboard')}
              className="text-xs font-bold text-slate-500 hover:text-indigo-400 cursor-pointer transition-colors flex items-center gap-1.5"
            >
              &larr; Back to Freelancer Dashboard
            </button>
            <button
              onClick={() => setView('client-dashboard')}
              className="text-xs font-bold text-slate-500 hover:text-indigo-400 cursor-pointer transition-colors flex items-center gap-1.5"
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

  return (
    <>
      {activeComponent}
      <GlobalDemoController setView={setView} currentView={view} />
    </>
  );
}

export default App;
