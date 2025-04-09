<template>
  <div class="overload-chart">
    <div ref="chartRef" class="chart"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import { getMockOverloadDays } from '../api/statistics';

const chartRef = ref(null);
let chart = null;

const initChart = () => {
  if (chartRef.value) {
    chart = echarts.init(chartRef.value);
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: [],
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
        name: '天数',
        nameTextStyle: {
          color: '#333'
        },
        axisLabel: {
          color: '#333'
        },
        axisLine: {
          lineStyle: {
            color: '#ddd'
          }
        },
        splitLine: {
          lineStyle: {
            color: '#ddd',
            type: 'dashed'
          }
        }
      },
      series: [
        {
          type: 'bar',
          data: [],
          itemStyle: {
            color: function(params) {
              const colors = ['#ff6b6b', '#ff9f43', '#ffd93d', '#6c5ce7', '#a8e6cf'];
              return colors[params.dataIndex % colors.length];
            }
          }
        }
      ]
    };
    chart.setOption(option);
  }
};

const updateChart = async () => {
  try {
    const response = await getMockOverloadDays({
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      thresholdRatio: 0.9
    });
    
    if (chart && response.data) {
      chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function(params) {
            const data = response.data.details[params[0].dataIndex];
            return `${data.stationName}<br/>
                    超限天数：${data.overThresholdCount}天<br/>
                    负荷上限：${data.limitLoad}A<br/>
                    阈值：${data.threshold}A<br/>
                    统计天数：${data.totalRecords}天`;
          }
        },
        xAxis: {
          data: response.data.stations
        },
        series: [{
          data: response.data.days,
          itemStyle: {
            color: function(params) {
              // 根据超限天数设置不同的颜色
              const value = params.value;
              if (value > 20) return '#ff4d4f';      // 严重超限
              if (value > 15) return '#ffa940';      // 较多超限
              if (value > 10) return '#fadb14';      // 中等超限
              if (value > 5) return '#73d13d';       // 轻微超限
              return '#40a9ff';                      // 正常范围
            }
          }
        }]
      });
    }
  } catch (error) {
    console.error('Failed to load overload days data:', error);
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
.overload-chart {
  width: 100%;
  height: 100%;
  position: relative;
}

.chart {
  width: 100%;
  height: 100%;
  min-height: 200px;
}
</style> 