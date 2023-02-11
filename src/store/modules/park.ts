import { ParkResult } from "@/api/park";
import { defineStore } from "pinia";
import parkApi from "@/api/park";
export const useParkStore = defineStore("park", {
  state: () => ({
    currentPage: 1,
    total: 0
  }),
  actions: {
    async fetchParkList(page: number): Promise<ParkResult> {
      const data = await parkApi.getList(page);
      this.total = data.pageInfo.total;
      console.log(data);

      return data;
    }
  }
});
