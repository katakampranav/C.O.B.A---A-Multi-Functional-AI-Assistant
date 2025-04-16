from flask import request, jsonify
from controllers.summarizer import summarize_text, extract_text_from_file

# The summarize controller
def summarize_controller(app):
    @app.route('/summarize-text', methods=['POST'])
    def summarize_txt():
        # Check if the request has JSON data
        if request.is_json:
            text_input = request.json.get("text", "")
        else:
            text_input = request.form.get("text", "")
        
        model = request.json.get("model", "LLama 3.3 Meta")

        if not text_input:
            return jsonify({"error": "Text input cannot be empty."}), 400
        
        # Call the model and get the summary
        summary = summarize_text(text_input, model)
        
        # Return summary as JSON
        return jsonify({"summary": summary})
    
    @app.route('/summarize-doc', methods=['POST'])
    def summarize_doc():
        uploaded_file = request.files.get("file")
        model = request.form.get("model", "LLama 3.3 Meta")  

        if not uploaded_file:
            return jsonify({"error": "Please provide a document file."}), 400

        text = extract_text_from_file(uploaded_file)
        if "Unsupported file type." in text or "Error reading file:" in text:
            return jsonify({"error": text}), 400        

        summary = summarize_text(text, model)
        return jsonify({"summary": summary})

