import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import './style.css';  // Import CSS file

function FeeCollection() {
  const [period, setPeriod] = useState('daily');
  const [collection, setCollection] = useState({ totalCollected: 0, totalDues: 0, payments: [] });
  const [specificDate, setSpecificDate] = useState(new Date());

  useEffect(() => {
    fetchCollectionData();
  }, [period]);

  const fetchCollectionData = async () => {
    let url = `http://localhost:5000/api/fees/collection/${period}`;

    if (period === 'specific') {
      const formattedDate = specificDate.toISOString().split('T')[0]; 
      url = `http://localhost:5000/api/fees/collection/date/${formattedDate}`;
    }

    try {
      const response = await axios.get(url);
      setCollection(response.data);
      toast.success('Collection data fetched successfully!'); // Show success toast
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch collection data.'); // Show error toast
    }
  };

  const handleDateChange = (date) => {
    setSpecificDate(date);
    setPeriod('specific');
  };

  return (
    <div className="fee-collection-container">
      <h1>Fee Collection</h1>
      <div>
        <label>Select Time Period: </label>
        <select 
          value={period} 
          onChange={(e) => setPeriod(e.target.value)}
          className="period-select"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="biannually">Bi-Annually</option>
          <option value="specific">Specific Date</option>
        </select>
      </div>
      {period === 'specific' && (
        <div>
          <label>Select Date: </label>
          <DatePicker
            selected={specificDate}
            onChange={handleDateChange}
            dateFormat="yyyy/MM/dd"
            className="date-picker"
          />
        </div>
      )}
      <div className="collection-summary">
        <h2>Collection Summary ({period}):</h2>
        <p>Total Collected: {collection.totalCollected}</p>
        <p>Total Dues: {collection.totalDues}</p>
        {collection.payments && collection.payments.length > 0 ? (
          <div>
            <h3>Payments:</h3>
            <ul>
              {collection.payments.map((payment, index) => (
                <li key={index}>
                  {payment.month} - {payment.amount} -{' '}
                  {new Date(payment.date).toLocaleDateString()}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No payments found for the selected period</p>
        )}
      </div>
      <ToastContainer /> {/* Add ToastContainer for notifications */}
    </div>
  );
}

export default FeeCollection;
