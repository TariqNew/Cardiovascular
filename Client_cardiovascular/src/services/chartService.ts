import * as echarts from 'echarts';
import { healthMetricsData, dates } from '../assets/data/healthMetricsData';

export const initializeCharts = () => {
  const instances: echarts.ECharts[] = [];

  const tryInitChart = (id: string, option: echarts.EChartsOption) => {
    const dom = document.getElementById(id);
    if (!dom) return;
    const existing = echarts.getInstanceByDom(dom);
    if (existing) existing.dispose();

    const chart = echarts.init(dom);
    chart.setOption(option);
    instances.push(chart);
  };

  // Chart Options
  tryInitChart('weight-chart', {
    animation: false,
    title: { text: 'Weight Trend (kg)', left: 'center', textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: dates },
    yAxis: { type: 'value', min: 75, max: 82 },
    series: [
      {
        data: healthMetricsData.weight,
        type: 'line',
        smooth: true,
        lineStyle: { color: '#4F46E5' },
        itemStyle: { color: '#4F46E5' },
      },
    ],
  });

  tryInitChart('bp-chart', {
    animation: false,
    title: { text: 'Blood Pressure (mmHg)', left: 'center', textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'axis' },
    legend: { data: ['Systolic', 'Diastolic'], bottom: 0 },
    xAxis: { type: 'category', data: dates },
    yAxis: { type: 'value', min: 70, max: 140 },
    series: [
      {
        name: 'Systolic',
        data: healthMetricsData.bloodPressure.systolic,
        type: 'line',
        smooth: true,
        lineStyle: { color: '#EF4444' },
        itemStyle: { color: '#EF4444' },
      },
      {
        name: 'Diastolic',
        data: healthMetricsData.bloodPressure.diastolic,
        type: 'line',
        smooth: true,
        lineStyle: { color: '#F97316' },
        itemStyle: { color: '#F97316' },
      },
    ],
  });

  tryInitChart('cholesterol-chart', {
    animation: false,
    title: { text: 'Cholesterol Levels (mg/dL)', left: 'center', textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'axis' },
    legend: { data: ['Total', 'LDL', 'HDL'], bottom: 0 },
    xAxis: { type: 'category', data: dates },
    yAxis: { type: 'value', min: 40, max: 230 },
    series: [
      {
        name: 'Total',
        data: healthMetricsData.cholesterol.total,
        type: 'line',
        smooth: true,
        lineStyle: { color: '#8B5CF6' },
        itemStyle: { color: '#8B5CF6' },
      },
      {
        name: 'LDL',
        data: healthMetricsData.cholesterol.ldl,
        type: 'line',
        smooth: true,
        lineStyle: { color: '#EC4899' },
        itemStyle: { color: '#EC4899' },
      },
      {
        name: 'HDL',
        data: healthMetricsData.cholesterol.hdl,
        type: 'line',
        smooth: true,
        lineStyle: { color: '#10B981' },
        itemStyle: { color: '#10B981' },
      },
    ],
  });

  tryInitChart('bmi-chart', {
    animation: false,
    title: { text: 'BMI Trend', left: 'center', textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: dates },
    yAxis: { type: 'value', min: 26, max: 29 },
    series: [
      {
        data: healthMetricsData.bmi,
        type: 'line',
        smooth: true,
        lineStyle: { color: '#0EA5E9' },
        itemStyle: { color: '#0EA5E9' },
        markLine: {
          silent: true,
          lineStyle: { color: '#10B981' },
          data: [{ yAxis: 25, name: 'Healthy Range' }],
        },
      },
    ],
  });

  const handleResize = () => instances.forEach((chart) => chart.resize());
  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);
    instances.forEach((chart) => chart.dispose());
  };
};
