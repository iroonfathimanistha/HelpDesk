# Database Architecture

> Status: Phase 1 — placeholder. No tables have been designed or created yet.

## Technology

- **Database:** PostgreSQL
- **ORM:** Sequelize
- **Schema changes:** Sequelize migrations in [`database/migrations/`](../../database/migrations/)
- **Initial data:** Sequelize seeders in [`database/seeders/`](../../database/seeders/)

## This Document Will Contain

1. **Entity list** — the main entities (for example users, provider profiles, service categories, bookings, reviews) with a short description of each.
2. **Entity-Relationship (ER) diagram** — drawn in Mermaid.
3. **Table definitions** — columns, data types, constraints and indexes.
4. **Relationships** — one-to-many and many-to-many associations.
5. **Role model** — how `customer`, `provider` and `admin` roles are stored to support role-based access control.
6. **Location data** — how addresses and coordinates are stored for nearby-provider search.
7. **Naming conventions** — table and column naming rules.
8. **Migration workflow** — how to create, run and roll back migrations.
