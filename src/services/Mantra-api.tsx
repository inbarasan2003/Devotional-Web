import { axiosInstance } from "./auth-Instance";

// GET
export const getMantras = async () => {
  const res = await axiosInstance.get("/mantras/");
  return res.data.data;
};

// CREATE
export const createMantra = async (data: any) => {
  const res = await axiosInstance.post("/mantras/", data);
  return res.data.data;
};

// 🔥 DELETE
export const deleteMantra = async (id: string) => {
  const res = await axiosInstance.delete(`/mantras/${id}`);
  return res.data.data;
};