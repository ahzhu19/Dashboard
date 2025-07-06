<script setup>
import { onMounted, onUnmounted, ref, nextTick } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import '../utils/mapConfig.js';
import { getAllStations, getStationCurrentChart,getStationAnomalyStats } from '../api/chargingStation';
import { getInfoContentGenerator } from '../utils/infoWindowContent';
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
let cachedStations = []; // 缓存充电站数据

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

// 初始化电流曲线图
const initCurrentChart = (container, chartData) => {
  if (currentChart) {
    currentChart.dispose();
  }
  
  const chart = echarts.init(container);
  currentChart = chart;
  
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        const data = params[0];
        return `${data.name}<br/>电流: ${data.value} A`;
      }
    },
    grid: {
      top: '15%',
      left: '10%',
      right: '5%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: chartData.map(item => item.time),
      axisLabel: {
        color: '#666',
        fontSize: 10,
        rotate: 45
      },
      axisLine: {
        lineStyle: {
          color: '#ddd'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: '电流 (A)',
      nameTextStyle: {
        color: '#666',
        fontSize: 10
      },
      axisLabel: {
        color: '#666',
        fontSize: 10
      },
      axisLine: {
        lineStyle: {
          color: '#ddd'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0'
        }
      }
    },
    series: [{
      name: '电流值',
      data: chartData.map(item => item.value),
      type: 'line',
      smooth: true,
      color: '#1890ff',
      lineWidth: 2,
      symbol: 'circle',
      symbolSize: 4,
      itemStyle: {
        color: '#1890ff',
        borderColor: '#fff',
        borderWidth: 1
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'rgba(24, 144, 255, 0.3)'
          }, {
            offset: 1, color: 'rgba(24, 144, 255, 0.05)'
          }]
        }
      }
    }]
  };
  
  chart.setOption(option);
};

const initAnomalyStatsChart = (container, anomalyTypes) => {
  if (!container || !anomalyTypes || anomalyTypes.length === 0) return;
  const chart = echarts.init(container);
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '异常类型',
        type: 'bar',
        data: anomalyTypes.map(item => ({
          name: item.anomaly_type,
          value: item.count
        }))
      }
    ]
  };
  chart.setOption(option);
};

// 按钮事件处理
const handleRefresh = async () => {
  try {
    message.loading({ content: '正在刷新数据...', duration: 0 });
    
    // 重新获取最新数据
    const newStations = await getAllStations();
    cachedStations = newStations;
    
    // 清除现有标记
    map.clearMap();
    
    // 重新创建标记
    const markers = cachedStations.map(createMarker);
    markers.forEach(marker => map.add(marker));
    
    // 调整视野
    if (markers.length > 0) {
      map.setFitView();
    }
    
    message.success('数据刷新成功');
  } catch (error) {
    console.error('刷新数据失败:', error);
    message.error('数据刷新失败');
  }
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

      // 创建不同警告级别的标记图标
      const icons = {
        red: new AMap.Icon({
          size: new AMap.Size(25, 34),    // 图标大小
          image: '/icons/marker-red.png',  // 红色图标 - 严重警告
          imageSize: new AMap.Size(25, 34) // 图片大小
        }),
        yellow: new AMap.Icon({
          size: new AMap.Size(25, 34),
          image: '/icons/marker-yellow.png', // 黄色图标 - 一般警告
          imageSize: new AMap.Size(25, 34)
        }),
        green: new AMap.Icon({
          size: new AMap.Size(25, 34),
          image: '/icons/marker-green.png',  // 绿色图标 - 正常状态
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
      const createMarker = (stationData) => {
        // 根据 warning_level 选择图标颜色
        const warningLevel = stationData.warning_level || 'green';
        console.log('Creating marker with warning_level:', warningLevel);
        
        const marker = new AMap.Marker({
          position: new AMap.LngLat(stationData.longitude, stationData.latitude),
          offset: new AMap.Pixel(-12.5, -34),
          icon: icons[warningLevel],
          title: `充电站-${stationData.meter_id}`,
          zoom: [3, 20],
        });

        marker.on('click', async () => {
          try {
            // 🔍 调试：检查meter_id的类型和值
            console.log('🔍 meter_id 类型:', typeof stationData.meter_id);
            console.log('🔍 meter_id 值:', stationData.meter_id);
            console.log('🔍 meter_id 字符串化:', String(stationData.meter_id));
            
            // 显示加载状态
            const loadingContent = `
              <div class="custom-content-marker">
                <div class="content-layout">
                  <div class="image-section">
                    <div class="loading-placeholder">
                      <div class="loading-spinner"></div>
                      <div class="loading-text">加载图表中...</div>
                    </div>
                  </div>
                  <div class="info-section">
                    <div class="loading-info">
                      <div class="loading-spinner"></div>
                      <div class="loading-text">加载数据中...</div>
                    </div>
                  </div>
                </div>
              </div>
            `;
            infoWindow.setContent(loadingContent);
            infoWindow.open(map, marker.getPosition());

            // 并行获取信息窗体内容和电流曲线图数据
            const [contentGenerator, chartData, anomalyStats] = await Promise.all([
              Promise.resolve(getInfoContentGenerator(route.path)),
              getStationCurrentChart(stationData.meter_id, 6), // 获取6小时数据
              getStationAnomalyStats(stationData.meter_id, 30) // 获取30天异常统计数据
            ]);

            // 生成信息窗体内容，传递图表数据
            const content = contentGenerator(stationData, chartData.data, anomalyStats);
            infoWindow.setContent(content);
            infoWindow.open(map, marker.getPosition());

            // 等待DOM更新后初始化图表
            setTimeout(() => {
              const containerId = `chart-${stationData.meter_id}`;
              console.log('🔍 查找的容器ID:', containerId);
              console.log('🔍 容器ID类型:', typeof containerId);
              
              const chartContainer = document.getElementById(containerId);
              console.log('🔍 找到的容器:', chartContainer);
              
              if (chartContainer) {
                console.log('🔍 容器尺寸:', {
                  offsetWidth: chartContainer.offsetWidth,
                  offsetHeight: chartContainer.offsetHeight,
                  clientWidth: chartContainer.clientWidth,
                  clientHeight: chartContainer.clientHeight
                });
                initCurrentChart(chartContainer, chartData.data);
              } else {
                console.error('❌ 图表容器未找到！');
                // 尝试查找所有包含chart-的div
                const allChartDivs = document.querySelectorAll('[id^="chart-"]');
                console.log('🔍 页面中所有chart-开头的div:', allChartDivs);
              }
            }, 100);

          } catch (error) {
            console.error('加载数据失败:', error);
            // 显示错误信息
            const errorContent = `
              <div class="custom-content-marker">
                <div class="content-layout">
                  <div class="image-section">
                    <div class="error-placeholder">
                      <div class="error-icon">❌</div>
                      <div class="error-text">图表加载失败</div>
                    </div>
                  </div>
                  <div class="info-section">
                    <div class="error-info">
                      <div class="error-icon">❌</div>
                      <div class="error-text">数据加载失败：${error.message || '未知错误'}</div>
                    </div>
                  </div>
                </div>
              </div>
            `;
            infoWindow.setContent(errorContent);
            infoWindow.open(map, marker.getPosition());
          }
        });

        return marker;
      };

      try {
        // 获取所有充电站数据并缓存
        cachedStations = await getAllStations();
        
        // 创建并添加所有充电站标记
        const markers = cachedStations.map(createMarker);
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
  min-height: 400px;
  border-radius: 8px;
  overflow: hidden;
}

:deep(.custom-content-marker) {
  width: 700px;
  padding: 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

:deep(.info-window-content) {
  padding: 0;
}

:deep(.content-layout) {
  display: flex !important;
  min-height: 300px;
  width: 100%;
}

:deep(.image-section) {
  width: 250px !important;
  min-width: 250px !important;
  flex-shrink: 0 !important;
  background: #f8f9fa;
  border-right: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px 0 0 8px;
  padding: 10px;
}

:deep(.image-placeholder) {
  text-align: center;
  color: #6c757d;
}

:deep(.placeholder-icon) {
  font-size: 48px;
  margin-bottom: 8px;
}

:deep(.placeholder-text) {
  font-size: 14px;
  font-weight: 500;
}

:deep(.info-section) {
  flex: 1 !important;
  padding: 20px;
  min-width: 0 !important;
}

:deep(.info-header) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

:deep(.info-header h4) {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

:deep(.status-tag) {
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

:deep(.status-tag.normal) {
  background: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

:deep(.status-tag.warning) {
  background: #fffbe6;
  color: #faad14;
  border: 1px solid #ffe58f;
}

:deep(.status-tag.critical) {
  background: #fff2f0;
  color: #ff4d4f;
  border: 1px solid #ffccc7;
}

:deep(.status-tag.unknown) {
  background: #f5f5f5;
  color: #666;
  border: 1px solid #d9d9d9;
}

:deep(.info-grid) {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

:deep(.info-item) {
  display: flex;
  flex-direction: column;
  padding: 10px 12px;
  background: #fafafa;
  border-radius: 6px;
  border-left: 3px solid #1890ff;
  transition: all 0.3s ease;
}

:deep(.info-item:hover) {
  background: #f0f8ff;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
}

:deep(.info-item .label) {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
  font-weight: 500;
}

:deep(.info-item .value) {
  font-size: 14px;
  color: #333;
  font-weight: 600;
  line-height: 1.4;
}

:deep(.warning-level-green) {
  color: #52c41a;
  font-weight: 600;
}

:deep(.warning-level-yellow) {
  color: #faad14;
  font-weight: 600;
}

:deep(.warning-level-red) {
  color: #ff4d4f;
  font-weight: 600;
}

:deep(.warning-level-unknown) {
  color: #666;
  font-weight: 600;
}

:deep(.chart-container) {
  width: 100% !important;
  height: 100% !important;
  display: flex !important;
  flex-direction: column !important;
}

:deep(.chart-title) {
  font-size: 12px;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin-bottom: 8px;
  padding: 4px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

:deep(.chart-wrapper) {
  flex: 1 !important;
  width: 100% !important;
  min-height: 180px !important;
  height: 180px !important;
}

:deep(.loading-placeholder) {
  text-align: center;
  color: #6c757d;
}

:deep(.loading-spinner) {
  width: 30px;
  height: 30px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 8px;
}

:deep(.loading-text) {
  font-size: 12px;
  color: #666;
}

:deep(.error-placeholder) {
  text-align: center;
  color: #ff4d4f;
}

:deep(.error-icon) {
  font-size: 24px;
  margin-bottom: 8px;
}

:deep(.error-text) {
  font-size: 12px;
}

:deep(.loading-info) {
  text-align: center;
  padding: 40px 20px;
}

:deep(.error-info) {
  text-align: center;
  padding: 40px 20px;
  color: #ff4d4f;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
