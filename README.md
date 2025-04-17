<div align="center">

![COBA Logo](https://github.com/user-attachments/assets/267d137c-c46b-4719-9a19-57c5f9e17e47)

# Comprehensive Omni-Functional Bot for Assistance

</div>

## 🌟 Features

### 🗂️ Document Processing
- PDF/DOCX/TXT file upload & analysis
- Document-based Q&A with RAG
- Text summarization

### 💬 Conversational AI
- Generative Q&A chatbot
- Sentiment analysis
- Named Entity Recognition (NER)

### 💻 Developer Tools
- Code generation & explanation
- Syntax error detection

## 🛠️ Tech Stack

### Frontend
- Next.js 15 (App Router)
- TypeScript
- Shadcn UI Components
- Tailwind CSS

### Backend
- Python Flask
- Google Generative AI
- Together AI
- Hugging Face Transformers (for NER)

## 🚀 Deployment

### Frontend (Vercel)
```bash
https://coba-ai-assistant.vercel.app
```

### Backend (Render)
```bash
https://c-o-b-a-a-multi-functional-ai-assistant.onrender.com
```

## 🖥️ Local Development

### Prerequisites
- Node.js 20+
- Python 3.11+
- Git

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

### Backend Setup
```bash
cd server
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
pip install -r requirements.txt
flask run
```

## 🔧 Environment Variables

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Backend (`.env`)
```env
GOOGLE_API_KEY=your_key_here
TOGETHER_AI_API_KEY=your_key_here
FLASK_ENV=development
```

## 📂 Project Structure

```
COBA/
    ├── README.md
    ├── client/
    │   ├── components.json
    │   ├── next.config.ts
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── postcss.config.mjs
    │   ├── tsconfig.json
    │   ├── vercel.json
    │   ├── .gitignore
    │   ├── public/
    │   │   └── assets/
    │   └── src/
    │       ├── app/
    │       │   ├── globals.css
    │       │   ├── layout.tsx
    │       │   ├── page.tsx
    │       │   ├── chatbot/
    │       │   │   └── page.tsx
    │       │   ├── code-generation/
    │       │   │   └── page.tsx
    │       │   ├── name-entity-recognition/
    │       │   │   └── page.tsx
    │       │   ├── sentimental-analysis/
    │       │   │   └── page.tsx
    │       │   └── summarization/
    │       │       └── page.tsx
    │       ├── components/
    │       │   ├── carousel-comp.tsx
    │       │   ├── features-section.tsx
    │       │   ├── footer.tsx
    │       │   ├── hero-section.tsx
    │       │   ├── loading.tsx
    │       │   ├── logo.tsx
    │       │   ├── mode-toggle.tsx
    │       │   ├── model-section.tsx
    │       │   ├── navbar.tsx
    │       │   ├── theme-provider.tsx
    │       │   └── ui/
    │       │       ├── avatar.tsx
    │       │       ├── badge.tsx
    │       │       ├── button.tsx
    │       │       ├── card.tsx
    │       │       ├── carousel.tsx
    │       │       ├── dropdown-menu.tsx
    │       │       ├── scroll-area.tsx
    │       │       ├── select.tsx
    │       │       ├── separator.tsx
    │       │       ├── sheet.tsx
    │       │       ├── switch.tsx
    │       │       ├── tabs.tsx
    │       │       ├── textarea.tsx
    │       │       └── tooltip.tsx
    │       └── lib/
    │           ├── config.ts
    │           └── utils.ts
    └── server/
        ├── app.py
        ├── requirements.txt
        ├── .gitignore
        ├── controllers/
        │   ├── __init__.py
        │   ├── code_generator.py
        │   ├── generative_qa.py
        │   ├── ner_extractor.py
        │   ├── rag_based_qa.py
        │   ├── sentiment_analyzer.py
        │   └── summarizer.py
        └── routes/
            ├── __init__.py
            ├── code_generation_route.py
            ├── generative_qa_route.py
            ├── ner_controller_route.py
            ├── rag_based_qa_controller_route.py
            ├── sentiment_route.py
            └── summarize_route.py
```

## 🤝 Contributing
1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit changes (`git commit -m 'Add some feature'`)
4. Push to branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## Author

This COBA application was developed by :
-	[@katakampranav](https://github.com/katakampranav)
-	Repository : https://github.com/katakampranav/COBA

## Feedback

For any feedback or queries, please reach out to me at katakampranavshankar@gmail.com.

```
