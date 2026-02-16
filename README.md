# Multi-Tenant Task Management System - Frontend

The frontend application for the Multi-Tenant Task Management System, built with React, TypeScript, and Vite.

## 🛠 Tech Stack

- **Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Vanilla CSS
- **Routing:** React Router DOM
- **HTTP Client:** Axios

## 📦 Prerequisites

- Node.js (v14+ recommended)
- npm or yarn

## 🔧 Setup & Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd multi-tenant-tasks-front
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

> **Note:** Ensure this URL points to your running backend server.

### 4. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## 🏗 Build for Production

To create a production build:

```bash
npm run build
```

The output will be in the `dist` directory.

## 📂 Project Structure

- `src/api`: API integration modules
- `src/components`: Reusable UI components (Modals, etc.)
- `src/context`: React Context (AuthContext)
- `src/pages`: Main application pages (Dashboard, ProjectDetails, Login, Register)
- `src/types`: TypeScript type definitions
- `src/styles`: Global and component-specific styles
