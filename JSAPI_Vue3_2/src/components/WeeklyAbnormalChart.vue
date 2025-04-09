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
      grid: {
        top: '15%',
        left: '5%',
        right: '5%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['4月5日', '4月7日', '4月8日', '4月9日', '4月10日', '4月11日'],
        axisLabel: {
          color: '#333',
          fontSize: 12
        },
        axisLine: {
          lineStyle: {
            color: '#ddd'
          }
        },
        axisTick: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 20,
        interval: 5,
        axisLabel: {
          color: '#333',
          fontSize: 12
        },
        splitLine: {
          lineStyle: {
            color: '#ddd'
          }
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#ddd'
          }
        },
        axisTick: {
          show: false
        }
      },
      series: [{
        data: [12, 5, 8, 10, 14, 7],
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          color: '#73d13d',
          width: 2
        },
        itemStyle: {
          color: '#73d13d',
          borderWidth: 2,
          borderColor: '#fff'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: 'rgba(115, 209, 61, 0.3)'
            }, {
              offset: 1,
              color: 'rgba(115, 209, 61, 0)'
            }]
          }
        }
      }]
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