import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";
export type ParkList = {
  // 园区id
  parkId: string;
  // 园区名称
  parkName: string;
  // 经度
  longitude: string;
  // 纬度
  latitude: string;
  // 园区建筑面积
  area: string;
  // 园区容量
  capacity: string;
  // 园区类型
  parkType: string;
  // 创建时间
  createTime: string;
  // 更新时间
  updateTime: string;
  // 描述
  description: string;
  // 图片地址
  img: JSON;
};
export type ParkResult = {
  msg: string;
  code: number;
  page: {
    totalCount: number;
    pageSize: number;
    totalPage: number;
    currPage: number;
    list: ParkList[];
  };
};
export const getList = async () => {
  return await http.request<ParkResult>("get", baseUrlApi("admin/park/list"));
};
