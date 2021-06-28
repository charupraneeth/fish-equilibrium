<template>
  <div>
    <h2>Chat(only on 3rd and 6th day)</h2>
    <div
      class="
        message-container
        my-2
        pb-5
        has-background-grey-light has-text-light
      "
    >
      <div v-for="message in messages" :key="message.text">
        <p v-if="message.type == 'regular'">
          <b>{{ message.from }}</b> : {{ message.text }}
        </p>
        <p v-else-if="message.type == 'joined'" class="has-background-primary">
          {{ message.text }}
        </p>
        <p v-else-if="message.type == 'left'" class="has-background-danger">
          {{ message.text }}
        </p>
      </div>
    </div>
    <form @submit.prevent="handleMessage" v-if="!disabled">
      <div>
        <div class="field">
          <!-- <label class="label">Name</label> -->
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="Enter Message"
              v-model="messageInput"
            />
          </div>
        </div>

        <div class="field is-grouped">
          <div class="control">
            <button class="button is-link">send</button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, toRefs } from "@vue/reactivity";
import globalState from "../store/diyStore";

export default {
  props: ["messages", "disabled"],
  setup() {
    const { socket } = toRefs(globalState);

    const messageInput = ref("");
    function handleMessage() {
      if (!messageInput.value || !messageInput.value.trim()) return;
      socket.emit("sendMessage", messageInput.value);
      messageInput.value = "";
    }

    return {
      messageInput,
      handleMessage,
    };
  },
  mounted() {
    console.log("mounted");
  },
};
</script>

<style scoped>
.message-container {
  height: 70vh;
  overflow-x: auto;
}
</style>
