<template>
  <div class="chart-container" ref="chartRef"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import * as echarts from 'echarts';
import { getMockAccuracyData } from '../api/statistics';

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
      const response = await getMockAccuracyData();
      
      chart = echarts.init(chartRef.value);
      const option = {
        tooltip: {
          trigger: 'axis',
          formatter: '{b}: {c}%'
        },
        grid: {
          top: '15%',
          left: '3%',
          right: '4%',
          bottom: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['高值异常', '波动异常', '趋势异常', '持续高值异常', '其他异常'],
          axisLabel: {
            interval: 0,
            rotate: 30,
            color: '#333'
          },
          axisLine: {
            lineStyle: {
              color: '#ddd'
            }
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
            type: 'bar',
            data: [92, 88, 85, 90, 82],
            barWidth: '40%',
            itemStyle: {
              color: function(params) {
                const colors = ['#ff4d4f', '#ffa940', '#73d13d', '#40a9ff', '#d3adf7'];
                return colors[params.dataIndex];
              },
              borderRadius: [4, 4, 0, 0]
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
      console.error('Failed to load accuracy data:', error);
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