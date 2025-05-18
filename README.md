
# Spell CRM

A mini content management system that enables user login and blog content management.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [API Mocking with JSON Server](#api-mocking-with-json-server)
- [Available Scripts](#available-scripts)
- [Features](#features)
- [Testing](#testing)
- [Screenshots](#screenshots)

## Overview

This is a React application with TypeScript, Tailwind CSS, and Vite. It uses JSON Server to mock API endpoints during development.

## Prerequisites

- Node.js
- npm

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/PRASUN-SITAULA/spell-cms.git
   cd spell-cms
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
VITE_API_BASE_URL=http://localhost:3000
```


## Development

To start the development server:

```bash
npm run dev
```


## API Mocking with JSON Server

This project uses [JSON Server](https://github.com/typicode/json-server) to mock API endpoints during development.

To start the JSON Server:

```bash
npx json-server --watch db.json --port 3000
```


## Available Scripts

- `npm run dev` - Starts the vite development server
- `npm run build` - Builds the app for production
- `npm test` - Runs the test suite with Jest
- `npm run lint` - Runs ESLint
- `npm run format` - Runs Prettier
- `npm run lint-staged` - Runs lint-staged
- `npm run prepare` - Runs husky precommit

## Features

### Authentication
- Secure mock authentication system with JWT tokens stored in local storage
- Auth State management via Zustand for persistent auth state across sessions
- Protected routes with authentication guards for unauthorized access prevention
- User session persistence between browser sessions

#### Credentials for mock login
- email: mock@example.com
- password: password123

### Blog Post Management

- Complete CRUD functionality for blog posts
- Advanced filtering capabilities:
  - Search by title
  - Filter by tags
  - Filter by status (Draft/Published)
  - Filter by categories

- Status selection during creation (Draft by default)
- Category selection via dropdown menu
- Author assignment via dropdown menu

### Author Management
- Complete CRUD operations for managing blog authors
- Author profiles linked to associated blog posts

### Category Management
- Complete CRUD operations for blog categories
- Categories available for selection when creating/editing posts

## Testing
Tests for the category creation form, covering successful submissions and validation.

## Screenshots
![Image](https://github.com/user-attachments/assets/cac6abb4-31ba-4da0-ad60-28a0f0158999)
![Image](https://github.com/user-attachments/assets/b4c2e962-79e7-41af-b009-05556936e4d7)
![Image](https://github.com/user-attachments/assets/e69a0d1d-4333-47de-9e7b-99b766771f0b)
![Image](https://github.com/user-attachments/assets/4359f9f7-cbdc-4864-bcf0-aa142f4e9673)
![Image](https://github.com/user-attachments/assets/0fc621c8-5ce5-4adf-a4e8-c7b97f33768c)
![Image](https://github.com/user-attachments/assets/b14ce252-5825-4b1b-a7f1-8bdeced2610f)
