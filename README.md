# TimeForge

A professional time tracking application built with Nuxt.js that helps you manage work hours, mileage, and calculate expected payouts.

## Features

- 📊 Time Tracking Dashboard
- 🚗 Mileage Tracker
- 💰 Payout Calculations (Daily, Weekly, Monthly)
- 👤 Customizable User Profiles
- ⚙️ Comprehensive Settings

## Tech Stack

- Frontend: Nuxt.js 2.x with Vuetify
- Backend: Strapi Headless CMS
- Authentication: @nuxtjs/auth
- Styling: Vuetify Material Design Framework

## Prerequisites

- Node.js (v14 or later recommended)
- npm or yarn package manager
- Docker (optional, for containerized Strapi)

## Setup Instructions

### 1. Frontend Setup (TimeForge)

```bash
# Clone the repository
git clone https://github.com/yourusername/timeforge.git
cd timeforge

# Install dependencies (using npm)
npm install --legacy-peer-deps

# OR if using yarn
yarn install --legacy-peer-deps

# Create .env file
cp .env.example .env
```

### 2. Environment Configuration

Create a `.env` file in the root directory with the following content:

```
# Development
API_AUTH_URL=http://localhost:1337
NODE_ENV=development

# Production (update when deploying)
# API_AUTH_URL=https://your-strapi-instance.com
```

### 3. Strapi Backend Setup

```bash
# Create a new Strapi project
npx create-strapi-app@latest timeforge-backend --quickstart

# Once Strapi is running, create an admin account at:
# http://localhost:1337/admin
```

#### Required Strapi Configuration:

1. Create Content Types:

   - TimeEntry

     - date (datetime)
     - startTime (time)
     - endTime (time)
     - description (text)
     - user (relation to User)

   - MileageEntry
     - date (date)
     - miles (decimal)
     - description (text)
     - user (relation to User)

2. Configure Permissions:
   - Go to Settings → Users & Permissions Plugin → Roles
   - Edit the Authenticated role
   - Enable necessary CRUD operations for TimeEntry and MileageEntry

### 4. Running the Application

#### Development Mode

```bash
# Start Strapi backend (in timeforge-backend directory)
npm run develop
# or yarn develop

# Start Nuxt frontend (in main project directory)
npm run dev
# or yarn dev
```

The application will be available at: http://localhost:3000

#### Production Build

```bash
# Generate static files
npm run generate
# or yarn generate

# Serve the static files
npm run start
# or yarn start
```

## Deployment Options

### Frontend Deployment

You can deploy the static frontend to:

- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

### Backend Deployment

For Strapi, you can:

- Use a Platform-as-a-Service (PaaS) like Heroku
- Deploy to a VPS
- Use managed services like DigitalOcean App Platform

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with Nuxt.js
- Styled with Vuetify
- Powered by Strapi CMS
