import axios from 'axios';
import { message } from 'ant-design-vue';

// 创建 axios 实例
const request = axios.create({
  baseURL: 'http://204.141.229.30:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    console.log('发送请求:', config.url);
    // 在发送请求之前做些什么
    // 例如：添加 token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    console.log('收到响应:', response.data);
    // 直接返回响应数据，让具体的 API 函数处理业务逻辑
    return response;
  },
  (error) => {
    console.error('响应错误:', error);
    message.error(error.message || '请求失败');
    return Promise.reject(error);
  }
);

export default request; 