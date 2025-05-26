import boto3
import os
from dotenv import load_dotenv

# Load secrets from .env file
load_dotenv()

# Create the Cost Explorer client using credentials
client = boto3.client(
    'ce',  # ce = Cost Explorer
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY"),
    aws_secret_access_key=os.getenv("AWS_SECRET_KEY"),
    region_name=os.getenv("AWS_REGION")
)

# Call AWS to get billing info
response = client.get_cost_and_usage(
    TimePeriod={
        'Start': '2024-04-01',
        'End': '2024-04-30'
    },
    Granularity='DAILY',
    Metrics=['UnblendedCost'],
    GroupBy=[{
        'Type': 'DIMENSION',
        'Key': 'SERVICE'
    }]
)

# Print the results
for day in response['ResultsByTime']:
    print(f"📅 {day['TimePeriod']['Start']}")
    for group in day['Groups']:
        service = group['Keys'][0]
        amount = group['Metrics']['UnblendedCost']['Amount']
        print(f" - {service}: ${float(amount):.2f}")