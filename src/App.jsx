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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

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
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
