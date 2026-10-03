import axiosClient from './axiosClient';
export const getAllStudents = async () => {
    const res = await axiosClient.get('/students');
    return res.data;
};
