// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    'normal': '正常运行',
    'warning': '需要关注',
    'critical': '需要立即处理',
    'unknown': '状态未知'
  };
  return statusMap[status] || '状态未知';
};

// 获取预警级别文本
const getWarningLevelText = (level) => {
  const levelMap = {
    'green': '正常',
    'yellow': '警告',
    'red': '严重',
    'unknown': '未知'
  };
  return levelMap[level] || '未知';
};

// 获取异常类型文本
const getAnomalyTypeText = (type) => {
  if (!type) return '无异常';
  return type;
};

// 格式化时间戳
const formatTimestamp = (timestamp) => {
  if (!timestamp) return '无数据';
  try {
    return new Date(timestamp).toLocaleString('zh-CN');
  } catch (error) {
    return timestamp;
  }
};

// 首页信息窗体内容 - 简洁版本
export const createHomePageInfoContent = (stationData) => {
  return `
    <div class="custom-content-marker">
      <div class="info-window-content">
        <div class="info-section">
          <div class="info-header">
            <h4>充电站概览 - ${stationData.meter_id}</h4>
            <span class="status-tag ${stationData.overall_status || 'unknown'}">${getStatusText(stationData.overall_status)}</span>
          </div>
          
          <div class="info-grid">
            <div class="info-item">
              <span class="label">设备标识</span>
              <span class="value">${stationData.dev_fac_id || '未知'}</span>
            </div>
            <div class="info-item">
              <span class="label">最新电流</span>
              <span class="value">${stationData.latest_current || '0'} A</span>
            </div>
            <div class="info-item">
              <span class="label">额定功率</span>
              <span class="value">${stationData.rated_power || '0'} kW</span>
            </div>
            <div class="info-item">
              <span class="label">异常状态</span>
              <span class="value">${stationData.is_anomaly ? '有异常' : '正常'}</span>
            </div>
            <div class="info-item">
              <span class="label">预警级别</span>
              <span class="value warning-level-${stationData.warning_level || 'unknown'}">${getWarningLevelText(stationData.warning_level)}</span>
            </div>
            <div class="info-item">
              <span class="label">更新时间</span>
              <span class="value">${formatTimestamp(stationData.current_timestamp)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

// 异常检测页面信息窗体内容 - 详细版本
export const createAbnormalDetectionInfoContent = (stationData, chartData = null, anomalyStats = null) => {

  return `
    <div class="custom-content-marker">
      <div class="info-window-content">
        <div class="content-layout">
          <!-- 左侧图片区域 -->
          <div class="image-section">
            ${chartData && Array.isArray(chartData) && chartData.length > 0 ? `
              <div class="chart-container">
                <div class="chart-title">电流曲线图 (6小时)</div>
                <div class="chart-wrapper" id="chart-${stationData.meter_id}"></div>
              </div>
            ` : `
              <div class="image-placeholder">
                <div class="placeholder-icon">📊</div>
                <div class="placeholder-text">图表区域</div>
              </div>
            `}
          </div>
          
          <!-- 右侧信息区域 -->
          <div class="info-section">
            <div class="info-header">
              <h4>详情</h4>
              <span class="status-tag ${stationData.overall_status || 'unknown'}">${getStatusText(stationData.overall_status)}</span>
            </div>
            
            <div class="info-grid">
              <div class="info-item">
                <span class="label">电表ID</span>
                <span class="value">${stationData.meter_id || '未知'}</span>
              </div>
              <div class="info-item">
                <span class="label">额定功率</span>
                <span class="value">${stationData.rated_power || '0'} kW</span>
              </div>
              <div class="info-item">
                <span class="label">最大电流</span>
                <span class="value">输入: ${stationData.max_input_current || '0'}A / 输出: ${stationData.max_output_current || '0'}A</span>
              </div>
              <div class="info-item">
                <span class="label">当前电流</span>
                <span class="value">${stationData.latest_current || '0'} A</span>
              </div>
              <div class="info-item">
                <span class="label">异常状态</span>
                <span class="value">${stationData.is_anomaly ? '有异常' : '正常'} - ${getAnomalyTypeText(stationData.anomaly_type)}</span>
              </div>
              <div class="info-item">
                <span class="label">更新时间</span>
                <span class="value">${formatTimestamp(stationData.current_timestamp)}</span>
              </div>
            </div>
            ${anomalyStats && anomalyStats.anomaly_types && anomalyStats.anomaly_types.length > 0 ? `
              <div class="anomaly-stats">
                <h5>历史异常统计（${anomalyStats.period_days}天）</h5>
                <div>总异常次数：${anomalyStats.total_anomalies}</div>
                <ul>
                  ${anomalyStats.anomaly_types.map(item => `
                    <li>${item.anomaly_type}：${item.count}次（${item.percentage}%）</li>
                  `).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    </div>
  `;
};

// 根据路由获取对应的信息窗体内容生成器
export const getInfoContentGenerator = (routePath) => {
  switch (routePath) {
    case '/':
      return createHomePageInfoContent;
    case '/abnormal-detection':
      return createAbnormalDetectionInfoContent;
    default:
      // 默认使用首页的简洁版本
      return createHomePageInfoContent;
  }
}; 