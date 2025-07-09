// 各个时间段的异常类型发生次数
<template>
    <div class="chart-container" ref="chartRef">
      <div v-if="loading" class="loading">加载中...</div>
      <div v-if="error" class="error">{{ error }}</div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
  import * as echarts from 'echarts';
  import { getTimePeriodAnomalyStats } from '@/api/statistics';
  
  // 定义props
  const props = defineProps({
    meterId: {
      type: String,
      default: ''
    }
  });
  
  const chartRef = ref(null);
  const loading = ref(false);
  const error = ref('');
  let chart = null;
  
  const correctTimeOrder = [
    '凌晨(00:00-06:00)',
    '上午(06:00-12:00)',
    '下午(12:00-18:00)',
    '晚上(18:00-24:00)'
  ];
  const periodLabelMap = {
    '凌晨(00:00-06:00)': '凌晨',
    '上午(06:00-12:00)': '上午',
    '下午(12:00-18:00)': '下午',
    '晚上(18:00-24:00)': '晚上'
  };

  // 处理时段异常统计数据
  const processTimePeriodData = (data) => {
    const { time_period_stats } = data;
    // 收集所有异常类型
    const anomalyTypes = new Set();
    correctTimeOrder.forEach(period => {
      (time_period_stats[period] || []).forEach(item => anomalyTypes.add(item.anomaly_type));
    });
    const anomalyTypesArray = Array.from(anomalyTypes);

    const colors = ['#ff4d4f', '#40a9ff', '#ffa940', '#73d13d', '#36cfc9', '#722ed1'];

    // 每个异常类型一组series，数据严格按correctTimeOrder顺序
    const series = anomalyTypesArray.map((anomalyType, idx) => ({
      name: anomalyType,
      type: 'bar',
      data: correctTimeOrder.map(period => {
        const found = (time_period_stats[period] || []).find(i => i.anomaly_type === anomalyType);
        return found ? found.count : 0;
      }),
      itemStyle: { color: colors[idx % colors.length] },
      label: { show: true, position: 'top' }
    }));

    return { timePeriods: correctTimeOrder, series, anomalyTypesArray };
  };
  
  // 更新图表
  const updateChart = (data) => {
    if (!chart) return;
    
    // 如果没有数据，显示空状态
    if (!data || !data.time_period_stats || Object.keys(data.time_period_stats).length === 0) {
      const option = {
        title: {
          text: '暂无数据',
          left: 'center',
          top: 'middle',
          textStyle: {
            color: '#999',
            fontSize: 16
          }
        }
      };
      chart.setOption(option);
      return;
    }
    
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
        data: correctTimeOrder,
        axisLabel: {
          color: '#333',
          formatter: (val) => periodLabelMap[val] || val
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
    error.value = '';
    try {
      const data = await getTimePeriodAnomalyStats({ 
        meter_id: props.meterId 
      });
      updateChart(data);
    } catch (err) {
      console.error('加载时段异常统计失败:', err);
      error.value = '数据加载失败';
      updateChart(null);
    } finally {
      loading.value = false;
    }
  };
  
  // 监听meterId变化
  watch(() => props.meterId, (newMeterId, oldMeterId) => {
    if (newMeterId !== oldMeterId) {
      loadData();
    }
  }, { immediate: false });
  
  const handleResize = () => {
    if (chart) {
      chart.resize();
    }
  };
  
  onMounted(() => {
    nextTick(async () => {
      if (!chartRef.value) return;
      
      chart = echarts.init(chartRef.value);
      window.addEventListener('resize', handleResize);
      
      // 加载数据
      await loadData();
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