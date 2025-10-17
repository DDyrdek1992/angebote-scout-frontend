from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3

app = FastAPI()

# CORS aktivieren für Frontend-Zugriff
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Datenbank Setup
def init_db():
    conn = sqlite3.connect('angebote.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS price_alerts (
                 id INTEGER PRIMARY KEY AUTOINCREMENT,
                 product TEXT,
                 email TEXT
                 )''')
    conn.commit()
    conn.close()

init_db()

# Datenmodelle
class ProductRequest(BaseModel):
    product: str

class AlertRequest(BaseModel):
    product: str
    email: str

@app.get("/")
async def root():
    return {"message": "Angebote Scout API läuft"}

@app.post("/search")
async def search_product(req: ProductRequest):
    # Beispiel-Daten (Mock statt Scraping)
    mock_offers = [
        {"store": "Lidl", "product": req.product, "price": "4,99 €", "valid_from": "Do"},
        {"store": "REWE", "product": req.product, "price": "5,49 €", "valid_from": "Fr"}
    ]
    return {"results": mock_offers}

@app.post("/alert")
async def set_price_alert(req: AlertRequest):
    conn = sqlite3.connect('angebote.db')
    c = conn.cursor()
    c.execute("INSERT INTO price_alerts (product, email) VALUES (?, ?)", (req.product, req.email))
    conn.commit()
    conn.close()
    return {"message": f"Preisalarm für {req.product} gesetzt."}