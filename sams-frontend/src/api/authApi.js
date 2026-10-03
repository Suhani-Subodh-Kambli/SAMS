// Mock API for authentication
export const login = async (email, password) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  if (email === 'admin@sams.edu' && password === 'admin') {
    return {
      user: {
        id: 1,
        name: 'Admin User',
        email: 'admin@sams.edu',
        role: 'ADMIN'
      }
    };
  } else if (email === 'student@sams.edu' && password === 'student') {
    return {
      user: {
        id: 2,
        name: 'Suhani',
        studentId: 'S12345',
        email: 'student@sams.edu',
        department: 'Computer Science',
        year: '3rd Year',
        division: 'A',
        role: 'STUDENT'
      }
    };
  }
  throw new Error('Invalid credentials');
};
