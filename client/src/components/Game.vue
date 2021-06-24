<template>
  <div class="columns">
    <div class="column">
      <div class="is-flex">
        <h3 class="mx-2"><b>name</b> : {{ username }}</h3>
        <h3 class="mx-2"><b>room-code</b> : {{ roomCode }}</h3>
        <h3 class="mx-2"><b>day</b>: {{ state.day }}</h3>
        <h3 class="mx-1"><b>players</b> :{{ state.users.join(" ,") }}</h3>
      </div>
    </div>
    <chat class="column is-one-fifth" :messages="messages" :socket="socket" />
  </div>
</template>

<script>
import username from "../store/diyStore";
import { onMounted, ref, reactive } from "@vue/runtime-core";
import Chat from "./Chat.vue";
// import { ref } from "vue";
export default {
  components: {
    Chat,
  },
  props: ["socket", "roomCode"],
  setup(props) {
    const messages = ref([]);
    const state = reactive({
      day: 1,
      users: [],
      scores: [],
    });
    onMounted(() => {
      // on new message
      props.socket.on("message", (message) => {
        messages.value.push(message);
        const con = document.querySelector(".message-container");
        con.scrollTop = con.scrollHeight - con.clientHeight;
      });

      // on game state update
      props.socket.on("gameStateUpdate", (gameState) => {
        console.log(gameState);
        state.day = gameState.day;
        state.users = gameState.userNames;
      });
    });
    return {
      messages,
      username,
      state,
    };
  },
};
</script>

<style lang="scss" scoped></style>
