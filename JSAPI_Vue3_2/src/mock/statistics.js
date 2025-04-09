// 充电时段统计模拟数据
export const mockChargingTimeData = {
  data: [
    { value: 30, name: '0点-6点', itemStyle: { color: '#ff9800' } },
    { value: 25, name: '6点-12点', itemStyle: { color: '#03a9f4' } },
    { value: 25, name: '12点-18点', itemStyle: { color: '#ffd700' } },
    { value: 20, name: '18点-24点', itemStyle: { color: '#4caf50' } }
  ]
};

// 充电站负荷排名模拟数据
export const mockLoadRankingData = {
  data: [
    {
      rank: 1,
      station: '充电站A',
      duration: '4.5',
      percentage: '90%'
    },
    {
      rank: 2,
      station: '充电站B',
      duration: '3.8',
      percentage: '85%'
    },
    {
      rank: 3,
      station: '充电站C',
      duration: '3.2',
      percentage: '78%'
    },
    {
      rank: 4,
      station: '充电站D',
      duration: '2.9',
      percentage: '72%'
    },
    {
      rank: 5,
      station: '充电站E',
      duration: '2.5',
      percentage: '65%'
    }
  ]
};

// 充电站超负荷天数统计模拟数据
export const mockOverloadDaysData = {
  data: {
    stations: ['充电站A', '充电站B', '充电站C', '充电站D', '充电站E'],
    days: [24, 18, 15, 12, 8]
  }
}; 