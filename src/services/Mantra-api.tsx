import { axiosInstance } from "./auth-Instance";

// GET ALL
export const getMantras = async () => {
  const res = await axiosInstance.get("/mantras/");
  return res.data.data;
};

// GET SINGLE
export const getSingleMantra = async (id: string) => {
  const res = await axiosInstance.get(`/mantras/${id}`);
  return res.data.data;
};

// CREATE
export const createMantra = async (data: any) => {
  const res = await axiosInstance.post("/mantras/", data);
  return res.data.data;
};

// UPDATE
export const updateMantra = async (data: any) => {
  const res = await axiosInstance.put(`/mantras/${data.id}`, data);
  return res.data.data;
};

// DELETE
export const deleteMantra = async (id: string) => {
  const res = await axiosInstance.delete(`/mantras/${id}`);
  return res.data.data;
};