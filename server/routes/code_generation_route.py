from flask import request, jsonify
from controllers.code_generator import extract_code

def code_generation_controller(app):
    @app.route('/generate-code', methods=['POST'])
    def generate_code():
        data = request.get_json()
        text = data.get('text', '')
        model_choice = data.get('model_choice', 'LLama 3.3 Meta')
        language = data.get('language', 'python')

        if not text:
            return jsonify({"error": "No text provided for code extraction"}), 400

        # Extract entities using the selected model
        code = extract_code(text, model_choice, language)

        # Return extracted entities as JSON
        return jsonify({"code": code})