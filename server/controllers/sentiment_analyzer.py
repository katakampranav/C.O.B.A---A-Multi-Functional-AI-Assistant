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
    
def analyze_sentiment(text, model):
    if text:
        query = f'''You are a sentiment analysis expert. Your task is to analyze the following text and classify its overall sentiment.

        Instructions:
        1. Read the provided text carefully.
        2. Identify the dominant emotional tone.
        3. Classify the sentiment as either positive, negative, or neutral.
        4. **Provide only the sentiment classification (positive, negative, or neutral) without any additional explanation or analysis.**

        Text: {text}

        Sentiment: '''
        
        # Sentiment result
        return call_model(model, query)