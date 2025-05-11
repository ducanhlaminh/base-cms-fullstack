# Base CMS Frontend

A React-based frontend for the Base CMS project.

## Features

- React with Vite for fast development and building
- Redux for state management
- Ant Design for UI components
- Dynamic menu system
- Authentication with JWT
- Axios for API communication
- Custom hooks for API calls
- Protected routes

## Project Structure

```
client/
├── public/             # Static assets
├── src/
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # Reusable components
│   ├── hooks/          # Custom React hooks
│   ├── layouts/        # Layout components
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── store/          # Redux store
│   │   ├── actions/    # Redux actions
│   │   └── reducers/   # Redux reducers
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main App component
│   ├── index.css       # Global styles
│   └── main.jsx        # Entry point
├── index.html          # HTML template
├── package.json        # Project dependencies
└── vite.config.js      # Vite configuration
```

## Getting Started

1. Install dependencies:

```bash
npm install
# or
yarn
```

2. Start the development server:

```bash
npm run dev
# or
yarn dev
```

3. Build for production:

```bash
npm run build
# or
yarn build
```

## Backend API

This frontend connects to a Node.js/Express backend API. Ensure the backend server is running at the URL configured in the API service.

## Authentication

The authentication system uses JWT tokens stored in localStorage. Login credentials are sent to the `/api/auth/login` endpoint, and the received token is stored for subsequent API calls.
