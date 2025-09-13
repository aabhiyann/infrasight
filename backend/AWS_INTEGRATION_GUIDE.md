# AWS Integration Guide - InfraSight

This guide explains how to transition from mock data to real AWS billing data in InfraSight.

## Overview

InfraSight now supports **hybrid data loading** - you can seamlessly switch between mock data and real AWS Cost Explorer data using environment variables.

## Setup

### 1. Install Dependencies

```bash
pip install boto3 python-dotenv
```

### 2. Configure AWS Credentials

Create a `.env` file in the backend directory:

```env
# AWS Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here
AWS_REGION=us-east-1

# Data Source Configuration
USE_REAL_DATA=false
# Set to 'true' to use real AWS data, 'false' to use mock data

# Alternative AWS Key Names (for backward compatibility)
AWS_ACCESS_KEY=your_aws_access_key_here
AWS_SECRET_KEY=your_aws_secret_key_here
```

### 3. AWS IAM Permissions

Your AWS user/role needs these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ce:GetCostAndUsage",
        "ce:GetCostForecast",
        "ce:GetDimensionValues"
      ],
      "Resource": "*"
    }
  ]
}
```

## How It Works

### Hybrid Data Loading System

The system automatically detects your data source preference:

```python
# Environment variable controls data source
USE_REAL_DATA=false  # Uses mock data
USE_REAL_DATA=true   # Uses real AWS data
```

### Updated API Endpoints

All cost-related endpoints now support an optional `source` parameter:

```bash
# Use auto-detected data source (from USE_REAL_DATA env var)
GET /api/cost

# Force mock data
GET /api/cost?source=mock

# Force real AWS data
GET /api/cost?source=real
```

### New Data Source Management Endpoints

```bash
# Get data source status and configuration
GET /api/data-source/status

# Test connection to configured data source
GET /api/data-source/test-connection

# Get sample data from current source
GET /api/data-source/sample-data?days=7
```

## Updated Routes

All these routes now support hybrid data loading:

- **`/api/cost`** - Cost data with filtering
- **`/api/clusters`** - Cost clustering analysis
- **`/api/anomalies`** - Anomaly detection
- **`/api/forecast`** - Cost forecasting
- **`/api/forecast/services`** - Available services
- **`/api/ml/cleaned-costs`** - ML-ready cost data

## Testing

### 1. Run the Integration Test

```bash
cd backend
python test_aws_integration.py
```

This script tests:

- Environment setup
- Package imports
- AWS connection
- Data fetching
- Hybrid mode functionality

### 2. Test Individual Components

```bash
# Test AWS connection only
python -c "from aws.cost_fetcher import test_aws_connection; print(test_aws_connection())"

# Test data fetching
python -c "from aws.cost_fetcher import fetch_aws_cost_data_flat; df = fetch_aws_cost_data_flat(); print(f'Fetched {len(df)} records')"
```

### 3. Test API Endpoints

```bash
# Start the server
uvicorn main:app --reload

# Test data source status
curl http://localhost:8000/api/data-source/status

# Test with mock data
curl http://localhost:8000/api/cost?source=mock

# Test with real data (if configured)
curl http://localhost:8000/api/cost?source=real
```

## 🔄 Migration Steps

### Step 1: Test with Mock Data (Current State)

```bash
# Ensure mock data works
curl http://localhost:8000/api/cost?source=mock
```

### Step 2: Configure AWS Credentials

```bash
# Set up .env file with your AWS credentials
# Test AWS connection
python test_aws_integration.py
```

### Step 3: Test Real Data Fetching

```bash
# Test real data fetching
curl http://localhost:8000/api/cost?source=real
```

### Step 4: Switch to Real Data

```bash
# Update .env file
USE_REAL_DATA=true

# Restart server
uvicorn main:app --reload

# Verify real data is being used
curl http://localhost:8000/api/data-source/status
```

## Response Format Changes

All cost-related endpoints now include data source information:

```json
{
  "cost_data": [...],
  "data_source": "real",
  "total_records": 150,
  "data_source_info": {
    "current_source": "real",
    "use_real_data_env": "true",
    "available_sources": ["mock", "real"],
    "aws_connection": {
      "status": "success",
      "message": "AWS Cost Explorer connection successful",
      "available_services": 25,
      "region": "us-east-1"
    }
  }
}
```

## 🛠️ Troubleshooting

### Common Issues

1. **Missing AWS Credentials**

   ```
   Error: Failed to create AWS Cost Explorer client
   ```

   - Check your `.env` file has correct AWS credentials
   - Verify environment variables are loaded

2. **Insufficient Permissions**

   ```
   Error: User is not authorized to perform: ce:GetCostAndUsage
   ```

   - Ensure your AWS user has Cost Explorer permissions
   - Check IAM policy includes required actions

3. **No Cost Data**

   ```
   Error: No cost data available for the specified time period
   ```

   - Verify you have AWS usage in the specified date range
   - Check if Cost Explorer is enabled in your AWS account

4. **Import Errors**
   ```
   Error: No module named 'boto3'
   ```
   - Install boto3: `pip install boto3`
   - Activate your virtual environment

### Debug Commands

```bash
# Check environment variables
python -c "import os; from dotenv import load_dotenv; load_dotenv(); print('AWS_ACCESS_KEY_ID:', bool(os.getenv('AWS_ACCESS_KEY_ID')))"

# Test AWS connection
python -c "from aws.cost_fetcher import test_aws_connection; import json; print(json.dumps(test_aws_connection(), indent=2))"

# Check data source detection
python -c "from utils.file_loader import get_data_source; print('Data source:', get_data_source())"
```

## Next Steps

1. **Set up AWS credentials** in your `.env` file
2. **Run the integration test** to verify everything works
3. **Test with real data** using the `source=real` parameter
4. **Switch to real data** by setting `USE_REAL_DATA=true`
5. **Monitor performance** and adjust date ranges as needed

## Additional Resources

- [AWS Cost Explorer API Documentation](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/cost-explorer-api.html)
- [Boto3 Cost Explorer Documentation](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/ce.html)
- [AWS IAM Policy Examples](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_examples.html)

---

## 🔧 Technical Details

### File Structure Changes

```
backend/
├── aws/
│   ├── cost_fetcher.py          # Enhanced AWS integration
│   └── mock_cost_data.json      # Original mock data
├── utils/
│   └── file_loader.py           # Hybrid data loading system
├── routes/
│   ├── data_source.py           # New data source management
│   ├── mock_data.py             # Updated with hybrid support
│   ├── clusters.py              # Updated with hybrid support
│   ├── anomalies.py             # Updated with hybrid support
│   ├── forecasts.py             # Updated with hybrid support
│   └── ml_data.py               # Updated with hybrid support
└── test_aws_integration.py      # Integration test script
```

### Key Functions

- `get_cost_explorer_client()` - Creates authenticated AWS client
- `fetch_aws_cost_data()` - Fetches raw AWS cost data
- `fetch_aws_cost_data_flat()` - Returns formatted DataFrame
- `load_cost_data()` - Hybrid data loader (mock/real)
- `get_data_source()` - Detects current data source
- `test_aws_connection()` - Tests AWS connectivity

This integration maintains backward compatibility while adding powerful real-world data capabilities to InfraSight! 🚀
