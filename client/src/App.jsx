import { useState } from 'react';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import FreelancerOnboarding from './FreelancerOnboarding';

function App() {
  const [view, setView] = useState('landing');

  if (view === 'login') {
    return <LoginPage onNavigate={setView} />;
  }
  if (view === 'signup') {
    return <SignupPage onNavigate={setView} />;
  }
  if (view === 'onboarding') {
    return <FreelancerOnboarding onNavigate={setView} />;
  }
  return <LandingPage onNavigate={setView} />;
}

export default App;
