import axiosClient from './axiosClient';
export const getAdminStats = async () => {
    const res = await axiosClient.get('/stats/admin');
    return res.data;
};
export const getStudentStats = async () => {
    const res = await axiosClient.get('/stats/me');
    return res.data;
};
