// Mock API for students
export const getAllStudents = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    { id: 2, name: 'Suhani', studentId: 'S12345', email: 'student@sams.edu', department: 'Computer Science', year: '3rd Year', division: 'A', totalActivities: 3 },
    { id: 3, name: 'Rahul', studentId: 'S12346', email: 'rahul@sams.edu', department: 'Information Technology', year: '2nd Year', division: 'B', totalActivities: 1 },
    { id: 4, name: 'Priya', studentId: 'S12347', email: 'priya@sams.edu', department: 'Electronics', year: '4th Year', division: 'A', totalActivities: 5 }
  ];
};
