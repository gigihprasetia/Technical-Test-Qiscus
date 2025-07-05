<script lang="ts" setup>
import { onMounted } from "vue";
import Api from "../http";
import type { Data } from "../types/type";
import type { AxiosResponse } from "axios";
import { useRoute, useRouter } from "vue-router";
import { useRoomsStore } from "../store/roomStore";
import moment from "moment";

const roomStore = useRoomsStore();
const router = useRouter();
const route = useRoute();

onMounted(() => {
  Api({
    url: "data",
    method: "GET",
  }).then((res: AxiosResponse<Data>) => {
    roomStore.setStoreRooms(res.data);
  });
});

const setQueryParamsByRoomId = (data: number) => {
  router.push({ name: "chat", params: { id: data } });
};
</script>
<template>
  <div class="flex h-screen">
    <!-- Room -->
    <div class="w-3/12 flex flex-col overflow-auto">
      <div
        class="bg-blue-500 text-white shadow-md font-bold p-7.5 sticky top-0"
      >
        <p>CONTACT LIST</p>
      </div>
      <div
        v-for="(room, index) in roomStore?.customer_rooms"
        :key="index"
        @click="setQueryParamsByRoomId(room.id)"
        :class="`p-3 border-gray-400 border-b-[1px] rounded-br-md shadow-md  border-collapse flex justify-between gap-2  ${
          Number(route.params.id) == room.id
            ? 'bg-blue-200 hover:bg-blue-200'
            : 'bg-white hover:bg-gray-100'
        } `"
      >
        <div class="flex gap-2">
          <img
            class="w-11 h-11 border-[0.5px] rounded-full object-cover object-center bg-white shadow-md"
            :src="room.user_avatar_url!"
          />
          <div>
            <p class="font-bold text-gray-800">{{ room.name }}</p>
            <p class="text-xs text-gray-500">{{ room.room_type }}</p>
          </div>
        </div>
        <div>
          <p class="text-[10px] text-gray-400">
            {{ moment(room.last_comment_timestamp).format("HH:mm A") }}
          </p>
        </div>
      </div>
    </div>
    <!-- Chat -->
    <div class="w-9/12 bg-blue-500">
      <slot />
    </div>
  </div>
</template>
