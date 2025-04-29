# 🎵 CPT202 Music Platform Frontend

<p align="center">
  <img src="src/assets/logo.png" alt="CPT202 Music Platform Logo" width="200" height="auto">
</p>

<p align="center">
  <a href="#overview">Overview</a> •
  <a href="#features">Features</a> •
  <a href="#technology-stack">Technology Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#user-interface">User Interface</a> •
  <a href="#api-integration">API Integration</a> •
  <a href="#contributing">Contributing</a>
</p>

## 📋 Overview

The CPT202 Music Platform is a comprehensive web application for music enthusiasts, offering music sharing, discovery, playback, and management capabilities. This repository contains the frontend codebase built with modern web technologies.

The platform enables users to:
- 🎧 Discover and explore music from various genres
- 📤 Upload their own music creations
- 👥 Manage their profile and view upload status
- 📝 Create and manage playlists
- 🔍 Search for music by name, artist, or category
- 🌐 Access the platform in multiple languages

## ✨ Features

### 🔐 User Authentication & Management
- Secure login and registration system
- JWT-based authentication
- Profile customization options
- User preference settings
- Persistent login sessions
- Password recovery functionality

### 🎵 Music Management
- **Music Discovery**:
  - Browse trending and popular music
  - Explore music by categories and genres
  - Personalized recommendations based on listening history

- **Music Upload**:
  - Support for multiple audio formats (MP3, WAV, FLAC, etc.)
  - Cover art upload and management
  - Detailed metadata editing (title, artist, album, genre)
  - Upload progress tracking

- **Playback Experience**:
  - Responsive audio player with visualization
  - Continuous playback across page navigation
  - Customizable playback settings (quality, autoplay)
  - Offline listening capabilities

### 📊 User Upload Status Dashboard
The user upload status page (`pages/user/UserUploadStatus.vue`) provides a comprehensive interface for managing uploaded content:

- **Status Monitoring**:
  - Real-time status updates (pending, approved, rejected)
  - Detailed rejection reasons for improved resubmission
  - Visual indicators with color-coding for quick status assessment

- **Content Management**:
  - Advanced filtering options by name, category, and status
  - Bulk and individual deletion options
  - Preview functionality for uploaded content
  - Direct playback of approved music

- **Analytics**:
  - View counts and engagement metrics
  - Upload history timeline
  - Performance statistics

### 👨‍💼 Admin Features
- **Content Moderation**:
  - Review queue for new uploads
  - Content approval/rejection with feedback
  - Content flagging and reporting system

- **User Management**:
  - User activity monitoring
  - Account status management
  - Permission and role assignment

- **System Administration**:
  - Site settings configuration
  - Analytics and reporting dashboard
  - Content category management

## 🛠️ Technology Stack

<p align="center">
  <img src="https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue.js">
  <img src="https://img.shields.io/badge/TypeScript-4.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Ant_Design_Vue-4.x-0170FE?style=for-the-badge&logo=ant-design&logoColor=white" alt="Ant Design">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Pinia-2.x-FFD859?style=for-the-badge&logo=pinia&logoColor=black" alt="Pinia">
</p>

- **Core Framework**: Vue 3 with Composition API
- **Type Safety**: TypeScript for enhanced development experience
- **UI Components**: Ant Design Vue for consistent design patterns
- **Styling**: Tailwind CSS for utility-first styling approach
- **State Management**: Pinia for reactive, modular state management
- **Internationalization**: Vue I18n for multilingual support
- **HTTP Client**: Axios for API communication
- **Date Management**: Day.js for lightweight date manipulation
- **Build System**: Vite for fast development and optimized builds
- **Testing**: Jest for unit and component testing

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher) or yarn (v1.22.0 or higher)
- Git

### Environment Setup

```bash
# Clone the repository
git clone https://github.com/your-username/CPT202_frontend.git

# Navigate to the project directory
cd CPT202_frontend

# Create environment file from template
cp .env.example .env

# Edit the .env file with your backend API endpoint
# VITE_API_BASE_URL=http://localhost:8080/api
```

### Installation

```bash
# Install dependencies
npm install
# or
yarn install
```

### Development

```bash
# Start the development server
npm run dev
# or
yarn dev

# The application will be available at http://localhost:5173
```

### Testing

```bash
# Run unit tests
npm run test
# or
yarn test

# Run e2e tests
npm run test:e2e
# or
yarn test:e2e
```

### Building for Production

```bash
# Build the project
npm run build
# or
yarn build

# Preview the production build
npm run preview
# or
yarn preview
```

## 📁 Project Structure

```
CPT202_frontend/
├── public/                 # Static assets served as-is
│   ├── favicon.ico        # Site favicon
│   └── default-cover.png  # Default music cover image
├── src/
│   ├── api/                # API service layer
│   │   ├── authController.ts    # Authentication API services
│   │   ├── musicFileController.ts # Music file API services
│   │   ├── userController.ts    # User API services
│   │   └── axiosInstance.ts     # Axios configuration
│   ├── assets/             # Project assets
│   │   ├── images/         # Image resources
│   │   ├── styles/         # Global SCSS files
│   │   └── logo.png        # Application logo
│   ├── components/         # Reusable components
│   │   ├── common/         # Common UI components
│   │   │   ├── Header.vue  # Site header
│   │   │   └── Footer.vue  # Site footer
│   │   └── ui/             # Custom UI components
│   │       ├── MusicPlayer.vue # Music player component
│   │       └── interactive-hover-button/ # Custom button component
│   ├── layouts/            # Page layouts
│   │   ├── MainLayout.vue  # Main application layout
│   │   └── AdminLayout.vue # Admin panel layout
│   ├── pages/              # Page components
│   │   ├── admin/          # Admin-related pages
│   │   │   ├── Dashboard.vue # Admin dashboard
│   │   │   └── MusicReview.vue # Music review page
│   │   ├── music/          # Music-related pages
│   │   │   ├── MusicExplore.vue # Music discovery page
│   │   │   └── MusicUpload.vue # Music upload page
│   │   └── user/           # User-related pages
│   │       ├── UserProfile.vue # User profile page
│   │       └── UserUploadStatus.vue # Upload status page
│   ├── router/             # Vue Router configuration
│   │   └── index.ts        # Route definitions
│   ├── stores/             # Pinia stores
│   │   ├── useLoginUserStore.ts # User authentication store
│   │   └── useMusicStore.ts # Music state store
│   ├── utils/              # Utility functions
│   │   ├── audioPlayerStore.ts # Audio player state management
│   │   ├── formatters.ts   # Data formatting utilities
│   │   └── validators.ts   # Form validation utilities
│   ├── App.vue             # Root component
│   └── main.ts             # Application entry point
├── .env                    # Environment variables
├── .env.example            # Environment variables template
├── index.html              # HTML entry point
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── package.json            # Dependencies and scripts
```

## 🖼️ User Interface

The CPT202 Music Platform features a modern, responsive UI designed for optimal user experience:

### 🎨 Design System
- **Consistent Color Scheme**: Visual hierarchy with primary, secondary, and accent colors
- **Typography**: Legible font choices with responsive sizing
- **Component Library**: Extended Ant Design Vue components with custom styling
- **Responsive Layout**: Mobile-first approach ensuring compatibility across devices

### 📱 Key Screens
- **Home Dashboard**: Personalized music recommendations and recent activity
- **Music Explorer**: Interactive browsing experience with filtering options
- **Upload Interface**: Streamlined upload process with drag-and-drop support
- **User Profile**: Customizable user preferences and activity history
- **Upload Status**: Comprehensive view of content status with management tools

## 🔌 API Integration

The frontend communicates with the backend through RESTful API endpoints:

### 🎵 Music Management
- `GET /api/music/file/list`: Retrieves music files with pagination and filtering
- `POST /api/music/file/page`: Retrieves paginated user uploads with detailed status
- `POST /api/music/file/delete`: Deletes music files
- `GET /api/music/file/tag/category`: Gets music categories
- `POST /api/music/file/upload`: Uploads new music files

### 👤 User Management
- `POST /api/user/login`: User authentication
- `POST /api/user/register`: New user registration
- `GET /api/user/current`: Retrieves current user information
- `POST /api/user/update`: Updates user profile information

### 🔊 Audio Player

The application includes a sophisticated audio player implementation:
- Global playback state managed through reactive Pinia store
- Background playback continuing across page navigation
- Advanced controls including play/pause, seek, and volume
- Audio visualization components for enhanced experience
- Playlist queue management with shuffle and repeat options

### 🌐 Internationalization

The platform supports multiple languages for global accessibility:
- Easy language switching through the UI
- Translation keys for all user-facing text
- Localized date and time formatting
- RTL (Right-to-Left) support for compatible languages
- Automatic language detection based on browser settings

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Development Workflow

1. Fork the repository and create your branch from `main`
2. Clone your fork and add the upstream remote:
   ```bash
   git clone https://github.com/your-username/CPT202_frontend.git
   cd CPT202_frontend
   git remote add upstream https://github.com/original-owner/CPT202_frontend.git
   ```
3. Install dependencies: `npm install`
4. Create a branch for your feature: `git checkout -b feature/amazing-feature`
5. Make your changes and commit them: `git commit -m 'Add some amazing feature'`
6. Push to your branch: `git push origin feature/amazing-feature`
7. Open a Pull Request against the `main` branch

### Coding Standards

- Follow the existing code style and structure
- Write clear, documented code with appropriate comments
- Include unit tests for new features
- Ensure your code passes all existing tests

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Vue.js](https://vuejs.org/) - The Progressive JavaScript Framework
- [Ant Design Vue](https://antdv.com/) - An enterprise-class UI components
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Pinia](https://pinia.vuejs.org/) - The Vue Store that you will enjoy using
- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
