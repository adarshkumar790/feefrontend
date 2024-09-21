import React, { useState } from 'react';
import './Receipt.css';

function PaymentForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({
    'Admission & Registration Fee': 0,
    'Development Fund': 0,
    'Tuition Fee': 0,
    'Library Fee': 0,
    'Laboratory Fee': 0,
    'Computer Laboratory Fee': 0,
    'Transport Fee': 0,
    'Game Fee': 0,
    'Electricity & Generator Fee': 0,
    'College Examination Fee': 0,
    'Journal & Magazine': 0,
    'Cultural Activity': 0,
    'Prospectus & Admission Form': 0,
    'Others': 0,
  });

  const handleInputChange = (e) => {
    setPaymentDetails({ ...paymentDetails, [e.target.name]: parseFloat(e.target.value) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalAmount = Object.values(paymentDetails).reduce((acc, item) => acc + item, 0);
    const paymentData = { name, rollNo, amount: totalAmount, paymentDetails };
    onSubmit(paymentData);
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="form-group">
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Roll No:</label>
        <input type="text" value={rollNo} onChange={(e) => setRollNo(e.target.value)} required />
      </div>

      {Object.keys(paymentDetails).map((key) => (
        <div className="form-group" key={key}>
          <label>{key}:</label>
          <input
            type="number"
            name={key}
            value={paymentDetails[key]}
            onChange={handleInputChange}
            required
          />
        </div>
      ))}

      <button type="submit" className="submit-button">Generate Receipt</button>
    </form>
  );
}

function Receipt({ payment }) {
  if (!payment) return null;

  const receiptNo = `NNG-${Math.floor(Math.random() * 10000)}`;
  
  const totalAmount = Object.keys(payment.paymentDetails).reduce(
    (sum, key) => key !== 'Total' ? sum + payment.paymentDetails[key] : sum, 
    0
  );

  const convertToWords = (num) => {
    const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
      'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen',
      'Eighteen', 'Nineteen'];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const g = ['', 'Thousand', 'Million', 'Billion'];

    let word = '';
    let i = 0;

    if (num === 0) return 'Zero';

    while (num > 0) {
      let n = num % 1000;
      if (n) {
        let str = '';
        if (n % 100 < 20) {
          str = a[n % 100] + ' ';
        } else {
          str = b[Math.floor(n % 100 / 10)] + ' ' + a[n % 10] + ' ';
        }
        if (Math.floor(n / 100) > 0) {
          str = a[Math.floor(n / 100)] + ' Hundred ' + str;
        }
        word = str + g[i] + ' ' + word;
      }
      num = Math.floor(num / 1000);
      i++;
    }
    return word.trim();
  };

  const totalInWords = convertToWords(totalAmount) + ' Rupees Only';

  return (
    <div className="payment-receipt-container">
      <div className="receipt-heading">
        <h3>MONEY RECEIPT</h3>
        <p><strong>N.N.GHOSH SANATAN TEACHERS TRAINING COLLEGE</strong></p>
        <p>Mob: 9576035072</p>
      </div>

      <div className="receipt-header">
        <div className="receipt-row">
          <p><strong>Receipt No:</strong> {receiptNo}</p>
          <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
        </div>
        <div className='receipt-row'>
          <p><strong>Name:</strong> {payment.name}</p>
        </div>
        <div className='receipt-row'>
          <p><strong>Roll No:</strong> {payment.rollNo}</p>
          <p><strong>Course:</strong> B.Ed</p>
        </div>
      </div>

      <div className="receipt-body">
        <table className="payment-details-table">
          <thead>
            <tr>
              <th>SI No</th>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(payment.paymentDetails).map((key, index) => (
              key !== 'Total' && (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{key}</td>
                  <td>{payment.paymentDetails[key]}</td>
                </tr>
              )
            ))}
            <tr>
              <td>{Object.keys(payment.paymentDetails).length}</td>
              <td><strong>Total</strong></td>
              <td><strong>{totalAmount}</strong></td>
            </tr>
          </tbody>
        </table>
        <h5>Rupees in words: {totalInWords}</h5>
      </div>

      <div className="print-button-container">
        <button onClick={() => window.print()} className="print-button">Print Receipt</button>
      </div>
    </div>
  );
}

function App() {
  const [paymentData, setPaymentData] = useState(null);

  const handleFormSubmit = (data) => {
    setPaymentData(data);
  };

  return (
    <div className="App">
      {!paymentData ? (
        <PaymentForm onSubmit={handleFormSubmit} />
      ) : (
        <Receipt payment={paymentData} />
      )}
    </div>
  );
}

export default App;
