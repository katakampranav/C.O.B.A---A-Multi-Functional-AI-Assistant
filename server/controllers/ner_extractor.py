import os
from together import Together
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv() 
TOGETHER_AI_API_KEY = os.getenv("TOGETHER_AI_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

def call_model(model, query):
    if model == "LLama 3.3 Meta":
        client = Together(api_key=TOGETHER_AI_API_KEY)
        response = client.chat.completions.create(
            model="meta-llama/Llama-3.3-70B-Instruct-Turbo",
            messages=[{"role": "user", "content": f"{query}"}]
        )
        return response.choices[0].message.content.strip()

    elif model == "Google Gemini":
        client = genai.Client(api_key=GEMINI_API_KEY)
        response = client.models.generate_content(
            model="gemini-2.0-flash-exp",
            contents=f"{query}"
        )
        return response.text.strip()

    elif model == "Deepseek":
        client = Together(api_key=TOGETHER_AI_API_KEY)
        response = client.chat.completions.create(
            model="deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",
            messages=[{"role": "user", "content": f"{query}"}]
        )
        return response.choices[0].message.content.strip()
    
def extract_entities(text, model):
    if text:
        query = f'''You are an expert in Named Entity Recognition. Extract and categorize all named entities from the following text. Return the output in a clearly structured, easy-to-parse format grouped by entity types.

        Instructions:
        1. Identify all named entities in the input text.
        2. Group them under the following types where applicable: Persons, Locations, Dates, Organizations, Miscellaneous.
        3. Format each entity type as a header (e.g., Persons:).
        4. List each entity on a new line under its respective type, enclosed in double quotation marks (").
        5. If a category has no entities, exclude it entirely from the output.
        6. Avoid extra commentary or explanations — return only the structured result.

        Example Output Format:
        Persons:
        "Narendra Modi"
        "Joe Biden"

        Locations:
        "India"
        "USA"

        ......

        Text: {text}

        Entities:
        '''
        
        # Sentiment result
        return call_model(model, query)