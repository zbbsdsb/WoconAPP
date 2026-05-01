# Wocon Backend Integration Strategy

This document outlines the high-level architecture and security model for the Wocon application, bridging the gap between our high-end React frontend and the Firebase/GCP ecosystem.

## 1. Core Architecture
- **Frontend**: React 18 + Vite + Tailwind CSS + Framer Motion.
- **Database**: Firebase Firestore (Enterprise Edition).
- **Auth**: Firebase Authentication (Google OAuth).
- **Storage**: Firebase Storage (for high-fidelity expedition media).

## 2. Data Modeling (Blueprint)
We maintain a centralized `firebase-blueprint.json` which serves as the "source of truth" for:
- Entity definitions (User, Trip, Itinerary).
- Path mappings (Collections/Subcollections).
- Attribute types and validation constraints.

## 3. Security (Fortress Rules)
Our `firestore.rules` implement a "Zero-Trust" model:
- **Relational Sync**: Access to sub-resources (Itinerary) is strictly bound to membership in the parent resource (Trip).
- **Identity Integrity**: Every write operation validates that `request.auth.uid` matches the `creator_id` or is a verified `participant`.
- **Atomic Operations**: Relational writes are enforced via `existsAfter` or batch-validation hooks.

## 4. Real-time Collaboration
The application utilizes Firestore's `onSnapshot` listeners to provide:
- Instant UI updates for shared itineraries.
- Live participant status tracking.
- Budget allocation sync.

## 5. Deployment
Configuration is managed via `firebase-applet-config.json`. Rules are deployed using the `deploy_firebase` tool to ensure the security "Fortress" is always up-to-date with the latest schema changes.

---
*Confidential — Wocon Development Syndicate*
