import { axiosInstance } from "./auth-Instance"

export const getStories = async()=>{
    const res = await axiosInstance.get("/stories/");
    return res.data.data;
};

export const CreateStories = async (data: any)=>{
    const res = await axiosInstance.post("/stories/",data);
    return res.data.data;
};

export const deleteStories = async (id: string)=>{
    const res = await axiosInstance.delete(`/stories/${id}`);
    return res.data.data;
};