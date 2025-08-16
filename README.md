# 🎁 GitHub Wrapped Visualizer

A modern web application built with **React**, **TypeScript**, and **Tailwind CSS** that generates a personalized "GitHub Wrapped" experience for any user. This tool provides an elegant and animated visualization of your coding journey, showcasing key statistics and milestones.

-----

## ✨ Features

  - **Interactive Dashboard:** The core of the application is a beautifully designed, slide-based visualizer that presents your GitHub statistics in an engaging and easy-to-digest format.
  - **Key Metrics:** Get an overview of your development year with a display of your total repositories, total stars, most-used programming language, and estimated commits.
  - **Elegant UI/UX:** The user interface is crafted with a modern aesthetic, featuring glassmorphism effects, dynamic particle animations, and shimmering text to create a premium feel.
  - **Developer-Friendly:** Built on a modular, component-based architecture with strong TypeScript support, making the codebase clean, extensible, and easy to maintain.

-----

## 🛠️ Tech Stack

| Category | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | React | 18.3.1 | Core UI library for building the application's user interface. |
| **Language** | TypeScript | 5.5.3 | Provides type safety and enhances developer experience. |
| **Build Tool** | Vite | 5.4.1 | A fast, modern development server and bundler. |
| **Styling** | Tailwind CSS | 3.4.17 | A utility-first CSS framework used for responsive and modern styling. |
| | `shadcn-ui`| N/A | A collection of accessible and customizable components built with Radix UI and Tailwind CSS. |
| | `class-variance-authority`| 0.7.1| A utility for composing Tailwind classes dynamically. |
| **Routing** | `react-router-dom`| 6.26.2 | Handles client-side routing for seamless page navigation. |
| **Data Fetching** | `@tanstack/react-query`| 5.56.2 | Manages asynchronous state, server caching, and data synchronization. |
| **Animations** | `tailwindcss-animate` | 1.0.7 | A Tailwind plugin that provides ready-to-use CSS animations. |

-----

## 📂 Getting Started

To get a local copy of this project running on your machine, follow these simple steps.

### Prerequisites

Before you begin, ensure you have the following software installed:

  - `Node.js` (version 18 or higher)
  - `npm` or `yarn` or `pnpm`

### Installation

1.  Clone the repository from GitHub:
    ```bash
    git clone https://github.com/shaista45/gitwrap-visualizer.git
    cd gitwrap-visualizer
    ```
2.  Install the project dependencies:
    ```bash
    npm install
    ```

### Running the Project

To start the development server and view the app in your browser:

```bash
npm run dev
```

The application will be available at `http://localhost:5173/` (or another port if specified by Vite).

### Build for Production

To create an optimized production-ready build of the application:

```bash
npm run build
```

This command generates the static files in the `dist` directory, which can then be deployed.

-----

## 📝 Customization

  - **Components**: All custom UI components are located in `src/components/`, with Shadcn UI components found in `src/components/ui/`.
  - **Styling & Animations**: Core styles, custom animations, and CSS variables are defined in `src/index.css`. The Tailwind configuration is in `tailwind.config.ts`.
  - **Routing**: The main application routing is managed in `src/App.tsx`.

-----

## 🚀 Deployment

This is a static web application and can be easily deployed to any static hosting service like Vercel, Netlify, or GitHub Pages.

1.  Run the production build: `npm run build`
2.  Upload the contents of the generated `dist` folder to your hosting provider.

-----

## 📜 License

This project is licensed under the MIT License.
