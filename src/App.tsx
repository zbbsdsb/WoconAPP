import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Shell } from './components/layout/Shell';
import { EntranceAnimation } from './components/layout/EntranceAnimation';
import { ExplorePage } from './pages/ExplorePage';
import { MapPage } from './pages/MapPage';
import { LoginPage } from './pages/LoginPage';
import { TripWorkspacePage } from './pages/TripWorkspacePage';
import { MyTripsPage } from './pages/MyTripsPage';
import { ConnectionsPage } from './pages/ConnectionsPage';

export default function App() {
  const [isAnimating, setIsAnimating] = useState(true);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#050505]">
      <EntranceAnimation onComplete={() => setIsAnimating(false)} />
      
      {!isAnimating && (
        <Shell>
          <Routes>
            <Route path="/" element={<ExplorePage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/trips/:id" element={<TripWorkspacePage />} />
            <Route path="/trips" element={<MyTripsPage />} />
            <Route path="/connections" element={<ConnectionsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Shell>
      )}
    </div>
  );
}
