import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

export type PolicyType = {
  id: string;
  title: string;
  time: string;
  contentPlain: string;
  content: string;
};

export const getPolicyInfo = async (param, page, limit) => {
  return await http.request(
    "get",
    baseUrlApi("/admin/policy/list?page=" + page + "&limit=" + limit),
    param
  );
};

export const searchByName = async (data?: string) => {
  return await http.get(
    baseUrlApi("/admin/park/searchByName:name?parkName=" + data)
  );
};

export const update = async (data?: object) => {
  return await http.post(baseUrlApi("/admin/policy/update"), { data });
};

export const create = async (data?: object) => {
  return await http.post(baseUrlApi("/admin/policy/save"), { data });
};

export const deletePolicy = async (data: number[]) => {
  return await http.post(baseUrlApi("/admin/policy/delete"), { data });
};
