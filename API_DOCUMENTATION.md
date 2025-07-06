# 电动汽车充电风险监测平台 API 接口文档

## 概述

本文档描述了电动汽车充电风险监测平台后端服务的所有API接口。该服务基于Flask框架构建，使用Waitress作为WSGI服务器，提供预测、监测和统计分析功能。

### 服务信息
- **服务名称**: 电动汽车充电风险监测平台后端服务
- **版本**: 1.1.0
- **基础URL**: `http://localhost:8000`
- **数据格式**: JSON
- **字符编码**: UTF-8

### 通用响应格式

#### 成功响应
```json
{
  "success": true,
  "data": {},
  "timestamp": "2025-01-04T12:00:00.000000"
}
```

#### 错误响应
```json
{
  "success": false,
  "error": "错误描述",
  "timestamp": "2025-01-04T12:00:00.000000"
}
```

---

## API 接口列表

### 1. 基础接口

#### 1.1 根路径 - API文档

**接口地址**: `GET /`

**功能描述**: 获取API文档和服务信息，没啥用，只是让根目录不会报错

**请求参数**: 无

**响应示例**:
```json
{
  "service_name": "电动汽车充电风险监测平台后端服务",
  "version": "1.1.0",
  "description": "提供预测、监测和统计分析功能的RESTful API服务",
  "status": "running",
  "timestamp": "2025-01-04T12:00:00.000000",
  "api_endpoints": {
    "health_check": {
      "path": "/api/health",
      "method": "GET",
      "description": "健康检查接口"
    }
    // ... 其他接口信息
  },
  "usage_examples": {
    "get_health": "GET /api/health",
    "get_prediction": "GET /api/prediction/data?meter_id=METER_001&hours=24",
    "get_sites_with_status": "GET /api/sites/locations"
    // ... 其他使用示例
  }
}
```

#### 1.2 健康检查

**接口地址**: `GET /api/health`

**功能描述**: 检查服务状态和数据库连接，可以随便放个地方，方便知道后端情况，也可以不用。

**请求参数**: 无

**响应示例**:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-04T12:00:00.000000",
  "database": "connected"
}
```

**错误响应**:
```json
{
  "status": "unhealthy",
  "timestamp": "2025-01-04T12:00:00.000000",
  "database": "disconnected",
  "error": "数据库连接失败"
}
```


---

### 2. 预测界面接口

#### 2.1 获取预测数据（主要）

**接口地址**: `GET /api/prediction/data`

**功能描述**: 获取指定时间范围内的预测数据，最好是指定电表，全部数据有点太多了，用于绘制预测曲线

**请求参数**:
| 参数名 | 类型 | 必需 | 默认值 | 说明 |
|--------|------|------|--------|------|
| meter_id | string | 否 | - | 电表ID，为空则获取所有电表数据 |
| hours | integer | 否 | 24 | 预测小时数 |

**请求示例**:
```
GET /api/prediction/data?meter_id=METER_001&hours=6
```

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "meter_id": "METER_001",
      "timestamp": "2025-01-04T12:00:00",
      "predicted_value": 15.5,
      "warning_level": "normal",
      "is_charging": true,
      "pattern_label": "正常充电",
      "anomaly_info": {
        "type": "none",
        "confidence": 0.95
      }
    }
  ],
  "count": 1,
  "timestamp": "2025-01-04T12:00:00.000000"
}
```

#### 2.2 获取充电站位置信息（主要）

**接口地址**: `GET /api/sites/locations`

**功能描述**: 获取所有充电站的完整状态信息，包括地理位置、基本信息和实时状态，用于地图展示和状态监控

**请求参数**: 无

**返回字段说明**:

**基本信息**:
- `meter_id`: 电表ID
- `longitude`: 经度
- `latitude`: 纬度
- `dev_fac_id`: 设备设施标识
- `rated_power`: 额定功率（kW）
- `max_input_current`: 最大输入电流（A）
- `max_output_current`: 最大输出电流（A）

**实时状态**:
- `latest_current`: 最新电流值（A）
- `current_timestamp`: 电流数据时间戳
- `anomaly_type`: 异常类型（如有）
- `is_anomaly`: 是否存在异常（boolean）
- `anomaly_timestamp`: 异常数据时间戳
- `warning_level`: 预警级别（green/yellow/red/unknown）
- `warning_timestamp`: 预警数据时间戳
- `overall_status`: 综合状态（normal/warning/critical/unknown）

**综合状态说明**:
- `normal`: 正常运行
- `warning`: 需要关注
- `critical`: 需要立即处理
- `unknown`: 状态未知

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "meter_id": "METER_001",
      "longitude": 116.4074,
      "latitude": 39.9042,
      "dev_fac_id": "FAC_001",
      "rated_power": 60.0,
      "max_input_current": 250.0,
      "max_output_current": 200.0,
      "latest_current": 45.2,
      "current_timestamp": "2025-01-04T12:00:00.000000",
      "anomaly_type": "高值异常",
      "is_anomaly": true,
      "anomaly_timestamp": "2025-01-04T11:45:00.000000",
      "warning_level": "yellow",
      "warning_timestamp": "2025-01-04T12:00:00.000000",
      "overall_status": "warning"
    },
    {
      "meter_id": "METER_002",
      "longitude": 116.4084,
      "latitude": 39.9052,
      "dev_fac_id": "FAC_002",
      "rated_power": 120.0,
      "max_input_current": 300.0,
      "max_output_current": 250.0,
      "latest_current": 25.8,
      "current_timestamp": "2025-01-04T12:00:00.000000",
      "anomaly_type": null,
      "is_anomaly": false,
      "anomaly_timestamp": null,
      "warning_level": "green",
      "warning_timestamp": "2025-01-04T12:00:00.000000",
      "overall_status": "normal"
    }
  ],
  "count": 2,
  "timestamp": "2025-01-04T12:00:00.000000"
}
```

---

### 3. 监测界面接口

#### 3.1 获取实时电流数据

**接口地址**: `GET /api/monitoring/current`

**功能描述**: 获取指定电表的实时电流数据，用于绘制充电桩的历史曲线，放在检测页面。

**请求参数**:
| 参数名 | 类型 | 必需 | 默认值 | 说明 |
|--------|------|------|--------|------|
| meter_id | string | 是 | - | 电表ID |
| hours | integer | 否 | 6 | 查询小时数 |

**请求示例**:
```
GET /api/monitoring/current?meter_id=METER_001&hours=6
```

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "timestamp": "2025-01-04T12:00:00",
      "current_value": 15.5,
      "dev_fac_id": "FAC_001"
    }
  ],
  "count": 1,
  "meter_id": "METER_001",
  "timestamp": "2025-01-04T12:00:00.000000"
}
```

**错误响应**:
```json
{
  "success": false,
  "error": "缺少必需参数: meter_id",
  "timestamp": "2025-01-04T12:00:00.000000"
}
```

#### 3.2 获取历史异常统计

**接口地址**: `GET /api/monitoring/anomalies`

**功能描述**: 获取指定电表的历史异常统计信息

**请求参数**:
| 参数名 | 类型 | 必需 | 默认值 | 说明 |
|--------|------|------|--------|------|
| meter_id | string | 是 | - | 电表ID |
| days | integer | 否 | 30 | 统计天数 |

**请求示例**:
```
GET /api/monitoring/anomalies?meter_id=METER_001&days=30
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "meter_id": "METER_001",
    "period_days": 30,
    "total_anomalies": 15,
    "anomaly_types": [
      {
        "anomaly_type": "电流过高",
        "count": 8,
        "percentage": 53.33
      },
      {
        "anomaly_type": "电流波动",
        "count": 7,
        "percentage": 46.67
      }
    ]
  },
  "timestamp": "2025-01-04T12:00:00.000000"
}
```

---

### 4. 统计分析接口

#### 4.1 获取月度异常统计

**接口地址**: `GET /api/statistics/monthly`

**功能描述**: 获取指定月份的异常统计信息

**请求参数**:
| 参数名 | 类型 | 必需 | 默认值 | 说明 |
|--------|------|------|--------|------|
| meter_id | string | 否 | - | 电表ID，为空则统计全部 |
| year | integer | 否 | 当前年 | 年份 |
| month | integer | 否 | 当前月 | 月份 |

**请求示例**:
```
GET /api/statistics/monthly?meter_id=METER_001&year=2025&month=1
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "meter_id": "METER_001",
    "year": 2025,
    "month": 1,
    "total_anomalies": 45,
    "anomaly_distribution": [
      {
        "anomaly_type": "电流过高",
        "count": 25,
        "percentage": 55.56
      },
      {
        "anomaly_type": "电流波动",
        "count": 20,
        "percentage": 44.44
      }
    ]
  },
  "timestamp": "2025-01-04T12:00:00.000000"
}
```

#### 4.2 获取时段异常统计

**接口地址**: `GET /api/statistics/time-periods`

**功能描述**: 获取按时段分布的异常统计信息

**时段划分**:
- 凌晨: 00:00-06:00
- 上午: 06:00-12:00
- 下午: 12:00-18:00
- 晚上: 18:00-24:00

**请求参数**:
| 参数名 | 类型 | 必需 | 默认值 | 说明 |
|--------|------|------|--------|------|
| meter_id | string | 否 | - | 电表ID，为空则统计全部 |
| year | integer | 否 | 当前年 | 年份 |
| month | integer | 否 | 当前月 | 月份 |

**请求示例**:
```
GET /api/statistics/time-periods?meter_id=METER_001&year=2025&month=1
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "meter_id": "METER_001",
    "year": 2025,
    "month": 1,
    "time_period_stats": {
      "凌晨(00:00-06:00)": [
        {
          "anomaly_type": "电流过高",
          "count": 5
        }
      ],
      "上午(06:00-12:00)": [
        {
          "anomaly_type": "电流波动",
          "count": 8
        }
      ],
      "下午(12:00-18:00)": [
        {
          "anomaly_type": "电流过高",
          "count": 12
        }
      ],
      "晚上(18:00-24:00)": [
        {
          "anomaly_type": "电流波动",
          "count": 6
        }
      ]
    }
  },
  "timestamp": "2025-01-04T12:00:00.000000"
}
```

---

## 错误处理

### HTTP状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 404 | 接口不存在 |
| 500 | 服务器内部错误 |

### 错误响应格式

所有错误响应都遵循统一格式：

```json
{
  "success": false,
  "error": "具体错误描述",
  "timestamp": "2025-01-04T12:00:00.000000"
}
```

### 常见错误

#### 1. 缺少必需参数
```json
{
  "success": false,
  "error": "缺少必需参数: meter_id",
  "timestamp": "2025-01-04T12:00:00.000000"
}
```

#### 2. 数据库连接失败
```json
{
  "success": false,
  "error": "数据库连接失败",
  "timestamp": "2025-01-04T12:00:00.000000"
}
```

#### 3. 接口不存在
```json
{
  "success": false,
  "error": "接口不存在",
  "timestamp": "2025-01-04T12:00:00.000000"
}
```


## 数据库表结构说明

### 主要数据表

1. **prediction_results** - 预测结果表
   - id: 主键
   - meter_id: 电表ID
   - timestamp: 时间戳
   - predicted_value: 预测值
   - warning_level: 预警级别
   - is_charging: 是否充电
   - pattern_label: 模式标签
   - anomaly_info: 异常信息(JSON)

2. **site_data** - 站点数据表
   - meter_id: 电表ID
   - longitude: 经度
   - latitude: 纬度
   - dev_fac_id: 设备设施ID
   - rated_power: 额定功率
   - max_input_current: 最大输入电流
   - max_output_current: 最大输出电流

3. **time_i_data** - 时序电流数据表
   - meter_id: 电表ID
   - timestamp: 时间戳
   - i: 电流值
   - dev_fac_id: 设备设施ID

4. **current_data** - 电流数据表
   - meter_id: 电表ID
   - timestamp: 时间戳
   - anomaly_type: 异常类型

## 版本历史

### v1.1.0 (2025-01-04)
- **接口增强**: `/api/sites/locations` 接口新增实时状态信息
  - 新增最新电流值、异常信息、预警级别等字段
  - 新增综合状态评级（normal/warning/critical/unknown）
  - 提供完整的充电站实时监控数据
- **数据查询优化**: 修改数据查询逻辑，基于数据库最新时间戳而非当前时间
  - 优化 `get_realtime_current` 方法
  - 优化 `get_prediction_data` 方法
  - 优化 `get_historical_anomalies` 方法
- **系统稳定性提升**: 增强日志记录和错误处理机制

### v1.0.0 (2025-01-04)
- 初始版本发布
- 实现预测、监测、统计三大功能模块
- 支持Waitress WSGI服务器
- 完整的API文档和错误处理

---


**文档更新时间**: 2025年1月4日
**API版本**: v1.1.0