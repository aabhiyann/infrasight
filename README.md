# InfraSight

InfraSight is a cloud cost intelligence dashboard that uses AWS billing data and machine learning to help developers and teams understand, visualize, and optimize their cloud spending.

## What It Does

- Fetches AWS cost and usage data (via Cost Explorer API)
- Shows cost breakdown by service over time
- Uses ML to detect waste and forecast future spend
- Offers savings recommendations
- Presents all insights in a sleek, interactive frontend dashboard

## Tech Stack

| Layer        | Tech                          |
| ------------ | ----------------------------- |
| Frontend     | Next.js 14, Tailwind CSS      |
| Backend      | FastAPI, Python               |
| Cloud Access | AWS Cost Explorer API (boto3) |
| ML Engine    | pandas, scikit-learn          |
| Database     | PostgreSQL (optional)         |
| Deployment   | Docker, Vercel, Render        |

## Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/infrasight.git
cd infrasight
```
