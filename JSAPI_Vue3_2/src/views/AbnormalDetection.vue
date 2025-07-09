<template>
  <base-layout>
    <!-- 搜索框区域 -->
    <a-card class="search-card">
      <a-row :gutter="16" align="middle">
        <a-col :span="8">
          <a-input
            v-model:value="searchMeterId"
            placeholder="请输入电表ID进行筛选"
            allow-clear
            @press-enter="handleSearch"
            @change="handleSearch"
          />
        </a-col>
        <a-col :span="4">
          <a-button type="primary" @click="handleSearch" :loading="searching">
            搜索
          </a-button>
        </a-col>
        <a-col :span="4">
          <a-button @click="handleReset">
            重置
          </a-button>
        </a-col>
      </a-row>
    </a-card>

    <!-- 图表卡片 -->
    <a-card
      class="stats-card"
      v-for="(item, index) in cards"
      :key="index"
      :style="index === 0 ? 'height: 380px;' : 'height: 320px;'"
    >
      <template #title>
        <span class="card-header">{{ getCardTitle(item, index) }}</span>
      </template>
      <component 
        :is="item.component" 
        :meter-id="currentMeterId"
        :key="`${item.component.name}-${currentMeterId}`"
      ></component>
    </a-card>
  </base-layout>
</template>

<script setup>
import { ref, computed } from 'vue';
import BaseLayout from '../components/layout/BaseLayout.vue';
import AbnormalTypeChart from '../components/AbnormalTypeChart.vue';
import CapacityAbnormalChart from '../components/CapacityAbnormalChart.vue';
import TripTrendChart from '../components/TripTrendChart.vue';
import AbnormalTypeByTimeChart from '../components/AbnormalTypeByTimeChart.vue';

const searchMeterId = ref('');
const currentMeterId = ref('');
const searching = ref(false);

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

// 动态生成卡片标题
const getCardTitle = (item, index) => {
  if (index === 0) {
    // 第一个卡片：异常类型分布
    if (currentMeterId.value) {
      return `电表${currentMeterId.value}的异常类型分布`;
    } else {
      return '本月异常类型分布';
    }
  } else if (index === 1) {
    // 第二个卡片：时间段异常分布
    if (currentMeterId.value) {
      return `电表${currentMeterId.value}的时段异常分布`;
    } else {
      return '各个时间段的异常类型发生次数';
    }
  }
  return item.title;
};

// 搜索处理
const handleSearch = () => {
  searching.value = true;
  // 使用防抖，避免频繁请求
  setTimeout(() => {
    currentMeterId.value = searchMeterId.value.trim();
    searching.value = false;
  }, 300);
};

// 重置处理
const handleReset = () => {
  searchMeterId.value = '';
  currentMeterId.value = '';
};
</script>

<style scoped>
.search-card {
  margin-bottom: 16px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

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