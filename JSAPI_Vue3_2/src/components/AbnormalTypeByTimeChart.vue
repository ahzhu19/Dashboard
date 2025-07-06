// 各个时间段的异常类型发生次数
<template>
    <div class="chart-container" ref="chartRef">
      <div v-if="loading" class="loading">加载中...</div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted, nextTick } from 'vue';
  import * as echarts from 'echarts';
  import { getTimePeriodAnomalyStats } from '@/api/statistics';
  
  const chartRef = ref(null);
  const loading = ref(false);
  let chart = null;
  
  // 处理时段异常统计数据
  const processTimePeriodData = (data) => {
    const { time_period_stats } = data;
    const timePeriods = Object.keys(time_period_stats);
    const anomalyTypes = new Set();
    timePeriods.forEach(period => {
      time_period_stats[period].forEach(item => anomalyTypes.add(item.anomaly_type));
    });
    const anomalyTypesArray = Array.from(anomalyTypes);
    
    const colors = ['#ff4d4f', '#40a9ff', '#ffa940', '#73d13d', '#36cfc9', '#722ed1'];
    
    // 每个异常类型一组series
    const series = anomalyTypesArray.map((anomalyType, idx) => ({
      name: anomalyType,
      type: 'bar',
      data: timePeriods.map(period => {
        const found = time_period_stats[period].find(i => i.anomaly_type === anomalyType);
        return found ? found.count : 0;
      }),
      itemStyle: { color: colors[idx % colors.length] },
      label: { show: true, position: 'top' }
    }));
    
    return { timePeriods, series, anomalyTypesArray };
  };
  
  // 更新图表
  const updateChart = (data) => {
    if (!chart) return;
    
    const { timePeriods, series, anomalyTypesArray } = processTimePeriodData(data);
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function(params) {
          let result = params[0].name + '<br/>';
          params.forEach(param => {
            result += param.marker + param.seriesName + ': ' + param.value + '<br/>';
          });
          return result;
        }
      },
      legend: {
        data: anomalyTypesArray,
        bottom: 10
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: 70,
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: timePeriods,
        axisLabel: {
          color: '#333'
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: '#333'
        }
      },
      series: series
    };
    
    chart.setOption(option);
  };
  
  // 加载数据
  const loadData = async () => {
    loading.value = true;
    try {
      const data = await getTimePeriodAnomalyStats();
      updateChart(data);
    } catch (error) {
      console.error('加载时段异常统计失败:', error);
      // 可以在这里添加错误提示
    } finally {
      loading.value = false;
    }
  };
  
  const handleResize = () => {
    if (chart) {
      chart.resize();
    }
  };
  
  onMounted(() => {
    nextTick(() => {
      if (!chartRef.value) return;
      
      chart = echarts.init(chartRef.value);
      window.addEventListener('resize', handleResize);
      
      // 加载数据
      loadData();
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
    height: 300px;
    position: relative;
  }
  
  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #666;
    font-size: 14px;
  }
  </style> 