<script lang="ts" setup>
import { ref, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useRoomsStore } from "../store/roomStore";
import type { Data, Messages } from "../types/type";
import Api from "../http";
import moment from "moment";
import type { AxiosResponse } from "axios";

const route = useRoute();
const roomStore = useRoomsStore();
const inputRef = ref<HTMLInputElement | null>(null);
const dataRoomActived = ref<Data["customer_rooms"][0] | null>(null);
const dataChat = ref<Messages[]>([]);
const text = ref<string>("");

const getDataChatByRoomId = async (room_id: number) => {
  try {
    const res = await Api({
      url: "/messages",
      method: "GET",
    });

    const data = res.data.filter((e: Messages) => e.room_id == room_id);
    dataChat.value = data;
  } catch (err) {}
};

const updateRoomData = () => {
  const id = Number(route.params.id);
  const filterRoom = roomStore.customer_rooms.find((e) => e.id == id);
  dataRoomActived.value = filterRoom || null;
  getDataChatByRoomId(id);
};

watch(
  () => [route.path, roomStore.customer_rooms],
  async () => {
    updateRoomData();

    await nextTick();
    inputRef.value?.focus();
  },
  {
    immediate: true,
  }
);

const sendMessage = () => {
  Api({
    url: "/messages",
    method: "POST",
    data: {
      room_id: Number(route.params.id),
      text: text.value,
      from: "me",
      to: dataRoomActived.value?.name,
      date: new Date(),
    },
  })
    .then(() => {
      getDataChatByRoomId(Number(route.params.id));
      Api({
        url: `/data`,
        method: "put",
        data: {
          customer_rooms: roomStore.customer_rooms
            .map((x: Data["customer_rooms"][0]) => {
              return {
                ...x,
                last_comment_timestamp:
                  x.id == dataRoomActived.value?.id
                    ? new Date()
                    : x.last_comment_timestamp,
              };
            })
            .sort((a, b) => {
              return (
                moment(b.last_comment_timestamp).valueOf() -
                moment(a.last_comment_timestamp).valueOf()
              );
            }),
        },
      }).then((res: AxiosResponse<Data>) => {
        roomStore.setStoreRooms(res.data);
      });
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      text.value = "";
    });
};
</script>

<template>
  <div
    v-if="route.params.id && dataRoomActived"
    class="h-full bg-white w-full flex flex-col"
  >
    <div
      class="bg-blue-500 text-white shadow-md font-bold p-5 sticky top-0 flex gap-2"
    >
      <img
        class="w-11 h-11 border-[1px] rounded-full object-cover object-center shadow-md bg-white"
        :src="dataRoomActived?.user_avatar_url!"
      />
      <div>
        <p class="font-bold text-white">{{ dataRoomActived?.name }}</p>
        <p class="text-xs text-gray-200">{{ dataRoomActived?.room_type }}</p>
      </div>
    </div>
    <div class="flex-1 overflow-auto text-white p-3 flex flex-col gap-2">
      <div
        v-for="(item, index) in dataChat"
        :key="index"
        :class="`flex ${item.from == 'me' ? 'justify-end' : 'justify-start'}`"
      >
        <div
          :class="`border-[1px] shadow-md text-justify flex items-end gap-2 ${
            item.from == 'me'
              ? 'border-blue-500 px-3 py-2 w-fit rounded-l-[30px] rounded-br-[30px] text-blue-500'
              : 'border-red-500 px-3 py-2 w-fit rounded-r-[30px] rounded-bl-[30px] text-red-500'
          } `"
        >
          <p
            :class="`max-w-2xl text-wrap  ${
              item.from == 'me' ? 'text-end ' : 'text-start'
            } `"
          >
            {{ item.text }}
          </p>
          <p class="text-[10px] opacity-70">
            {{ moment(item.date).format("HH:mm a") }}
          </p>
        </div>
      </div>
    </div>
    <form
      @submit.prevent="sendMessage"
      class="flex w-full justify-center pb-5 px-5 items-center gap-2"
    >
      <input
        ref="inputRef"
        name="message"
        required
        placeholder="Message"
        class="border-[1px] border-blue-500 rounded-[30px] flex-1 h-10 text-blue-500 shadow-md pl-5 outline-0 placeholder:text-blue-500"
        v-model="text"
      />

      <button
        type="submit"
        class="border-2 h-11 text-white bg-blue-600 w-fit px-5 shadow-md rounded-md flex justify-center items-center cursor-pointer"
      >
        Send
      </button>
    </form>
  </div>
  <div
    v-else
    class="bg-white h-full flex justify-center items-center flex-col gap-2"
  >
    <p class="text-lg">Hi There start your conversation today 👋</p>
  </div>
</template>
