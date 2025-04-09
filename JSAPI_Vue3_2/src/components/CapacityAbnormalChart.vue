<template>
  <div class="chart-container" ref="chartRef"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import * as echarts from 'echarts';
import { getMockCapacityAbnormal } from '../api/statistics';

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
      const response = await getMockCapacityAbnormal();
      
      chart = echarts.init(chartRef.value);
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}次 ({d}%)'
        },
        legend: {
          bottom: '5%',
          left: 'center',
          itemWidth: 12,
          itemHeight: 12,
          textStyle: {
            color: '#333',
            fontSize: 12
          }
        },
        series: [
          {
            name: '异常次数',
            type: 'pie',
            roseType: 'radius',
            radius: ['20%', '70%'],
            center: ['50%', '45%'],
            itemStyle: {
              borderRadius: 8,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: true,
              formatter: '{b}\n{c}次',
              color: '#333',
              fontSize: 12,
              lineHeight: 16
            },
            labelLine: {
              smooth: true,
              length: 10,
              length2: 10
            },
            data: [
              { 
                value: response.data[0].value, 
                name: response.data[0].name,
                itemStyle: { color: '#ff7070' }
              },
              { 
                value: response.data[1].value, 
                name: response.data[1].name,
                itemStyle: { color: '#ffd670' }
              },
              { 
                value: response.data[2].value, 
                name: response.data[2].name,
                itemStyle: { color: '#60c0e8' }
              },
              { 
                value: response.data[3].value, 
                name: response.data[3].name,
                itemStyle: { color: '#95de64' }
              },
              { 
                value: response.data[4].value, 
                name: response.data[4].name,
                itemStyle: { color: '#b37feb' }
              }
            ],
            emphasis: {
              label: {
                show: true,
                fontSize: 14,
                fontWeight: 'bold'
              }
            }
          }
        ]
      };
      
      chart.setOption(option);
      window.addEventListener('resize', handleResize);
    } catch (error) {
      console.error('Failed to load station abnormal data:', error);
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