<template>
  <div class="columns">
    <div class="column">
      <div class="is-flex">
        <h3 class="mx-2"><b>name</b> : {{ username }}</h3>
        <h3 class="mx-2"><b>room-code</b> : {{ roomCode }}</h3>
        <h3 class="mx-2"><b>day</b>: {{ state.day }}</h3>
        <h3 class="mx-1"><b>players</b> :{{ getUserNames.join(" ,") }}</h3>
      </div>
      <div v-if="isGameStarted">
        <game-stats :state="state" />
        <option-selection
          :socket="socket"
          v-if="showOptions && isGameStarted"
        />
        <div v-if="!showOptions && !isGameEnded">waiting for others ...</div>
      </div>
    </div>
    <chat
      :disabled="state.isChatDisabled"
      class="column is-one-fifth"
      :messages="messages"
      :socket="socket"
    />
  </div>
</template>

<script>
import username from "../store/diyStore";
import { onMounted, ref, reactive, computed, watch } from "@vue/runtime-core";
import Chat from "./Chat.vue";
import GameStats from "./GameStats";
import OptionSelection from "./OptionSelection";
import showOptions from "../store/showOptions";
// import { ref } from "vue";
export default {
  components: {
    Chat,
    GameStats,
    OptionSelection,
  },
  props: ["socket", "roomCode"],
  setup(props) {
    const isGameEnded = ref(false);
    const isGameStarted = ref(false);
    const prevDay = ref(0);
    const messages = ref([]);
    const state = reactive({
      day: 1,
      userData: [],
      scores: {},
      isChatDisabled: true,
    });

    const getUserNames = computed(() => {
      return state.userData.length
        ? state.userData.map((data) => data.username)
        : [];
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
        window.scrollTo(0, document.body.scrollHeight);

        console.log(gameState);
        state.day = gameState.day;
        state.userData = gameState.userData;
        state.scores = gameState.scores;
        state.isChatDisabled = gameState.isChatDisabled;
        if (state.userData?.length == 4) isGameStarted.value = true;
        else isGameStarted.value = false;
      });

      props.socket.on("gameOver", (winner) => {
        isGameEnded.value = true;
        console.log(winner);
        alert(`${winner.username} won the game`);
      });
      watch(
        state,
        () => {
          if (state.userData.length == 4 && prevDay.value != state.day) {
            showOptions.value = true;
            prevDay.value += 1;
          }
        },
        { immediate: true }
      );
    });
    return {
      isGameStarted,
      messages,
      username,
      state,
      getUserNames,
      showOptions,
      isGameEnded,
    };
  },
};
</script>

<style lang="scss" scoped></style>
