
from flask import Flask, request, jsonify
from langchain.chains import RetrievalQA
from langchain_openai import ChatOpenAI
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
import os
from dotenv import load_dotenv
from langchain.prompts import ChatPromptTemplate
from langchain.chains import LLMChain


load_dotenv()

client = QdrantClient(
        url=os.getenv("QDRANT_URL"),
        api_key=os.getenv("QDRANT_API_KEY")
    )

# Embeddings
embeddings=HuggingFaceEmbeddings(model_name="sentence-transformers/paraphrase-MiniLM-L3-v2")

# Vector Stores
data_store = QdrantVectorStore(
        client=client,
        embedding=embeddings,
        collection_name="MedData"
    )

# Assuming you already built vector_store and llm
retriever = data_store.as_retriever(search_kwargs={"k": 3})


# --- Option 2: Simple Sentence Maker ---
def make_clean_response(docs, max_sentences=3):
    """
    Naive 'sentence maker' without LLM.
    Picks the first few sentences from retrieved docs.
    """
    text = " ".join([d.page_content for d in docs])
    sentences = [s.strip() for s in text.replace("\n", " ").split(". ") if s.strip()]
    return ". ".join(sentences[:max_sentences]) + "."

llm = ChatOpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",   
    model="openai/gpt-oss-20b:free",                
    temperature=0
)


prompt = ChatPromptTemplate.from_messages([
    ("system", """You are a knowledgeable assistant for a medical database.  
Only answer based on the provided context.  
Keep your response concise, factual, and in Markdown format.  
If the answer is not found in the context, say: 'I don't know based on the provided documents'.""" ),
    ("human", "{context}\nQuestion: {question}")
])


# --- LLM RAG pipeline ---
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=retriever,
    chain_type_kwargs={"prompt": prompt}
)


app = Flask(__name__)

@app.route("/query", methods=["POST"])
def query_endpoint():
    data = request.get_json()
    query = data.get("query")
    mode = data.get("mode", "llm").lower()

    if not query:
        return jsonify({"error": "Query is required"}), 400

    try:
        if mode == "llm":
            response = qa_chain.run(query)

        elif mode == "retriever":
            docs = retriever.get_relevant_documents(query)
            response = "\n---\n".join([d.page_content for d in docs])

        elif mode == "clean":
            docs = retriever.get_relevant_documents(query)
            response = make_clean_response(docs)

        else:
            return jsonify({"error": "Invalid mode. Choose from: llm / retriever / clean"}), 400

        return jsonify({
            "query": query,
            "mode": mode,
            "response": response
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)

