# E-comm Project Context

Updated: 2026-07-03

## What This Project Is

This is an early Django backend project for an e-commerce app.

Current structure:

```text
backend/
  manage.py
  Pipfile
  Pipfile.lock
  backend/
    settings.py
    urls.py
    asgi.py
    wsgi.py
  store/
    admin.py
    apps.py
    models.py
    tests.py
    views.py
    migrations/
```

## Current Status

- Django project exists and can be developed from the `backend` folder.
- App `store` exists but is still mostly empty.
- No e-commerce models have been created yet.
- No APIs have been created yet.
- No frontend exists yet.
- URL routing only has the Django admin route.
- Database is currently the default SQLite setup.
- Dependencies already listed include:
  - `django`
  - `djangorestframework`
  - `psycopg2-binary`
  - `python-dotenv`

## Suggested Next Process

1. Add `store` and `rest_framework` to `INSTALLED_APPS`.
2. Create core e-commerce models, likely:
   - Category
   - Product
   - Cart
   - CartItem
   - Order
   - OrderItem
3. Create migrations and apply them.
4. Register models in Django admin.
5. Add serializers for API responses.
6. Add API views/viewsets.
7. Add API routes.
8. Test the backend endpoints.
9. Later, add authentication, checkout flow, payment integration, and frontend.

## Important Notes For Future AI Agents

- Keep changes small and update this file after meaningful edits.
- Use this file as the project memory instead of rereading every file from scratch.
- Before changing code, check the actual files because this summary may be slightly behind.
- After changing code, add a short note under `Change Log`.

## Change Log

### 2026-07-03

- Created initial compact project context file.
- Project is still at Django starter stage.
