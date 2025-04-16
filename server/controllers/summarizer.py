from langchain.text_splitter import CharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
import os
from pypdf import PdfReader
from docx import Document
from together import Together
from dotenv import load_dotenv
import google.generativeai as genai  

load_dotenv()
TOGETHER_AI_API_KEY = os.getenv("TOGETHER_AI_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

def call_model(model, context=""):
    summarization_prompt = '''You are an advanced AI assistant skilled in document summarization. Your task is to provide a concise, yet informative summary of the provided content.

    Context from knowledge retrieval system:
    {context}

    Based on the above retrieved context, create a summary that:
    - Highlights the main points and key information
    - Is clear, structured, and well-organized
    - Is easy to read and understand
    - Integrates the most relevant information from the retrieved context
    - Maintains factual accuracy according to the source material'''

    if model == "LLama 3.3 Meta":
        client = Together(api_key=TOGETHER_AI_API_KEY)
        response = client.chat.completions.create(
            model="meta-llama/Llama-3.3-70B-Instruct-Turbo",
            messages=[{"role": "user", "content": f"{summarization_prompt}\n\n{context}"}]
        )
        return response.choices[0].message.content

    elif model == "Google Gemini":
        client = genai.Client(api_key=GEMINI_API_KEY)
        response = client.models.generate_content(
            model="gemini-2.0-flash-exp",
            contents=f"{summarization_prompt}\n\n{context}"
        )
        return response.text

    elif model == "Deepseek":
        client = Together(api_key=TOGETHER_AI_API_KEY)
        response = client.chat.completions.create(
            model="deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",
            messages=[{"role": "user", "content": f"{summarization_prompt}\n\n{context}"}]
        )
        return response.choices[0].message.content

# File processing functions
def extract_text_from_file(uploaded_file):
    file_extension = uploaded_file.filename.split('.')[-1].lower()
    if file_extension == "pdf":
        return extract_text_from_pdf(uploaded_file)
    elif file_extension == "docx":
        return extract_text_from_docx(uploaded_file)
    elif file_extension == "txt":
        return extract_text_from_txt(uploaded_file)
    return ""

def extract_text_from_pdf(pdf_file):
    text = ""
    pdf_reader = PdfReader(pdf_file)
    for page in pdf_reader.pages:
        text += page.extract_text() or ''
    return text

def extract_text_from_docx(docx_file):
    text = ""
    doc = Document(docx_file)
    for paragraph in doc.paragraphs:
        text += paragraph.text + '\n'
    return text

def extract_text_from_txt(txt_file):
    return txt_file.read().decode('utf-8')

# Text processing
def process_text(text):
    text_splitter = CharacterTextSplitter(separator="\n", chunk_size=1000, chunk_overlap=200, length_function=len)
    chunks = text_splitter.split_text(text)
    embeddings = HuggingFaceEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2')
    knowledgebase = FAISS.from_texts(chunks, embeddings)
    return knowledgebase

def summarize_text(text, model):
    try:
        knowledgebase = process_text(text)
        
        query = "What are the primary topics, arguments, and conclusions in this document?"
        
        docs = knowledgebase.similarity_search(query)
        context = docs[0].page_content if docs else ""
        
        # Add timeout handling for API calls
        return call_model(model, context)
    except Exception as e:
        # Log the error
        print(f"Error in summarize_text: {str(e)}")
        # Return a meaningful error message
        return f"An error occurred during summarization: {str(e)}" 