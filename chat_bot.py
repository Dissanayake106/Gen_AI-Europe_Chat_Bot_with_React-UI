from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from dotenv import load_dotenv
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.prompts import PromptTemplate
from openai import OpenAI
from typing import List, Dict
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Configuration
DATA_DIR = "europe_data"
CHROMA_DB_DIR = "chroma_db"
EMBEDDING_MODEL = "sentence-transformers/all-mpnet-base-v2"

# System prompt template
EUROPE_RAG_PROMPT = """You are a knowledgeable assistant specialized in European information. 
Your responses must adhere to these rules:
1. Only provide information about Europe - its countries, regions, culture, history, politics, economy, etc.
2. If asked about other continents or global topics, politely decline and explain you specialize in Europe.
3. Base your answers strictly on the provided context documents about Europe.
4. If the context doesn't contain relevant information, say "I don't have information about that specific aspect of Europe."
5. For comparisons involving Europe and other regions, focus primarily on the European aspect.
6. Sports of Europe, Beauty of Europe, Details each Europe Country like Name, President, Capital etc can add.
7. If a question is too broad about Europe, ask for clarification about which specific country/region is meant.
"""

# RAG prompt template
RAG_PROMPT_TEMPLATE = """
Context: {context}

Question: {question}
"""

rag_prompt = PromptTemplate.from_template(RAG_PROMPT_TEMPLATE)

# Initialize OpenAI client for OpenRouter
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY")
)

# Global variables
vector_store = None


def load_and_chunk_documents() -> List[Dict]:
    """Load and chunk documents from europe_data directory"""
    try:
        loader = DirectoryLoader(
            DATA_DIR,
            glob="**/*.txt",
            loader_cls=TextLoader,
            show_progress=True
        )
        documents = loader.load()

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len
        )

        chunks = text_splitter.split_documents(documents)
        return chunks
    except Exception as e:
        logger.error(f"Error loading documents: {e}")
        return []


def create_vector_store(chunks: List[Dict]) -> Chroma:
    """Create Chroma vector store with HuggingFace embeddings"""
    try:
        embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)
        vector_store = Chroma.from_documents(
            documents=chunks,
            embedding=embeddings,
            persist_directory=CHROMA_DB_DIR
        )
        return vector_store
    except Exception as e:
        logger.error(f"Error creating vector store: {e}")
        return None


def initialize_components():
    """Initialize or load the vector store"""
    global vector_store
    try:
        if os.path.exists(CHROMA_DB_DIR):
            embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)
            vector_store = Chroma(
                persist_directory=CHROMA_DB_DIR,
                embedding_function=embeddings
            )
            logger.info("Loaded existing vector store")
        else:
            logger.info("Creating new vector store...")
            chunks = load_and_chunk_documents()
            if chunks:
                vector_store = create_vector_store(chunks)
                logger.info("Vector store created successfully")
            else:
                logger.error("No documents found to create vector store")
    except Exception as e:
        logger.error(f"Error initializing components: {e}")


def get_relevant_context(question: str) -> str:
    """Retrieve relevant context from vector store"""
    global vector_store
    try:
        if vector_store:
            docs = vector_store.similarity_search(question, k=3)
            return "\n\n".join([doc.page_content for doc in docs])
        return ""
    except Exception as e:
        logger.error(f"Error getting context: {e}")
        return ""


# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend


@app.route('/')
def serve_frontend():
    """Serve the React frontend (for production)"""
    return send_from_directory('../euro-bot-frontend/build', 'index.html')


@app.route('/static/<path:path>')
def serve_static(path):
    """Serve static files (for production)"""
    return send_from_directory('../euro-bot-frontend/build/static', path)


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'EURO-Bot API is running'})


@app.route('/api/chat', methods=['POST'])
def chat_endpoint():
    """Main chat endpoint"""
    try:
        data = request.get_json()
        user_input = data.get('message', '').strip()

        if not user_input:
            return jsonify({'error': 'Message is required'}), 400

        logger.info(f"Received message: {user_input}")

        # Retrieve relevant context
        context = get_relevant_context(user_input)

        # Format the RAG prompt
        formatted_prompt = rag_prompt.format(
            context=context,
            question=user_input
        )

        # Get AI response
        response = client.chat.completions.create(
            model="openai/gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": EUROPE_RAG_PROMPT},
                {"role": "user", "content": formatted_prompt}
            ],
            max_tokens=500,
            temperature=0.5
        )

        ai_response = response.choices[0].message.content
        logger.info(f"Generated response: {ai_response[:100]}...")

        return jsonify({
            'response': ai_response,
            'context_used': bool(context)
        })

    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        return jsonify({'error': 'Internal server error'}), 500


@app.route('/api/initialize', methods=['POST'])
def initialize_api():
    """Initialize the RAG system"""
    try:
        initialize_components()
        return jsonify({'status': 'success', 'message': 'Components initialized'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    # Initialize components when starting the server
    print("Initializing EURO-Bot components...")
    initialize_components()
    print("Starting Flask server on http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)