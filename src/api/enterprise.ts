import { http } from "@/utils/http";
import axios from "axios";
import { baseUrlApi } from "./utils";

// export const getList = async () => {
//   return await http.request(
//     "get",
//     baseUrlApi("/admin/enterprise/findEnterpriseAll"),
//   );
// };
export type EnterpriseType = {
  enterpriseId: string;
  enterpriseName: string;
  industry: string;
  registeredCapital: string;
  outputValue: string;
  enterpriseType: string;
  score: string;
  url: string;
  parkId: string;
  createTime: string;
  updateTime: string;
  description: string;
};

export const getList = async (page, limit) => {
  return await http.request(
    "get",
    baseUrlApi("/admin/enterprise/list?page=" + page + "&limit=" + limit)
  );
};

export const getInfoByEnterpriseId = async param => {
  return await axios({
    method: "get",
    url: "http://42.192.172.214:8484/api/admin/enterprise/getInfoByEnterpriseId",
    params: param
  });
};

export const findEnterprise = async param => {
  return await axios({
    method: "post",
    url: "http://42.192.172.214:8484/api/admin/enterprise/findEnterprise",
    params: param
  });
};

export const getOccupancySize = async () => {
  return await http.request(
    "get",
    baseUrlApi("/admin/enterprise/getOccupancySize")
  );
};

export const update = async (data: object) => {
  return await http.post(baseUrlApi("/admin/enterprise/update"), { data });
};

export const deleteEnterprise = async (data: number[]) => {
  return await http.post(baseUrlApi("/admin/enterprise/delete"), { data });
};

export const createEnterprise = async (data: object) => {
  return await http.post(baseUrlApi("/admin/enterprise/save"), { data });
};
