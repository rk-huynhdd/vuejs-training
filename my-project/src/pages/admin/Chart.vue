<script setup>
import { computed, nextTick, onMounted } from "vue";
import MainLayout from "../../layouts/MainLayout.vue";
import useEmployees from "../../stores/employee";
import useUiStore from "../../stores/UIstore";
import Loading from "../../common/Loading.vue";
import { Bar, Column, Pie } from "@antv/g2plot";
const employeeStore = useEmployees();
const UIStore = useUiStore();
const dataChart = computed(() => {
  return [
    {
      type: "Male",
      value: employeeStore.maleNumber,
    },
    {
      type: "Female",
      value: employeeStore.femaleNumber,
    },
  ];
});
const drawPieChart = () => {
  const piePlot = new Pie("containerPie", {
    forceFit: true,

    radius: 0.8,
    data: dataChart.value,
    angleField: "value",
    colorField: "type",
    color: ["blue", "purple"],
    label: {
      type: "inner",
      offset: "-30%",
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: { fontSize: 14, textAlign: "center", color: "black" },
    },
    interactions: [{ type: "element-active" }],
    autoFit: true,
  });
  piePlot.render();
};
const drawColumnChart = () => {
  const columnPort = new Column("containerColumn", {
    data: employeeStore.departmentData,
    xField: "type",
    yField: "value",
    color: "green",
    label: {
      position: "middle",
      style: {
        fill: "white",
      },
    },
    xAxis: {
      label: {
        autoRotate: false,
        autoHide: true,
        autoEllipsis: true,
        style: {
          fontWeight: "bold",
          fill: "black",
        },
      },
    },
    autoFit: true,
  });
  columnPort.render();
};
const drawBarChart = () => {
  const barPlot = new Bar("containerBar", {
    data: employeeStore.titleData,
    xField: "value",
    yField: "type",
    color: "orange",
    yAxis: {
      label: {
        style: {
          fontWeight: "bold",
        },
      },
    },
    xAxis: {
      label: {
        style: {
          fontWeight: "bold",
        },
      },
    },
    autoFit: true,
  });
  barPlot.render();
};
onMounted(async () => {
  await employeeStore.getData();
  drawPieChart();
  drawColumnChart();
  drawBarChart();
});
</script>

<template>
  <MainLayout>
    <Loading v-model:is-loading="UIStore.isLoading" />
    <a-row :gutter="6">
      <a-col :span="6">
        <a-card title="Gender">
          <div id="containerPie"></div>
        </a-card>
      </a-col>
      <a-col :span="14">
        <a-card title="Department">
          <div id="containerColumn"></div>
        </a-card>
      </a-col>
    </a-row>
    <a-card title="Job title">
      <div id="containerBar"></div>
    </a-card>
  </MainLayout>
</template>
