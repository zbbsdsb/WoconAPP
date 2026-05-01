# 🌍 Wocon (World Companion)

**Wocon** is a next-generation platform designed for high-fidelity journey planning and recruitment of verified travel companions. Whether you're planning a solo expedition through Northern Iceland or a collaborative Zen tour in Kyoto, Wocon provides the spatial tools and social trust needed to turn ideas into shared adventures.

![Wocon Interface Preview](https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200)

## ✨ Core Features

### 📡 Discovery & Recruitment
- **Active Recruitment Hub:** Browse "Legendary Journeys" looking for specific skills or personality types.
- **Trip Wizard:** Step-by-step intuitive creation flow using **OpenStreetMap (Nominatim)** for precise geolocation.
- **Verified Connections:** Match with explorers based on rhythm, goals, and previous journey ratings.

### 🗺️ Spatial Intelligence
- **Interactive Multi-layer Map:** High-performance spatial engine supporting Dark, Street, and Satellite views.
- **Geographic Discovery:** Search destinations or discover trending trips nearby using real-world coordinate mapping.
- **POI Interactivity:** Real-time marker clusters and interactive trip previews directly on the map.

### 🛠️ Collaborative Workspace
- **Journey Timeline:** Dynamic day-by-day itinerary editor with live sync capabilities.
- **Team Management:** Invite members, manage permissions, and assign roles for complex expeditions.
- **Integrated Tooling:** Cost tracking, weather integration, and preparation checklists in a unified dashboard.

## 🛠️ Technology Stack

- **Frontend:** React 18+ (TypeScript)
- **Tooling:** Vite, ESLint
- **Styling:** Tailwind CSS (Modern Utility-first design)
- **Animation:** Framer Motion (Motion for React)
- **Mapping:** Leaflet & OpenStreetMap Engine
- **Icons:** Lucide React
- **Integration Ready:** Architected for **Supabase** (PostgreSQL + PostGIS) for real-time collaboration and spatial querying.

## 🚀 Getting Started

### Prerequisites
- Node.js (Latest LTS version recommended)
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

- `/src/pages`: Core views including Explore, Map, My Trips, and Workspace.
- `/src/components`: Reusable UI modules (Map engine, Trip Wizard, Layout Shell).
- `/src/services`: API abstraction layers (Nominatim search, Mock data).
- `/src/types`: Centralized TypeScript interfaces for domain entities.

## 🔐 Security & Integration

Wocon is designed with a **Security-First** mindset for collaborative trip data. For detailed information on the planned backend architecture, PostGIS schema, and Row-Level Security (RLS) policies, please refer to:

👉 [**BACKEND_INTEGRATION.md**](./BACKEND_INTEGRATION.md)

## 🤝 Contributing

We are building a community of explorers and builders. If you're interested in contributing to the Wocon core or the upcoming mobile app, please join our discord or open a PR.

---
*Created with passion by the Wocon-org Team. Exploring the world, one companion at a time.*
