# Database

PostgreSQL database managed with **Sequelize ORM** migrations and seeders.

> Status: Phase 1 — structure only. No tables have been created yet.

## Folders

| Folder | Purpose |
|---|---|
| `migrations/` | Versioned, ordered schema changes (create/alter tables). Each migration must be reversible (`up` / `down`). |
| `seeders/` | Initial or demo data, e.g. service categories (Plumbing, Electrical, …) and a development admin account. |

## Relationship to the backend

- **Migrations** (here) define how the database schema *changes over time*.
- **Models** (`backend/src/models/`) describe how the application *reads and writes* that schema.

Both must be kept in sync: every model change needs a matching migration.

## Rules

- Never edit a migration that has already been run on a shared database — create a new one instead.
- Never commit database dumps or real user data.
- Database credentials live only in `backend/.env` (see `backend/.env.example`).

The schema design will be documented in [`docs/architecture/database-architecture.md`](../docs/architecture/database-architecture.md).
