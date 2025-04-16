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
        return response.choices[0].message.content

    elif model == "Google Gemini":
        client = genai.Client(api_key=GEMINI_API_KEY)
        response = client.models.generate_content(
            model="gemini-2.0-flash-exp",
            contents=f"{query}"
        )
        return response.text

    elif model == "Deepseek":
        client = Together(api_key=TOGETHER_AI_API_KEY)
        response = client.chat.completions.create(
            model="deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",
            messages=[{"role": "user", "content": f"{query}"}]
        )
        return response.choices[0].message.content
    
# Function to generte answers
def generate_answer(query, model):
    prompt = f"""You are a helpful and informative chatbot designed to answer user questions to the best of your ability.

            Instructions:

            1.  Read the user's question carefully.
            2.  Provide a clear, concise, and accurate answer.
            3.  If you don't know the answer, respond with "I'm sorry, I don't have the answer to that question."
            4.  Maintain a friendly and helpful tone.

            User Question: {query}

            Chatbot Response:
        """
    if query:
        
        answer = call_model(model, prompt)
        return answer