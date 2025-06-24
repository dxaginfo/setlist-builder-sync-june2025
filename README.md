# Setlist Builder + Sync

A comprehensive web application for musicians and bands to create, manage, and synchronize setlists across team members. Streamline your performance preparation with collaborative setlist management, real-time syncing, and performance mode features.

## Features

- **Setlist Management**: Create, edit, and organize setlists with drag-and-drop functionality
- **Song Library**: Maintain a database of your songs with details like key, tempo, and duration
- **Band Collaboration**: Share setlists with band members and collaborate in real-time
- **Performance Mode**: Distraction-free view with auto-scrolling and night mode for live performances
- **Version History**: Track changes to setlists with full version history
- **Sync Across Devices**: Access your setlists on any device with real-time synchronization
- **Export Options**: Export setlists as PDF, text, or share via link
- **Notes & Annotations**: Add performance notes, reminders, and annotations to songs and setlists
- **Set Time Calculator**: Automatically calculate set duration based on song lengths
- **Offline Support**: Access and edit setlists even without internet connection

## Tech Stack

### Frontend
- React with TypeScript
- Redux Toolkit for state management
- Material UI for component library
- Socket.io for real-time updates
- PWA (Progressive Web App) for offline functionality

### Backend
- Node.js with Express
- PostgreSQL database with Sequelize ORM
- Redis for caching and session management
- Socket.io for real-time communication
- JWT for authentication

### DevOps
- Docker for containerization
- GitHub Actions for CI/CD
- AWS S3 for file storage
- Elasticsearch for search functionality

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Docker and Docker Compose (for containerized setup)
- PostgreSQL (if running locally without Docker)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dxaginfo/setlist-builder-sync-june2025.git
   cd setlist-builder-sync-june2025
   ```

2. Set up environment variables:
   ```bash
   cp client/.env.example client/.env
   cp server/.env.example server/.env
   ```
   Update the environment files with your configuration.

3. Run with Docker (recommended):
   ```bash
   docker-compose up
   ```

4. Or install and run locally:
   ```bash
   # Install and start backend
   cd server
   npm install
   npm run dev

   # In a new terminal, install and start frontend
   cd client
   npm install
   npm start
   ```

5. The application will be available at:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## API Documentation

API documentation is available at `/api/docs` when the server is running, powered by Swagger.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Material UI](https://mui.com/)
- [Sequelize](https://sequelize.org/)
- [Socket.io](https://socket.io/)