# System Architecture

> Status: Phase 1 — initial high-level design. Will be refined as features are built.

## Overview

The platform consists of three client applications and one backend API. The backend is the **only** component that accesses the database and external services.

```mermaid
flowchart TD
    subgraph Clients
        CA[Customer App<br/>React Native]
        PA[Provider App<br/>React Native]
        AD[Admin Dashboard<br/>React.js]
    end

    CA -->|HTTPS + JWT| API
    PA -->|HTTPS + JWT| API
    AD -->|HTTPS + JWT| API

    API[Backend API<br/>Node.js + Express.js]

    API -->|Sequelize ORM| DB[(PostgreSQL)]

    subgraph External Services
        AI[LLM API]
        VAI[Vision AI API]
        MAPS[Maps API]
        FCM[Firebase Cloud Messaging]
        S3[AWS S3]
    end

    API --> AI
    API --> VAI
    API --> MAPS
    API --> FCM
    API --> S3
```

## Components

| Component | Responsibility |
|---|---|
| **Customer App** | Customers describe a household problem, view suggested providers and manage bookings. |
| **Provider App** | Providers manage their profile and availability and respond to job requests. |
| **Admin Dashboard** | Administrators verify providers, manage service categories and monitor activity. |
| **Backend API** | Authentication, authorization (roles), business rules, provider matching and all external integrations. |
| **PostgreSQL** | Persistent storage for users, providers, services, bookings and reviews. |

## External Integrations (backend only)

| Service | Planned use | Backend location |
|---|---|---|
| LLM API | Understand the customer's problem description and suggest a service category | `backend/src/services/ai/` |
| Vision AI API | Analyse photos of the problem uploaded by the customer | `backend/src/services/ai/` |
| Maps API | Locations, distances and nearby provider search | `backend/src/services/matching/` |
| Firebase Cloud Messaging | Push notifications to the mobile apps | `backend/src/services/notifications/` |
| AWS S3 | Storing uploaded images (problem photos, profile photos, documents) | `backend/src/services/storage/` |

## Key Principles

1. **Clients never hold secrets.** API keys for AI, maps (server-side), S3 and Firebase Admin stay in the backend.
2. **Layered backend.** Routes → Middleware → Controllers → Services → Models.
3. **Role-based access.** Every authenticated request carries a JWT that identifies the user and role (`customer`, `provider`, `admin`).

## To Be Documented

- Request flow for a typical booking (sequence diagram)
- Deployment architecture (Render / AWS)
- Environment setup (development / production)
