import axios, { AxiosError, type AxiosInstance } from 'axios'
import { error } from 'console';
import { toast } from 'react-toastify';
import HttpStatusCode from 'src/constants/httpStatusCode.enum';
import { AuthResponse } from 'src/types/auth.type';
import { clearAccessTokenFromLS, getAccessTokenFromLS, saveAccesTokenToLS } from './auth';

class Http {
    instance: AxiosInstance
    //  private: chỉ sử dụng được bên trong class, không mang ra bên ngoài được
    private accessToken: string;
    constructor() {
        this.accessToken = getAccessTokenFromLS() //Lấy token trên lc để mang xuống dưới
        this.instance = axios.create({
            baseURL: 'https://api-ecom.duthanhduoc.com/',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        // gửi lên API
        this.instance.interceptors.request.use((config) => {
            if( this.accessToken && config.headers) {
                config.headers.authorization = this.accessToken // 'Authorization': 'Bearer token'
                return config
            }
            return config
        }, (error) => {
            return Promise.reject(error)
        })
        // xử lý lỗi message của axios với interceptor
        this.instance.interceptors.response.use( (response) => {
            const {url} = response.config
            if(url === '/login' || url === '/register') {
                this.accessToken = (response.data as AuthResponse).data.access_token
                saveAccesTokenToLS(this.accessToken)
            } else if( url === 'logout') {
                this.accessToken = ''
                clearAccessTokenFromLS()
            }
            return response;
        }, function (error: AxiosError) {
            // HttpStatusCode.UnprocessableEntity lỗi 422
            if(error.response?.status !== HttpStatusCode.UnprocessableEntity) {
                const data: any | undefined = error.response?.data
                const message = data.message || error.message
                toast.error(message)
            }
            return Promise.reject(error);
        });
    }
}

const http = new Http().instance

export default http