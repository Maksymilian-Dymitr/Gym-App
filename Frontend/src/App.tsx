import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import PageShell from './components/layout/PageShell';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import LoginSuccessPage from './pages/LoginSuccessPage';
import DashboardPage from './pages/DashboardPage';
import ExerciseCatalogPage from './pages/ExerciseCatalogPage';
import SetLoggerPage from './pages/SetLoggerPage';
import WorkoutBuilderPage from './pages/WorkoutBuilderPage';
import BodyWeightPage from './pages/BodyWeightPage';
import WorkoutHistoryPage from './pages/WorkoutHistoryPage';
import ProgressPage from './pages/ProgressPage';
import ProfilePage from './pages/ProfilePage';
import ExerciseDetailPage from './pages/ExerciseDetailPage';
import AdminPage from './pages/admin/AdminPage';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login-success" element={<LoginSuccessPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<PageShell />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/exercises" element={<ExerciseCatalogPage />} />
              <Route path="/dashboard/sets" element={<SetLoggerPage />} />
              <Route path="/dashboard/workouts" element={<WorkoutBuilderPage />} />
              <Route path="/dashboard/bodyweight" element={<BodyWeightPage />} />
              <Route path="/history" element={<WorkoutHistoryPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/exercises/:name" element={<ExerciseDetailPage />} />
            </Route>
          </Route>

          <Route element={<AdminRoute />}>
            <Route element={<PageShell />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
