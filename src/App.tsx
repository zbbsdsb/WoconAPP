import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Shell } from './components/layout/Shell';
import { ExplorePage } from './pages/ExplorePage';
import { MapPage } from './pages/MapPage';
import { LoginPage } from './pages/LoginPage';
import { TripWorkspacePage } from './pages/TripWorkspacePage';
import { MyTripsPage } from './pages/MyTripsPage';
import { ConnectionsPage } from './pages/ConnectionsPage';

export default function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<ExplorePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/trips/:id" element={<TripWorkspacePage />} />
        <Route path="/trips" element={<MyTripsPage />} />
        <Route path="/connections" element={<ConnectionsPage />} />
      </Routes>
    </Shell>
  );
}
