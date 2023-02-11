import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";
import { ResType } from "./types";
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
  imgList: string[];
};
export type ParkResult = {
  msg: string;
  code: number;
  pageInfo: {
    total: number;
    pageSize: number;
    totalPage: number;
    current: number;
    records: ParkType[];
  };
};
export type ParkCreateRequest = {
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
  imgList: string[];
};
const getList = async (page: number) => {
  return await http.request<ParkResult>(
    "get",
    baseUrlApi("/admin/park/page?curPage=" + page)
  );
};
const edit = async (data: ParkCreateRequest): Promise<ResType> => {
  return http.request<ResType>("post", baseUrlApi("/admin/park/update"), {
    data
  });
};
const create = async (data: ParkCreateRequest): Promise<ResType> => {
  console.log(data);

  return http.request<ResType>("post", baseUrlApi("/admin/park/save"), {
    data
  });
};
const deletePark = async (data: number[]) => {
  console.log(data);

  return http.request<ResType>("post", baseUrlApi("/admin/park/delete"), {
    data
  });
};
export default {
  getList,
  edit,
  create,
  deletePark
};
