
# React App with JSON Server

This repository contains task for spell CRM.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [API Mocking with JSON Server](#api-mocking-with-json-server)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

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
npm start
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
