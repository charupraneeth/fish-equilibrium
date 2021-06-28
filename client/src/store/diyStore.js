import { reactive } from "vue";

const globalState = reactive({
  username: "",
  socket: {},
});

export default globalState;
