import { defineStore } from "pinia";
import type { Data } from "../types/type";

export const useRoomsStore = defineStore("rooms", {
  state: (): Data => ({ customer_rooms: [] }),
  getters: {
    getStoreRooms: (state) => state.customer_rooms,
  },
  actions: {
    setStoreRooms(payload: Data) {
      this.$state.customer_rooms = payload.customer_rooms;
    },
  },
});
