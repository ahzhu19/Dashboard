<template>
  <div class="ranking-list">
    <Table
      :dataSource="tableData"
      :columns="columns"
      :pagination="false"
      size="small"
      :scroll="{ y: 160 }"
      :bordered="false"
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'loadRatio'">
          <div class="percentage-cell">
            <Progress :percent="text" size="small" :showInfo="false" />
            <span class="percentage-text">{{ text }}%</span>
          </div>
        </template>
        <template v-if="column.dataIndex === 'durationHours'">
          {{ text }}小时
        </template>
      </template>
    </Table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Table, Progress } from 'ant-design-vue';
import { getMockLoadRanking } from '../api/statistics';

const tableData = ref([]);

const columns = [
  {
    title: '充电站',
    dataIndex: 'stationName',
    width: '30%',
    align: 'left'
  },
  {
    title: '持续时间',
    dataIndex: 'durationHours',
    width: '30%',
    align: 'center'
  },
  {
    title: '负荷率',
    dataIndex: 'loadRatio',
    width: '40%',
    align: 'left'
  }
];

onMounted(async () => {
  try {
    const response = await getMockLoadRanking({
      threshold: 0.8,
      limit: 5
    });
    // 数据处理
    tableData.value = response.data.map(item => ({
      ...item,
      key: item.stationId // 添加key属性用于表格渲染
    }));
  } catch (error) {
    console.error('Failed to load ranking data:', error);
  }
});
</script>

<style scoped>
.ranking-list {
  height: 100%;
  overflow: hidden;
  padding: 0;
}

.percentage-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.percentage-text {
  font-size: 12px;
  color: #666;
  min-width: 45px;
}

:deep(.ant-table-wrapper) {
  height: 100%;
}

:deep(.ant-table) {
  height: 100%;
  font-size: 13px;
  background: transparent;
}

:deep(.ant-table-header) {
  background: transparent;
}

:deep(.ant-table-cell) {
  padding: 6px 8px !important;
  background: transparent !important;
  border: none !important;
}

:deep(.ant-table-thead > tr > th) {
  font-weight: 600;
  background: transparent !important;
  border-bottom: 1px solid #f0f0f0 !important;
}

:deep(.ant-progress) {
  margin: 0;
  width: 100%;
}

:deep(.ant-table-tbody > tr > td) {
  border-bottom: 1px solid #f5f5f5;
}

:deep(.ant-table-tbody > tr:hover > td) {
  background: #fafafa !important;
}

:deep(.ant-table-body) {
  overflow-y: auto !important;
  height: calc(100% - 39px) !important;
}

/* 自定义滚动条样式 */
:deep(.ant-table-body::-webkit-scrollbar) {
  width: 4px;
}

:deep(.ant-table-body::-webkit-scrollbar-thumb) {
  background: #c0c4cc;
  border-radius: 2px;
}

:deep(.ant-table-body::-webkit-scrollbar-track) {
  background: #f5f7fa;
}
</style> 