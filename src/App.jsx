import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import CheckIn from './pages/CheckIn';
import Profile from './pages/Profile';
import Workouts from './pages/Workouts';
import Subscribe from './pages/Subscribe';
import BottomNav from './components/BottomNav';
import ProtectedRoute from './components/ProtectedRoute';

import Settings from './pages/Settings';
import CreateWorkout from './pages/CreateWorkout';
import CalculatorsPage from './pages/CalculatorsPage';
import ProgressPage from './pages/ProgressPage';
import MissionsPage from './pages/MissionsPage';
import BadgesPage from './pages/BadgesPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSeasons from './pages/admin/AdminSeasons';
import AdminBadges from './pages/admin/AdminBadges';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminLayout from './components/admin/AdminLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
            <BottomNav />
          </ProtectedRoute>
        } />
        <Route path="/create-workout" element={
          <ProtectedRoute>
            <CreateWorkout />
            <BottomNav />
          </ProtectedRoute>
        } />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={
            <>
              <Dashboard />
              <BottomNav />
            </>
          } />
          <Route path="/workouts" element={
            <>
              <Workouts />
              <BottomNav />
            </>
          } />
          <Route path="/leaderboard" element={
            <>
              <Leaderboard />
              <BottomNav />
            </>
          } />
          <Route path="/subscribe" element={
            <>
              <Subscribe />
              <BottomNav />
            </>
          } />
          <Route path="/checkin" element={
            <>
              <CheckIn />
              <BottomNav />
            </>
          } />
          <Route path="/profile" element={
            <>
              <Profile />
              <BottomNav />
            </>
          } />
          <Route path="/calculators" element={
            <>
              <CalculatorsPage />
              <BottomNav />
            </>
          } />
          <Route path="/progress" element={
            <>
              <ProgressPage />
              <BottomNav />
            </>
          } />
          <Route path="/missions" element={
            <>
              <MissionsPage />
              <BottomNav />
            </>
          } />
          <Route path="/badges" element={
            <>
              <BadgesPage />
              <BottomNav />
            </>
          } />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="seasons" element={<AdminSeasons />} />
          <Route path="badges" element={<AdminBadges />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="analytics" element={<AdminAnalytics />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
