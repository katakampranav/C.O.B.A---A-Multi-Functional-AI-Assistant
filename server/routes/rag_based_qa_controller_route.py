from flask import request, jsonify
from controllers.rag_based_qa import answer_query_from_document, extract_text_from_file

def rag_based_qa_controller(app):
    @app.route("/answer-query-from-document", methods=["POST"])
    def answer_query_from_document_route():
        # First check if request is multipart/form-data
        if not request.content_type or 'multipart/form-data' not in request.content_type:
            return jsonify({"error": "Content-Type must be multipart/form-data"}), 415
            
        if 'file' not in request.files:
            return jsonify({"error": "No file part in the request"}), 400
            
        uploaded_file = request.files['file']
        if uploaded_file.filename == '':
            return jsonify({"error": "No file selected"}), 400
            
        # Get other form data
        model_choice = request.form.get("model", "LLama 3.3 Meta")
        query = request.form.get("query", "")

        try:
            text = extract_text_from_file(uploaded_file)
            if "Unsupported file type." in text or "Error reading file:" in text:
                return jsonify({"error": text}), 400
                
            answer = answer_query_from_document(text, query, model_choice)
            return jsonify({"answer": answer})
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500