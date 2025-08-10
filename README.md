# npascu-website-latest

Personal website for [Norbert Pascu](https://pascu.io). This repository contains a modern React and TypeScript application powered by Vite and Tailwind CSS. It serves as a boilerplate for building web apps with state management, routing, translations and API integrations.

## Table of Contents
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [API Services](#api-services)
- [Browser Support](#browser-support)
- [Key Dependencies](#key-dependencies)

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```
2. Run the development server:
   ```bash
   npm start
   ```
3. Build for production:
   ```bash
   npm run build
   ```
4. Run tests:
   ```bash
   npm test
   ```

## Available Scripts
- `npm start` – start the Vite development server.
- `npm run build` – type-check and build the app for production.
- `npm run preview` – preview the production build locally.
- `npm test` – run unit tests with Vitest.
- `npm run test:watch` – watch mode for tests.
- `npm run test:coverage` – generate a test coverage report.

## Project Structure
```
src/
  components/        # Reusable UI components
  pages/             # Route views
  services/          # REST API wrappers (GitHub, email)
  store/             # Redux Toolkit store
  hooks/             # Custom hooks
  i18n.ts            # Internationalisation setup
  router/            # Application routes
```

## API Services
API calls are centralised under `src/services`.

- `AppService` communicates with the [GitHub REST API](https://docs.github.com/en/rest). Set `REACT_APP_SECRET` in your environment to authorise requests.
- `EmailService` posts contact form data to an endpoint defined by `VITE_EMAIL_API`.

Both services extend `RestService`, which wraps `axios` for `get`, `post`, `patch` and `delete` helpers.

## Browser Support
- **Production** – modern browsers with >0.2% global usage.
- **Development** – last Chrome, Firefox and Safari versions.

## Key Dependencies
- [React](https://react.dev/) & [React DOM](https://react.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [Vitest](https://vitest.dev/)
- [i18next](https://www.i18next.com/)
- [axios](https://axios-http.com/)

---

Happy coding!
