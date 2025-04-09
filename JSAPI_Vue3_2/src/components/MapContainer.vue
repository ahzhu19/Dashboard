<script setup>
import { onMounted, onUnmounted, ref, nextTick } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import '../utils/mapConfig.js';
import { getStationDetail, getStationLoadData, getAllStations } from '../api/chargingStation';
import * as echarts from 'echarts';
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import { GridComponent, TooltipComponent } from "echarts/components";
import VChart from "vue-echarts";
import {
  Button,
  Space,
  Modal,
  Form,
  InputNumber,
  DatePicker,
  message
} from 'ant-design-vue';
import {
  ReloadOutlined,
  FilterOutlined,
  DownloadOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue';
import { useRoute } from 'vue-router';

// 注册 ECharts 组件
use([CanvasRenderer, LineChart, GridComponent, TooltipComponent]);

let map = null;
let currentChart = null;

// 筛选弹窗相关
const filterVisible = ref(false);
const filterForm = ref({
  loadMin: null,
  loadMax: null,
  dateRange: null
});

// 获取当前路由
const route = useRoute();

// 添加 props
const props = defineProps({
  isHomePage: {
    type: Boolean,
    default: false
  }
});

// 创建简单版本的信息窗体内容（用于首页）
const createSimpleInfoWindowContent = (stationData, loadData) => {
  return `
    <div class="custom-content-marker">
      <div class="info-window-content">
        <div class="chart-section">
          <div class="chart-title">24小时负荷趋势</div>
          <div class="chart-container" id="chart-${stationData.id}"></div>
        </div>
        <div class="info-section">
          <div class="info-header">
            <h4>充电站电流数据详情-${stationData.id}</h4>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">最新电流值</span>
              <span class="value">${stationData.current}A</span>
            </div>
            <div class="info-item">
              <span class="label">最新有功率</span>
              <span class="value">${stationData.power || '0.01'}度</span>
            </div>
            <div class="info-item">
              <span class="label">最新电压</span>
              <span class="value">${stationData.voltage}V</span>
            </div>
            <div class="info-item">
              <span class="label">异常检测</span>
              <span class="value">${stationData.abnormalStatus || '无'}</span>
            </div>
            <div class="info-item">
              <span class="label">异常预测</span>
              <span class="value">${stationData.prediction || '无'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

// 创建信息窗体内容
const createInfoWindowContent = (stationData, loadData) => {
  // 确保数据格式正确,
  const normalizedStationData = {
    id: stationData.id || '未知',
    status: stationData.status || 'unknown',
    statusText: stationData.statusText || '未知',
    voltage: stationData.voltage || 0,
    current: stationData.current || 0,
    loadPercentage: stationData.loadPercentage || 0,
    todayChargingCount: stationData.todayChargingCount || 0,
    abnormalCount: stationData.abnormalCount || 0,
    loadLimit: stationData.loadLimit || 100,
    latitude: stationData.latitude || 0,
    longitude: stationData.longitude || 0,
    suggestion: stationData.suggestion || '未知'
  };

  // 确保负荷数据格式正确
  const normalizedLoadData = Array.isArray(loadData) ? loadData.map(item => ({
    time: item.time || '00:00',
    value: typeof item.value === 'number' ? item.value : 0
  })) : [];

  return `
    <div class="custom-content-marker">
      <div class="info-window-content">
        <div class="chart-section">
          <div class="chart-title">24小时负荷趋势</div>
          <div class="chart-container" id="chart-${normalizedStationData.id}"></div>
        </div>
        <div class="info-section">
          <div class="info-header">
            <h4>充电站详情</h4>
            <span class="status-tag ${normalizedStationData.status}">${normalizedStationData.statusText}</span>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">站点编号</span>
              <span class="value">${normalizedStationData.id}</span>
            </div>
            <div class="info-item">
              <span class="label">经纬度</span>
              <span class="value">${normalizedStationData.latitude},${normalizedStationData.longitude}</span>
            </div>
            <div class="info-item">
              <span class="label">负荷占用比</span>
              <span class="value">${normalizedStationData.loadPercentage}%</span>
            </div>
            <div class="info-item">
              <span class="label">负荷上限</span>
              <span class="value">${normalizedStationData.loadLimit}%</span>
            </div>
            <div class="info-item">
              <span class="label">当前电流</span>
              <span class="value">${normalizedStationData.current}A</span>
            </div>

            <div class="info-item">
              <span class="label">今日充电次数</span>
              <span class="value">${normalizedStationData.todayChargingCount}次</span>
            </div>
            <div class="info-item">
              <span class="label">异常次数</span>
              <span class="value">${normalizedStationData.abnormalCount}次</span>
            </div>
            <div class="info-item">
              <span class="label">建议</span>
              <span class="value">${normalizedStationData.suggestion}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

// 初始化图表
const initChart = (containerId, loadData) => {
  if (currentChart) {
    currentChart.dispose();
  }
  
  const chart = echarts.init(document.getElementById(containerId));
  currentChart = chart;
  
  // 确保负荷数据格式正确
  const normalizedLoadData = Array.isArray(loadData) ? loadData.map(item => ({
    time: item.time || '00:00',
    value: typeof item.value === 'number' ? item.value : 0
  })) : [];
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: normalizedLoadData.map(item => item.time),
      axisLabel: {
        color: '#666'
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#666'
      }
    },
    series: [{
      data: normalizedLoadData.map(item => item.value),
      type: 'line',
      smooth: true,
      color: '#1890ff',
      lineWidth: 2,
      symbol: 'circle',
      symbolSize: 6,
      itemStyle: {
        color: '#1890ff',
        borderColor: '#fff',
        borderWidth: 2
      }
    }]
  };
  
  chart.setOption(option);
};

// 按钮事件处理
const handleRefresh = () => {
  message.loading({ content: '正在刷新数据...', duration: 1 });
  // TODO: 实现刷新逻辑
};

const handleFilter = () => {
  filterVisible.value = true;
};

const handleFilterConfirm = () => {
  message.success('筛选条件已应用');
  filterVisible.value = false;
  // TODO: 实现筛选逻辑
};

const handleExport = () => {
  message.success('数据导出成功');
  // TODO: 实现导出逻辑
};

const handleClear = () => {
  Modal.confirm({
    title: '确认清除',
    content: '是否确认清除所有标记点？此操作不可恢复。',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      message.success('已清除所有标记');
      // TODO: 实现清除逻辑
    }
  });
};

onMounted(() => {
  // 确保容器已经渲染
  nextTick(async () => {
    try {
      const AMap = await AMapLoader.load({
        key: "8e5cc8985b4b1f1da351a053d65dd75f",
        version: "2.0",
        plugins: ['AMap.Scale'],
        AMapUI: {
          version: "1.1",
          plugins: ['overlay/SimpleMarker'],
        },
        Loca: {
          version: "2.0",
        }
      });

      map = new AMap.Map("container", {
        viewMode: "3D",
        zoom: 13,
        center: [120.864608, 32.016212],
      });
      
      map.addControl(new AMap.Scale());

      // 创建不同状态的标记图标
      const icons = {
        danger: new AMap.Icon({
          size: new AMap.Size(25, 34),    // 图标大小
          image: '/icons/marker-red.png',  // 图标路径
          imageSize: new AMap.Size(25, 34) // 图片大小
        }),
        warning: new AMap.Icon({
          size: new AMap.Size(25, 34),
          image: '/icons/marker-yellow.png',
          imageSize: new AMap.Size(25, 34)
        }),
        normal: new AMap.Icon({
          size: new AMap.Size(25, 34),
          image: '/icons/marker-green.png',
          imageSize: new AMap.Size(25, 34)
        })
      };

      // 创建信息窗体
      const infoWindow = new AMap.InfoWindow({
        offset: new AMap.Pixel(0, -32),
        isCustom: true,
        autoMove: true,
        closeWhenClickMap: true
      });

      // 创建充电站标记
      const createMarker = async (stationData) => {
        // 确保状态值有效
        const status = stationData.status || 'normal';
        console.log('Creating marker with status:', status); // 添加调试日志
        
        const marker = new AMap.Marker({
          position: new AMap.LngLat(stationData.longitude, stationData.latitude),
          offset: new AMap.Pixel(-12.5, -34), // 调整偏移量为图标高度的一半
          icon: icons[status],
          title: `充电站-${stationData.id}`,
          zoom: [3, 20],
        });

        marker.on('click', async () => {
          try {
            // 显示加载状态
            infoWindow.setContent(`
              <div class="custom-content-marker">
                <div class="loading-content">
                  <div class="loading-spinner"></div>
                  <div class="loading-text">加载中...</div>
                </div>
              </div>
            `);
            infoWindow.open(map, marker.getPosition());

            // 获取充电站详情和负荷数据
            const [updatedStationData, loadData] = await Promise.all([
              getStationDetail(stationData.id),
              getStationLoadData(stationData.id)
            ]);

            // 根据当前路由选择不同的信息窗体内容
            const content = route.path === '/' 
              ? createSimpleInfoWindowContent(updatedStationData, loadData)
              : createInfoWindowContent(updatedStationData, loadData);

            infoWindow.setContent(content);
            infoWindow.open(map, marker.getPosition());

            // 初始化图表
            const chartOption = {
              tooltip: {
                trigger: 'axis'
              },
              xAxis: {
                type: 'category',
                data: loadData.map(item => item.time),
                axisLabel: {
                  color: '#666',
                  fontSize: 10
                }
              },
              yAxis: {
                type: 'value',
                axisLabel: {
                  color: '#666',
                  fontSize: 10
                }
              },
              grid: {
                top: '10%',
                left: '10%',
                right: '5%',
                bottom: '15%'
              },
              series: [{
                data: loadData.map(item => item.value),
                type: 'line',
                smooth: true,
                color: '#1890ff'
              }]
            };
            
            initChart(`chart-${updatedStationData.id}`, chartOption);
          } catch (error) {
            console.error('加载数据失败:', error);
            // 显示错误信息
            infoWindow.setContent(`
              <div class="custom-content-marker">
                <div class="error-content">
                  <div class="error-icon">!</div>
                  <div class="error-text">数据加载失败：${error.message || '未知错误'}</div>
                  <button class="retry-button" onclick="window.location.reload()">重试</button>
                </div>
              </div>
            `);
            infoWindow.open(map, marker.getPosition());
          }
        });

        return marker;
      };

      try {
        // 获取所有充电站数据
        const stations = await getAllStations();
        
        // 创建并添加所有充电站标记
        const markers = await Promise.all(stations.map(createMarker));
        markers.forEach(marker => map.add(marker));
        
        // 如果有充电站，调整地图视野以显示所有标记
        if (markers.length > 0) {
          map.setFitView();
        }
      } catch (error) {
        console.error('加载充电站列表失败:', error);
      }
    } catch (error) {
      console.error('地图初始化失败:', error);
    }
  });
});

onUnmounted(() => {
  if (currentChart) {
    currentChart.dispose();
  }
  map?.destroy();
});
</script>

<template>
  <div class="map-container">
    <div id="container" class="map"></div>
    <!-- 只在负荷检测页面显示控制按钮 -->
    <div class="map-controls" v-if="!isHomePage">
      <Space>
        <Button type="primary" @click="handleRefresh">
          <template #icon><ReloadOutlined /></template>
          刷新数据
        </Button>
        <Button @click="handleFilter">
          <template #icon><FilterOutlined /></template>
          筛选
        </Button>
        <Button type="primary" ghost @click="handleExport">
          <template #icon><DownloadOutlined /></template>
          导出数据
        </Button>
        <Button danger @click="handleClear">
          <template #icon><DeleteOutlined /></template>
          清除标记
        </Button>
      </Space>
    </div>
    <!-- 筛选弹窗也只在负荷检测页面显示 -->
    <Modal v-if="!isHomePage" v-model:open="filterVisible" title="筛选条件" @ok="handleFilterConfirm">
      <Form :model="filterForm" layout="vertical">
        <Form.Item label="负荷率范围">
          <Space>
            <InputNumber
              v-model:value="filterForm.loadMin"
              :min="0"
              :max="100"
              addon-after="%"
              placeholder="最小值"
            />
            <span>-</span>
            <InputNumber
              v-model:value="filterForm.loadMax"
              :min="0"
              :max="100"
              addon-after="%"
              placeholder="最大值"
            />
          </Space>
        </Form.Item>
        <Form.Item label="时间范围">
          <DatePicker.RangePicker
            v-model:value="filterForm.dateRange"
            :show-time="true"
            format="YYYY-MM-DD HH:mm:ss"
          />
        </Form.Item>
      </Form>
    </Modal>
  </div>
</template>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

.map {
  flex: 1;
  width: 100%;
}

.map-controls {
  padding: 16px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
  text-align: center;
}

:deep(.ant-space) {
  gap: 16px !important;
}

:deep(.ant-form-item) {
  margin-bottom: 16px;
}

:deep(.ant-picker-range) {
  width: 100%;
}

#container {
  width: 100%;
  height: 100%;
  min-height: 400px;  /* 添加最小高度 */
  border-radius: 8px;
  overflow: hidden;
}

:deep(.custom-content-marker) {
  width: 500px;
  padding: 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

:deep(.info-window-content) {
  display: flex;
}

:deep(.chart-section) {
  width: 200px;
  padding: 15px;
  background: #f5f5f5;
  border-right: 1px solid #eee;
}

:deep(.chart-title) {
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
  text-align: center;
}

:deep(.chart-container) {
  height: 150px;
}

:deep(.info-section) {
  flex: 1;
  padding: 15px;
}

:deep(.info-header) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

:deep(.info-header h4) {
  margin: 0;
  color: #333;
  font-size: 16px;
}

:deep(.status-tag) {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

:deep(.status-tag.normal) {
  background: #e6f7ff;
  color: #1890ff;
  border: 1px solid #91d5ff;
}

:deep(.info-grid) {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

:deep(.info-item) {
  display: flex;
  flex-direction: column;
}

:deep(.info-item .label) {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

:deep(.info-item .value) {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

:deep(.loading-content) {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  padding: 20px;
}

:deep(.loading-spinner) {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

:deep(.loading-text) {
  margin-top: 10px;
  color: #666;
}

:deep(.error-content) {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  padding: 20px;
}

:deep(.error-icon) {
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background: #ff4d4f;
  color: white;
  border-radius: 50%;
  font-size: 24px;
  font-weight: bold;
}

:deep(.error-text) {
  margin-top: 10px;
  color: #ff4d4f;
}

:deep(.retry-button) {
  margin-top: 15px;
  padding: 6px 16px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

:deep(.retry-button:hover) {
  background: #40a9ff;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
