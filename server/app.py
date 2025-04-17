from flask import Flask
from flask_cors import CORS
from routes.summarize_route import summarize_controller
from routes.sentiment_route import sentiment_controller
from routes.ner_controller_route import ner_controller
from routes.code_generation_route import code_generation_controller
from routes.generative_qa_route import generative_qa_controller
from routes.rag_based_qa_controller_route import rag_based_qa_controller

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# summarize controller
summarize_controller(app)

# sentiment controller
sentiment_controller(app)

# NER controller
ner_controller(app)

# code generator controller
code_generation_controller(app)

# generative Q&A
generative_qa_controller(app)

# RAG based Q&A
rag_based_qa_controller(app)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
