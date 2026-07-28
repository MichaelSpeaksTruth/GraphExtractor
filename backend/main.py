import io
import base64
import fitz  # PyMuPDF
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="PDF Graph Extractor API")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the Vercel domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_images_from_pdf_bytes(pdf_bytes: bytes) -> list[dict]:
    images = []
    
    # Open the PDF from bytes in memory
    try:
        pdf_document = fitz.open(stream=pdf_bytes, filetype="pdf")
    except Exception as e:
        raise ValueError(f"Failed to open PDF: {str(e)}")

    for page_num in range(len(pdf_document)):
        page = pdf_document[page_num]
        image_list = page.get_images(full=True)
        
        for img_index, img in enumerate(image_list):
            xref = img[0]
            try:
                base_image = pdf_document.extract_image(xref)
                image_bytes = base_image["image"]
                image_ext = base_image["ext"]
                
                # Convert to base64
                encoded_image = base64.b64encode(image_bytes).decode('utf-8')
                
                images.append({
                    "page": page_num + 1,
                    "index": img_index + 1,
                    "ext": image_ext,
                    "data": f"data:image/{image_ext};base64,{encoded_image}"
                })
            except Exception as e:
                # Log error and continue if a specific image fails
                print(f"Failed to extract image xref {xref} on page {page_num + 1}: {e}")
                continue

    return images

@app.get("/")
def read_root():
    return {"status": "ok", "message": "PDF Graph Extractor API is running."}

@app.post("/extract")
async def extract_graphs(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    try:
        # Read the file into memory
        pdf_bytes = await file.read()
        
        # We can implement a size check here if we want to restrict memory
        # e.g., if len(pdf_bytes) > 15 * 1024 * 1024: raise HTTPException(...)
        
        extracted_images = extract_images_from_pdf_bytes(pdf_bytes)
        
        return {
            "filename": file.filename,
            "total_images": len(extracted_images),
            "images": extracted_images
        }
        
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
