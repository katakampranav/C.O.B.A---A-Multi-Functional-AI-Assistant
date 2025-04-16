from flask import request, jsonify
from controllers.sentiment_analyzer import analyze_sentiment

# The sentiment analysis controller
def sentiment_controller(app):
    @app.route("/analyze_sentiment", methods=["POST"])
    def analyze_sentiment_route():
        data = request.json  # Access JSON data
        # Get user input from the request
        text_input = data.get("text_input", "")  
        model_choice = data.get("model", "LLama 3.3 Meta")  # Default to "LLama 3.3 Meta"

        if not text_input:
            return jsonify({"error": "No text provided for sentiment analysis"}), 400

        # Analyze sentiment using the selected model
        sentiment = analyze_sentiment(text_input, model_choice)

        # Return sentiment result as JSON
        return jsonify({"sentiment": sentiment})
