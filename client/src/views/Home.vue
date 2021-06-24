<template>
  <div class="home">
    <h1 class="is-size-3 has-text-centered">Fish equilibrium</h1>
    <div v-if="!username">
      <form @submit.prevent="handleUserName">
        <div>
          <div class="field">
            <label class="label">Name</label>
            <div class="control">
              <input
                class="input"
                type="text"
                placeholder="Enter name"
                v-model="usernameInput"
              />
            </div>
          </div>

          <div class="field is-grouped">
            <div class="control">
              <button class="button is-link">submit</button>
            </div>
          </div>
        </div>
      </form>
    </div>
    <div v-else>
      <div v-if="joined">
        <game :socket="socket" :roomCode="roomCode" />
      </div>
      <div v-else>
        <h3>Join existing room</h3>
        <form @submit.prevent="handleJoinRoom">
          <div>
            <div class="field">
              <!-- <label class="label">Room code</label> -->
              <div class="control">
                <input
                  class="input"
                  type="text"
                  placeholder="Enter room code"
                  v-model="roomCodeInput"
                />
              </div>
            </div>

            <div class="field is-grouped">
              <div class="control">
                <button class="button is-link">Join</button>
              </div>
            </div>
          </div>
        </form>
        <div>
          <h3>Create room</h3>
          <button class="button is-link" @click="createRoom">
            create room
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import username from "../store/diyStore";
import { io } from "socket.io-client";
import Game from "../components/Game.vue";
import { ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
export default {
  components: {
    Game,
  },
  setup() {
    const usernameInput = ref("");
    const joined = ref(false);
    const socket = ref({});
    const roomCode = ref("");
    const roomCodeInput = ref("");

    function handleUserName() {
      if (!usernameInput.value || !usernameInput.value.trim()) return;
      username.value = usernameInput.value;
    }

    function createRoom() {
      console.log("uservalue", username.value);
      socket.value.emit("createRoom", username.value);
    }

    function handleJoinRoom() {
      if (!roomCodeInput.value || !roomCodeInput.value.trim()) return;
      console.log(roomCodeInput.value);
      roomCode.value = roomCodeInput.value;
      const data = {
        username: username.value,
        roomCode: roomCodeInput.value,
      };
      socket.value.emit("joinRoom", data);
    }

    onMounted(() => {
      socket.value = io("http://localhost:1337");

      socket.value.on("roomJoined", (code) => {
        console.log("room code got is : ", code);
        joined.value = true;
        roomCode.value = code;
      });
    });
    return {
      username,
      usernameInput,
      roomCode,
      roomCodeInput,
      createRoom,
      joined,
      handleUserName,
      socket,
      handleJoinRoom,
    };
  },
};
</script>
