import * as echarts from "echarts";

export const initializeCharts = async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

    const response = await fetch('http://localhost:5050/api/health/logs', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch graph data");

  const data = await response.json();
  const { dates, weight, bloodPressure, cholesterol, bmi } = data;

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

  // Charts
  tryInitChart("weight-chart", {
    animation: false,
    title: { text: "Weight Trend (kg)", left: "center", textStyle: { fontSize: 14 } },
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: dates },
    yAxis: { type: "value" },
    series: [
      {
        data: weight,
        type: "line",
        smooth: true,
        lineStyle: { color: "#4F46E5" },
        itemStyle: { color: "#4F46E5" },
      },
    ],
  });

  tryInitChart("bp-chart", {
    animation: false,
    title: { text: "Blood Pressure (mmHg)", left: "center", textStyle: { fontSize: 14 } },
    tooltip: { trigger: "axis" },
    legend: { data: ["Systolic", "Diastolic"], bottom: 0 },
    xAxis: { type: "category", data: dates },
    yAxis: { type: "value" },
    series: [
      {
        name: "Systolic",
        data: bloodPressure?.systolic || [],
        type: "line",
        smooth: true,
        lineStyle: { color: "#EF4444" },
        itemStyle: { color: "#EF4444" },
      },
      {
        name: "Diastolic",
        data: bloodPressure?.diastolic || [],
        type: "line",
        smooth: true,
        lineStyle: { color: "#F97316" },
        itemStyle: { color: "#F97316" },
      },
    ],
  });

  tryInitChart("cholesterol-chart", {
    animation: false,
    title: { text: "Cholesterol Levels (mg/dL)", left: "center", textStyle: { fontSize: 14 } },
    tooltip: { trigger: "axis" },
    legend: { data: ["Total", "LDL", "HDL"], bottom: 0 },
    xAxis: { type: "category", data: dates },
    yAxis: { type: "value" },
    series: [
      {
        name: "Total",
        data: cholesterol?.total || [],
        type: "line",
        smooth: true,
        lineStyle: { color: "#8B5CF6" },
        itemStyle: { color: "#8B5CF6" },
      },
      {
        name: "LDL",
        data: cholesterol?.ldl || [],
        type: "line",
        smooth: true,
        lineStyle: { color: "#EC4899" },
        itemStyle: { color: "#EC4899" },
      },
      {
        name: "HDL",
        data: cholesterol?.hdl || [],
        type: "line",
        smooth: true,
        lineStyle: { color: "#10B981" },
        itemStyle: { color: "#10B981" },
      },
    ],
  });

  tryInitChart("bmi-chart", {
    animation: false,
    title: { text: "BMI Trend", left: "center", textStyle: { fontSize: 14 } },
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: dates },
    yAxis: { type: "value" },
    series: [
      {
        data: bmi || [],
        type: "line",
        smooth: true,
        lineStyle: { color: "#0EA5E9" },
        itemStyle: { color: "#0EA5E9" },
        markLine: {
          silent: true,
          lineStyle: { color: "#10B981" },
          data: [{ yAxis: 25, name: "Healthy Range" }],
        },
      },
    ],
  });

  const handleResize = () => instances.forEach((chart) => chart.resize());
  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
    instances.forEach((chart) => chart.dispose());
  };
};
