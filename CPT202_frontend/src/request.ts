import axios from 'axios'
import { message } from 'ant-design-vue'


// Distinguish between development and production environments
const DEV_BASE_URL = "http://localhost:8080";
const PROD_BASE_URL = "http://118.31.173.230";
// Create an Axios instance
const myAxios = axios.create({
  baseURL: PROD_BASE_URL,
  timeout: 300000,
  withCredentials: true,
});


// Global request interceptor
myAxios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  },
)

// Global response interceptor
myAxios.interceptors.response.use(
  function (response) {
    const { data } = response
    // Not Login
    if (data.code === 40100) {
      // It is not a request to obtain user information, and the user is not currently on the user login page, so it will jump to the login page.
      if (
        !response.request.responseURL.includes('user/get/login') &&
        !window.location.pathname.includes('/user/login')
      ) {
        message.warning('Please Login first!')
        window.location.href = `/user/login?redirect=${window.location.href}`
      }
    }
    return response
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  },
)

export default myAxios
