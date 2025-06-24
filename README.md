# Setlist Builder + Sync

A web application for musicians to create, manage, and synchronize setlists across devices with real-time collaboration features.

## Project Overview

Setlist Builder + Sync is designed to help musicians and bands:

- Create and organize setlists for performances and rehearsals
- Store song information, lyrics, and chord charts
- Collaborate with band members in real-time
- Use a distraction-free performance mode with auto-scrolling
- Export and share setlists with venue staff
- Track setlist history and changes over time

## Features

- **Setlist Management**: Create, edit, and organize multiple setlists
- **Song Library**: Maintain a comprehensive library of songs with metadata
- **Real-time Collaboration**: Share and edit setlists with band members simultaneously
- **Performance Mode**: Distraction-free interface with auto-scrolling and quick navigation
- **Export Options**: Share and print setlists in various formats
- **Version History**: Track changes and revert to previous versions

## Technology Stack

### Frontend
- React.js with TypeScript
- Redux Toolkit for state management
- Material-UI components
- Socket.io client for real-time updates
- Styled-components for responsive design

### Backend
- Node.js with Express
- RESTful API with GraphQL support
- Socket.io for real-time communication
- JWT authentication with OAuth 2.0
- AWS S3 for file storage

### Database
- PostgreSQL for structured data
- Redis for caching and performance
- Elasticsearch for search functionality

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- PostgreSQL (v14 or higher)
- Redis (v6 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dxaginfo/setlist-builder-sync-june2025.git
   cd setlist-builder-sync-june2025
   ```

2. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../client
   npm install
   ```

4. Set up environment variables:
   - Create `.env` files in both `client` and `server` directories based on the provided templates

5. Initialize the database:
   ```bash
   cd ../server
   npm run db:migrate
   npm run db:seed
   ```

6. Start the development servers:
   ```bash
   # In server directory
   npm run dev
   
   # In client directory (separate terminal)
   npm start
   ```

## Project Structure

```
setlist-builder-sync/
├── client/               # Frontend React application
│   ├── public/           # Static files
│   └── src/              # React source code
│       ├── components/   # UI components
│       ├── pages/        # Page components
│       ├── store/        # Redux state management
│       ├── services/     # API services
│       └── utils/        # Utility functions
│
├── server/               # Backend Node.js application
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── middleware/       # Express middleware
│   └── utils/            # Utility functions
│
└── docs/                 # Documentation
```

## Deployment

The application can be deployed using Docker:

```bash
docker-compose up -d
```

For production deployment, follow the detailed instructions in the deployment guide.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please open an issue in the GitHub repository.