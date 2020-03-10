# Scraty

## Project management tool based on Scrum

It uses [Crate](https://crate.io) as backend database for storage and the
API can be served from a local machine or server that runs Python.

![Dashboard](scraty.png)

## Development

### Backend DB

**Requirements**: [CrateDB](https://crate.io/docs/crate/getting-started/en/latest/install-run/index.html)
                  installed and started

DB Schema: `/setup/schema.sql`

### Backend API

```bash
cd backend/
python3.6 -m venv env
source env/bin/activate
pip install -e .
```

Run the backend API with:

```bash
app
```

### Frontend

```bash
yarn
yarn start
```

## Features / Todos

- [x] Task synchronisation
- [x] Markdown support
- [ ] increment stars
- [ ] multi select (drag & drop, delete, etc.)
- [ ] keyboard shortcuts
