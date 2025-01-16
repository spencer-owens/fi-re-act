import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import AppLayout from './components/layout/AppLayout';
import { LoadingScreen } from './components/ui/LoadingSpinner';

// Protected Route wrapper
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!user.emailVerified) {
    return <Navigate to="/verify-email" />;
  }

  return children;
}

// Public Route wrapper (redirects to home if already authenticated)
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (user?.emailVerified) {
    return <Navigate to="/" />;
  }

  return children;
}

function AppContent() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/signup" element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        } />
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/forgot-password" element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        } />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Protected routes - wrapped in AppLayout */}
        <Route path="/" element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }>
          <Route index element={<div className="p-6">Select a channel or start a conversation</div>} />
          <Route path="channel/:channelId" element={<div className="p-6">Channel content coming soon</div>} />
          <Route path="dm/:userId" element={<div className="p-6">Direct message content coming soon</div>} />
          <Route path="search" element={<div className="p-6">Search page coming soon</div>} />
          <Route path="jonathan" element={<div className="p-6">Jonathan AI chat coming soon</div>} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}