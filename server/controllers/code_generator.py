import os
from together import Together
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv() 
TOGETHER_AI_API = os.getenv("TOGETHER_AI_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Function to call models
def call_model(model, query):
    if model == "LLama 3.3 Meta":
        client = Together(api_key=TOGETHER_AI_API)
        response = client.chat.completions.create(
            model="meta-llama/Llama-3.3-70B-Instruct-Turbo",
            messages=[{"role": "user", "content": query}]
        )
        return response.choices[0].message.content.strip()

    elif model == "Google Gemini":
        client = genai.Client(api_key=GEMINI_API_KEY)
        response = client.models.generate_content(
            model="gemini-2.0-flash-exp",
            contents=query
        )
        return response.text.strip()

    elif model == "Deepseek":
        client = Together(api_key=TOGETHER_AI_API)
        response = client.chat.completions.create(
            model="deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",
            messages=[{"role": "user", "content": query}]
        )
        return response.choices[0].message.content.strip()
    
# Function to extract code based on user query and selected model and language
def extract_code(query, model, language='python'):
    valid_languages = ['python', 'java', 'C++', 'javascript']

    # Validate if the provided language is supported
    if language not in valid_languages:
        raise ValueError(f"Invalid language selected. Supported languages are: {', '.join(valid_languages)}")

    if query:
        # Create a prompt based on the user's selected language
        prompt = f"""You are a highly skilled {language} code generator. Your task is to produce clean, efficient, and directly executable {language} code based on the user's request.

        Instructions:
        1. Understand the user's request precisely.
        2. Generate the complete {language} code to fulfill the request.
        3. Provide **only** the {language} code. Do not include any explanations, comments, docstrings, or example usage.
        4. The code should be self-contained and ready to run.
        
        User Request: {query}
        """
        
        # Call the appropriate model and get the response
        return call_model(model, prompt)