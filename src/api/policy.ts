import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

export const getPolicyInfo = async param => {
  return await http.request(
    "get",
    baseUrlApi("/admin/policy/getPolicyInfo"),
    param
  );
};

export const searchByName = async (data?: string) => {
  return await http.get(
    baseUrlApi("admin/park/searchByName:name?parkName=" + data)
  );
};

export const update = async (data?: object) => {
  return await http.post(baseUrlApi("admin/policy/update"), { data });
};
