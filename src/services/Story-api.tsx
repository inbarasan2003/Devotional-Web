import { axiosInstance } from "./auth-Instance"

//Get All
export const getStories = async()=>{
    const res = await axiosInstance.get("/stories/");
    return res.data.data;
};

//Get Single
export const getSIngleStory = async(id : string)=>{
    const res = await axiosInstance.get(`/stories/${id}`);
    return res.data.data
}

//Create
export const CreateStories = async (data: any)=>{
    const res = await axiosInstance.post("/stories/",data);
    return res.data.data;
};

//Update
export const UpdateStories = async(data: any)=>{
    const res = await axiosInstance.put(`/stories/${data.id}`,data)
    return res.data.data
}

//Delete
export const deleteStories = async (id: string)=>{
    const res = await axiosInstance.delete(`/stories/${id}`);
    return res.data.data;
};