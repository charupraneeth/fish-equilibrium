import { reactive } from "vue";

const globalState = reactive({
  username: "",
  socket: {},
  showOptions: false,
});

export default globalState;
