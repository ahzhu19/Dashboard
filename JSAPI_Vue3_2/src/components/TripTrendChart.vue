<template>
  <div class="chart-container" ref="chartRef"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import * as echarts from 'echarts';
import { getMockTripData } from '../api/statistics';

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
      const response = await getMockTripData();
      
      chart = echarts.init(chartRef.value);
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            lineStyle: {
              color: '#188df0',
              width: 1,
              type: 'solid'
            }
          }
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
          data: response.data.dates,
          axisLine: {
            lineStyle: {
              color: '#ddd'
            }
          },
          axisLabel: {
            color: '#333',
            fontSize: 12
          }
        },
        yAxis: {
          type: 'value',
          name: '跳闸次数',
          nameTextStyle: {
            color: '#666',
            fontSize: 12,
            padding: [0, 0, 0, 30]
          },
          splitLine: {
            lineStyle: {
              color: '#eee',
              type: 'dashed'
            }
          },
          axisLabel: {
            color: '#333',
            fontSize: 12
          }
        },
        series: [
          {
            data: response.data.values,
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            itemStyle: {
              color: '#188df0'
            },
            lineStyle: {
              width: 3,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#188df0' },
                { offset: 1, color: '#60c0e8' }
              ])
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
              formatter: '{c}次',
              color: '#333',
              fontSize: 12
            }
          }
        ]
      };
      
      chart.setOption(option);
      window.addEventListener('resize', handleResize);
    } catch (error) {
      console.error('Failed to load trip trend data:', error);
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