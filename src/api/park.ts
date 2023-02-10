import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";
export type ParkType = {
  // 园区id
  id: string;
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
  img: string;
};
export type ParkResult = {
  msg: string;
  code: number;
  page: {
    totalCount: number;
    pageSize: number;
    totalPage: number;
    currPage: number;
    list: ParkType[];
  };
};
export type ParkCreateRequest = {
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
  img: string;
};
const getList = async () => {
  return await http.request<ParkResult>("get", baseUrlApi("/admin/park/list"));
};
// export const edit = async (data: ParkType) => {
//   return await http.request<any>("post", baseUrlApi("admin/park/update"), {
//     data
//   });
// }

// Todo:
const edit = async (id: string, data: ParkCreateRequest): Promise<ParkType> => {
  return http.request<any>("post", baseUrlApi("/admin/park/update"), { data });
};
const create = async (data: ParkCreateRequest): Promise<ParkType> => {
  return http.request<any>("post", baseUrlApi("/admin/park/update"), { data });
};
export default {
  getList,
  edit,
  create
};
