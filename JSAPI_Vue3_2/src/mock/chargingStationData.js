// 充电站详情数据
export const mockStations = {
  '155544887': {
    id: '155544887',
    status: 'danger',
    statusText: '危险',
    voltage: 380,
    current: 2331,
    loadPercentage: 95,
    loadLimit: 100,
    todayChargingCount: 120,
    abnormalCount: 5,
    latitude: 32.016212,
    longitude: 120.864608,
    suggestion: '建议立即检查设备状态，可能存在过载风险'
  },
  '155544888': {
    id: '155544888',
    status: 'warning',
    statusText: '预警',
    voltage: 380,
    current: 60,
    loadPercentage: 75,
    loadLimit: 100,
    todayChargingCount: 90,
    abnormalCount: 2,
    latitude: 32.026212,
    longitude: 120.874608,
    suggestion: '负荷较高，建议关注设备运行状态'
  },
  '155544889': {
    id: '155544889',
    status: 'normal',
    statusText: '正常',
    voltage: 380,
    current: 40,
    loadPercentage: 50,
    loadLimit: 100,
    todayChargingCount: 60,
    abnormalCount: 0,
    latitude: 32.036212,
    longitude: 120.884608,
    suggestion: '运行状态良好，可继续使用'
  }
};

// 充电站负荷数据
export const mockLoadData = {
  '155544887': [
    { time: '00:00', value: 30 },
    { time: '02:00', value: 25 },
    { time: '04:00', value: 20 },
    { time: '06:00', value: 35 },
    { time: '08:00', value: 60 },
    { time: '10:00', value: 75 },
    { time: '12:00', value: 80 },
    { time: '14:00', value: 85 },
    { time: '16:00', value: 90 },
    { time: '18:00', value: 70 },
    { time: '20:00', value: 50 },
    { time: '22:00', value: 40 }
  ],
  '155544888': [
    { time: '00:00', value: 20 },
    { time: '02:00', value: 15 },
    { time: '04:00', value: 10 },
    { time: '06:00', value: 25 },
    { time: '08:00', value: 50 },
    { time: '10:00', value: 65 },
    { time: '12:00', value: 70 },
    { time: '14:00', value: 75 },
    { time: '16:00', value: 80 },
    { time: '18:00', value: 60 },
    { time: '20:00', value: 40 },
    { time: '22:00', value: 30 }
  ],
  '155544889': [
    { time: '00:00', value: 10 },
    { time: '02:00', value: 5 },
    { time: '04:00', value: 0 },
    { time: '06:00', value: 15 },
    { time: '08:00', value: 40 },
    { time: '10:00', value: 45 },
    { time: '12:00', value: 50 },
    { time: '14:00', value: 55 },
    { time: '16:00', value: 60 },
    { time: '18:00', value: 40 },
    { time: '20:00', value: 20 },
    { time: '22:00', value: 10 }
  ]
}; 