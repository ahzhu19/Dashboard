// 模拟获取充电时段统计数据
export const getMockChargingTime = (params = {}) => {
  // 默认参数
  const defaultParams = {
    startTime: null,
    endTime: null
  };

  const queryParams = { ...defaultParams, ...params };

  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟后端返回的数据格式
      const mockData = {
        timeSlotStats: [
          {
            timeSlot: "00:00-06:00",
            displayName: "0时-6时",
            stationCount: 5,
            chargingCount: 120,
            percentage: 35,
            avgChargingCurrent: 2.5
          },
          {
            timeSlot: "06:00-12:00",
            displayName: "6时-12时",
            stationCount: 8,
            chargingCount: 85,
            percentage: 25,
            avgChargingCurrent: 2.1
          },
          {
            timeSlot: "12:00-18:00",
            displayName: "12时-18时",
            stationCount: 6,
            chargingCount: 50,
            percentage: 15,
            avgChargingCurrent: 1.8
          },
          {
            timeSlot: "18:00-24:00",
            displayName: "18时-24时",
            stationCount: 7,
            chargingCount: 87,
            percentage: 25,
            avgChargingCurrent: 2.3
          }
        ],
        totalChargingCount: 342
      };

      resolve({
        data: mockData
      });
    }, 500);
  });
};

// 模拟获取充电站负荷排名数据
export const getMockLoadRanking = (params = {}) => {
  // 默认参数
  const defaultParams = {
    threshold: 0.8,  // 默认负荷阈值
    limit: 10        // 默认返回记录数
  };

  const queryParams = { ...defaultParams, ...params };

  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟后端返回的数据格式
      const mockData = [
        {
          stationId: "1555746523",
          stationName: "充电站A",
          durationHours: 18,
          loadRatio: 75.0
        },
        {
          stationId: "1555746524",
          stationName: "充电站B",
          durationHours: 15,
          loadRatio: 62.5
        },
        {
          stationId: "1555746525",
          stationName: "充电站C",
          durationHours: 12,
          loadRatio: 50.0
        },
        {
          stationId: "1555746526",
          stationName: "充电站D",
          durationHours: 10,
          loadRatio: 41.7
        },
        {
          stationId: "1555746527",
          stationName: "充电站E",
          durationHours: 8,
          loadRatio: 33.3
        }
      ];

      resolve({
        data: mockData
      });
    }, 500);
  });
};

// 模拟获取充电站负荷超限天数数据
export const getMockOverloadDays = (params = {}) => {
  // 默认参数
  const defaultParams = {
    month: new Date().getMonth() + 1,  // 当前月份
    year: new Date().getFullYear(),    // 当前年份
    thresholdRatio: 0.9                // 默认阈值比例90%
  };

  const queryParams = { ...defaultParams, ...params };

  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟后端返回的数据格式
      const mockData = [
        {
          stationId: "1555746521",
          stationName: "充电站A",
          limitLoad: 3.0,
          threshold: 2.7,
          overThresholdCount: 24,
          totalRecords: 30
        },
        {
          stationId: "1555746522",
          stationName: "充电站B",
          limitLoad: 2.8,
          threshold: 2.52,
          overThresholdCount: 18,
          totalRecords: 30
        },
        {
          stationId: "1555746523",
          stationName: "充电站C",
          limitLoad: 2.893,
          threshold: 2.6037,
          overThresholdCount: 15,
          totalRecords: 30
        },
        {
          stationId: "1555746524",
          stationName: "充电站D",
          limitLoad: 2.5,
          threshold: 2.25,
          overThresholdCount: 12,
          totalRecords: 30
        },
        {
          stationId: "1555746525",
          stationName: "充电站E",
          limitLoad: 2.7,
          threshold: 2.43,
          overThresholdCount: 8,
          totalRecords: 30
        }
      ];

      // 转换数据格式以适配图表
      const formattedData = {
        data: {
          stations: mockData.map(item => item.stationName),
          days: mockData.map(item => item.overThresholdCount),
          details: mockData  // 保留完整数据，以备需要
        }
      };

      resolve(formattedData);
    }, 500); // 模拟网络延迟
  });
}; 