import json
from langchain.docstore.document import Document
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Qdrant
from qdrant_client import QdrantClient
from dotenv import load_dotenv
import os
load_dotenv()


with open("MedData.json","r",encoding="utf-8") as f:
    data =json.load(f)


docs = []
for item in data:
    medname = item["medname"]
    urls = item["urls"]
    details = item["details"]

    

    for section, content in details.items():

        section_url = None
        for url in urls:
            if section in url:
                section_url = url
                break

        docs.append(
            Document(
                page_content=content,
                metadata={
                    "medicine": medname,
                    "section": section,
                    "urls": section_url  
                }
            )
        )


embeddings=HuggingFaceEmbeddings(model_name="sentence-transformers/paraphrase-MiniLM-L3-v2")

client=QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY")
)

vector_store =Qdrant.from_documents(
    documents=docs,
    embedding=embeddings,
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY"),
    collection_name="MedData"
)

print(f"Uploaded {len(docs)} page-documents to Qdrant (no overlap)")