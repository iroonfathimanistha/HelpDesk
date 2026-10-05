# API Architecture

> Status: Phase 1 — placeholder. No endpoints have been implemented yet.

## Style

- RESTful JSON API built with Node.js + Express.js
- Planned base path: `/api`
- Authentication with JWT (`Authorization: Bearer <token>`)
- Tested with Postman

## Planned Request Flow

```
Request → Route → Middleware (auth, role, validation) → Controller → Service → Model → PostgreSQL
```

| Layer | Folder | Responsibility |
|---|---|---|
| Route | `backend/src/routes/` | Maps URL + HTTP method to a controller. No logic. |
| Middleware | `backend/src/middleware/` | JWT authentication, role checks, error handling. |
| Validator | `backend/src/validators/` | Validates request body, params and query. |
| Controller | `backend/src/controllers/` | Reads the request, calls services, sends the response. |
| Service | `backend/src/services/` | Business logic and external integrations. |
| Model | `backend/src/models/` | Sequelize models — database access only. |

## This Document Will Contain

1. **Endpoint groups** — the list of resource groups (for example auth, users, providers, services, bookings, admin).
2. **Endpoint reference** — method, path, required role, request and response examples.
3. **Authentication flow** — how tokens are issued and verified.
4. **Role-based access matrix** — which roles (`customer`, `provider`, `admin`) can access which endpoints.
5. **Response format** — standard success and error response shapes.
6. **Error codes** — HTTP status codes used and their meaning.
7. **Versioning strategy** — how breaking API changes will be handled.
8. **Postman collection** — where the shared collection is stored and how to use it.
