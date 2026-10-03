import axiosClient from './axiosClient';
export const getStudentActivities = async () => {
    const res = await axiosClient.get('/activities/my');
    return res.data;
};
export const getAllActivities = async () => {
    const res = await axiosClient.get('/activities');
    return res.data;
};
export const addActivity = async (activity) => {
    const res = await axiosClient.post('/activities', activity);
    return res.data;
};
export const updateActivityStatus = async (id, status) => {
    const res = await axiosClient.patch(`/activities/${id}/status`, { status });
    return res.data;
};
export const deleteActivity = async (id) => {
    await axiosClient.delete(`/activities/${id}`);
    return true;
};
export const getActivityById = async (id) => {
    const res = await axiosClient.get(`/activities/my`);
    return res.data.find(a => a.id === parseInt(id));
};
export const updateActivity = async (id, updatedData) => {
    // Only PENDING allowed
    const res = await axiosClient.put(`/activities/${id}`, updatedData);
    return res.data;
};
