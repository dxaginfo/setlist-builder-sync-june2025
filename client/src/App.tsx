import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './hooks/reduxHooks';
import { checkAuth } from './store/slices/authSlice';
import MainLayout from './layouts/MainLayout';
import PublicLayout from './layouts/PublicLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Protected Pages
import DashboardPage from './pages/dashboard/DashboardPage';
import SetlistsPage from './pages/setlists/SetlistsPage';
import SetlistDetailPage from './pages/setlists/SetlistDetailPage';
import CreateSetlistPage from './pages/setlists/CreateSetlistPage';
import EditSetlistPage from './pages/setlists/EditSetlistPage';
import SongsPage from './pages/songs/SongsPage';
import SongDetailPage from './pages/songs/SongDetailPage';
import CreateSongPage from './pages/songs/CreateSongPage';
import EditSongPage from './pages/songs/EditSongPage';
import BandsPage from './pages/bands/BandsPage';
import BandDetailPage from './pages/bands/BandDetailPage';
import CreateBandPage from './pages/bands/CreateBandPage';
import EditBandPage from './pages/bands/EditBandPage';
import ProfilePage from './pages/profile/ProfilePage';
import SettingsPage from './pages/profile/SettingsPage';
import PerformanceModePage from './pages/performance/PerformanceModePage';
import NotFoundPage from './pages/NotFoundPage';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={
          !isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />
        } />
        <Route path="/register" element={
          !isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" replace />
        } />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          
          <Route path="/setlists" element={<SetlistsPage />} />
          <Route path="/setlists/new" element={<CreateSetlistPage />} />
          <Route path="/setlists/:id" element={<SetlistDetailPage />} />
          <Route path="/setlists/:id/edit" element={<EditSetlistPage />} />
          
          <Route path="/songs" element={<SongsPage />} />
          <Route path="/songs/new" element={<CreateSongPage />} />
          <Route path="/songs/:id" element={<SongDetailPage />} />
          <Route path="/songs/:id/edit" element={<EditSongPage />} />
          
          <Route path="/bands" element={<BandsPage />} />
          <Route path="/bands/new" element={<CreateBandPage />} />
          <Route path="/bands/:id" element={<BandDetailPage />} />
          <Route path="/bands/:id/edit" element={<EditBandPage />} />
          
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        
        {/* Special layout for performance mode */}
        <Route path="/perform/:id" element={<PerformanceModePage />} />
      </Route>

      {/* 404 Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;