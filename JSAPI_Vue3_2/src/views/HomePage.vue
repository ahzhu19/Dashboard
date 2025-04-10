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
import RankingList from '../components/RankingList.vue';
import WeeklyAbnormalChart from '../components/WeeklyAbnormalChart.vue';

const cards = ref([
  {
    title: '异常类型占比',
    component: AbnormalTypeChart
  },
  {
    title: '高峰期充电站负荷持续时间排名',
    component: RankingList
  },
  {
    title: '近七日异常数量变化',
    component: WeeklyAbnormalChart
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

/* 自定义滚动条样式 */
.left-panel::-webkit-scrollbar {
  width: 6px;
}

.left-panel::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 3px;
}

.left-panel::-webkit-scrollbar-track {
  background: #f5f7fa;
}
</style>
