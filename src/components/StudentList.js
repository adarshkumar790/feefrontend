import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';  // Import CSS file

function StudentList({ students }) {
  return (
    <>
    
    <div>
      
      <ul className="student-list">
        {students.map(student => (
          <li key={student._id} className="student-list-item">
            {student.name} - {student.class} - Roll No: {student.rollNo}
            <Link to={`/fee/${student._id}`} state={{ 
              name: student.name,
              rollNo: student.rollNo
            }} className="view-fee-link">
              View Fee Details
            </Link>
          </li>
        ))}
      </ul>
      
      {/* <div className="button-container">
        <Link to="/add-student" className="add-student-button">Add Student</Link>
        <Link to="/generate-receipt" className="generate-receipt-button">Generate Receipt</Link>
      </div> */}
    </div>
    </>
  );
}

export default StudentList;
