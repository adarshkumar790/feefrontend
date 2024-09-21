import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentList from '../components/StudentList';
import FeeCollection from '../components/FeeCollection';
import { Link } from 'react-router-dom';
import './style.css';  // Import CSS file
const baseURL = 'https://feebackend.onrender.com'


function Home() {
  const [students, setStudents] = useState([]);
  const [classFilter, setClassFilter] = useState('');

  useEffect(() => {
    if (classFilter) {
      axios.get(`${baseURL}/api/students/${classFilter}`)
        .then(response => setStudents(response.data))
        .catch(error => console.log(error));
    }
  }, [classFilter]);

  return (
    <div className="home-container">
      <h1>Student List</h1>
      <div className="button-container">
        <Link to="/add-student" className="add-student-button">Add Student</Link>
        <Link to="/receipt" className="generate-receipt-button">Generate Receipt</Link>
      </div>
      <div className="filter-container">
        <label>Filter by Session:</label>
        <input 
          type="text" 
          value={classFilter} 
          onChange={(e) => setClassFilter(e.target.value)} 
        />
      </div>
      <StudentList students={students} />
      <FeeCollection />
    </div>
  );
}

export default Home;
