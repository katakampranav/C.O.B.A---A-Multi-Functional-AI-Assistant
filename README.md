# 🚀 COBA - Multi-Functional AI Assistant

![Image](https://github.com/user-attachments/assets/267d137c-c46b-4719-9a19-57c5f9e17e47)

*An all-in-one AI assistant with summarization, document processing, code generation, and NLP capabilities*

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
.
├── client/               # Next.js frontend
│   ├── src/app/          # App router
│   ├── components/       # UI components
│   └── lib/              # Config & utilities
│
├── server/               # Flask backend
│   ├── controllers/      # AI logic
│   ├── routes/           # API endpoints
│   └── app.py            # Main app
└── README.md
```

## 🤝 Contributing
1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit changes (`git commit -m 'Add some feature'`)
4. Push to branch (`git push origin feature/your-feature`)
5. Open a Pull Request

```
