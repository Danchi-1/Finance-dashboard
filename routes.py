from fastapi import FastAPI
from pydantic import BaseModel
import sqlite3
from sqlite3 import IntegrityError
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# Mount the static files directory
app.mount("/static", StaticFiles(directory="c:/Users/USER/OneDrive/Documents/finance_dashboard/javascript"), name="static")

@app.get("/", response_class=HTMLResponse)
async def read_root():
    with open("c:/Users/USER/OneDrive/Documents/finance_dashboard/html/form.html", "r") as file:
        html_content = file.read()
    return HTMLResponse(content=html_content)

class Transaction(BaseModel):
    type: str
    amount: float
    category: str
    date: str

@app.post("/add_transaction/")
async def add_transaction(transaction: Transaction):
    conn = None
    try:
        conn = sqlite3.connect("finance.db")
        cursor = conn.cursor()

        # Check if the transaction already exists
        cursor.execute(
            "SELECT COUNT(*) FROM Transactions WHERE type = ? AND amount = ? AND category = ? AND date = ?",
            (transaction.type, transaction.amount, transaction.category, transaction.date)
        )
        exists = cursor.fetchone()[0]

        if exists:
            return {"message": "Transaction already exists"}

        # Insert the transaction if it doesn't exist
        cursor.execute(
            "INSERT INTO Transactions (type, amount, category, date) VALUES (?, ?, ?, ?)",
            (transaction.type, transaction.amount, transaction.category, transaction.date)
        )
        conn.commit()
        return {"message": "Transaction added successfully"}
    except IntegrityError as e:
        return {"message": f"Failed to add transaction due to a database integrity error: {str(e)}"}
    finally:
        if conn:
            conn.close()

@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    try:
        return FileResponse("favicon.ico")
    except FileNotFoundError:
        return {"message": "Favicon not found"}

@app.get("/get_transactions/")
async def get_transactions():
    conn = sqlite3.connect("finance.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Transactions")
    transactions = cursor.fetchall()
    conn.close()

    # Convert to a more readable format
    transactions_list = [{"type": t[0], "amount": t[1], "category": t[2], "date": t[3]} for t in transactions]
    return {"transactions": transactions_list}