import { defineStore } from "pinia";
import { store } from "@/store";

export const useWelcomeStore = defineStore("welcomeURL", {
  state: () => ({
    welcomeURL: import.meta.env.VITE_HOME_URL
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
