// Mock API for activities
const mockActivities = [
  { id: 1, studentId: 2, studentName: 'Suhani', title: 'React Hackathon', category: 'Hackathon', date: '2026-09-15', status: 'VERIFIED', organizer: 'XYZ Institute' },
  { id: 2, studentId: 2, studentName: 'Suhani', title: 'Web Dev Workshop', category: 'Workshop', date: '2026-10-01', status: 'PENDING', organizer: 'ABC College' },
  { id: 3, studentId: 2, studentName: 'Suhani', title: 'Paper Presentation', category: 'Academic', date: '2026-08-20', status: 'REJECTED', organizer: 'DEF University' }
];

export const getStudentActivities = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...mockActivities];
};

export const getAllActivities = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...mockActivities];
};

export const addActivity = async (activity) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newAct = { ...activity, id: Date.now(), status: 'PENDING', studentId: 2, studentName: 'Suhani' };
  mockActivities.push(newAct);
  return newAct;
};

export const updateActivityStatus = async (id, status) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const act = mockActivities.find(a => a.id === id);
  if (act) act.status = status;
  return act;
};

export const deleteActivity = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockActivities.findIndex(a => a.id === id);
  if (index > -1) mockActivities.splice(index, 1);
  return true;
};

export const getActivityById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockActivities.find(a => a.id === parseInt(id));
};

export const updateActivity = async (id, updatedData) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockActivities.findIndex(a => a.id === parseInt(id));
  if (index > -1) {
    mockActivities[index] = { ...mockActivities[index], ...updatedData };
    return mockActivities[index];
  }
  throw new Error("Activity not found");
};
