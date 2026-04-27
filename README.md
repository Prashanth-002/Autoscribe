# 📘 AutoScribe – Personal Generative AI Note Assistant

## 🚀 Overview
AutoScribe is an AI-powered web application that transforms how users interact with documents by automating note-taking, summarization, and question answering.

Instead of manually reading lengthy PDFs and writing notes, AutoScribe uses Generative AI, Natural Language Processing (NLP), and semantic search to generate structured, context-aware notes instantly.

---

## 🎯 Key Features

### 📄 Document Processing
- Upload PDF files
- Automatic text extraction
- Smart chunking for efficient processing

### 🤖 AI-Powered Assistance
- Context-aware summarization
- Natural language question answering
- Intelligent note generation

### 🔍 Semantic Search
- Uses vector embeddings (Google Gemini)
- Retrieves meaning-based results (not just keywords)

### 📝 Rich Text Editor
- Highlight, annotate, and format notes
- Insert AI-generated answers directly
- Real-time editing and saving

### 📤 Export Functionality
- Export notes to DOCX format
- Maintain formatting (headings, lists, etc.)

### 🔐 Authentication & Security
- User authentication via Clerk
- Secure file storage with Convex DB

---

## ⚙️ Tech Stack

### 🖥️ Frontend
- Next.js
- React.js
- Tailwind CSS
- TipTap Editor

### ⚙️ Backend
- Node.js
- Express.js
- Convex (Backend-as-a-Service)

### 🤖 AI & Processing
- Google Gemini API
- LangChain
- Vector Embeddings

### 🗄️ Database
- Convex DB (Vector Store)

### 🔐 Authentication
- Clerk

---

## 🔄 Workflow

1. User uploads PDF  
2. System extracts text  
3. Text is split into chunks  
4. Embeddings are generated  
5. Stored in vector database  
6. User asks query / highlights text  
7. Semantic search retrieves relevant content  
8. AI generates structured answer  
9. Output shown in editor  
10. User edits and exports notes  

---

## 🧪 Installation & Setup

```bash
# Clone repository
git clone https://github.com/Prashanth-002/Autoscribe.git

# Navigate to project
cd autoscribe

# Install dependencies
npm install

# Run development server
npm run dev
