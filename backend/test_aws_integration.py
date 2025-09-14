#!/usr/bin/env python3
"""
Test script for AWS integration with InfraSight.
This script tests the connection and data fetching capabilities.
"""

import os
import sys
from pathlib import Path

# Add the backend directory to the Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

def test_environment_setup():
    """Test if environment variables are properly set."""
    print("Testing environment setup...")
    
    # Check for .env file
    env_file = backend_dir / ".env"
    if env_file.exists():
        print(".env file found")
    else:
        print("WARNING: .env file not found - will use system environment variables")
    
    # Check for AWS credentials
    aws_keys = [
        "AWS_ACCESS_KEY_ID",
        "AWS_SECRET_ACCESS_KEY", 
        "AWS_REGION"
    ]
    
    missing_keys = []
    for key in aws_keys:
        if not os.getenv(key):
            missing_keys.append(key)
    
    if missing_keys:
        print(f"ERROR: Missing AWS credentials: {', '.join(missing_keys)}")
        print("   Please set these environment variables or create a .env file")
        return False
    else:
        print("AWS credentials found")
        return True

def test_imports():
    """Test if required packages are installed."""
    print("\nTesting package imports...")
    
    try:
        import boto3
        print("boto3 installed")
    except ImportError:
        print("ERROR: boto3 not installed - run: pip install boto3")
        return False
    
    try:
        from dotenv import load_dotenv
        print("python-dotenv installed")
    except ImportError:
        print("ERROR: python-dotenv not installed - run: pip install python-dotenv")
        return False
    
    try:
        import pandas
        print("pandas installed")
    except ImportError:
        print("ERROR: pandas not installed - run: pip install pandas")
        return False
    
    return True

def test_aws_connection():
    """Test AWS Cost Explorer connection."""
    print("\nTesting AWS Cost Explorer connection...")
    
    try:
        from aws.cost_fetcher import test_aws_connection
        result = test_aws_connection()
        
        if result["status"] == "success":
            print("AWS Cost Explorer connection successful")
            print(f"   Region: {result.get('region', 'Unknown')}")
            print(f"   Available services: {result.get('available_services', 'Unknown')}")
            return True
        else:
            print(f"ERROR: AWS connection failed: {result['message']}")
            return False
            
    except Exception as e:
        print(f"ERROR: Error testing AWS connection: {str(e)}")
        return False

def test_data_fetching():
    """Test fetching real AWS cost data."""
    print("\nTesting AWS data fetching...")
    
    try:
        from aws.cost_fetcher import fetch_aws_cost_data_flat
        
        # Fetch last 7 days of data
        df = fetch_aws_cost_data_flat()
        
        print(f"Successfully fetched {len(df)} cost records")
        print(f"   Date range: {df['date'].min()} to {df['date'].max()}")
        print(f"   Services: {df['service'].nunique()} unique services")
        print(f"   Total cost: ${df['amount'].sum():.2f}")
        
        # Show sample services
        services = df['service'].unique()[:5]
        print(f"   Sample services: {', '.join(services)}")
        
        return True
        
    except Exception as e:
        print(f"ERROR: Error fetching AWS data: {str(e)}")
        return False

def test_hybrid_mode():
    """Test the hybrid data loading system."""
    print("\nTesting hybrid data loading...")
    
    try:
        from utils.file_loader import get_data_source, load_cost_data, get_data_source_info
        
        # Test current data source detection
        current_source = get_data_source()
        print(f"   Current data source: {current_source}")
        
        # Test data source info
        info = get_data_source_info()
        print(f"   USE_REAL_DATA env var: {info['use_real_data_env']}")
        
        # Test loading data
        data = load_cost_data()
        print(f"   Loaded {len(data.get('ResultsByTime', []))} days of data")
        
        return True
        
    except Exception as e:
        print(f"ERROR: Error testing hybrid mode: {str(e)}")
        return False

def main():
    """Run all tests."""
    print("InfraSight AWS Integration Test")
    print("=" * 50)
    
    tests = [
        ("Environment Setup", test_environment_setup),
        ("Package Imports", test_imports),
        ("AWS Connection", test_aws_connection),
        ("Data Fetching", test_data_fetching),
        ("Hybrid Mode", test_hybrid_mode)
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"ERROR: {test_name} failed with exception: {str(e)}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "=" * 50)
    print("Test Summary:")
    
    passed = 0
    for test_name, result in results:
        status = "PASS" if result else "FAIL"
        print(f"   {test_name}: {status}")
        if result:
            passed += 1
    
    print(f"\n{passed}/{len(results)} tests passed")
    
    if passed == len(results):
        print("All tests passed! AWS integration is ready.")
        print("\nNext steps:")
        print("   1. Set USE_REAL_DATA=true in your .env file to use real AWS data")
        print("   2. Start the FastAPI server: uvicorn main:app --reload")
        print("   3. Test the API endpoints with real data")
    else:
        print("WARNING: Some tests failed. Please fix the issues above before proceeding.")
    
    return passed == len(results)

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
