// import React from 'react';
// import { Link } from 'react-router-dom';
// import './style.css';  // Import CSS file

// function StudentList({ students }) {
//   return (
//     <ul className="student-list">
//       {students.map(student => (
//         <li key={student._id} className="student-list-item">
//           {student.name} - {student.class} - Roll No: {student.rollNo}
//           <Link to={`/fee/${student._id}`} className="view-fee-link">
//             View Fee Details
//           </Link>
//         </li>
//       ))}
//     </ul>
//   );
// }

// export default StudentList;
import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';  // Import CSS file

function StudentList({ students }) {
  return (
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
  );
}

export default StudentList;
