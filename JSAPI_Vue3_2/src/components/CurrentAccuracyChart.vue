<template>
  <div class="chart-container" ref="chartRef"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import * as echarts from 'echarts';
import { getMockCurrentAccuracy } from '../api/statistics';

const chartRef = ref(null);
let chart = null;

const handleResize = () => {
  if (chart) {
    chart.resize();
  }
};

onMounted(() => {
  nextTick(async () => {
    if (!chartRef.value) return;
    
    try {
      const response = await getMockCurrentAccuracy();
      
      chart = echarts.init(chartRef.value);
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          top: '15%',
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: response.data.times,
          axisLine: {
            lineStyle: {
              color: '#ddd'
            }
          },
          axisLabel: {
            color: '#333'
          }
        },
        yAxis: {
          type: 'value',
          name: '准确率',
          max: 100,
          axisLabel: {
            formatter: '{value}%',
            color: '#333'
          },
          splitLine: {
            lineStyle: {
              color: '#eee',
              type: 'dashed'
            }
          }
        },
        series: [
          {
            data: response.data.accuracies,
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            itemStyle: {
              color: '#188df0'
            },
            lineStyle: {
              width: 3
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(24,141,240,0.3)' },
                { offset: 1, color: 'rgba(24,141,240,0.1)' }
              ])
            },
            label: {
              show: true,
              position: 'top',
              formatter: '{c}%'
            }
          }
        ]
      };
      
      chart.setOption(option);
      window.addEventListener('resize', handleResize);
    } catch (error) {
      console.error('Failed to load current accuracy data:', error);
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

<style scoped>
.chart-container {
  width: 100%;
  height: 200px;
}
</style> 