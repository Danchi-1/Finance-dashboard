CREATE TABLE Transactions (
    id INTEGER PRIMARY KEY,
    type TEXT NOT NULL,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    date DATE NOT NULL,
    UNIQUE(type, amount, category, date)
);
