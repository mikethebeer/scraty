# Scraty

## Project management tool based on Scrum

It uses [Crate](https://crate.io) as backend database for storage and can be
served from a local machine or server that runs Python.

## Installation

Bootstrap project with Python >= 3.5:

```bash
python bootstrap.py
bin/buildout
```

To bootstrap the app simply run `npm` in this scraty folder:

```bash
bin/npm install bower markdown
```

```bash
bin/bower install jquery jquery-ui requirejs knockoutjs
```

## Usage

The app is served on localhost with defaul-port `8080` by running:

```bash
bin/app
```

## Features / Todos

- [x] Task synchronisation
- [x] Markdown support
- [ ] increment stars
- [ ] multi select (drag & drop, delete, etc.)
- [ ] keyboard shortcuts