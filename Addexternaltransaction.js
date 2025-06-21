// Show/hide admin transaction form when correct code is entered
const adminCodeInput = document.getElementById('admin-code');
const adminFormDiv = document.getElementById('admin-transaction-form');

adminCodeInput.addEventListener('input', () => {
    if (adminCodeInput.value === '3237') {
        adminFormDiv.style.display = 'block';
    } else {
        adminFormDiv.style.display = 'none';
    }
});

// Handle admin transaction form submit
document.getElementById('add-transaction-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const desc = document.getElementById('admin-desc').value;
    const amountValue = parseFloat(document.getElementById('admin-amount').value);
    const balanceValue = parseFloat(document.getElementById('admin-balance').value);
    const status = document.getElementById('admin-status').value;

    // Send data to backend
    try {
        const response = await fetch('https://ubsbackend.onrender.com/api/addtransaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                description: desc,
                amount: amountValue,
                balance: balanceValue,
                status: status,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to add transaction');
        }

        // Format amount
        const amountFormatted = (amountValue >= 0 ? '+' : '−') + '$' + Math.abs(amountValue).toLocaleString(undefined, { minimumFractionDigits: 2 });

        // Format balance
        const balanceFormatted = '$' + balanceValue.toLocaleString(undefined, { minimumFractionDigits: 2 });

        // Use today's date
        const currentDate = new Date().toLocaleDateString('en-US');

        // Insert into transaction history
        const tbody = document.querySelector('.transaction-history tbody');
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${currentDate}</td>
            <td>${desc}</td>
            <td>${amountFormatted}</td>
            <td>${status === 'Completed' ? balanceFormatted : status}</td>
        `;
        tbody.insertBefore(newRow, tbody.firstChild);

        // Reset form & hide
        this.reset();
        adminCodeInput.value = '';
        adminFormDiv.style.display = 'none';

        // Show success
        Swal.fire({
            icon: 'success',
            title: 'Transaction Added',
            text: `Transaction "${desc}" has been added successfully!`
        });

    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message
        });
    }
});
