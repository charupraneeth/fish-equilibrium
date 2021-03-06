const profitMap = {
  "2,2,2,2": [null, -25],
  "2,2,2,1": [-25, 25],
  "2,2,1,1": [-12.5, 50],
  "2,1,1,1": [0, 75],
  "1,1,1,1": [25, null],
};

function getStateWithCalculatedProfit(gameState) {
  const chosenFishKey = Object.keys(gameState.scores[gameState.day])
    .map((id) => +gameState.scores[gameState.day][id].chosenFish)
    .sort((a, b) => b - a)
    .toString();
  for (let id in gameState.scores[gameState.day]) {
    const numberOfFishChosen = parseInt(
      gameState.scores[gameState.day][id].chosenFish
    );

    const profit =
      gameState.day == 7 || gameState.day == 8
        ? profitMap[chosenFishKey][numberOfFishChosen - 1] * 2
        : profitMap[chosenFishKey][numberOfFishChosen - 1];
    gameState.scores[gameState.day][id].profit = profit;

    // add the profits of previous day
    if (gameState.day - 1) {
      gameState.scores[gameState.day][id].totalProfit =
        gameState.scores[gameState.day - 1][id].totalProfit;
    }
    gameState.scores[gameState.day][id].totalProfit += profit;
  }
  return gameState;
}

function findWinner(gameState) {
  // day 8
  let largestNumber = 0;
  let winner;
  Object.keys(gameState.scores[gameState.day]).forEach((id) => {
    if (gameState.scores[gameState.day][id].totalProfit > largestNumber) {
      largestNumber = gameState.scores[gameState.day][id].totalProfit;
      winner = id;
    }
  });

  return winner;
}

module.exports = {
  getStateWithCalculatedProfit,
  findWinner,
};
