import http from "src/others/http";
import { AuthResponse } from "src/types/auth.type";

export const registerAccount = (body: {email: string; password: string}) => http.post<AuthResponse>('/register', body)
export const login = (body: {email: string; password: string}) => http.post<AuthResponse>('/login', body)
export const logout = () => http.post('/logout')