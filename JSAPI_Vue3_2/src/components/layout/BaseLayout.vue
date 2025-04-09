<template>
  <div class="app-container">
    <header class="header">
      <div class="logo">
        <environment-outlined class="nav-icon" />
        <h1>电动自行车充电风险监测平台</h1>
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        mode="horizontal"
        :style="{ lineHeight: '60px', border: 'none' }"
      >
        <a-menu-item key="home">
          <router-link to="/">首页</router-link>
        </a-menu-item>
        <a-menu-item key="monitor">
          <router-link to="/load-monitor">负荷监测</router-link>
        </a-menu-item>
      </a-menu>
    </header>
    <div class="main-container">
      <a-row :gutter="20" style="height: 100%">
        <a-col :span="6" class="left-panel">
          <slot></slot>
        </a-col>
        <a-col :span="18" class="right-panel">
          <MapContainer />
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { EnvironmentOutlined } from '@ant-design/icons-vue';
import MapContainer from '../MapContainer.vue';

const route = useRoute();
const selectedKeys = ref(['home']);

onMounted(() => {
  // 根据当前路由设置选中的菜单项
  selectedKeys.value = [route.path === '/' ? 'home' : 'monitor'];
});
</script>

<style scoped>
.app-container {
  width: 100%;
  height: 100vh;
  background: #f5f7fa;
}

.header {
  background: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo h1 {
  margin: 0;
  font-size: 1.5rem;
  background: linear-gradient(45deg, #00b96b, #36cfc9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-icon {
  font-size: 24px;
  color: #00b96b;
}

.main-container {
  height: calc(100vh - 60px);
  padding: 20px;
  background: #f5f7fa;
}

.left-panel {
  padding-right: 20px;
  height: 100%;
  overflow-y: auto;
}

.right-panel {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 0;
  height: 100%;
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

:deep(.ant-menu-horizontal) {
  border-bottom: none !important;
}

:deep(.ant-menu-item a) {
  color: #2c3e50;
}

:deep(.ant-menu-item-selected a) {
  color: #00b96b;
}
</style> 