# InfraSight

### Cloud Cost Intelligence Platform

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen?style=for-the-badge)](https://infrasight.netlify.app/)
[![API Docs](https://img.shields.io/badge/API-docs-blue?style=for-the-badge)](https://infrasight-rs1b.onrender.com/docs)

[![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Netlify](https://img.shields.io/badge/Netlify-00C7B7?logo=netlify&logoColor=white)](https://netlify.com)
[![Render](https://img.shields.io/badge/Render-46E3B7?logo=render&logoColor=white)](https://render.com)

A full-stack ML-powered platform for cloud cost analytics—featuring anomaly detection, cost forecasting, service clustering, and optimization recommendations.

![Dashboard Preview](Screenshots/Dark%20Mode.png)

---

## 🚀 Live Application

**Experience InfraSight in action:**

- **Frontend:** [https://infrasight.netlify.app](https://infrasight.netlify.app)
- **Backend API:** [https://infrasight-rs1b.onrender.com](https://infrasight-rs1b.onrender.com)
- **API Documentation:** [https://infrasight-rs1b.onrender.com/docs](https://infrasight-rs1b.onrender.com/docs)

**Demo Credentials:**

- Email: `demo@infrasight.com` | Password: `password123`
- Email: `admin@infrasight.com` | Password: `admin123`

> **Note:** The backend may take 10-15 seconds to start on first load (cold start). This is normal for free-tier hosting.

---

## 📖 Overview

InfraSight is a full-stack web application designed to help organizations monitor, analyze, and optimize their cloud infrastructure costs. The platform processes billing data, applies machine learning algorithms for pattern recognition, and provides intuitive visualizations to help teams make informed decisions about their cloud spending.

---

## 💼 Business Value

### Cost Optimization

- **Identify waste** through automated anomaly detection
- **Forecast spending** to improve budget planning
- **Service analysis** to optimize resource allocation
- **Trend analysis** for long-term cost management

### Operational Efficiency

- **Automated insights** reduce manual analysis time
- **Real-time monitoring** enables quick response to issues
- **Historical analysis** provides context for decision-making
- **User-friendly interface** reduces learning curve

### Scalability

- **Cloud-native architecture** supports growth
- **Microservices design** enables independent scaling
- **Containerized deployment** ensures consistency
- **API-first approach** supports integration

---

## ✨ Features

| Feature                   | Description                                                                                       |
| ------------------------- | ------------------------------------------------------------------------------------------------- |
| 📊 **Cost Forecasting**   | Linear Regression with temporal features for predicting future spending with confidence intervals |
| 🚨 **Anomaly Detection**  | Z-score statistical analysis to flag unusual spending patterns with configurable thresholds       |
| 🔬 **Service Clustering** | K-means clustering to group services by spending behavior                                         |
| 💡 **Recommendations**    | Rule-based engine combining anomaly flags and budget thresholds                                   |
| 📈 **Interactive Charts** | Chart.js visualizations with date range filtering and service comparison                          |
| 🔐 **Authentication**     | JWT-based auth with role-based access control (admin/user)                                        |
| 🎨 **Accessibility**      | Dark, light, and high-contrast themes                                                             |
| 📤 **Data Export**        | CSV export for further analysis                                                                   |

---

## 🏗️ System Architecture

![InfraSight Architecture](Screenshots/infrasight_architecture.png)

**Architecture Overview:**

- **Frontend:** React/TypeScript on Netlify with global CDN
- **Backend:** FastAPI containerized on Render with auto-scaling
- **Database:** Managed PostgreSQL on Neon.tech with connection pooling
- **ML Engine:** Pandas, Scikit-learn for analytics

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │  REST   │                 │   SQL   │                 │
│  React + TS     │◄───────►│    FastAPI      │◄───────►│   PostgreSQL    │
│  (Netlify CDN)  │   API   │    (Render)     │         │   (Neon.tech)   │
│                 │         │                 │         │                 │
└─────────────────┘         └────────┬────────┘         └─────────────────┘
                                     │
                            ┌────────┴────────┐
                            │   ML Pipeline   │
                            │  ─────────────  │
                            │ • Z-score       │
                            │ • Linear Reg    │
                            │ • K-means       │
                            └─────────────────┘
```

---

## 📸 Screenshots

### Authentication & User Management

![Signup Page](Screenshots/Signup.png)
_Professional signup interface with form validation and clean design_

### Dashboard & Analytics

| Light Mode                             | Dark Mode                            | High Contrast                                            |
| -------------------------------------- | ------------------------------------ | -------------------------------------------------------- |
| ![Light](Screenshots/Light%20Mode.png) | ![Dark](Screenshots/Dark%20Mode.png) | ![High Contrast](Screenshots/High%20Contrast%20mode.png) |

_Comprehensive cost overview with key metrics and service breakdown across three accessibility themes_

![Cost Over Time Graph](Screenshots/Cost%20Over%20Time%20Graph.png)
_Interactive line chart showing daily cost trends and fluctuations_

![Top 5 Services](Screenshots/Top%205%20services.png)
_Visual representation of highest-cost services with interactive tooltips_

![Service Cost Breakdown](Screenshots/Overview%20page%20showing%20Cost%20graph%20for%20each%20service.png)
_Detailed service-by-service cost analysis with timeline visualization_

### Advanced Analytics

![Anomaly Detection Scatter Plot](Screenshots/Anomalies%20Detected%20Scatter%20Plot.png)
_Anomaly detection with Z-score severity classification_

![Anomaly Details Table](Screenshots/Anomaly%20details%20table.png)
_Detailed anomaly table with Z-scores, costs, and severity levels_

![AI Recommendations](Screenshots/Recommendations.png)
_Intelligent cost optimization recommendations with priority levels_

### User Experience Features

| Date Range Picker                              | Mobile View                                            |
| ---------------------------------------------- | ------------------------------------------------------ |
| ![Date](Screenshots/Date%20range%20picker.png) | ![Mobile](Screenshots/Mobile%20View%20side%20menu.png) |

_Intuitive date range selection and responsive mobile interface_

---

## 🛠️ Tech Stack

### Frontend

- **React 19** with TypeScript for type-safe development
- **Vite** for fast build tooling and development server
- **React Router** for client-side routing and navigation
- **Chart.js** with React integration for data visualization
- **Custom CSS** with utility classes for responsive and modern UI design
- **Lucide React** for consistent iconography

### Backend

- **FastAPI** with Python 3.11 for high-performance API development
- **SQLAlchemy** with async support for database operations
- **Pydantic** for data validation and serialization
- **JWT** authentication with python-jose
- **Bcrypt** for secure password hashing
- **Uvicorn** as ASGI server for production deployment

### Database & Storage

- **PostgreSQL** with asyncpg driver for optimal performance
- **Neon.tech** managed database for cloud deployment
- **SQLAlchemy ORM** for database abstraction
- **Connection pooling** for efficient database resource management

### Machine Learning & Analytics

- **Pandas** for data manipulation and analysis
- **Scikit-learn** for machine learning algorithms (K-means clustering, Linear Regression)
- **NumPy** for numerical computations
- **Z-score analysis** for statistical anomaly detection

### Deployment & Infrastructure

- **Docker** containerization for consistent deployment
- **Netlify** for frontend hosting with CDN distribution
- **Render** for backend container hosting
- **Neon.tech** for managed PostgreSQL database
- **GitHub Actions** for automated CI/CD pipeline

---

## 🎯 Key Achievements

- **Full-Stack Development:** Built end-to-end application with React frontend and Python FastAPI backend
- **Machine Learning Integration:** Implemented anomaly detection (Z-score), forecasting (Linear Regression), and clustering (K-means)
- **Cloud-Native Architecture:** Deployed using Docker containers on Render and Netlify with managed PostgreSQL
- **Modern Tech Stack:** Utilized latest versions of React 19, TypeScript 5.8, Python 3.11, and FastAPI
- **Production-Ready:** Implemented authentication, error handling, and security best practices
- **Responsive Design:** Created mobile-first UI with dark/light/high-contrast themes for accessibility
- **API-First Design:** RESTful API with comprehensive documentation and OpenAPI/Swagger integration

---

## 🔌 API Endpoints

| Method | Endpoint               | Description              |
| ------ | ---------------------- | ------------------------ |
| POST   | `/api/auth/signup`     | User registration        |
| POST   | `/api/auth/login`      | Authentication           |
| GET    | `/api/auth/me`         | Current user info        |
| GET    | `/api/services`        | List cloud services      |
| GET    | `/api/forecast`        | Cost predictions         |
| GET    | `/api/anomalies`       | Anomaly detection        |
| POST   | `/api/recommendations` | Optimization suggestions |
| GET    | `/api/clusters`        | Service clustering       |

Full API documentation: [infrasight-rs1b.onrender.com/docs](https://infrasight-rs1b.onrender.com/docs)

---

## 📁 Project Structure

```
infrasight/
├── backend/                 # FastAPI backend application
│   ├── routes/              # API route definitions
│   ├── models.py            # SQLAlchemy database models
│   ├── ml_utils.py          # ML algorithms
│   ├── auth_utils.py        # JWT authentication
│   ├── Dockerfile           # Backend container configuration
│   └── requirements.txt     # Python dependencies
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Application pages
│   │   ├── hooks/           # Custom React hooks
│   │   ├── contexts/        # React context providers
│   │   └── api/             # API client functions
│   ├── Dockerfile           # Frontend container configuration
│   └── package.json         # Node.js dependencies
├── Screenshots/             # Application screenshots
├── docker-compose.local.yml # Local development setup
├── netlify.toml             # Netlify deployment configuration
└── README.md                # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 20+ (for local development)
- Python 3.11+ (for local development)

### Quick Start with Docker

```bash
# Clone the repository
git clone https://github.com/aabhiyann/infrasight.git
cd infrasight

# Start the development environment
docker compose -f docker-compose.local.yml up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Documentation: http://localhost:8000/docs
```

### Environment Configuration

Create a `.env` file in the root directory:

```bash
# Database Configuration
DATABASE_URL=postgresql+asyncpg://infrasight:infrasight_password@localhost:5432/infrasight

# Security
SECRET_KEY=your-secret-key-here
DEBUG=true
ENVIRONMENT=development

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

---

## 🔒 Security Implementation

- **CORS** configuration for cross-origin requests
- **Input validation** on all API endpoints
- **SQL injection prevention** through parameterized queries
- **XSS protection** with proper data sanitization
- **Environment variable** management for sensitive data
- **JWT tokens** with secure signing
- **Password hashing** with bcrypt

---

## 🗺️ Future Enhancements

- [ ] Multi-cloud support for AWS, Azure, and GCP
- [ ] Real-time data integration with cloud provider APIs
- [ ] Advanced ML models (ARIMA, Prophet) for more accurate predictions
- [ ] Team collaboration features for shared cost management
- [ ] Custom reporting with scheduled delivery
- [ ] Budget alerts and automated notifications
- [ ] Slack/Teams integration for alerts

---

## 📬 Contact

**Abhiyan Sainju**

[![Email](https://img.shields.io/badge/Email-sainjuabhiyan321%40gmail.com-EA4335?logo=gmail&logoColor=white)](mailto:sainjuabhiyan321@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-abhiyansainju-0A66C2?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/abhiyansainju)
[![GitHub](https://img.shields.io/badge/GitHub-aabhiyann-181717?logo=github&logoColor=white)](https://github.com/aabhiyann)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <strong>⭐ Star this repo if you found it useful!</strong>
</p>
