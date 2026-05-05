# Farmaid-AI : Combining Predictive Analytics for Crop Selection with Deep Learning for Disease Detection.

> **An intelligent AI-powered agricultural advisory system for crop recommendation and disease detection**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.8+-blue?logo=python)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18+-blue?logo=react)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

## Overview

FarmAid AI is a comprehensive agricultural technology platform designed to help farmers make data-driven decisions about crop selection and disease management. The system combines machine learning models with an intuitive web interface to provide personalized crop recommendations and disease detection capabilities.

## Key Features

- **🌾 Crop Recommendation System**
  - AI-powered crop suggestions based on soil conditions, climate, and location
  - Data-driven recommendations using Random Forest algorithms
  - Seasonal and environmental factor analysis

- **🔍 Disease Detection**
  - CNN-based plant disease identification from leaf images
  - Real-time disease detection using OCR and image processing
  - Comprehensive disease information and treatment suggestions

- **👨‍🌾 Farmer Management Dashboard**
  - User-friendly interface for farmers and administrators
  - Activity logging and dashboard analytics
  - Multi-language support (English, Hindi, Gujarati)

- **🌙 Dark/Light Theme Support**
  - Customizable UI themes for better accessibility
  - User preference persistence

- **📊 Admin Panel**
  - System monitoring and analytics
  - User management and permissions
  - Settings configuration

- **🔐 Secure Authentication**
  - JWT-based authentication system
  - Role-based access control (RBAC)
  - Refresh token mechanism for enhanced security

## Project Structure

```
FarmaidAI-version2/
├── ai-services/              # Python AI services
│   ├── app.py               # Main Flask application
│   ├── disease_app.py       # Disease detection service
│   ├── train.py             # Model training script
│   ├── train_crop.py        # Crop model training
│   ├── predict.py           # Prediction service
│   ├── requirements.txt      # Python dependencies
│   ├── data/                # Dataset directory
│   ├── model/               # Trained ML models
│   └── utils/               # Utility functions
│
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── app.js           # Express app configuration
│   │   ├── server.js        # Server entry point
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Request controllers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Custom middleware
│   │   └── utils/           # Utility functions
│   ├── package.json         # Node dependencies
│   └── .env                 # Environment configuration
│
└── frontend/                # React web application
    ├── src/
    │   ├── main.jsx         # Entry point
    │   ├── app/
    │   │   ├── App.jsx      # Main app component
    │   │   ├── routes.jsx   # Route definitions
    │   │   ├── api/         # API client files
    │   │   ├── components/  # Reusable components
    │   │   ├── context/     # React context providers
    │   │   ├── pages/       # Page components
    │   │   └── lib/         # Helper libraries
    │   ├── i18n/            # Internationalization
    │   └── styles/          # Global styles
    ├── package.json         # Frontend dependencies
    ├── vite.config.js       # Vite configuration
    └── index.html           # HTML template
```

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (configured)
- **Authentication**: JWT with Refresh Tokens
- **Validation**: Custom middleware for input validation

### Frontend
- **Framework**: React 18+
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Internationalization**: i18n
- **UI Components**: Custom component library

### AI/ML Services
- **Language**: Python 3.8+
- **Framework**: Flask/TensorFlow
- **ML Models**:
  - Random Forest for crop recommendation
  - CNN for disease detection
  - Label Encoders for categorical data

### Additional Technologies
- **OCR**: Image processing and text recognition
- **Job Queuing**: Background task processing
- **Logging**: Comprehensive activity logging
- **Security**: Password hashing, JWT authentication

## Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+ and pip
- MongoDB (installed and running on localhost:27017)
- Git
- Tesseract OCR (for text extraction)

### Quick Start Setup

1. **Install Tesseract OCR** (Required for AI services)
   - Windows: Download from https://github.com/UB-Mannheim/tesseract/wiki
   - Linux: `sudo apt-get install tesseract-ocr`
   - macOS: `brew install tesseract`

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Update .env with your MongoDB URI and API keys
   npm start
   ```
   Backend runs on `http://localhost:5001`

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

4. **AI Services Setup**
   ```bash
   cd ai-services
   pip install -r requirements.txt
   python app.py
   ```
   AI Services run on `http://localhost:5000`

## Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Frontend Origin
FRONTEND_ORIGIN=http://localhost:5173

# Database
MONGO_URI=mongodb://127.0.0.1:27017/farmaidai_version2
MONGO_DB_NAME=farmaid

# JWT Configuration
JWT_ACCESS_SECRET=your_access_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_EXPIRES=7d

# AI Services
FLASK_API_URL=http://localhost:5000

# Optional: For AI features
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### AI Services Configuration

AI services run on port 5000 and connect to the following model files (included in the repository):
- `model/crop_model.joblib` - Random Forest crop recommendation model
- `model/disease_model.h5` - CNN disease detection model
- `model/encoders.joblib` - Feature encoders
- `model/disease_class_indices.json` - Disease class mapping

## Usage

### Running the Full Application

The application consists of three main services that must be running simultaneously:

1. **Start Backend Server** (Terminal 1)
   ```bash
   cd backend
   npm start
   ```
   Backend API: `http://localhost:5001`

2. **Start AI Services** (Terminal 2)
   ```bash
   cd ai-services
   python app.py
   ```
   Crop Recommendation Service: `http://localhost:5000`

3. **Start Disease Detection Service** (Terminal 3 - Optional, if running separately)
   ```bash
   cd ai-services
   python disease_app.py
   ```
   Disease Detection Service runs on: `http://localhost:5000` (default) or configurable port

4. **Start Frontend Application** (Terminal 4)
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend UI: `http://localhost:5173`

### Default Admin Credentials

Use these credentials to access the admin panel:
- **Email**: `admin@farmaid.ai`
- **Password**: `admin12345`

## API Endpoints

### Authentication Endpoints (`/auth`)
- `POST /auth/register` - Register a new user account
- `POST /auth/login` - User login with email and password
- `POST /auth/refresh-token` - Refresh JWT access token
- `POST /auth/logout` - User logout

### AI Services Endpoints (`/ai`)
- `POST /ai/predict` - Crop recommendation using soil and environmental data
- `POST /ai/crop/predict` - Alternative crop prediction endpoint
- `POST /ai/crop/ocr` - Extract soil report data from image using OCR
- `POST /ai/disease/predict` - Disease detection from plant leaf image
- `POST /ai/detect-disease` - Alternative disease detection endpoint (multipart form-data)

**AI Service Request Format (Crop Prediction):**
```json
{
  "N": 90,
  "P": 40,
  "K": 40,
  "temperature": 25.5,
  "humidity": 75,
  "ph": 6.5,
  "rainfall": 200,
  "location": "Gujarat",
  "season": "Kharif"
}
```

**AI Service Request Format (Disease Detection):**
```
multipart/form-data
File field: "image" (JPG, PNG format)
```

### Dashboard Endpoints (`/dashboard`)
- `GET /dashboard` - Get user dashboard data and statistics
- `GET /dashboard/metrics` - Get system metrics and analytics

### Farmers Management Endpoints (`/farmers`)
- `GET /farmers` - List all farmers (admin only)
- `GET /farmers/:id` - Get specific farmer details
- `POST /farmers` - Create new farmer profile
- `PUT /farmers/:id` - Update farmer profile
- `DELETE /farmers/:id` - Delete farmer profile

### Admin Endpoints (`/admin`)
- `GET /admin/stats` - Get admin dashboard statistics
- `GET /admin/logs` - Get system activity logs
- `GET /admin/farmers` - List all farmers
- `PUT /admin/settings` - Update admin settings
- `GET /admin/settings` - Get current settings

### User Settings Endpoints (`/settings`)
- `GET /settings` - Get user settings
- `PUT /settings` - Update user settings and preferences

### Activity Logs Endpoints (`/logs`)
- `GET /logs` - Get activity logs
- `POST /logs` - Create activity log entry

### Location Endpoints (`/location`)
- `GET /location/list` - Get list of available locations
- `POST /location` - Add new location

For detailed API testing results, see [ENDPOINT_TEST_REPORT.md](backend/ENDPOINT_TEST_REPORT.md)

## Development

### Running in Development Mode

#### Backend Development
```bash
cd backend
npm run dev  # Uses --watch flag for hot reload
```

#### Frontend Development
```bash
cd frontend
npm run dev  # Vite development server with HMR
```

### Running Tests

```bash
cd backend
npm test
```

### Database Seeding

Load sample data into MongoDB:
```bash
cd backend
node scripts/seed-logs.js
```

### Testing API Endpoints

```bash
# Run PowerShell test script (Windows)
cd backend/scripts
./test-endpoints.ps1
```

### Training Models

Retrain the machine learning models with new data:

```bash
# Train crop recommendation model
cd ai-services
python train_crop.py

# Train disease detection model
cd ai-services
python train.py
```

### Building for Production

```bash
# Backend - Build (if applicable)
cd backend
# Node.js doesn't require building, but run:
npm run start

# Frontend - Build static files
cd frontend
npm run build
# Output: dist/ folder

# AI Services - Package (optional)
# Create Python virtual environment for deployment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Project Structure Details

**AI Services Components:**
- `app.py` - Main Flask app for crop recommendations
- `disease_app.py` - Disease detection Flask service
- `predict.py` - Prediction utilities
- `train_crop.py` - Crop model training script
- `train.py` - Disease model training script
- `ocr_utils.py` - OCR and text extraction utilities
- `disease_info.py` - Disease information database
- `data/` - Training datasets
- `model/` - Pre-trained model files

**Backend Components:**
- `controllers/` - Handle HTTP requests
- `services/` - Business logic
- `models/` - MongoDB schemas
- `middleware/` - Authentication, validation
- `routes/` - API endpoint definitions
- `utils/` - Helper functions

## Contributing

We welcome contributions to the FarmAid AI project. Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Troubleshooting

### Common Issues

**MongoDB Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
Solution: Ensure MongoDB is running locally. Start with `mongod` command.

**AI Services Port Already in Use**
```
Address already in use :::5000
```
Solution: Kill the process using port 5000 or change the port in the Flask app.

**Tesseract Not Found (Windows)**
```
TesseractNotFoundError
```
Solution: Install Tesseract OCR and add to system PATH or configure pytesseract path in `ocr_utils.py`.

**Module Not Found Errors (Python)**
```
ModuleNotFoundError: No module named 'tensorflow'
```
Solution: Reinstall requirements: `pip install -r requirements.txt --force-reinstall`

**CORS Errors in Frontend**
```
Access to XMLHttpRequest has been blocked by CORS policy
```
Solution: Verify `FRONTEND_ORIGIN` in backend `.env` matches your frontend URL (default: `http://localhost:5173`).

**Model Files Missing**
```
FileNotFoundError: model/crop_model.joblib not found
```
Solution: Ensure model files exist in `ai-services/model/` directory. Train models if needed.

## Frequently Asked Questions

**Q: How do I use the crop recommendation feature?**
A: Send POST request to `/ai/predict` with soil metrics (N, P, K), weather data (temperature, humidity, rainfall), and location.

**Q: Can I train the models with my own data?**
A: Yes, add your data to `ai-services/data/` and run `train_crop.py` or `train.py`.

**Q: How is disease detection performed?**
A: Upload a leaf image to `/ai/disease/predict` endpoint. The CNN model analyzes it and returns disease prediction with confidence score.

**Q: What database does the application use?**
A: MongoDB (recommended) with in-memory fallback if not configured.

## Contributors

- **Viraj Solanki** - Backend Services and AI Integration
- **Yashvi Bhavsar** - Frontend Services

## Support & Contact

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation in project reports
- Review API test results in [ENDPOINT_TEST_REPORT.md](backend/ENDPOINT_TEST_REPORT.md)

## Acknowledgments

- Machine learning models trained on agricultural datasets
- UI components inspired by modern design practices
- Community feedback and contributions
- TensorFlow and scikit-learn communities
- React and Vite communities

---



