import axios from "axios";

export const mergeTransitionDuration = 0.7;
export const SERVER_ADDRESS = "http://localhost:8080/";
export const customAxios = axios.create({
  baseURL: `${SERVER_ADDRESS}`,
  withCredentials: true,
});
