# Student Collaboration Hub

A comprehensive platform for students to collaborate, share study materials, and manage their academic resources. Built with React frontend and Node.js/MongoDB backend.

## Features

### 🔐 Authentication
- User registration and login with JWT
- Secure password hashing with bcrypt
- Protected routes and middleware
- User profile management

### 📚 Library Management
- Upload and share study materials (files, links, notes)
- Advanced search and filtering
- File download tracking
- Rating system
- Tags and categorization
- Department-based organization

### 👤 User Profiles
- Editable profile information
- Profile picture upload
- Department and year tracking
- Bio and personal information

### 🎨 Modern UI/UX
- Material-UI components
- Dark/Light mode toggle
- Responsive design
- Interactive dialogs and forms
- Real-time search highlighting

## Tech Stack

### Frontend
- **React 19** - UI framework
- **Material-UI** - Component library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin support

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd Student-collaboration-hub
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `config.env` file in the backend directory:
```env
MONGO_URI=mongodb://localhost:27017/student-collaboration-hub
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

Start the backend server:
```bash
npm run dev
```

The backend will be running on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd Student-collaboration-hub
npm install
```

Start the development server:
```bash
npm run dev
```

The frontend will be running on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Library
- `GET /api/library` - Get all materials (with filters)
- `GET /api/library/my-items` - Get user's materials
- `GET /api/library/:id` - Get specific material
- `POST /api/library` - Create new material
- `PUT /api/library/:id` - Update material
- `DELETE /api/library/:id` - Delete material
- `POST /api/library/:id/download` - Download material
- `POST /api/library/:id/rate` - Rate material

### Health Check
- `GET /api/health` - API health status

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  department: String,
  bio: String,
  profilePicture: String,
  year: Number,
  isOnline: Boolean,
  lastSeen: Date,
  timestamps: true
}
```

### LibraryItem Model
```javascript
{
  title: String,
  description: String,
  type: String (file/link/note),
  fileData: String,
  fileName: String,
  fileSize: Number,
  linkUrl: String,
  tags: [String],
  department: String,
  subject: String,
  uploadedBy: ObjectId (ref: User),
  downloads: Number,
  isPublic: Boolean,
  rating: Number,
  ratingCount: Number,
  timestamps: true
}
```

## Environment Variables

### Backend (.env)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)

## Development

### Backend Development
```bash
cd backend
npm run dev  # Start with nodemon
npm start    # Start production server
```

### Frontend Development
```bash
cd Student-collaboration-hub
npm run dev  # Start development server
npm run build  # Build for production
npm run preview  # Preview production build
```

## Deployment

### Backend Deployment
1. Set up MongoDB (Atlas recommended for production)
2. Configure environment variables
3. Deploy to your preferred platform (Heroku, Vercel, etc.)

### Frontend Deployment
1. Update API base URL in `src/services/api.js`
2. Build the project: `npm run build`
3. Deploy the `dist` folder to your hosting platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository. "# Student_Collab_Hub" 
"# Student_Collab_Hub" 
"# Student_Collab_Hub" 
"# SCH-app" 
"# SCH-app" 
"# SCH-app" 
"# SCH-app" 
"# SCH-app-updated" 
