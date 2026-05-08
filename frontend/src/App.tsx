import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NewAssessment from './pages/NewAssessment';
import Assessment from './pages/Assessment';
import Findings from './pages/Findings';
import Remediation from './pages/Remediation';
import RemediationDetail from './pages/RemediationDetail';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Authenticated routes */}
      <Route path="/dashboard" element={<RequireAuth><Layout /></RequireAuth>}>
        <Route index element={<Dashboard />} />
      </Route>
      <Route path="/assessments" element={<RequireAuth><Layout /></RequireAuth>}>
        <Route path="new" element={<NewAssessment />} />
        <Route path=":id" element={<Assessment />} />
        <Route path=":id/findings" element={<Findings />} />
        <Route path=":id/remediation" element={<Remediation />} />
        <Route path=":id/remediation/:planId" element={<RemediationDetail />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
