import React, { useEffect, useState } from 'react';
import { getAllStudents } from '../../api/studentApi';
import { Eye } from 'lucide-react';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  
  useEffect(() => {
    getAllStudents().then(setStudents);
  }, []);

  return (
    <div>
      <div style={{marginBottom: '24px'}}>
        <h1 style={{color: 'var(--color-primary)', marginBottom: '8px'}}>Students List</h1>
        <p className="text-muted">View all registered students in the system.</p>
      </div>

      <div className="card" style={{padding: '0'}}>
        <div className="table-container" style={{boxShadow: 'none', borderRadius: '0'}}>
          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Year</th>
                <th>Total Activities</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td><strong>{student.studentId}</strong></td>
                  <td>{student.name}<br/><span style={{fontSize:'12px', color: 'var(--color-text-light)'}}>{student.email}</span></td>
                  <td>{student.department}</td>
                  <td>{student.year}</td>
                  <td>{student.totalActivities}</td>
                  <td>
                    <button className="btn btn-icon btn-secondary" title="View Details">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr><td colSpan="6" style={{textAlign: 'center', padding: '40px'}}>No students found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminStudents;
