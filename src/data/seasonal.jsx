const seasonalItems = {
  1: ["orange", "cabbage"],  // Jan
  2: ["grapefruit", "leek"],   // Feb
  3: ["spinach", "mushroom"], // Mar
  4: ["asparagus", "rhubarb"], // Apr
  5: ["strawberry", "zucchini"], // May
  6: ["blueberry", "cherry"],  // Jun
  7: ["watermelon", "peach"],// Jul
  8: ["tomato", "corn", "mango"],     // Aug
  9: ["apple", "pumpkin"],     // Sep
  10: ["squash", "pear"],     // Oct
  11: ["cranberry", "broccoli"], // Nov
  12: ["pomegranate", "kale"],// Dec
};

export const getSeasonalSuggestions = () => {
  const currentMonth = new Date().getMonth() + 1;
  return seasonalItems[currentMonth] || [];
};