<template>
  <base-layout>
    <a-card class="stats-card" v-for="(item, index) in cards" :key="index">
      <template #title>
        <span class="card-header">{{ item.title }}</span>
      </template>
      <component :is="item.component"></component>
    </a-card>
  </base-layout>
</template>

<script setup>
import { ref } from 'vue';
import BaseLayout from '../components/layout/BaseLayout.vue';
import AbnormalTypeChart from '../components/AbnormalTypeChart.vue';
import CapacityAbnormalChart from '../components/CapacityAbnormalChart.vue';
import TripTrendChart from '../components/TripTrendChart.vue';

const cards = ref([
  {
    title: '异常类型分布',
    component: AbnormalTypeChart
  },
  {
    title: '各充电站发生增容改装异常次数占比',
    component: CapacityAbnormalChart
  },
  {
    title: '近6日电表跳闸数显变化',
    component: TripTrendChart
  }
]);
</script>

<style scoped>
.stats-card {
  height: 280px;
  margin-bottom: 20px;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
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
</style> 