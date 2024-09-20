import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import './PaymentReceipt.css';
const baseURL = 'https://feebackend.onrender.com'

function PaymentReceipt() {
  const { paymentId } = useParams();
  const location = useLocation();
  const [payment, setPayment] = useState(location.state?.payment || null);
  const [name, setName] = useState(location.state?.name || ''); // Retrieve name from state
  const [rollNo, setRollNo] = useState(location.state?.rollNo || ''); // Retrieve roll number from state

  useEffect(() => {
    if (!payment) {
      const fetchPayment = async () => {
        try {
          const response = await axios.get(`${baseURL}/api/payments/${paymentId}`);
          setPayment(response.data);
        } catch (error) {
          console.error(error);
          alert('Failed to fetch payment details.');
        }
      };
      fetchPayment();
    }
  }, [payment, paymentId]);

  if (!payment) {
    return <p>Loading...</p>;
  }

  const generateReceiptNumber = () => {
    const timestamp = Date.now();
    const randomPart = Math.floor(Math.random() * 10000);
    return `NNG-${randomPart}`;
  };

  const receiptNo = generateReceiptNumber();
  const paymentDetails = payment.paymentDetails || [];

  const staticFees = [
    { id: 'admission', description: 'Admission & Registration Fee', amount: 0 },
    { id: 'fund', description: 'Development Fund', amount: 0 },
    { id: 'institute', description: 'Institute Fee', amount: 0 },
    { id: 'library', description: 'Library Fee', amount: 0 },
    { id: 'laboratory', description: 'Laboratory Fee', amount: 0 },
    { id: 'lab', description: 'Computer Laboratory Fee', amount: 0 },
    { id: 'game', description: 'Game Fee', amount: 0 },
    { id: 'electricity', description: 'Electricity & Generator', amount: 0 },
    { id: 'exam', description: 'Exam Fee', amount: 0 },
    { id: 'journal', description: 'Journal & Magazine Fee', amount: 0 },
    { id: 'cultural', description: 'Cultural Fee', amount: 0 },
    { id: 'prospectus', description: 'Prospectus Fee & Admission Form', amount: 0 },
    { id: 'others', description: 'Others', amount: 0 },
  ];

  const mergedFees = staticFees.map(staticFee => {
    if (staticFee.description === 'Institute Fee') {
      return { ...staticFee, amount: payment.amount };
    }
    const dynamicFee = paymentDetails.find(fee => fee.description === staticFee.description);
    return dynamicFee ? { ...staticFee, amount: dynamicFee.amount } : staticFee;
  });

  // Calculate total amount
  const totalAmount = mergedFees.reduce((acc, item) => acc + item.amount, 0);
  const totalRow = { id: '--', description: 'Total', amount: totalAmount };
  mergedFees.push(totalRow);

  // Function to convert number to words
  const convertToWords = (num) => {
    const a = [
      '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
      'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
      'Seventeen', 'Eighteen', 'Nineteen'
    ];
    const b = [
      '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
    ];
    const g = [
      '', 'Thousand', 'Million', 'Billion'
    ];

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

  const totalInWords = convertToWords(totalAmount);

  return (
    <div className="payment-receipt-container">
      <div className="receipt-heading">
        <h3>MONEY RECEIPT</h3>
        <p><strong>N.N.GHOSH SANATAN TEACHERS TRAINING COLLEGE</strong> <br />
          JAMUARY, KANKE, RANCHI-834006(JHARKHAND)</p>
        <p>Mob: 9576035072</p>
      </div>

      <div className="receipt-header">
        <div className="header-row">
          <div className="left">
            <p><strong>Receipt No:</strong> {receiptNo}</p>
          </div>
          <div className="right">
            <p><strong>Date:</strong> {new Date(payment.date).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="header-row">
          <div className="left">
            <p><strong>Name:</strong> {name}</p>
          </div>
        </div>
        <div className="header-row">
          <div className="right">
            <p><strong>Roll No:</strong> {rollNo}</p>
          </div>
          <div className="left">
            <p><strong>Course:</strong> B.Ed</p>
          </div>
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
            {mergedFees.length > 0 ? (
              mergedFees.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.description}</td>
                  <td>{item.amount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No payment details available.</td>
              </tr>
            )}
          </tbody>
        </table>
        <h4>Received Rupees (in words): {totalInWords}</h4>
      </div>

      <div className="print-button-container">
        <button onClick={() => window.print()} className="print-button">Print Receipt</button>
      </div>
    </div>
  );
}

export default PaymentReceipt;
