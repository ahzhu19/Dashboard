<script setup>
import { getMonthlyAnomalyStats } from '../api/statistics';
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import * as echarts from 'echarts';

const chartRef = ref(null);
let chart = null;
const loading = ref(true);
const error = ref('');
const chartData = ref([]); // 存放后端返回的 anomaly_distribution

const handleResize = () => {
  if (chart) {
    chart.resize();
  }
};

const colorList = [
  '#1890ff', // 蓝
  '#ff4d4f', // 红
  '#faad14', // 橙
  '#52c41a', // 绿
  '#13c2c2', // 青
  '#722ed1', // 紫
  '#eb2f96', // 粉
  '#2f54eb', // 深蓝
  '#a0d911', // 浅绿
  '#fa541c'  // 深橙
];

const renderChart = () => {
  if (!chartRef.value || !chartData.value.length) return;
  if (!chart) chart = echarts.init(chartRef.value);

  const maxValue = Math.max(...chartData.value.map(item => item.count), 0);

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: 30,
      right: 20,
      top: 30,
      bottom: 30,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: chartData.value.map(item => item.anomaly_type),
      axisLabel: { color: '#333', fontSize: 14, rotate: 30 }
    },
    yAxis: {
      type: 'value',
      name: '次数',
      min: 0,
      axisLabel: { color: '#333', fontSize: 13 },
      splitLine: { show: true, lineStyle: { color: '#f0f0f0' } }
    },
    series: [
      {
        name: '异常次数',
        type: 'bar',
        data: chartData.value.map((item, idx) => ({
          value: item.count,
          itemStyle: { color: colorList[idx % colorList.length] }
        })),
        barWidth: 28,
        barCategoryGap: '40%',
        label: {
          show: true,
          position: 'top',
          color: '#333',
          fontWeight: 400,
          fontSize: 14,
          formatter: '{c}'
        }
      }
    ]
  };

  chart.setOption(option);
};

onMounted(async () => {
  nextTick(async () => {
    loading.value = true;
    error.value = '';
    try {
      const stats = await getMonthlyAnomalyStats(); // 不传meter_id即为所有电表
      chartData.value = stats.anomaly_distribution || [];
      renderChart();
      window.addEventListener('resize', handleResize);
    } catch (e) {
      error.value = '数据加载失败';
    } finally {
      loading.value = false;
    }
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (chart) {
    chart.dispose();
    chart = null;
  }
});
</script>

<!-- ┌─────────────────────────────────────┐ -->
<!-- │           异常类型占比               │ -->
<!-- └─────────────────────────────────────┘ -->
<template>
  <div class="chart-container" ref="chartRef">
    <div v-if="loading" class="loading">加载中...</div>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  position: relative;
  background: #fff;
  border-radius: 10px;
}
.loading, .error {
  position: absolute;
  left: 0; right: 0; top: 0; bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  background: #fff;
  z-index: 1;
}
</style>

<style scoped>
.stats-card {
  height: 320px; /* 你可以根据实际条数和美观调整 */
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-header {
  font-size: 18px;
  font-weight: 700;
  color: #222;
  letter-spacing: 1px;
}

:deep(.ant-card-body) {
  height: calc(100% - 55px);
  padding: 24px;
}
</style> 