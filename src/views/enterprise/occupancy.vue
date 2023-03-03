<template>
  <el-row>
    <el-card style="height: 650px; width: 1200px">
      <h1>入驻规模</h1>
      <div id="occupancyChart" style="height: 600px" />
    </el-card>
  </el-row>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { getOccupancySize } from "../../api/enterprise";
import * as echarts from "echarts";

export default defineComponent({
  setup() {
    //入驻列表数据
    const list = ref([]);
    const timeArr = ref([]);
    const rulesArr = ref([]);
    const normalsArr = ref([]);
    // 获得入驻数据
    const getOccupancyData = async () => {
      const res = await getOccupancySize();
      list.value = res.count.sort(compare("time"));
      timeArr.value = list.value.map(item => {
        return item.time;
      });
      rulesArr.value = list.value.map(item => {
        return item.rules;
      });
      normalsArr.value = list.value.map(item => {
        return item.normals;
      });
    };
    // 对数组中的对象按time属性升序排序
    function compare(property) {
      return function (obj1, obj2) {
        const value1 = obj1[property];
        const value2 = obj2[property];
        return value1 - value2; // 升序
      };
    }

    const init = () => {
      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999"
            }
          }
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["bar"] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: ["rules", "normals"]
        },
        xAxis: [
          {
            type: "category",
            data: timeArr.value,
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "value",
            min: 0,
            max: 3,
            interval: 50,
            axisLabel: {
              formatter: "{value} 个"
            }
          }
        ],
        series: [
          {
            name: "rules",
            type: "bar",
            tooltip: {
              valueFormatter: function (value) {
                return (value as number) + "个";
              }
            },
            data: rulesArr.value
          },
          {
            name: "normals",
            type: "bar",
            tooltip: {
              valueFormatter: function (value) {
                return (value as number) + "个";
              }
            },
            data: normalsArr.value
          }
        ]
      };
      // let myChart = echarts.init(proxy.$refs["occupancyChart"]);
      // myChart.setOption(option);
      const chartDom = document.getElementById("occupancyChart")!;
      const myChart = echarts.init(chartDom);
      myChart.setOption(option);
    };
    // 页面加载时
    onMounted(() => {
      getOccupancyData();
      setTimeout(() => {
        init();
        setInterval(init, 60 * 1000);
      }, 200);
      console.log(timeArr.value);
    });

    return {
      list
    };
  }
});
</script>
