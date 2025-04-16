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
TOGETHER_AI_API = os.getenv("TOGETHER_AI_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

def call_model(model, prompt):

    if model == "LLama 3.3 Meta":
        client = Together(api_key=TOGETHER_AI_API)
        response = client.chat.completions.create(
            model="meta-llama/Llama-3.3-70B-Instruct-Turbo",
            messages=[{"role": "user", "content": f"{prompt}"}]
        )
        return response.choices[0].message.content

    elif model == "Google Gemini":
        client = genai.Client(api_key=GEMINI_API_KEY)
        response = client.models.generate_content(
            model="gemini-2.0-flash-exp",
            contents=f"{prompt}"
        )
        return response.text

    elif model == "Deepseek":
        client = Together(api_key=TOGETHER_AI_API)
        response = client.chat.completions.create(
            model="deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",
            messages=[{"role": "user", "content": f"{prompt}"}]
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

def answer_query_from_document(text, query, model):

    knowledgebase = process_text(text)
    # Perform a similarity search to find the most relevant chunks for the given query
    docs = knowledgebase.similarity_search(query, k=3)  # Retrieve top 3 relevant chunks

    # Combine the retrieved chunks into a context for the LLM
    context = "\n\n".join([doc.page_content for doc in docs])

    # Prepare the prompt for LLM, providing context to answer the query
    prompt = f"Answer the following question based on the provided context:\n\n{context}\n\nQuestion: {query}"

    return call_model(model, prompt)