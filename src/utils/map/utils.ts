import AMapLoader from "@amap/amap-jsapi-loader";
let AMap: any;
export async function initMap() {
  AMap = await AMapLoader.load({
    key: "b9651d5a61cc910cbbab24c25aacfd37", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0",
    plugins: [
      "AMap.Scale", //工具条，控制地图的缩放、平移等
      "AMap.ToolBar", //比例尺，显示当前地图中心的比例尺
      "AMap.Geolocation", //定位，提供了获取用户当前准确位置、所在城市的方法
      "AMap.HawkEye" //鹰眼，显示缩略图
    ] // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  });
  return AMap;
}
export const setNewMarker = (longitude, latitude, map) => {
  const marker = new AMap.Marker({
    icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
    position: [longitude, latitude],
    offset: new AMap.Pixel(-26, -54)
  });
  marker.setMap(map);
  return marker;
};
