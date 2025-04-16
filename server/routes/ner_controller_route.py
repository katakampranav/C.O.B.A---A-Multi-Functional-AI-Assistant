from flask import request, jsonify
from controllers.ner_extractor import extract_entities

# The NER controller
def ner_controller(app):
    @app.route("/extract_entities", methods=["POST"])
    def extract_entities_route():
        data = request.json
        # Get user input from the request
        text = data.get("text", "")
        model_choice = data.get("model", "LLama 3.3 Meta")

        if not text:
            return jsonify({"error": "No text provided for entity extraction"}), 400

        # Extract entities using the selected model
        entities = extract_entities(text, model_choice)

        # Return extracted entities as JSON
        return jsonify({"entities": entities})