import { useState } from 'react';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import FreelancerOnboarding from './FreelancerOnboarding';
import FreelancerDashboard from './FreelancerDashboard';
import ClientWorkspace from './ClientWorkspace';
import ProjectFeedWorkspace from './ProjectFeedWorkspace';
import SkillMatchWorkspace from './SkillMatchWorkspace';

function App() {
  const [view, setView] = useState('skill-match');

  if (view === 'login') {
    return <LoginPage onNavigate={setView} />;
  }
  if (view === 'signup') {
    return <SignupPage onNavigate={setView} />;
  }
  if (view === 'onboarding') {
    return <FreelancerOnboarding onNavigate={setView} />;
  }
  if (view === 'dashboard') {
    return <FreelancerDashboard onNavigate={setView} />;
  }
  if (view === 'client-dashboard') {
    return <ClientWorkspace onNavigate={setView} />;
  }
  if (view === 'project-feed') {
    return <ProjectFeedWorkspace onNavigate={setView} />;
  }
  if (view === 'skill-match') {
    return <SkillMatchWorkspace onNavigate={setView} />;
  }
  return <LandingPage onNavigate={setView} />;
}

export default App;
