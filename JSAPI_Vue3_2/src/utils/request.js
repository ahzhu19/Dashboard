import axios from 'axios';
import { message } from 'ant-design-vue';

// 创建 axios 实例
const service = axios.create({
  baseURL: 'https://your-ssh-server.com', // 替换为您的 SSH 服务器地址
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    // 例如：添加 token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    // 对请求错误做些什么
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    // 如果返回的状态码不是 200，则判断为错误
    if (res.code !== 200) {
      message.error(res.message || '请求失败');
      return Promise.reject(new Error(res.message || '请求失败'));
    }
    return res;
  },
  error => {
    console.error('响应错误:', error);
    message.error(error.message || '请求失败');
    return Promise.reject(error);
  }
);

export default service; 