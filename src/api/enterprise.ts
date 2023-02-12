import { http } from "@/utils/http";
import axios from "axios";
import { baseUrlApi } from "./utils";

export const getList = async () => {
  return await http.request(
    "get",
    baseUrlApi("admin/enterprise/findEnterpriseAll")
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
