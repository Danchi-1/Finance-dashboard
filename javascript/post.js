document.getElementById('transactionForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const type = document.getElementById('type').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const formattedDate = document.getElementById('date').value; // Use the date directly

    // Validate amount
    if (isNaN(amount)) {
        alert('Please enter a valid number for the amount.');
        return;
    }

    console.log({ type, amount, category, date: formattedDate }); // Log the data being sent

    try {
        const response = await fetch('/add_transaction/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, amount, category, date: formattedDate })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        alert(result.message); // Display the message from the backend
    } catch (error) {
        console.error('Error:', error);
        alert(`An error occurred: ${error.message}`);
    }
});

 const transactionForm = document.getElementById('transactionForm');
        const transactionsTable = document.getElementById('transactionsTable').querySelector('tbody');
        const adviceDiv = document.getElementById('advice');

        // Fetch transactions from the backend and display them
        async function fetchTransactions() {
            const response = await fetch('/get_transactions/');
            const data = await response.json();
            const transactions = data.transactions;

            // Clear the table
            transactionsTable.innerHTML = '';

            let totalIncome = 0;
            let totalExpense = 0;

            // Populate the table with transactions
            transactions.forEach(transaction => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${transaction.type}</td>
                    <td>${transaction.amount}</td>
                    <td>${transaction.category}</td>
                    <td>${transaction.date}</td>
                `;
                transactionsTable.appendChild(row);

                // Calculate totals
                if (transaction.type.toLowerCase() === 'income') {
                    totalIncome += transaction.amount;
                } else if (transaction.type.toLowerCase() === 'expense') {
                    totalExpense += transaction.amount;
                }
            });

            // Generate financial advice
            const balance = totalIncome - totalExpense;
            if (balance > 0) {
                adviceDiv.textContent = `Great job! You have a positive balance of $${balance.toFixed(2)}. Keep saving!`;
                adviceDiv.style.color = 'green';
            } else if (balance < 0) {
                adviceDiv.textContent = `Warning! You have a negative balance of $${balance.toFixed(2)}. Try to cut down on expenses.`;
                adviceDiv.style.color = 'red';
            } else {
                adviceDiv.textContent = `Your balance is zero. Plan your finances carefully.`;
                adviceDiv.style.color = 'orange';
            }
        }

        // Handle form submission
        transactionForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const type = document.getElementById('type').value;
            const amount = parseFloat(document.getElementById('amount').value);
            const category = document.getElementById('category').value;
            const date = document.getElementById('date').value;

            // Validate amount
            if (isNaN(amount)) {
                alert('Please enter a valid number for the amount.');
                return;
            }

            // Send the transaction to the backend
            const response = await fetch('/add_transaction/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, amount, category, date })
            });

            if (response.ok) {
                alert('Transaction added successfully!');
                fetchTransactions(); // Refresh the table
            } else {
                alert('Failed to add transaction.');
            }

            // Reset the form
            transactionForm.reset();
        });

        // Fetch and display transactions on page load
        fetchTransactions();