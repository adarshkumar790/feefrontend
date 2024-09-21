import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import './FeePage.css';  // Importing the CSS file

function FeePage() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState(location.state?.name || ''); // Retrieve name from state
  const [rollNo, setRollNo] = useState(location.state?.rollNo || ''); // Retrieve roll number from state
  const [feeDetails, setFeeDetails] = useState(null);
  const [totalFees, setTotalFees] = useState(0);
  const [dues, setDues] = useState(0);
  const [payments, setPayments] = useState([]);
  const [paymentMonth, setPaymentMonth] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [newTotalFees, setNewTotalFees] = useState(0);
  const baseURL = 'https://feebackend.onrender.com'

  useEffect(() => {
    axios
      .get(`${baseURL}/api/fees/${studentId}`)
      .then((response) => {
        if (response.data) {
          setFeeDetails(response.data);
          setTotalFees(response.data.totalFees);
          setDues(response.data.dues);
          setPayments(response.data.payments);
        } else {
          setFeeDetails(null);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error('Failed to fetch fee details.');
      });
  }, [studentId]);

  const handleAddFeeDetails = async () => {
    if (newTotalFees <= 0) {
      toast.error('Please enter a valid total fee amount.');
      return;
    }

    try {
      const response = await axios.post(`${baseURL}/api/fees`, {
        studentId,
        totalFees: newTotalFees,
        paidFees: 0,
        dues: newTotalFees,
        payments: []
      });
      toast.success('Fee details added successfully.');
      setFeeDetails(response.data);
      setTotalFees(newTotalFees);
      setDues(newTotalFees);
      setNewTotalFees(0);
    } catch (error) {
      console.log(error.response ? error.response.data : error.message);
      toast.error('Failed to add fee details.');
    }
  };

  const handleAddPayment = async () => {
    if (!paymentMonth || paymentAmount <= 0) {
      toast.error('Please fill in all fields with valid values.');
      return;
    }

    const newPayment = {
      month: paymentMonth,
      amount: parseFloat(paymentAmount),
      date: new Date() // Setting the date to current date
    };

    const updatedPayments = [...payments, newPayment];
    const updatedPaidFees = feeDetails.paidFees + parseFloat(paymentAmount);
    const updatedDues = totalFees - updatedPaidFees;

    try {
      const response = await axios.put(`${baseURL}/api/fees/${studentId}`, {
        totalFees,
        paidFees: updatedPaidFees,
        dues: updatedDues,
        payments: updatedPayments
      });
      toast.success('Payment added successfully.');
      setFeeDetails(response.data);
      setPayments(updatedPayments);
      setDues(updatedDues);
      setPaymentMonth('');
      setPaymentAmount('');
    } catch (error) {
      console.log(error.response ? error.response.data : error.message);
      toast.error('Failed to add payment.');
    }
  };

  const handleViewReceipt = (payment) => {
    navigate(`/payment-receipt/${payment._id}`, { 
      state: { 
        payment,
        name, // Pass the student's name
        rollNo // Pass the roll number
      } 
    });
  };

  return (
    <div className="fee-page-container">
      <h1>Fee Details</h1>
      {feeDetails ? (
        <div>
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Roll No:</strong> {rollNo}</p>
          <p><strong>Total Fees:</strong> {feeDetails.totalFees}</p>
          <p><strong>Paid Fees:</strong> {feeDetails.paidFees}</p>
          <p><strong>Dues:</strong> {dues}</p>
          <h2>Payments</h2>
          <ul className="payment-list">
            {payments.map((payment, index) => (
              <li key={index} className="payment-item">
                <span>{payment.month} - {payment.amount} - {new Date(payment.date).toLocaleDateString()}</span>
                <button 
                  onClick={() => handleViewReceipt(payment)} 
                  className="view-receipt-btn"
                >
                  View Receipt
                </button>
              </li>
            ))}
          </ul>
          <div className="add-payment-container">
            <h3>Add Payment</h3>
            <div className="form-group">
              <label>Installment</label>
              <input 
                type="text" 
                value={paymentMonth} 
                onChange={(e) => setPaymentMonth(e.target.value)} 
                className="input-field"
                placeholder="e.g., January"
              />
            </div>
            <div className="form-group">
              <label>Amount</label>
              <input 
                type="number" 
                value={paymentAmount} 
                onChange={(e) => setPaymentAmount(e.target.value)} 
                className="input-field"
                placeholder="Enter amount"
              />
            </div>
            <button onClick={handleAddPayment} className="submit-btn">Add Payment</button>
          </div>
        </div>
      ) : (
        <div className="no-fee-details">
          <p>No fee details found for this student.</p>
          <div className="add-fee-container">
            <h3>Add Fee Details</h3>
            <div className="form-group">
              <label>Total Fees</label>
              <input 
                type="number" 
                value={newTotalFees} 
                onChange={(e) => setNewTotalFees(e.target.value)} 
                className="input-field"
                placeholder="Enter total fees"
              />
            </div>
            <button onClick={handleAddFeeDetails} className="submit-btn">Add Fee Details</button>
          </div>
        </div>
      )}
      <ToastContainer /> {/* Add ToastContainer for notifications */}
    </div>
  );
}

export default FeePage;
