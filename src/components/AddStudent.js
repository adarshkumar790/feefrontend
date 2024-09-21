import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; // Import toastify components
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toastify
import './AddStudent.css'; // Import the CSS file
const baseURL = 'https://feebackend.onrender.com';

function AddStudent() {
  const [name, setName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [rollNo, setRollNo] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newStudent = { name, class: studentClass, rollNo };
    try {
      await axios.post(`${baseURL}/api/students`, newStudent);
      toast.success('Student added successfully!'); // Show success toast
      setName('');
      setStudentClass('');
      setRollNo('');
      navigate('/'); // Redirect to home page
    } catch (error) {
      console.log(error);
      toast.error('Failed to add student. Please try again.'); // Show error toast
    }
  };

  return (
    <div className="add-student-container">
      <h1>Add Student</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
        </div>
        <div>
          <label>Session</label>
          <input 
            type="text" 
            value={studentClass} 
            onChange={(e) => setStudentClass(e.target.value)} 
          />
        </div>
        <div>
          <label>Roll Number</label>
          <input 
            type="number" 
            value={rollNo} 
            onChange={(e) => setRollNo(Number(e.target.value))} 
          />
        </div>
        <button type="submit">Add Student</button>
      </form>
      <ToastContainer /> {/* Include the toast container */}
    </div>
  );
}

export default AddStudent;
