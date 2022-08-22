import axios, { AxiosError, AxiosInstance } from "axios";
import { redirect } from "next/dist/server/api-utils";
import Router from "next/router";
import { useSelector } from "react-redux";
import { selectAuthState } from "../store/slices/authSlice";

export const useApi = (): AxiosInstance => {
  const authState = useSelector(selectAuthState);

  const instance = axios.create({
    baseURL: "http://localhost:3000/",
    timeout: 10000,
    headers: { Authorization: `Bearer ${authState.authToken}` },
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 401) {
        Router.push("/");
      }
      throw error;
    }
  );
  return instance;
};
