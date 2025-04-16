from flask import request, jsonify
from controllers.generative_qa import generate_answer

# The Generative QA controller
def generative_qa_controller(app):
    @app.route("/generate-answer", methods=["POST"])
    def generate_answer_route():
        data = request.json
        # Get user input from the request
        text = data.get("text", "")
        model_choice = data.get("model", "LLama 3.3 Meta")

        if not text:
            return jsonify({"error": "No text provided for generating answers"}), 400

        # Extract entities using the selected model
        answer = generate_answer(text, model_choice)

        # Return extracted entities as JSON
        return jsonify({"answer": answer}) 