import axios from "./axios"

const API = "http://localhost:3000/api";

export const registerRequest = (user) => axios.post(`/signup`, user);

export const loginRequest = (user) => axios.post(`/signin`, user);

export const verifyTokenRequest = () => axios.get("/verify")
