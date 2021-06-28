<template>
  <div>
    <h3>Choose number of fishes to fish for the day</h3>
  </div>
  <div>
    <button @click="handleFishChoose(1)" class="button is-info m-3">one</button
    ><button @click="handleFishChoose(2)" class="button is-info m-3">
      two
    </button>
  </div>
</template>

<script>
import showOptions from "../store/showOptions";
import globalState from "../store/diyStore";
import { toRefs } from "@vue/reactivity";
export default {
  setup() {
    const { socket } = toRefs(globalState);

    function handleFishChoose(fishChoose) {
      socket.value.emit("chooseFish", fishChoose);
      showOptions.value = false;
    }
    return {
      handleFishChoose,
    };
  },
};
</script>

<style lang="scss" scoped></style>
