<template>
  <div class="doughnut-chart">
    <a-card :bordered="false" class="chart-card">
      <template #title>
        <div class="card-title">
          <span>充电站负荷分布</span>
        </div>
      </template>
      <div ref="chartRef" class="chart"></div>
    </a-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import { getMockLoadDistribution } from '../api/statistics';

const chartRef = ref(null);
let chart = null;

const initChart = () => {
  if (chartRef.value) {
    chart = echarts.init(chartRef.value);
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 10,
        data: ['正常', '过载', '轻载']
      },
      series: [
        {
          name: '负荷分布',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 0, name: '正常' },
            { value: 0, name: '过载' },
            { value: 0, name: '轻载' }
          ]
        }
      ]
    };
    chart.setOption(option);
  }
};

const updateChart = async () => {
  try {
    const response = await getMockLoadDistribution();
    const data = response.data;
    if (chart) {
      chart.setOption({
        series: [{
          data: [
            { value: data.normal, name: '正常' },
            { value: data.overload, name: '过载' },
            { value: data.light, name: '轻载' }
          ]
        }]
      });
    }
  } catch (error) {
    console.error('Failed to load distribution data:', error);
  }
};

onMounted(() => {
  initChart();
  updateChart();
  window.addEventListener('resize', () => {
    chart && chart.resize();
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', () => {
    chart && chart.resize();
  });
  chart && chart.dispose();
});
</script>

<style scoped>
.doughnut-chart {
  height: 100%;
}

.chart-card {
  height: 100%;
}

.card-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chart {
  height: calc(100% - 50px);
  width: 100%;
}
</style> 