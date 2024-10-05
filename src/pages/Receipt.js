// src/App.js

import React, { useState } from 'react';
import axios from 'axios';
import styles from './Receipt.module.css'; // Importing the CSS module

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
    'College Examination Fee': 0,
    'Journal & Magazine': 0,
    'Cultural Activity': 0,
    'Prospectus & Admission Form': 0,
    'Others': 0,
  });

  const handleInputChange = (e) => {
    setPaymentDetails({
      ...paymentDetails,
      [e.target.name]: parseFloat(e.target.value) || 0, // Default to 0 if input is empty
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalAmount = Object.values(paymentDetails).reduce((acc, item) => acc + item, 0);
    const paymentData = { name, rollNo, amount: totalAmount, paymentDetails: { ...paymentDetails, Total: totalAmount } }; // Add Total key
    onSubmit(paymentData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.payment_Form}>
      <div className={styles.form_Group}>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className={styles.form_Group}>
        <label>Roll No:</label>
        <input
          type="text"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
          required
        />
      </div>

      {Object.keys(paymentDetails).map((key) => (
        <div className={styles.form_Group} key={key}>
          <label>{key}:</label>
          <input
            type="number"
            name={key}
            value={paymentDetails[key]}
            onChange={handleInputChange}
            min="0"
            required
          />
        </div>
      ))}

      <button type="submit" className={styles.submit_Button}>
        Generate Receipt
      </button>
      
    </form>
  );
}

function Receipt({ payment, receiptNo, onSave }) {
  if (!payment) return null;

  const totalAmount = payment.amount; 

  const convertToWords = (num) => {
    const a = [
      '',
      'One',
      'Two',
      'Three',
      'Four',
      'Five',
      'Six',
      'Seven',
      'Eight',
      'Nine',
      'Ten',
      'Eleven',
      'Twelve',
      'Thirteen',
      'Fourteen',
      'Fifteen',
      'Sixteen',
      'Seventeen',
      'Eighteen',
      'Nineteen',
    ];
    const b = [
      '',
      '',
      'Twenty',
      'Thirty',
      'Forty',
      'Fifty',
      'Sixty',
      'Seventy',
      'Eighty',
      'Ninety',
    ];
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
          str = b[Math.floor((n % 100) / 10)] + ' ' + a[n % 10] + ' ';
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
    <div className={styles.payment_ReceiptContainer}>
      <div className={styles.receipt_Heading}>
        <h3>MONEY RECEIPT</h3>
        <p>
          <strong>
            N.N.GHOSH SANATAN TEACHERS TRAINING COLLEGE <br />
            JAMUARY, KANKE, RANCHI-834006(JHARKHAND)
          </strong>
        </p>
        <p>Phone No: 06512913165</p>
      </div>

      <div className={styles.receipt_Header}>
        <div className={styles.receipt_Row}>
          <p>
            <strong>Receipt No:</strong> {receiptNo}
          </p>
          <p>
            <strong>Date:</strong> {new Date().toLocaleDateString()}
          </p>
        </div>
        <div className={styles.receipt_Row}>
          <p>
            <strong>Name:</strong> {payment.name}
          </p>
        </div>
        <div className={styles.receipt_Row}>
          <p>
            <strong>Roll No:</strong> {payment.rollNo}
          </p>
          <p>
            <strong>Course:</strong> B.Ed
          </p>
        </div>
      </div>

      <div className={styles.receipt_Body}>
        <table className={styles.payment_DetailsTable}>
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
        <h4>Received Rupees (in words): {totalInWords}</h4>
        <div className={styles.header}>
          <p>Thank You</p>
          <p>Authorized Signature</p>
        </div>
      </div>

      <div className={styles.print_ButtonContainer}>
        <button onClick={() => window.print()} className={styles.print_Button}>
          Print Receipt
        </button>
      </div>

      <div className={styles.save_ButtonContainer}>
        <button onClick={onSave} className={styles.save_Button}>
          Save to Database
        </button>
      </div>
    </div>
  );
}


 const baseURL = 'https://feebackend.onrender.com'

function App() {
  const [paymentData, setPaymentData] = useState(null);
  const [receiptNo, setReceiptNo] = useState('');
  const [date, setDate] = useState(new Date());

  const handleFormSubmit = (data) => {
    // Generate a unique receipt number
    const generatedReceiptNo = `NNG-${Math.floor(100000 + Math.random() * 900000)}`;
    setReceiptNo(generatedReceiptNo);
    setPaymentData(data);
  };

  const handleSaveToDatabase = async () => {
    if (!paymentData) return;

    const payload = {
      receiptno: receiptNo,
      name: paymentData.name,
      rollno: paymentData.rollNo,
      admissionfee: paymentData.paymentDetails['Admission & Registration Fee'],
      developmentFund: paymentData.paymentDetails['Development Fund'],
      tuitionFee: paymentData.paymentDetails['Tuition Fee'],
      libFee: paymentData.paymentDetails['Library Fee'],
      labFee: paymentData.paymentDetails['Laboratory Fee'],
      computerLabFee: paymentData.paymentDetails['Computer Laboratory Fee'],
      transportFee: paymentData.paymentDetails['Transport Fee'],
      gameFee: paymentData.paymentDetails['Game Fee'],
      examinationFee: paymentData.paymentDetails['College Examination Fee'],
      journalMagazine: paymentData.paymentDetails['Journal & Magazine'],
      culturalActivity: paymentData.paymentDetails['Cultural Activity'],
      prospectusFee: paymentData.paymentDetails['Prospectus & Admission Form'],
      other: paymentData.paymentDetails['Others'],
      totalAmount: paymentData.amount,
      date: date.toLocaleDateString()
    };

    try {
      const response = await axios.post(`${baseURL}/api/receipts`, payload);
      if (response.status === 201) {
        alert('Receipt saved to database successfully!');
      }
    } catch (error) {
      console.error('Error saving receipt:', error);
      if (error.response && error.response.data && error.response.data.error) {
        alert(`Error: ${error.response.data.error}`);
      } else {
        alert('Failed to save receipt. Please try again.');
      }
    }
  };

  return (
    <div className="App">
      {!paymentData ? (
        <PaymentForm onSubmit={handleFormSubmit} />
      ) : (
        <div className={styles.receipt_Page}>
          <Receipt payment={paymentData} receiptNo={receiptNo} onSave={handleSaveToDatabase} />
          <Receipt payment={paymentData} receiptNo={receiptNo} onSave={handleSaveToDatabase} />
        </div>
      )}
    </div>
  );
}

export default App;
