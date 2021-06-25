<template>
  <div>
    <button @click="handleFishChoose(1)" class="button is-info m-3">one</button
    ><button @click="handleFishChoose(2)" class="button is-info m-3">
      two
    </button>
  </div>
</template>

<script>
import showOptions from "../store/showOptions";
export default {
  props: ["socket"],
  setup(props) {
    function handleFishChoose(fishChoose) {
      props.socket.emit("chooseFish", fishChoose);
      showOptions.value = false;
    }
    return {
      handleFishChoose,
    };
  },
};
</script>

<style lang="scss" scoped></style>
