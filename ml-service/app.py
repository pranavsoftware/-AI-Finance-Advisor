from http.server import HTTPServer, BaseHTTPRequestHandler
import json
from datetime import datetime, timedelta
import logging
from urllib.parse import urlparse

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] %(levelname)s: %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)


def simple_linear_regression(dates, amounts):
    """Simple linear regression without numpy/sklearn"""
    n = len(dates)
    if n < 2:
        return 0, 0
    
    # Convert dates to numeric (days since first date)
    x_values = list(range(n))
    y_values = amounts
    
    # Calculate means
    x_mean = sum(x_values) / n
    y_mean = sum(y_values) / n
    
    # Calculate slope
    numerator = sum((x_values[i] - x_mean) * (y_values[i] - y_mean) for i in range(n))
    denominator = sum((x_values[i] - x_mean) ** 2 for i in range(n))
    
    if denominator == 0:
        return y_mean, 0
    
    slope = numerator / denominator
    intercept = y_mean - slope * x_mean
    
    return slope, intercept


def predict_spending(transactions):
    """
    Predict spending for the next 30 days using simple linear regression
    
    Args:
        transactions: List of transaction dicts with 'date' and 'amount'
        
    Returns:
        Dict with predictions list
    """
    try:
        if not transactions or len(transactions) < 10:
            return {
                "error": "Need at least 10 transactions for predictions",
                "status": 400
            }

        # Parse dates and amounts
        dates = []
        amounts = []
        
        for t in transactions:
            try:
                # Parse ISO format date
                date_str = t.get('date', '')
                date_obj = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
                dates.append(date_obj)
                amounts.append(float(t.get('amount', 0)))
            except Exception as e:
                logger.warning(f"Failed to parse transaction: {t}")
                continue
        
        if len(amounts) < 10:
            return {
                "error": "Need at least 10 valid transactions for predictions",
                "status": 400
            }
        
        # Sort by date
        sorted_pairs = sorted(zip(dates, amounts))
        dates, amounts = zip(*sorted_pairs)
        dates = list(dates)
        amounts = list(amounts)
        
        # Daily aggregation - group by day and sum
        daily_data = {}
        for date, amount in zip(dates, amounts):
            day_key = date.date()
            daily_data[day_key] = daily_data.get(day_key, 0) + amount
        
        # Sort daily data
        sorted_days = sorted(daily_data.items())
        daily_dates = [d for d, _ in sorted_days]
        daily_amounts = [a for _, a in sorted_days]
        
        # Simple linear regression
        slope, intercept = simple_linear_regression(daily_dates, daily_amounts)
        
        # Generate predictions for next 30 days
        last_date = daily_dates[-1]
        predictions = []
        
        for i in range(1, 31):
            future_date = last_date + timedelta(days=i)
            # Simple prediction: use slope and intercept
            predicted_amount = max(intercept + slope * (len(daily_dates) + i - 1), 0)
            
            predictions.append({
                "date": future_date.isoformat(),
                "predicted_amount": round(float(predicted_amount), 2)
            })
        
        logger.info(f"✅ Generated predictions for {len(predictions)} days")
        
        return {
            "predictions": predictions,
            "status": 200
        }
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return {
            "error": f"Prediction failed: {str(e)}",
            "status": 400
        }


class MLServiceHandler(BaseHTTPRequestHandler):
    """HTTP request handler for ML prediction service"""
    
    def do_GET(self):
        """Handle GET requests"""
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/health':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response = {
                "status": "OK",
                "timestamp": datetime.now().isoformat(),
                "service": "AI Finance Advisor ML Service"
            }
            self.wfile.write(json.dumps(response).encode())
        else:
            self.send_response(404)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Not found"}).encode())
    
    def do_POST(self):
        """Handle POST requests"""
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/predict':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            try:
                request_data = json.loads(post_data.decode())
                transactions = request_data.get('transactions', [])
                
                result = predict_spending(transactions)
                status_code = result.pop('status', 200)
                
                self.send_response(status_code)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(result).encode())
                
            except json.JSONDecodeError:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Invalid JSON"}).encode())
        else:
            self.send_response(404)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Not found"}).encode())
    
    def do_OPTIONS(self):
        """Handle OPTIONS requests for CORS"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def log_message(self, format, *args):
        """Override to use custom logger"""
        logger.info(f"{self.address_string()} - {format % args}")


def run_server(host='0.0.0.0', port=5000):
    """Start the ML service HTTP server"""
    server_address = (host, port)
    httpd = HTTPServer(server_address, MLServiceHandler)
    
    logger.info(f"🚀 ML Service starting on http://{host}:{port}")
    logger.info(f"📊 Endpoints:")
    logger.info(f"   - GET  http://{host}:{port}/health")
    logger.info(f"   - POST http://{host}:{port}/predict")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        logger.info("\n🛑 Shutting down ML service...")
        httpd.shutdown()


if __name__ == "__main__":
    run_server()
