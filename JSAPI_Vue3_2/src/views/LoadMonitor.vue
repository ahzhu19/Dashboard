<script setup>
import { ref } from 'vue';
import BaseLayout from '../components/layout/BaseLayout.vue';
import ChargingTimeChart from '../components/ChargingTimeChart.vue';
import RankingList from '../components/RankingList.vue';
import OverloadChart from '../components/OverloadChart.vue';

const cards = ref([
  {
    title: '各时间段充电统计占比',
    component: ChargingTimeChart
  },
  {
    title: '高峰期充电站负荷持续时间排名',
    component: RankingList
  },
  {
    title: '本月各充电站负荷超上限的90%天数',
    component: OverloadChart
  }
]);
</script>

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
