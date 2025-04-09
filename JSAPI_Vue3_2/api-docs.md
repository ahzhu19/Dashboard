# API接口文档

## 充电数据API

### 1. 获取所有充电设施信息

- **URL**: `/api/charging/facility/all`
- **方法**: GET
- **描述**: 获取所有充电设施信息
- **响应示例**:
```json
[
  {
    "id": 1,
    "facilityId": "1555746523",
    "address": "江苏省南通市海门市通海花苑·海棠园16号楼1单元充电桩站点",
    "longitude": 120.427313,
    "latitude": 32.545030
  }
]
```

### 2. 获取所有充电站负荷上限分析结果

- **URL**: `/api/charging/load-limit/all`
- **方法**: GET
- **描述**: 获取所有充电站负荷上限分析结果
- **响应示例**:
```json
[
  {
    "id": 1,
    "stationId": "1555746523",
    "maxLoad": 2.893,
    "limitLoad": 2.893,
    "percentile95Load": 1.613,
    "avgLoad": 0.207
  }
]
```

### 3. 获取所有充电站负荷占用总体分析结果

- **URL**: `/api/charging/load-occupancy/all`
- **方法**: GET
- **描述**: 获取所有充电站负荷占用总体分析结果
- **响应示例**:
```json
[
  {
    "id": 1,
    "stationId": "1555746523",
    "avgLoadOccupancyRate": 7.25,
    "maxLoadOccupancyRate": 95.92,
    "timeRange": "00:00-06:00",
    "timeRangeAvgOccupancy": 7.27
  }
]
```

### 4. 根据充电站ID获取负荷上限分析结果

- **URL**: `/api/charging/load-limit/station/{stationId}`
- **方法**: GET
- **参数**: 
  - `stationId`: 充电站ID
- **描述**: 根据充电站ID获取负荷上限分析结果
- **响应示例**:
```json
{
  "id": 1,
  "stationId": "1555746523",
  "maxLoad": 2.893,
  "limitLoad": 2.893,
  "percentile95Load": 1.613,
  "avgLoad": 0.207
}
```

### 5. 根据充电站ID获取负荷占用分析结果

- **URL**: `/api/charging/load-occupancy/station/{stationId}`
- **方法**: GET
- **参数**: 
  - `stationId`: 充电站ID
- **描述**: 根据充电站ID获取负荷占用分析结果
- **响应示例**:
```json
[
  {
    "id": 1,
    "stationId": "1555746523",
    "avgLoadOccupancyRate": 7.25,
    "maxLoadOccupancyRate": 95.92,
    "timeRange": "00:00-06:00",
    "timeRangeAvgOccupancy": 7.27
  },
  {
    "id": 2,
    "stationId": "1555746523",
    "avgLoadOccupancyRate": 2.57,
    "maxLoadOccupancyRate": 91.74,
    "timeRange": "06:00-12:00",
    "timeRangeAvgOccupancy": 2.57
  }
]
```

### 6. 导入充电设施信息CSV文件

- **URL**: `/api/charging/facility/import`
- **方法**: POST
- **描述**: 导入充电设施信息CSV文件
- **参数**:
  - `file`: CSV文件
- **响应示例**:
```json
{
  "success": true,
  "message": "成功导入9条充电设施信息",
  "count": 9
}
```

### 7. 导入充电站负荷上限分析结果CSV文件

- **URL**: `/api/charging/load-limit/import`
- **方法**: POST
- **描述**: 导入充电站负荷上限分析结果CSV文件
- **参数**:
  - `file`: CSV文件
- **响应示例**:
```json
{
  "success": true,
  "message": "成功导入9条充电站负荷上限分析结果",
  "count": 9
}
```

### 8. 导入充电站负荷占用总体分析结果CSV文件

- **URL**: `/api/charging/load-occupancy/import`
- **方法**: POST
- **描述**: 导入充电站负荷占用总体分析结果CSV文件
- **参数**:
  - `file`: CSV文件
- **响应示例**:
```json
{
  "success": true,
  "message": "成功导入36条充电站负荷占用总体分析结果",
  "count": 36
}
```

## 充电站数据统计API

### 1. 获取时间段充电统计数据

- **URL**: `/api/station/time-slot-stats`
- **方法**: GET
- **描述**: 获取各时间段（0-6时、6-12时、12-18时、18-24时）的充电统计数据
- **参数**:
  - `startTime`: 开始时间（可选，格式：yyyy-MM-dd HH:mm:ss）
  - `endTime`: 结束时间（可选，格式：yyyy-MM-dd HH:mm:ss）
- **备注**: 如果不提供时间参数，将返回所有数据的时间段统计
- **响应示例**:
```json
{
  "timeSlotStats": [
    {
      "timeSlot": "00:00-06:00",
      "displayName": "0时-6时",
      "stationCount": 5,
      "chargingCount": 120,
      "percentage": 35,
      "avgChargingCurrent": 2.5
    },
    {
      "timeSlot": "06:00-12:00",
      "displayName": "6时-12时",
      "stationCount": 8,
      "chargingCount": 85,
      "percentage": 25,
      "avgChargingCurrent": 2.1
    }
  ],
  "totalChargingCount": 342
}
```

### 2. 获取负荷持续时间排名

- **URL**: `/api/station/load-duration/ranking`
- **方法**: GET
- **描述**: 获取充电站负荷持续时间排名，包含持续时间和负荷率
- **参数**:
  - `threshold`: 负荷阈值（默认0.8）
  - `limit`: 返回记录数量限制（默认10）
- **响应示例**:
```json
[
  {
    "stationId": "1555746523",
    "stationName": "充电站A",
    "durationHours": 18,
    "loadRatio": 75.0
  },
  {
    "stationId": "1555746524",
    "stationName": "充电站B",
    "durationHours": 15,
    "loadRatio": 62.5
  }
]
```

### 3. 获取高电流天数统计

- **URL**: `/api/station/high-current-days`
- **方法**: GET
- **描述**: 获取各充电站电流值超过历史上限特定比例的天数统计
- **参数**:
  - `month`: 月份（可选，格式：1-12）
  - `year`: 年份（可选，格式：yyyy）
  - `thresholdRatio`: 阈值比例（默认0.9，即90%）
- **说明**: 
  - 如果不提供`month`和`year`参数，将自动查询数据库中最近30天的数据
  - 返回结果包含每个充电站在指定时间范围内超过阈值的记录数和总记录数
  - 阈值计算方式为：充电站负荷上限 × 阈值比例
- **响应字段说明**:
  - `stationId`: 充电站ID
  - `stationName`: 充电站名称
  - `limitLoad`: 充电站负荷上限
  - `threshold`: 计算使用的阈值（limitLoad * thresholdRatio）
  - `overThresholdCount`: 超过阈值的记录数
  - `totalRecords`: 时间范围内的总记录数
- **响应示例**:
```json
[
  {
    "stationId": "1555746523",
    "stationName": "充电站3",
    "limitLoad": 2.893,
    "threshold": 2.6037,
    "overThresholdCount": 5,
    "totalRecords": 17
  },
  {
    "stationId": "1555746524",
    "stationName": "充电站4",
    "limitLoad": 2.5,
    "threshold": 2.25,
    "overThresholdCount": 3,
    "totalRecords": 13
  }
]
```

## 本地数据查询接口

### 获取负荷预测历史
- 请求方法：GET
- 接口路径：`/api/ai/local/load_predictions`
- 功能说明：从本地数据库获取历史负荷预测数据
- 请求参数：
  - `limit`：返回记录数量限制，默认10

### 获取异常预测历史
- 请求方法：GET
- 接口路径：`/api/ai/local/anomaly_predictions`
- 功能说明：从本地数据库获取历史异常预测数据
- 请求参数：
  - `limit`：返回记录数量限制，默认10

### 获取有异常标记的预测记录
- 请求方法：GET
- 接口路径：`/api/ai/local/anomaly_predictions/with_anomalies`
- 功能说明：从本地数据库获取带有异常标记的预测记录
- 请求参数：
  - `limit`：返回记录数量限制，默认10

### 获取单个异常预测记录
- 请求方法：GET
- 接口路径：`/api/ai/local/anomaly_predictions/{id}`
- 功能说明：从本地数据库获取指定ID的异常预测记录
- 路径参数：
  - `id`：记录ID

### 获取预警历史
- 请求方法：GET
- 接口路径：`/api/ai/local/warnings`
- 功能说明：从本地数据库获取历史预警数据
- 请求参数：
  - `limit`：返回记录数量限制，默认10
  - `only_actions`：是否只返回需要采取行动的预警，默认false
  - `warning_level`：按预警级别筛选，可选值：LOW、MEDIUM、HIGH、CRITICAL