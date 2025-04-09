<template>
  <div class="charging-time-chart">
    <div ref="chartRef" style="width: 100%; height: 200px;"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import { getMockChargingTime } from '../api/statistics';

const chartRef = ref(null);
let chart = null;

const initChart = async () => {
  if (!chartRef.value) return;
  
  try {
    const response = await getMockChargingTime();
    const { timeSlotStats } = response.data;

    if (chart) {
      chart.dispose();
    }
    
    chart = echarts.init(chartRef.value);
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          const data = timeSlotStats.find(item => item.displayName === params.name);
          if (data) {
            return `${data.displayName}<br/>
                    充电次数: ${data.chargingCount}次<br/>
                    站点数量: ${data.stationCount}个<br/>
                    平均电流: ${data.avgChargingCurrent}A<br/>
                    占比: ${data.percentage}%`;
          }
          return params.name;
        }
      },
      legend: {
        bottom: '0',
        left: 'center',
        itemWidth: 12,
        itemHeight: 12,
        itemGap: 20,
        textStyle: {
          color: '#333'
        }
      },
      series: [
        {
          name: '充电时段',
          type: 'pie',
          radius: '50%',
          center: ['50%', '35%'],
          label: {
            show: true,
            formatter: '{d}%',
            color: '#333'
          },
          data: timeSlotStats.map(item => ({
            name: item.displayName,
            value: item.percentage
          }))
        }
      ],
      color: ['#36cfc9', '#73d13d', '#ffa940', '#40a9ff']
    };
    chart.setOption(option);
  } catch (error) {
    console.error('Failed to load charging time data:', error);
  }
};

// 处理窗口大小变化
const handleResize = () => {
  chart && chart.resize();
};

onMounted(() => {
  initChart();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (chart) {
    chart.dispose();
    chart = null;
  }
});
</script>

<style scoped>
.charging-time-chart {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 