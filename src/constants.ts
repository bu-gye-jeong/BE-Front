import axios from "axios";

export const mergeTransitionDuration = 0.7;
export const IS_DEV = process.env.NODE_ENV === "development";
export const SERVER_ADDRESS = IS_DEV
  ? "http://localhost:8080/"
  : "https://bugyejeong-elemental.herokuapp.com/";
export const customAxios = axios.create({
  baseURL: `${SERVER_ADDRESS}`,
  withCredentials: true,
});
