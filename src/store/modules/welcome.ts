import { defineStore } from "pinia";
import { store } from "@/store";

export const useWelcomeStore = defineStore("welcomeURL", {
  state: () => ({
    welcomeURL: "http://106.15.198.228:9008/"
  }),
  actions: {},
  persist: {
    key: "welcomURL",
    storage: localStorage,
    paths: ["welcomeURL"]
  }
});

export function useWelcomeStoreHook() {
  return useWelcomeStore(store);
}
