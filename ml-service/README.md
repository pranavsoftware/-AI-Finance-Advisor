# ML Service Configuration

```
python app.py
```

This FastAPI microservice provides ML-powered spending predictions using time-series forecasting.

## Features

- **Time-Series Prediction**: Uses linear regression to predict next 30 days of spending
- **RESTful API**: Simple HTTP endpoints
- **Health Check**: Monitor service status
- **Error Handling**: Comprehensive error messages

## Endpoints

### GET /health
Check service status

### POST /predict
Predict spending for next 30 days

**Request Body:**
```json
{
  "transactions": [
    {"date": "2024-01-01", "amount": 50.00},
    {"date": "2024-01-02", "amount": 75.50}
  ]
}
```

**Response:**
```json
{
  "predictions": [
    {"date": "2024-01-31", "predicted_amount": 62.50},
    {"date": "2024-02-01", "predicted_amount": 63.00}
  ]
}
```

## Setup

```bash
pip install -r requirements.txt
python app.py
```

Service runs on http://localhost:5000
