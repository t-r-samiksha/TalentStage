import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
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
import ClientProfilePage from './ClientProfilePage';
import FreelancerProfilePage from './FreelancerProfilePage';
import { authStorage } from './api';

/**
 * Route Guard for Authenticated Private Routes
 */
function ProtectedRoute({ children }) {
  const location = useLocation();
  
  if (!authStorage.isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
}

/**
 * Route Guard for Role Separation (CLIENT vs FREELANCER)
 */
function RoleGuard({ allowedRole, children }) {
  if (!authStorage.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const user = authStorage.getUser();
  const role = user?.role;

  if (role !== allowedRole) {
    console.warn(`[Route Guard] Blocked access for role: ${role}. Expected: ${allowedRole}`);
    return role === 'CLIENT' 
      ? <Navigate to="/client-dashboard" replace /> 
      : <Navigate to="/dashboard" replace />;
  }

  return children;
}

/**
 * Route Guard to redirect authenticated users away from landing/auth pages
 */
function PublicOnlyRoute({ children }) {
  if (authStorage.isAuthenticated()) {
    const user = authStorage.getUser();
    return user?.role === 'CLIENT' 
      ? <Navigate to="/client-dashboard" replace /> 
      : <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

/**
 * Isolated wrapper layout for messages/contracts full view
 */
function WorkspaceMessagesAndContractsWrapper() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authStorage.getUser();
  
  const handleBack = () => {
    if (user?.role === 'CLIENT') {
      navigate('/client-dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const contractId = location.state?.contractId || new URLSearchParams(location.search).get('contractId') || null;
  const section = location.state?.section || new URLSearchParams(location.search).get('section') || 'messages';

  return (
    <div className="min-h-screen bg-slate-950 p-8 lg:p-10 select-none relative overflow-hidden flex flex-col text-slate-100">
      {/* Glowing background highlights */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-80px] right-[-60px] w-[500px] h-[500px] rounded-full bg-indigo-950/20 blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-[-100px] left-[200px] w-[450px] h-[450px] rounded-full bg-violet-950/15 blur-[100px] animate-pulse-glow-reverse" />
      </div>
      
      <div className="relative z-10 flex-1 flex flex-col justify-start animate-fadeIn">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleBack}
            className="text-xs font-bold text-slate-500 hover:text-indigo-400 cursor-pointer transition-colors flex items-center gap-1.5"
          >
            &larr; Back to Dashboard
          </button>
        </div>
        <WorkspaceMessagesAndContracts activeSection={section} preselectedContractId={contractId} />
      </div>
    </div>
  );
}

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 1. Global event listener for session expirations (like 401s)
    const handleUnauthorized = () => {
      authStorage.clearAuth();
      navigate('/login', { replace: true });
    };

    // 2. Global event listener for manual logout
    const handleLogout = () => {
      authStorage.clearAuth();
      navigate('/', { replace: true });
    };

    window.addEventListener('talentstage-unauthorized', handleUnauthorized);
    window.addEventListener('talentstage-logout', handleLogout);

    return () => {
      window.removeEventListener('talentstage-unauthorized', handleUnauthorized);
      window.removeEventListener('talentstage-logout', handleLogout);
    };
  }, [navigate]);

  const isDashboardView = [
    '/dashboard', 
    '/client-dashboard', 
    '/project-feed', 
    '/skill-match', 
    '/workspace', 
    '/onboarding'
  ].some(path => location.pathname.startsWith(path));

  return (
    <div className={isDashboardView ? 'dashboard-theme text-slate-100 bg-slate-955 min-h-screen' : 'bg-slate-955 text-slate-100 min-h-screen'}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicOnlyRoute><LandingPage /></PublicOnlyRoute>} />
        <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
        <Route path="/signup" element={<PublicOnlyRoute><SignupPage /></PublicOnlyRoute>} />

        {/* Private Freelancer Routes */}
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <RoleGuard allowedRole="FREELANCER">
              <FreelancerOnboarding />
            </RoleGuard>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/*" element={
          <ProtectedRoute>
            <RoleGuard allowedRole="FREELANCER">
              <FreelancerDashboard />
            </RoleGuard>
          </ProtectedRoute>
        } />

        {/* Private Client Routes */}
        <Route path="/client-dashboard/*" element={
          <ProtectedRoute>
            <RoleGuard allowedRole="CLIENT">
              <ClientWorkspace />
            </RoleGuard>
          </ProtectedRoute>
        } />

        {/* Shared Private Routes */}
        <Route path="/project-feed" element={
          <ProtectedRoute>
            <ProjectFeedWorkspace />
          </ProtectedRoute>
        } />
        <Route path="/skill-match" element={
          <ProtectedRoute>
            <SkillMatchWorkspace />
          </ProtectedRoute>
        } />
        <Route path="/workspace" element={
          <ProtectedRoute>
            <WorkspaceMessagesAndContractsWrapper />
          </ProtectedRoute>
        } />
        <Route path="/client/:id" element={
          <ProtectedRoute>
            <ClientProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/freelancer/:id" element={
          <ProtectedRoute>
            <FreelancerProfilePage />
          </ProtectedRoute>
        } />

        {/* Fallback Catch-all Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Unified Demo Navigator FAB */}
      <GlobalDemoController />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
