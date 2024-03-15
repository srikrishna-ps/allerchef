# AllerChef

AllerChef is a modern web application for discovering, saving, and managing allergy-friendly recipes. It features authentication, recipe detail pages, dietician profiles, and a responsive, accessible UI built with React, TypeScript, and Tailwind CSS.

## Features
- User authentication (sign up, login, logout, delete account)
- Recipe discovery with filtering by allergens and nutrients
- Detailed recipe pages with ingredients, instructions, and nutrition info
- Save and manage favorite recipes
- Dietician profiles with specialization filters
- Responsive, accessible design with modern UI components

## Tech Stack
- React 18
- TypeScript
- Vite
- Tailwind CSS (with shadcn-ui components)
- Radix UI (for accessible dialogs, menus, etc.)

## Getting Started

### Prerequisites
- Node.js (v18 or newer recommended)
- npm (v9 or newer)

### Installation
1. Clone the repository:
   ```sh
   git clone <REPO_URL>
   cd allerchef-1
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
   The app will be available at http://localhost:8080 (or the port shown in your terminal).

### Build for Production
To build the app for production:
```sh
npm run build
```
The output will be in the `dist/` directory.

To preview the production build locally:
```sh
npm run preview
```

## Project Structure
- `src/` - Main source code
  - `components/` - Reusable UI and layout components
  - `pages/` - Top-level pages (Home, Recipes, Dieticians, Auth, etc.)
  - `hooks/` - Custom React hooks
  - `lib/` - Utility functions
  - `assets/` - Images and static assets
- `public/` - Static files
- `index.html` - Main HTML entry point
- `tailwind.config.ts` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration

## Troubleshooting Tailwind CSS / PostCSS
- Ensure `src/index.css` is imported in your main entry file (e.g., `main.tsx`).
- Only use `@tailwind` and `@apply` in CSS files processed by Tailwind (e.g., `src/index.css`).
- If you see errors like `unknown at rule @tailwind` or `@apply`, make sure you are running the app with Vite (`npm run dev`) and that your dependencies are installed.
- If issues persist, try deleting `node_modules` and reinstalling:
  ```sh
  rm -rf node_modules
  npm install
  ```

## License

[Specify your license here]