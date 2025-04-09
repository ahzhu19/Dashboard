<template>
  <div class="chart-container" ref="chartRef"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import * as echarts from 'echarts';

const chartRef = ref(null);
let chart = null;

const handleResize = () => {
  if (chart) {
    chart.resize();
  }
};

onMounted(() => {
  nextTick(() => {
    if (!chartRef.value) return;
    
    chart = echarts.init(chartRef.value);
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        bottom: '5%',
        left: 'center',
        textStyle: {
          color: '#333'
        }
      },
      series: [
        {
          name: '异常类型',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '40%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 4,
            borderWidth: 2
          },
          label: {
            show: true,
            position: 'outer',
            formatter: '{b}: {d}%'
          },
          labelLine: {
            show: true
          },
          data: [
            { value: 35, name: '高值异常', itemStyle: { color: '#ff4d4f' } },
            { value: 25, name: '波动异常', itemStyle: { color: '#40a9ff' } },
            { value: 20, name: '超时异常', itemStyle: { color: '#ffa940' } },
            { value: 15, name: '持续异常负荷', itemStyle: { color: '#73d13d' } },
            { value: 5, name: '其他异常', itemStyle: { color: '#36cfc9' } }
          ]
        }
      ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', handleResize);
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

<style scoped>
.chart-container {
  width: 100%;
  height: 200px;
}
</style> 