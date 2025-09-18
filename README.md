# InfraSight

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green.svg)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue.svg)](https://www.docker.com/)
[![Netlify](https://img.shields.io/badge/Deployed%20on-Netlify-00C7B7.svg)](https://netlify.com)
[![Render](https://img.shields.io/badge/Backend%20on-Render-46E3B7.svg)](https://render.com)
[![Neon](https://img.shields.io/badge/Database-Neon.tech-00D9FF.svg)](https://neon.tech)

A comprehensive cloud cost intelligence platform that leverages machine learning and advanced analytics to provide actionable insights into cloud spending patterns, anomaly detection, and cost optimization recommendations.

## 🚀 Live Application

**Experience InfraSight in action:**

- **Frontend:** [https://infrasight.netlify.app](https://infrasight.netlify.app)
- **Backend API:** [https://infrasight-rs1b.onrender.com](https://infrasight-rs1b.onrender.com)
- **API Documentation:** [https://infrasight-rs1b.onrender.com/docs](https://infrasight-rs1b.onrender.com/docs)

**Demo Credentials:**

- Email: `demo@infrasight.com` | Password: `password123`
- Email: `admin@infrasight.com` | Password: `admin123`
- Email: `test@infrasight.com` | Password: `test123`

> **Note:** The backend may take 10-15 seconds to start on first load (cold start). This is normal for free-tier hosting.

## 📊 Screenshots

### Authentication & User Management

![Signup Page](Screenshots/Signup.png)
_Professional signup interface with form validation and clean design_

### Dashboard & Analytics

![Dashboard Overview - Light Mode](Screenshots/Light%20Mode.png)
_Comprehensive cost overview with key metrics and service breakdown in light theme_

![Dashboard Overview - Dark Mode](Screenshots/Dark%20Mode.png)
_Dark theme interface showing cost analytics and service timelines_

![Dashboard Overview - High Contrast](Screenshots/High%20Contrast%20mode.png)
_High contrast accessibility mode for better visibility_

![Cost Over Time Graph](Screenshots/Cost%20Over%20Time%20Graph.png)
_Interactive line chart showing daily cost trends and fluctuations_

![Top 5 Services](Screenshots/Top%205%20services.png)
_Visual representation of highest-cost services with interactive tooltips_

![Service Cost Breakdown](Screenshots/Overview%20page%20showing%20Cost%20graph%20for%20each%20service.png)
_Detailed service-by-service cost analysis with timeline visualization_

### Advanced Analytics

![Anomaly Detection Scatter Plot](Screenshots/Anomalies%20Detected%20Scatter%20Plot.png)
_Machine learning-powered anomaly detection with severity classification_

![Anomaly Details Table](Screenshots/Anomaly%20details%20table.png)
_Detailed anomaly table with Z-scores, costs, and severity levels_

![AI Recommendations](Screenshots/Recommendations.png)
_Intelligent cost optimization recommendations with priority levels_

### User Experience Features

![Loading State](<Screenshots/Loading%20State%20(takes%20a%20few%20seconds).png>)
_Professional loading states during data processing_

![Date Range Picker](Screenshots/Date%20range%20picker.png)
_Intuitive date range selection with quick preset options_

![Mobile View](Screenshots/Mobile%20View%20side%20menu.png)
_Responsive mobile interface with collapsible navigation menu_

## ⚡ Quick Demo (30 seconds)

1. **Visit:** [https://infrasight.netlify.app](https://infrasight.netlify.app)
2. **Sign up** with any email or use demo credentials above
3. **Explore** the dashboard, anomaly detection, and recommendations
4. **Try** different date ranges and service filters
5. **Export** data as CSV for further analysis

## 🏗️ System Architecture

![InfraSight Architecture](Screenshots/infrasight_architecture.png)

**Architecture Overview:**

- **Frontend:** React/TypeScript on Netlify with global CDN
- **Backend:** FastAPI containerized on Render with auto-scaling
- **Database:** Managed PostgreSQL on Neon.tech with connection pooling
- **ML Engine:** Pandas, Scikit-learn, and custom algorithms for analytics

## Overview

InfraSight is a full-stack web application designed to help organizations monitor, analyze, and optimize their cloud infrastructure costs. The platform processes billing data, applies machine learning algorithms for pattern recognition, and provides intuitive visualizations to help teams make informed decisions about their cloud spending.

## Business Value

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

## Key Features

### Cost Analytics & Visualization

- **Multi-dimensional cost breakdown** by service, region, and time period
- **Interactive charts and graphs** using Chart.js with responsive design
- **Real-time cost monitoring** with configurable date ranges
- **Service comparison analytics** for identifying cost drivers

### Machine Learning Capabilities

- **Anomaly Detection** using statistical analysis and Z-score algorithms
- **Cost Forecasting** with time-series analysis and trend prediction
- **Pattern Recognition** to identify unusual spending patterns
- **Automated Insights** generation based on historical data

### User Management & Security

- **JWT-based authentication** with secure token management
- **Role-based access control** (admin and user roles)
- **Password hashing** using bcrypt for security
- **Session management** with automatic token refresh

### Data Management

- **Mock data generation** for safe testing and demonstration
- **Database persistence** with PostgreSQL integration
- **Data validation** and error handling throughout the application
- **Export capabilities** for cost reports and analytics

## Technical Architecture

### Frontend Stack

- **React 19** with TypeScript for type-safe development
- **Vite** for fast build tooling and development server
- **React Router** for client-side routing and navigation
- **Chart.js** with React integration for data visualization
- **Tailwind CSS** for responsive and modern UI design
- **Lucide React** for consistent iconography

### Backend Stack

- **FastAPI** with Python 3.11 for high-performance API development
- **SQLAlchemy** with async support for database operations
- **Pydantic** for data validation and serialization
- **JWT** authentication with python-jose
- **Bcrypt** for secure password hashing
- **Uvicorn** as ASGI server for production deployment

### Database & Storage

- **PostgreSQL** with asyncpg driver for optimal performance
- **Neon.tech** managed database for cloud deployment
- **SQLAlchemy ORM** for database abstraction and migrations
- **Connection pooling** for efficient database resource management

### Machine Learning & Analytics

- **Pandas** for data manipulation and analysis
- **Scikit-learn** for machine learning algorithms
- **NumPy** for numerical computations
- **Custom algorithms** for anomaly detection and forecasting

### Deployment & Infrastructure

- **Docker** containerization for consistent deployment
- **Netlify** for frontend hosting with CDN distribution
- **Render** for backend container hosting with auto-scaling
- **Neon.tech** for managed PostgreSQL database
- **GitHub Actions** for automated CI/CD pipeline

## Development Features

### Code Quality & Standards

- **TypeScript** throughout the frontend for type safety
- **ESLint** configuration for code quality enforcement
- **Prettier** for consistent code formatting
- **Modular architecture** with reusable components
- **Error boundaries** for graceful error handling

### Performance Optimizations

- **Code splitting** with dynamic imports
- **Lazy loading** for route-based components
- **Gzip compression** for API responses
- **Static asset caching** with long-term cache headers
- **Database query optimization** with proper indexing

### Security Implementation

- **CORS** configuration for cross-origin requests
- **Input validation** on all API endpoints
- **SQL injection prevention** through parameterized queries
- **XSS protection** with proper data sanitization
- **Environment variable** management for sensitive data

## Project Structure

```
infrasight/
├── backend/                 # FastAPI backend application
│   ├── routes/             # API route definitions
│   ├── models/             # SQLAlchemy database models
│   ├── utils/              # Utility functions and helpers
│   ├── Dockerfile          # Backend container configuration
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── hooks/          # Custom React hooks
│   │   ├── contexts/       # React context providers
│   │   └── api/            # API client functions
│   ├── Dockerfile          # Frontend container configuration
│   └── package.json        # Node.js dependencies
├── screenshots/            # Application screenshots
├── docker-compose.local.yml # Local development setup
├── netlify.toml            # Netlify deployment configuration
└── README.md              # Project documentation
```

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 20+ (for local development)
- Python 3.11+ (for local development)

### Local Development Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/aabhiyann/infrasight.git
   cd infrasight
   ```

2. **Start the development environment**

   ```bash
   docker compose -f docker-compose.local.yml up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

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

## API Documentation

The backend provides a comprehensive REST API with the following endpoints:

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/auth/me` - Get current user information
- `POST /api/auth/logout` - User logout

### Cost Analytics

- `GET /api/services` - List all cloud services
- `GET /api/forecast` - Get cost forecasting data
- `GET /api/anomalies` - Detect cost anomalies
- `POST /api/recommendations` - Generate cost optimization recommendations

### Data Management

- `GET /api/ml/cleaned-costs` - Retrieve processed cost data
- `GET /api/data-source/status` - Check data source status

## Deployment

### Production Infrastructure

The application is deployed using a microservices architecture:

- **Frontend**: Hosted on Netlify with global CDN distribution
- **Backend**: Containerized FastAPI application on Render
- **Database**: Managed PostgreSQL instance on Neon.tech
- **Monitoring**: Built-in health checks and logging

### Deployment Process

1. **Frontend Deployment**

   - Automatic deployment from GitHub pushes
   - Build optimization with Vite
   - Static asset caching and compression

2. **Backend Deployment**

   - Docker container deployment on Render
   - Environment variable configuration
   - Health check monitoring

3. **Database Setup**
   - Managed PostgreSQL on Neon.tech
   - Automatic backups and scaling
   - Connection pooling for performance

## Future Enhancements

- **Multi-cloud support** for AWS, Azure, and GCP
- **Real-time data integration** with cloud provider APIs
- **Advanced ML models** for more accurate predictions
- **Team collaboration features** for shared cost management
- **Custom reporting** with scheduled delivery
- **Cost allocation** by department or project
- **Budget alerts** and automated notifications
- **Cost optimization** recommendations with ROI calculations

## Contributing

This project demonstrates modern full-stack development practices including:

- **Clean Architecture** with separation of concerns
- **Test-Driven Development** with comprehensive test coverage
- **CI/CD Pipeline** with automated testing and deployment
- **Documentation** with clear API specifications
- **Security Best Practices** throughout the application

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions about this project or to discuss potential opportunities, please contact [sainjuabhiyan321@gmail.com](mailto:sainjuabhiyan321@gmail.com).

---

**Built with ❤️ using modern web technologies and best practices.**
