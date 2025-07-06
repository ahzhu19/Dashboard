import request from '../utils/request';

// 获取所有充电站位置数据
export const getAllStations = async () => {
  try {
    const response = await request.get('/sites/locations');
    
    // 检查响应是否成功
    if (response.data.success) {
      // 转换数据格式以适配现有组件
      const stations = response.data.data.map(station => ({
        meter_id: station.meter_id,
        dev_fac_id: station.dev_fac_id,
        latitude: parseFloat(station.latitude),
        longitude: parseFloat(station.longitude),
        max_input_current: parseFloat(station.max_input_current),
        max_output_current: parseFloat(station.max_output_current),
        rated_power: parseFloat(station.rated_power),
        // 异常相关字段
        anomaly_timestamp: station.anomaly_timestamp,
        anomaly_type: station.anomaly_type,
        is_anomaly: station.is_anomaly,
        // 当前状态字段
        current_timestamp: station.current_timestamp,
        latest_current: parseFloat(station.latest_current),
        overall_status: station.overall_status || 'normal',
        warning_level: station.warning_level || 'green',
        warning_timestamp: station.warning_timestamp,
        // 兼容旧字段名
        status: station.overall_status || 'normal'
      }));
      
      return stations;
    } else {
      throw new Error('API 返回失败');
    }
  } catch (error) {
    console.error('获取充电站列表失败:', error);
    throw new Error('获取充电站列表失败');
  }
};

// 获取单个充电站电流曲线图
export const getStationCurrentChart = async (meterId, hours = 6) => {
  try {
    const response = await request.get('/monitoring/current', {
      params: {
        meter_id: meterId,
        hours: hours
      }
    });
    
    // 检查响应是否成功
    if (response.data.success) {
      // 转换数据格式以适配ECharts图表
      const chartData = response.data.data.map(item => ({
        time: new Date(item.timestamp).toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        value: parseFloat(item.current_value),
        timestamp: item.timestamp,
        dev_fac_id: item.dev_fac_id
      }));
      
      return {
        meter_id: response.data.meter_id,
        count: response.data.count,
        data: chartData,
        success: true
      };
    } else {
      throw new Error('API 返回失败');
    }
  } catch (error) {
    console.error('获取充电站电流曲线图失败:', error);
    throw new Error('获取充电站电流曲线图失败');
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



// 获取充电站历史异常统计信息
export const getStationAnomalyStats = async (meterId, days = 30) => {
  try {
    const response = await request.get('/monitoring/anomalies', {
      params: {
        meter_id: meterId,
        days: days
      }
    });

    if (response.data.success) {
      // 直接返回后端数据结构
      return response.data.data;
    } else {
      throw new Error('API 返回失败');
    }
  } catch (error) {
    console.error('获取历史异常统计失败:', error);
    throw new Error('获取历史异常统计失败');
  }
};

