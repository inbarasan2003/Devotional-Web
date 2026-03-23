import axios from "axios";

//  Base URL
const API = "https://bhaktidev.devserver.live/api/mantras";

//  Axios instance
const api = axios.create({
  baseURL: API,
});

//  Attach token automatically
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("jwt_token");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });




export interface Mantra {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  photos: string[];
  audio: string;
  playCount: number;
  status: "active" | "inactive";
  createdAt: string;
}


//  GET ALL (with filters / pagination)
export const getMantras = async (params?: any) => {
  const res = await api.get("", {
    params,
  });

  return {
    mantras: res.data.data,
    meta: res.data.meta,
  };
};


//  GET BY ID
export const getMantraById = async (id: string) => {
  const res = await api.get(`/${id}`);
  return res.data.data;
};


//  CREATE
export const createMantra = async (data: any) => {
  const res = await api.post("", data);
  return res.data.data;
};


//  UPDATE
export const updateMantra = async (id: string, data: any) => {
  const res = await api.put(`/${id}`, data);
  return res.data.data;
};


//  DELETE
export const deleteMantra = async (id: string) => {
  const res = await api.delete(`/${id}`);
  return res.data.data;
};