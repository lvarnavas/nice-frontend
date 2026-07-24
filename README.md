# Nice — Frontend

React client for **Nice**, an ice warehouse management system. It provides the
daily workflow for warehouse staff: recording vehicle loads, returns and
destructions, tracking stock, and generating PDF reports.

This is the client component. The Express API lives in
[nice-backend](https://github.com/lvarnavas/nice-backend) and must be running
for the app to function.

---

## Tech stack

| Concern        | Choice                    |
| -------------- | ------------------------- |
| Framework      | React 18                  |
| Build tooling  | Create React App          |
| Routing        | React Router 5            |
| HTTP client    | Axios                     |
| Dates          | date-fns, moment          |
| PDF generation | jsPDF, pdfmake            |
| Authentication | JWT held in React context |

---

## Prerequisites

- Node.js 22 or later (`.nvmrc` is provided — run `nvm use`)
- npm 10 or later
- A running instance of [nice-backend](https://github.com/lvarnavas/nice-backend)

---

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/lvarnavas/nice-frontend.git
cd nice-frontend
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.development
```

| Variable                | Required | Description                 |
| ----------------------- | -------- | --------------------------- |
| `REACT_APP_BACKEND_URL` | yes      | Base URL of the backend API |

Create React App only exposes variables prefixed with `REACT_APP_`, and it
inlines them into the bundle at build time. **Everything in these files is
publicly visible in the shipped JavaScript — never put secrets in them.**

Create React App reads `.env.development` for `npm start` and `.env.production`
for `npm run build`.

### 3. Run the development server

```bash
npm start
```

The app runs at `http://localhost:3000` and expects the API at the URL
configured above.

---

## Available scripts

| Command         | Description                                       |
| --------------- | ------------------------------------------------- |
| `npm start`     | Start the development server with hot reloading    |
| `npm test`      | Run tests in watch mode                            |
| `npm run build` | Produce an optimised production build in `build/`  |

---

## Application routes

Unauthenticated visitors can only reach `/auth`. Once a token is held, the
following routes become available:

| Route                                        | Purpose                               |
| -------------------------------------------- | ------------------------------------- |
| `/warehouse-status`                          | Current stock levels                  |
| `/loads/single-car-loads`                    | Loads for one vehicle                 |
| `/loads/total-car-loads`                     | Loads across all vehicles             |
| `/returns/single-car-returns`                | Returns for one vehicle               |
| `/returns/total-car-returns`                 | Returns across all vehicles           |
| `/destructions/single-car-destructions`      | Destructions for one vehicle          |
| `/destructions/total-car-destructions`       | Destructions across all vehicles      |
| `/destructions/total-warehouse-destructions` | Warehouse destructions                |
| `/addentry`                                  | Record a new daily entry              |
| `/edit-quantities`                           | Amend quantities on an existing entry |
| `/search`                                    | Search past entries                   |
| `/report`                                    | Generate a single-day PDF report      |
| `/report-range`                              | Generate a date-range PDF report      |
| `/view-all-reports`                          | Browse previously generated reports   |

---

## Project structure

```
src/
  products/    Stock, loads, returns and destruction pages and components
  reports/     Report browsing pages
  users/       Authentication pages
  shared/      Navigation, form elements, UI primitives, hooks, utilities
  App.js       Route definitions and auth context provider
```

---

## Deployment

```bash
cp .env.example .env.production   # point REACT_APP_BACKEND_URL at the live API
npm run build
```

The contents of `build/` are static files that can be served by any web server.
In the current deployment they are served by the backend from its `public/`
directory.

---

## Contributing

Branching model, commit conventions and the pull request process are documented
in [CONTRIBUTING.md](CONTRIBUTING.md).

---

## License

Released under the [MIT License](LICENSE).
