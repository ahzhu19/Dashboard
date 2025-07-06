<template>
  <base-layout>
    <a-card
      class="stats-card"
      v-for="(item, index) in cards"
      :key="index"
      :style="index === 0 ? 'height: 380px;' : 'height: 320px;'"
    >
      <template #title>
        <span class="card-header">{{ item.title }}</span>
      </template>
      <component :is="item.component"></component>
    </a-card>
  </base-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BaseLayout from '../components/layout/BaseLayout.vue';
import AbnormalTypeChart from '../components/AbnormalTypeChart.vue';
import CapacityAbnormalChart from '../components/CapacityAbnormalChart.vue';
import TripTrendChart from '../components/TripTrendChart.vue';
import AbnormalTypeByTimeChart from '../components/AbnormalTypeByTimeChart.vue';

const chartData = ref([]);

const cards = ref([
  {
    title: '本月异常类型分布',
    component: AbnormalTypeChart
  },
  {
    title: '各个时间段的异常类型发生次数',
    component: AbnormalTypeByTimeChart
  }
  // {
  //   title: '各充电站发生增容改装异常次数占比',
  //   component: CapacityAbnormalChart
  // },
  // {
  //   title: '近6日电表跳闸数显变化',
  //   component: TripTrendChart
  // }
]);

const option = {
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '10%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: chartData.value.map(item => item.anomaly_type),
    axisLabel: {
      color: '#333',
      rotate: 30 // 避免文字重叠
    }
  },
  yAxis: {
    type: 'value',
    name: '次数',
    axisLabel: { color: '#333' }
  },
  series: [
    {
      name: '异常次数',
      type: 'bar',
      data: chartData.value.map(item => item.count),
      itemStyle: {
        color: '#40a9ff',
        borderRadius: [4, 4, 0, 0]
      },
      label: {
        show: true,
        position: 'top'
      }
    }
  ]
};

onMounted(async () => {
  // ...请求数据
  // chartData.value = ...;
});
</script>

<style scoped>
.stats-card {
  min-height: 260px;
  /* 可选：max-height: 400px; */
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  /* 不要写 height: 380px; */
}

.card-header {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

:deep(.ant-card-body) {
  height: calc(100% - 55px);
  padding: 15px;
}

.chart-container {
  width: 100%;
  height: 100%;
  position: relative;
  background: #fff;
  border-radius: 10px;
}
</style> 