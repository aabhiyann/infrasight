# InfraSight: Cloud Cost Intelligence Platform

## At a Glance

| | |
|---|---|
| **What** | Cloud cost analytics platform with ML-powered insights |
| **Status** | 🟢 LIVE at [infrasight.netlify.app](https://infrasight.netlify.app/) |
| **Role** | Solo Full-Stack Developer |
| **Tech Stack** | Python · FastAPI · PostgreSQL · scikit-learn · Docker · React · TypeScript · JWT |

[🌐 Live Demo](https://infrasight.netlify.app/) · [💻 GitHub](https://github.com/aabhiyann/infrasight) · [📖 API Docs](https://infrasight-rs1b.onrender.com/docs)

---

## The Problem

**Who needs this:**
- DevOps teams managing cloud infrastructure budgets
- Finance teams trying to forecast and control cloud costs
- Engineering managers needing visibility into spending patterns

**The pain points:**
- Cloud billing dashboards are complex and reactive
- Teams discover cost spikes *after* they're billed
- Manual analysis of spending patterns is time-consuming
- No easy way to identify unusual spending behavior

**Why I built this:**
I wanted to create a proactive, analytics-driven approach to cloud cost management—combining statistical analysis with intuitive visualizations.

---

## The Solution

InfraSight is a full-stack platform that provides:

1. **Cost Forecasting** - Predicts future spending with confidence intervals
2. **Anomaly Detection** - Flags unusual spending patterns in real-time
3. **Service Clustering** - Groups similar spending patterns for insights
4. **Optimization Recommendations** - Suggests cost-saving opportunities

---

## Key Features

### 1. Cost Forecasting Dashboard
- Linear Regression model with temporal features (day-of-week, weekend patterns)
- Service-level predictions with 95% confidence intervals
- Configurable forecast periods (1-30 days)

### 2. Anomaly Detection
- Statistical Z-score analysis with configurable thresholds
- Real-time flagging of unusual cost spikes
- Historical comparison and trend analysis
- Service-level and date-range filtering

### 3. Spending Pattern Analysis
- K-means clustering to group similar services
- Cost attribution by service
- Interactive trend visualizations
- CSV export for further analysis

### 4. Smart Recommendations
- Rule-based engine combining anomaly flags and budget thresholds
- Priority-ranked optimization suggestions
- Service-level insights

---

## Technical Architecture

```
┌──────────────────┐     REST API      ┌──────────────────┐     SQL      ┌──────────────────┐
│   React + TS     │◄──────────────────►│     FastAPI      │◄────────────►│   PostgreSQL     │
│   Chart.js       │                    │   + ML Engine    │              │   (Neon.tech)    │
│   (Netlify)      │                    │   (Render)       │              │                  │
└──────────────────┘                    └──────────────────┘              └──────────────────┘
```

### Backend Architecture

**API Layer (FastAPI)**
- RESTful endpoints with async request handling
- JWT authentication with role-based access (admin/user)
- Request validation using Pydantic schemas
- OpenAPI/Swagger documentation auto-generated
- GZip compression middleware for performance

**Database (PostgreSQL)**
- Async queries using SQLAlchemy + asyncpg
- Serverless PostgreSQL on Neon.tech
- Connection pooling for efficient resource usage

**ML Pipeline**
- **Anomaly Detection:** Z-score statistical analysis
- **Forecasting:** Linear Regression with temporal feature engineering
- **Clustering:** K-means for service pattern grouping
- **Recommendations:** Rule-based engine with budget thresholds

### Frontend Architecture

**React 19 + TypeScript**
- Component-based architecture with custom hooks
- Chart.js with react-chartjs-2 for visualizations
- Custom CSS with utility classes
- Responsive design with dark/light/high-contrast themes
- Accessibility-focused (keyboard navigation, color contrast)

### Deployment Infrastructure

| Component | Platform | Features |
|-----------|----------|----------|
| Frontend | Netlify | CDN, auto-deploy from main branch |
| Backend | Render | Docker containerization, health checks |
| Database | Neon.tech | Serverless PostgreSQL, auto-scaling |
| CI/CD | GitHub Actions | Automated testing on push |

---

## Engineering Highlights

### Challenge 1: Handling Time-Series Cost Data

**Problem:** Cloud billing data comes with varying granularity and potential gaps.

**Solution:**
- Implemented data preprocessing pipeline to normalize and clean input
- Created pivot table transformation for service-level analysis
- Built flexible date range filtering for focused analysis

### Challenge 2: Meaningful Anomaly Detection

**Problem:** Simple threshold-based detection produces too many false positives.

**Solution:**
- Implemented Z-score statistical method
- Made threshold configurable (users can tune sensitivity)
- Added service-level filtering to focus on relevant alerts
- Included Z-score values so users understand severity

### Challenge 3: Real-Time API Performance

**Problem:** ML computations could slow down API responses.

**Solution:**
- Used async SQLAlchemy with asyncpg for non-blocking database queries
- Implemented GZip compression to reduce payload sizes
- Optimized data transformations using pandas vectorized operations

---

## ML Model Details

### Cost Forecasting: Linear Regression

**Why Linear Regression?**
- Interpretable predictions for business stakeholders
- Fast inference for real-time API responses
- Effective for trend-based cost patterns
- Provides confidence intervals for uncertainty quantification

**Features:**
- `day_number`: Captures linear trend over time
- `is_weekend`: Accounts for weekend usage patterns

**Output:** Per-service predictions with 95% confidence intervals

### Anomaly Detection: Z-Score Method

**Why Z-Score?**
- Simple, interpretable statistical method
- No training required (works immediately on new data)
- Configurable sensitivity via threshold parameter
- Detects both high and low anomalies

**Configuration:**
- Default threshold: 2.0 (flags points >2 standard deviations)
- User-adjustable from 1.0 to 5.0

### Service Clustering: K-Means

**Why K-Means?**
- Identifies natural groupings in spending patterns
- Helps find services with similar cost behaviors
- Scalable to many services

**Configuration:**
- Default: 3 clusters
- Features: Daily cost vectors per service

---

## What I Built (Technical Ownership)

✅ **Complete Backend API** - 10+ endpoints with authentication, validation, and error handling

✅ **ML Pipeline** - Anomaly detection, forecasting, and clustering from scratch

✅ **React Dashboard** - Interactive charts, filters, and responsive design

✅ **Production Deployment** - Docker, CI/CD, and cloud hosting configuration

✅ **Database Design** - Schema, models, and async query patterns

✅ **Authentication System** - JWT tokens, password hashing, role-based access

---

## What I Learned

### 1. Full-Stack Integration Complexity
Building the entire stack solo taught me how frontend, backend, and database decisions all affect each other. API design impacts frontend code structure, and database schema affects query performance.

### 2. ML in Production vs. Notebooks
Productionizing ML is different from experimentation. I learned to prioritize:
- Fast inference over perfect accuracy
- Clear error handling and fallbacks
- Configurable parameters for user control

### 3. Deployment and DevOps
Setting up Docker, CI/CD, and multi-service hosting taught me:
- Container best practices (multi-stage builds, non-root users)
- Environment variable management across environments
- CORS configuration for cross-origin deployments

---

## Tech Stack Summary

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, TypeScript, Chart.js, Vite, Custom CSS |
| **Backend** | Python 3.11, FastAPI, Pydantic, SQLAlchemy |
| **ML/Analytics** | scikit-learn, pandas, NumPy |
| **Database** | PostgreSQL (Neon.tech), asyncpg |
| **Auth** | JWT (python-jose), bcrypt |
| **DevOps** | Docker, GitHub Actions, Netlify, Render |

---

## Future Enhancements

- [ ] Multi-cloud support (Azure, GCP)
- [ ] Slack/Teams integration for alerts
- [ ] More advanced forecasting models (ARIMA, Prophet)
- [ ] Team collaboration features
- [ ] Budget alerting system

---

## Try It Live

🌐 **Demo:** [infrasight.netlify.app](https://infrasight.netlify.app/)

**Demo Credentials:**
- Email: `demo@infrasight.com` | Password: `password123`

💻 **Source Code:** [github.com/aabhiyann/infrasight](https://github.com/aabhiyann/infrasight)

📖 **API Documentation:** [infrasight-rs1b.onrender.com/docs](https://infrasight-rs1b.onrender.com/docs)

---

*Built with Python, React, and a lot of coffee ☕*


