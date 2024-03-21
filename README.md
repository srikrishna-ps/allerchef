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
```
allerchef-1/
├── public/                  # Static public assets (favicon, robots.txt, etc.)
├── src/                     # Main source code
│   ├── assets/              # Images and static assets (e.g., logo, hero image)
│   ├── components/          # Reusable React components
│   │   ├── layout/          # Layout components (Header, Footer, Layout)
│   │   └── ui/              # UI components (buttons, dialogs, forms, etc.)
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions and helpers
│   ├── pages/               # Top-level route pages
│   │   ├── About.tsx            # About page
│   │   ├── Auth.tsx             # Authentication modal/page (login/signup)
│   │   ├── Blogs.tsx            # Blogs listing page
│   │   ├── Dieticians.tsx       # Dietician profiles and filters
│   │   ├── ForgotPassword.tsx   # Password reset page
│   │   ├── Home.tsx             # Home/landing page
│   │   ├── Index.tsx            # Fallback index page
│   │   ├── NotFound.tsx         # 404 Not Found page
│   │   ├── RecipeDetail.tsx     # Detailed recipe view
│   │   ├── Recipes.tsx          # Recipe discovery and listing
│   │   └── Saved.tsx            # User's saved recipes
│   ├── App.tsx              # Main App component
│   ├── App.css              # App-level CSS (optional, for custom styles)
│   ├── index.css            # Tailwind CSS entry point and custom styles
│   ├── main.tsx             # React app entry point
│   └── vite-env.d.ts        # Vite/TypeScript environment types
├── index.html               # Main HTML entry point
├── tailwind.config.ts       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── package.json             # Project metadata and dependencies
├── tsconfig.json            # TypeScript base configuration
├── tsconfig.app.json        # TypeScript config for app source
├── tsconfig.node.json       # TypeScript config for Node.js scripts
├── vite.config.ts           # Vite build tool configuration
├── README.md                # Project documentation
└── .gitignore               # Git ignore rules
```

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

This project is developed and maintained by SriKrishna Pejathaya P S