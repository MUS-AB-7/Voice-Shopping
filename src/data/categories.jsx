export const categoryMap = {
  produce: ["apple", "banana", "orange", "spinach", "carrot", "onion", "tomato", "mango", "strawberry"],
  dairy: ["milk", "cheese", "yogurt", "butter", "egg"],
  bakery: ["bread", "bagel", "croissant"],
  meat: ["chicken", "beef", "pork", "fish"],
  pantry: ["pasta", "rice", "flour", "sugar", "cereal", "toothpaste"],
  beverages: ["water", "juice", "soda", "coffee", "tea", "almond milk", "soy milk"],
};

export const findCategory = (item) => {
  for (const category in categoryMap) {
    if (categoryMap[category].some(keyword => item.includes(keyword))) {
      return category;
    }
  }
  return "miscellaneous";
};