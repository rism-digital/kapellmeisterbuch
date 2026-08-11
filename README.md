# Kapellmeisterbuch

Kapellmeisterbuch is a static React single-page application for exploring the corpus. The book content, browse indexes, and full-text search corpus are versioned in this repository and run entirely in the browser; no backend or API server is required.

## Project structure

```text
src/       React application and UI components
dataset/   Full-text records, browse indexes, book HTML, and IIIF manifest data
static/    Images and translated Markdown pages
build/     Generated production site (created by `yarn build`)
```

The `/search` page lazily loads the local transcription corpus and searches it with FlexSearch. The `/browse` page lazily loads the local browse-index dataset. Both link directly to anchors in the static book view.

## Requirements

- Node.js 22.11.0 or later
- Yarn Classic 1.22.22

## Development

Install dependencies once:

```bash
yarn install
```

Start the local development server:

```bash
yarn start
```

The application is served at `http://localhost:8080`.

## Production build

Create a clean production build:

```bash
yarn build
```

The generated static site is written to `build/`. Deploy that directory with any static hosting provider or web server. Configure the host to serve `index.html` for unknown application routes so direct visits to SPA paths continue to work.
