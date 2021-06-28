<template>
  <div>
    <!-- for every day -->
    <div v-for="day in Object.keys(state.scores)" :key="day">
      <span>{{ day }}.</span>

      <div class="is-flex is-justify-content-space-around">
        <div v-for="id in Object.keys(state.scores[day])" :key="id">
          <div>{{ getUserName(id) }}</div>
          <div>
            {{ state.scores[day][id].chosenFish }}({{
              state.scores[day][id].profit
            }})
          </div>
        </div>
      </div>
    </div>
    <span>Total</span>
    <div
      class="is-flex is-justify-content-space-around"
      v-if="state.scores[state.day - 1]"
    >
      <div v-for="id in Object.keys(state.scores[state.day - 1])" :key="id">
        <div>{{ getUserName(id) }}</div>
        <div
          v-if="
            state.day == 8 &&
            state.scores['8'] &&
            Object.keys(state.scores[8]).length == 4
          "
        >
          {{ state.scores[8][id].totalProfit }}
        </div>
        <div v-else>
          {{ state.scores[state.day - 1][id].totalProfit }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["state"],
  setup(props) {
    function getUserName(id) {
      return props.state.userData.filter((data) => data.userID == id)[0]
        .username;
    }
    return { getUserName };
  },
};
</script>

<style lang="scss" scoped></style>
