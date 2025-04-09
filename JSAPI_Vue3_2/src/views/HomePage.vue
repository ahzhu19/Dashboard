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
import { h } from 'vue';
import { useRouter } from 'vue-router';
import { Layout, LayoutHeader, LayoutContent, LayoutSider, Menu, Card } from 'ant-design-vue';
import { HomeOutlined, LineChartOutlined, WarningOutlined, MenuFoldOutlined, EnvironmentOutlined } from '@ant-design/icons-vue';
import MapContainer from '../components/MapContainer.vue';
import RankingList from '../components/RankingList.vue';
import AbnormalTypeChart from '../components/AbnormalTypeChart.vue';
import WeeklyAbnormalChart from '../components/WeeklyAbnormalChart.vue';
import BaseLayout from '../components/layout/BaseLayout.vue';

const router = useRouter();

const menuItems = [
  {
    key: 'home',
    icon: () => h(HomeOutlined),
    label: '首页',
  },
  {
    key: 'load',
    icon: () => h(LineChartOutlined),
    label: '负荷检测',
  },
  {
    key: 'abnormal',
    icon: () => h(WarningOutlined),
    label: '异常检测',
  },
  {
    key: 'predict',
    icon: () => h(MenuFoldOutlined),
    label: '异常预测',
  },
];

const handleMenuClick = ({ key }) => {
  if (key === 'home') {
    router.push('/');
  } else if (key === 'load') {
    router.push('/load-monitor');
  }
};

const cards = [
  {
    title: '异常类型占比',
    component: AbnormalTypeChart,
  },
  {
    title: '高峰期充电站负荷持续时间排名',
    component: RankingList,
  },
  {
    title: '近七日异常数量变化',
    component: WeeklyAbnormalChart,
  },
];
</script>

<style scoped>
.stats-card {
  height: 280px;
  margin-bottom: 20px;
  border-radius: 8px;
  background: #ffffff;
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

:deep(.ant-menu) {
  border-bottom: none;
  background: transparent;
  line-height: 58px;
}

:deep(.ant-menu-item:hover) {
  background-color: #e6f7ff;
}

:deep(.ant-menu-item-selected) {
  color: #00b96b !important;
  border-bottom: 2px solid #00b96b !important;
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
