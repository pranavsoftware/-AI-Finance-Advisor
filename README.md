# 🤖 AI Finance Advisor

<div align="center">

![AI Finance Advisor](https://img.shields.io/badge/AI-Finance%20Advisor-8B5CF6?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

**An intelligent financial management platform powered by Google Gemini AI**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Architecture](#-system-architecture) • [Installation](#-installation) • [Usage](#-usage) • [API Documentation](#-api-documentation)

</div>

---

## 📸 Screenshots

### Login Interface
<div align="center">
  <img src="docs/Login.png" alt="Login Screen" width="800"/>
  <p><em>Secure authentication with modern UI design</em></p>
</div>

### Dashboard Overview
<div align="center">
  <img src="docs/Dashboard.png" alt="Dashboard" width="800"/>
  <p><em>Comprehensive financial insights with AI-powered categorization</em></p>
</div>

---

## ✨ Features

### 🎯 Core Functionality
- **🔐 Secure Authentication**: JWT-based authentication with OTP verification
- **📊 Smart Transaction Management**: Upload CSV/Excel files for automatic transaction import
- **🤖 AI-Powered Categorization**: Google Gemini 2.5 Flash automatically categorizes transactions
- **💡 Intelligent Insights**: Get personalized spending analysis and recommendations
- **📈 Predictive Analytics**: ML-based spending predictions for the next 30 days
- **🔄 Real-time Updates**: Live dashboard with refresh functionality
- **📱 Responsive Design**: Modern, professional UI with glass morphism effects

### 🎨 UI/UX Highlights
- Professional SVG icons throughout (Heroicons)
- Gradient backgrounds with purple/indigo theme
- Loading overlays with backdrop blur
- Smooth animations and transitions
- Category-based color coding
- Mobile-responsive layout

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2.0 | UI framework |
| **TypeScript** | 5.3.3 | Type safety |
| **Vite** | 5.4.21 | Build tool & dev server |
| **TailwindCSS** | 3.4.17 | Styling framework |
| **Axios** | 1.7.9 | HTTP client |
| **Recharts** | 2.15.0 | Data visualization |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18.x | Runtime environment |
| **Express.js** | 4.21.2 | Web framework |
| **TypeScript** | 5.9.3 | Type safety |
| **MongoDB** | 6.12.0 | Database |
| **Mongoose** | 8.9.3 | ODM |
| **JWT** | 9.0.2 | Authentication |
| **Google GenAI** | 1.27.0 | Gemini 2.5 Flash integration |
| **Multer** | 1.4.5-lts.1 | File upload handling |
| **XLSX** | 0.18.5 | Excel file parsing |

### ML Service
| Technology | Version | Purpose |
|------------|---------|---------|
| **Python** | 3.11 | Runtime |
| **Standard Library** | Built-in | HTTP server & predictions |
| **Linear Regression** | Custom | Spending forecasting |

### DevOps & Tools
| Technology | Purpose |
|------------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Multi-container orchestration |
| **Nginx** | Production web server |
| **Pino** | Structured logging |
| **ESLint** | Code linting |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                                │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  React Frontend (TypeScript + Vite)                          │  │
│  │  • Authentication UI                                         │  │
│  │  • Dashboard & File Upload                                   │  │
│  │  • AI Insights Display                                       │  │
│  │  • Transaction Management                                    │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              ↓ HTTP/REST                            │
└─────────────────────────────────────────────────────────────────────┘
                                  ↓
┌─────────────────────────────────────────────────────────────────────┐
│                       APPLICATION LAYER                              │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Express.js Backend (Node.js + TypeScript)                   │  │
│  │                                                              │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │  │
│  │  │   Auth      │  │  Transaction │  │   Gemini AI      │  │  │
│  │  │  Controller │  │   Controller │  │    Service       │  │  │
│  │  └─────────────┘  └──────────────┘  └──────────────────┘  │  │
│  │         ↓                 ↓                    ↓            │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │  │
│  │  │ JWT & OTP   │  │ File Parser  │  │  Google Gemini   │  │  │
│  │  │  Middleware │  │ (CSV/Excel)  │  │   2.5 Flash API  │  │  │
│  │  └─────────────┘  └──────────────┘  └──────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│         ↓                           ↓                    ↓          │
└─────────────────────────────────────────────────────────────────────┘
         ↓                           ↓                    ↓
┌─────────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│   DATA LAYER        │   │   AI LAYER       │   │   ML LAYER       │
│  ┌───────────────┐  │   │  ┌────────────┐  │   │  ┌────────────┐  │
│  │   MongoDB     │  │   │  │   Gemini   │  │   │  │  Python    │  │
│  │               │  │   │  │  AI Model  │  │   │  │  Service   │  │
│  │  • Users      │  │   │  │            │  │   │  │            │  │
│  │  • Transactions│ │   │  │ Categories │  │   │  │  Linear    │  │
│  │  • Insights   │  │   │  │  Insights  │  │   │  │ Regression │  │
│  │  • Categories │  │   │  │  Analysis  │  │   │  │ Forecasting│  │
│  └───────────────┘  │   │  └────────────┘  │   │  └────────────┘  │
└─────────────────────┘   └──────────────────┘   └──────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      DEPLOYMENT LAYER                                │
│                                                                      │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────────┐   │
│  │  Frontend      │  │  Backend       │  │  ML Service        │   │
│  │  Container     │  │  Container     │  │  Container         │   │
│  │  (Nginx)       │  │  (Node.js)     │  │  (Python 3.11)     │   │
│  │  Port: 5173    │  │  Port: 8000    │  │  Port: 5000        │   │
│  └────────────────┘  └────────────────┘  └────────────────────┘   │
│                                                                      │
│              Docker Network: ai-finance-network                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
┌─────────────┐
│   User      │
│  Uploads    │
│  CSV File   │
└──────┬──────┘
       │
       ↓
┌──────────────────────────────────────────────────┐
│  1. File Upload (Multer)                         │
│     • Validate format (CSV/XLSX)                 │
│     • Parse transactions                         │
│     • Store in MongoDB                           │
└──────┬───────────────────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────────────────┐
│  2. AI Categorization (Gemini 2.5 Flash)         │
│     • Send transaction descriptions              │
│     • Get AI-powered categories                  │
│     • Update database with categories            │
└──────┬───────────────────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────────────────┐
│  3. Generate Insights (Cached 24h)               │
│     • Analyze spending patterns                  │
│     • Identify trends                            │
│     • Generate recommendations                   │
└──────┬───────────────────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────────────────┐
│  4. ML Predictions (Python Service)              │
│     • Linear regression on historical data       │
│     • Forecast next 30 days spending             │
│     • Return predictions to frontend             │
└──────┬───────────────────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────────────────┐
│  5. Display on Dashboard                         │
│     • Show categorized transactions              │
│     • Display AI insights                        │
│     • Render prediction charts                   │
└──────────────────────────────────────────────────┘
```

---

## 🚀 Installation

### Prerequisites
- **Node.js** >= 18.x
- **Python** >= 3.11
- **MongoDB** >= 6.0
- **Docker** & **Docker Compose** (for containerized deployment)
- **Google Gemini API Key** ([Get one here](https://aistudio.google.com/apikey))

### Option 1: Docker Deployment (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-finance-advisor.git
   cd ai-finance-advisor
   ```

2. **Set up environment variables**
   
   Create `.env` in `backend/` directory:
   ```env
   PORT=8000
   MONGO_URI=mongodb://host.docker.internal:27017/ai-finance
   JWT_SECRET=your_jwt_secret_key_here_minimum_32_characters
   GEMINI_API_KEY=your_gemini_api_key_here
   NODE_ENV=production
   ```

3. **Start MongoDB locally** (if not using Docker MongoDB)
   ```bash
   # Ensure MongoDB is running on localhost:27017
   mongod
   ```

4. **Build and run with Docker**
   ```bash
   docker-compose build
   docker-compose up -d
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/api/docs
   - ML Service: http://localhost:5000

### Option 2: Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-finance-advisor.git
   cd ai-finance-advisor
   ```

2. **Backend setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file
   cp .env.example .env
   # Edit .env with your credentials
   
   npm run dev
   ```

3. **Frontend setup** (new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **ML Service setup** (new terminal)
   ```bash
   cd ml-service
   python app.py
   ```

5. **Start MongoDB**
   ```bash
   mongod
   ```

---

## 💻 Usage

### 1. Create an Account
- Navigate to http://localhost:5173
- Click "Register" and provide email/password
- Verify your account (OTP sent to console in dev mode)

### 2. Upload Transactions
- Click "Browse Files" or drag & drop CSV/Excel file
- Supported formats: CSV, XLSX
- Required columns: `Date`, `Description`, `Amount`

### 3. AI Categorization
- Transactions are automatically categorized by Gemini AI
- Categories: Food & Dining, Transportation, Utilities, Healthcare, Entertainment, Shopping

### 4. View Insights
- Click "Refresh" to generate new AI insights
- Insights are cached for 24 hours
- Get personalized spending recommendations

### 5. Predictions
- View 30-day spending forecast on the dashboard
- ML model learns from your historical data

---

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

#### Verify OTP
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

### Transaction Endpoints

#### Upload Transactions
```http
POST /api/transactions/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: transactions.csv
```

#### Get All Transactions
```http
GET /api/transactions
Authorization: Bearer <token>
```

#### Delete Transaction
```http
DELETE /api/transactions/:id
Authorization: Bearer <token>
```

### Insights Endpoints

#### Get AI Insights
```http
GET /api/insights
Authorization: Bearer <token>
```

### ML Prediction Endpoints

#### Get 30-Day Forecast
```http
POST http://localhost:5000/predict
Content-Type: application/json

{
  "data": [
    {"date": "2024-10-01", "amount": 150.00},
    {"date": "2024-10-02", "amount": 200.00}
  ]
}
```

---

## 🐳 Docker Commands

### Build images
```bash
docker-compose build
```

### Start all services
```bash
docker-compose up -d
```

### Stop all services
```bash
docker-compose down
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f ml-service
```

### Check container status
```bash
docker-compose ps
```

### Rebuild specific service
```bash
docker-compose build backend
docker-compose up -d backend
```

---

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Server
PORT=8000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/ai-finance

# Authentication
JWT_SECRET=your_secret_key_minimum_32_characters
JWT_EXPIRES_IN=7d

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Email (Optional for OTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api
VITE_ML_SERVICE_URL=http://localhost:5000
```

---

## 📊 Database Schema

### User Model
```typescript
{
  email: string (unique, required)
  password: string (hashed, required)
  name: string (required)
  isVerified: boolean (default: false)
  otp: string (optional)
  otpExpires: Date (optional)
  createdAt: Date
  updatedAt: Date
}
```

### Transaction Model
```typescript
{
  userId: ObjectId (ref: User, required)
  date: Date (required)
  description: string (required)
  amount: number (required)
  category: string (optional, AI-generated)
  createdAt: Date
  updatedAt: Date
}
```

### Insight Model
```typescript
{
  userId: ObjectId (ref: User, required)
  insights: string (Gemini AI response)
  summary: {
    totalSpend: number
    monthlyAverage: number
    generatedAt: Date
  }
  generatedAt: Date
  createdAt: Date
  updatedAt: Date
}
```

---

## 🔐 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **OTP Verification**: Two-factor authentication
- **Environment Variables**: Sensitive data protection
- **CORS Configuration**: Controlled cross-origin requests
- **Input Validation**: Mongoose schema validation
- **File Upload Limits**: Multer size restrictions
- **Error Handling**: Structured error responses

---

## 🎨 UI Components

### Design System
- **Color Scheme**: Purple/Indigo gradients (#8B5CF6, #6366F1)
- **Typography**: System fonts with fallbacks
- **Icons**: Heroicons SVG library
- **Effects**: Glass morphism, backdrop blur
- **Animations**: Smooth transitions, loading spinners

### Key Components
- **Dashboard**: Main interface with transaction overview
- **FileUpload**: Drag & drop CSV/Excel upload
- **AIInsights**: Display Gemini-generated insights with refresh overlay
- **Navbar**: Navigation with user profile
- **TransactionTable**: Sortable, deletable transaction list

---

## 📈 Performance Optimizations

- **Insight Caching**: 24-hour MongoDB cache reduces AI API calls
- **Lazy Loading**: React lazy imports for code splitting
- **Multi-stage Docker Builds**: Smaller production images
- **Production Dependencies Only**: Minimal container footprint
- **Nginx Gzip**: Compressed frontend assets
- **Database Indexing**: userId + createdAt indexes

---

## 🗺️ Roadmap

- [ ] Budget setting and tracking
- [ ] Recurring transaction detection
- [ ] Multi-currency support
- [ ] Export reports (PDF/Excel)
- [ ] Mobile app (React Native)
- [ ] Bank API integrations
- [ ] Custom category creation
- [ ] Collaborative budgets (family/team)
- [ ] Advanced ML models (LSTM, Prophet)
- [ ] Data visualization improvements

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards
- Follow TypeScript best practices
- Use ESLint and Prettier
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Pranav**
- Email: raybanpranav27@gmail.com
- GitHub: [@pranavsoftware](https://github.com/pranavsoftware)

---

## 🙏 Acknowledgments

- [Google Gemini AI](https://deepmind.google/technologies/gemini/) - For powerful AI categorization and insights
- [Heroicons](https://heroicons.com/) - For beautiful SVG icons
- [TailwindCSS](https://tailwindcss.com/) - For utility-first CSS framework
- [MongoDB](https://www.mongodb.com/) - For flexible document database
- [Docker](https://www.docker.com/) - For containerization platform

---

## 📞 Support

If you encounter any issues or have questions:
- 📧 Email: raybanpranav27@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/pranavsoftware/ai-finance-advisor/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/pranavsoftware/ai-finance-advisor/discussions)

---

<div align="center">

**Made with ❤️ using React, Node.js, Python, and Google Gemini AI**

⭐ Star this repository if you found it helpful!

</div>
