import axios from 'axios'
// const baseURL = 'http://10.0.63.114:9002/api/v1';
const baseURL = `https://apiryo.niaganusaabadi.co.id/api`;

const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 10000,
})

axiosInstance.interceptors.request.use(
    config => {
        const accessToken = localStorage.getItem('token')
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

axiosInstance.interceptors.response.use(
    response => {
        return response
    },
    error => {
        if (error.response && error.response.status === 401) {
            // Clear token and redirect to login if unauthorized
            localStorage.removeItem('token')
            window.location.href = '/SignIn'
        }
        return Promise.reject(error)
    }
)

export default axiosInstance