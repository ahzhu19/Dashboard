import axios from 'axios';

// 模拟数据
const stationData = {
  stations: [
    {
      id: '155544887',
      status: 'danger',
      latitude: 32.016212,
      longitude: 120.864608
    },
    {
      id: '155544888',
      status: 'warning',
      latitude: 32.026212,
      longitude: 120.874608
    },
    {
      id: '155544889',
      status: 'normal',
      latitude: 32.006212,
      longitude: 120.854608
    }
  ],
  
  loadData: [
    { time: '18:00', value: 2 },
    { time: '18:15', value: 2 },
    { time: '18:30', value: 2 },
    { time: '18:45', value: 2 },
    { time: '19:00', value: 2 },
    { time: '19:15', value: 1 }
  ]
};

// 获取所有充电站
export const getAllStations = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    return stationData.stations;
  } catch (error) {
    console.error('获取充电站列表失败:', error);
    throw new Error('获取充电站列表失败');
  }
};

// 获取充电站详情
export const getStationDetail = async (stationId) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    const station = stationData.stations.find(s => s.id === stationId) || {};
    return {
      ...station,
      voltage: 221,
      current: 0.5,
      power: 0.01,
      abnormalStatus: '无',
      prediction: '分类4'
    };
  } catch (error) {
    console.error('获取充电站详情失败:', error);
    throw new Error('获取充电站详情失败');
  }
};

// 获取充电站负荷数据
export const getStationLoadData = async (stationId) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    return stationData.loadData;
  } catch (error) {
    console.error('获取充电站负荷数据失败:', error);
    throw new Error('获取充电站负荷数据失败');
  }
}; 