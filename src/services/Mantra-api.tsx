import { axiosInstance } from "./auth-Instance";

export const getMantras = async () => {
  const res = await axiosInstance.get("/mantras/");
  return res.data.data;
};

export const createMantra = async (data: any) => {
  const res = await axiosInstance.post("/mantras/", data);
  return res.data.data;
};