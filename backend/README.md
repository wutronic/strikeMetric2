# StrikeMetric Backend

## Database Models

The application uses SQLAlchemy ORM with SQLite database. The database models are structured as follows:

### Base Model

All models inherit from `BaseModel` which provides common fields:
- `id`: Primary key
- `created_at`: Timestamp of record creation
- `updated_at`: Timestamp of last update

### User Model

Table name: `users`

Fields:
- `username`: String(50), unique, required
- `email`: String(255), unique, required, indexed
- `password_hash`: String(255), required
- `first_name`: String(50), optional
- `last_name`: String(50), optional
- `is_active`: Boolean, defaults to True
- `is_admin`: Boolean, defaults to False
- `created_at`: DateTime
- `updated_at`: DateTime

Relationships:
- `punch_analyses`: One-to-many relationship with PunchAnalysis

### Punch Analysis Model

Table name: `punch_analyses`

Fields:
- `user_id`: Integer, Foreign Key to users.id, required
- `punch_type`: Enum(PunchType), required
  - Valid types: JAB, CROSS, HOOK, UPPERCUT
- `speed`: Float, optional
- `force`: Float, optional
- `accuracy`: Float, optional
- `notes`: String(500), optional
- `created_at`: DateTime
- `updated_at`: DateTime

Relationships:
- `user`: Many-to-one relationship with User

## Database Configuration

The database is configured using SQLite with the following settings:
- Database URL: `sqlite:///./strike_metric.db`
- Session management: Using `SessionLocal` with autocommit=False and autoflush=False
- Thread safety: SQLite is configured with `check_same_thread=False`

## Database Migrations

The project uses Alembic for database migrations. The migration files are located in the `alembic` directory.

### Migration Commands

```bash
# Initialize migrations
alembic init alembic

# Create a new migration
alembic revision --autogenerate -m "description"

# Run migrations
alembic upgrade head

# Rollback migrations
alembic downgrade -1
```

## Session Management

Two methods are available for managing database sessions:

1. `get_db()`: Generator function for dependency injection
```python
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

2. `get_db_session()`: Context manager for manual session management
```python
with get_db_session() as db:
    # perform database operations
    # session is automatically committed or rolled back
``` 