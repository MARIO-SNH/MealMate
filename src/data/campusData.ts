export const MESS_LOCATIONS = ["IT Mess", "Main Mess", "Girls Mess"];

export const HANGOUT_LOCATIONS = ["Café Adda", "Coffee Talk", "SOM Canteen"];

export const CAMPUS_LOCATIONS = [...MESS_LOCATIONS, ...HANGOUT_LOCATIONS];

export const MEAL_TYPES = ["Breakfast", "Lunch", "Snacks", "Dinner", "Coffee", "Quick Bite"];

export const VISIBILITY_OPTIONS = ["Friends", "Campus Public"];

export const VIBE_OPTIONS = ["Social", "Quiet", "Study", "Quick Bite", "Open to New People"];

export const HANGOUT_ITEMS = [
  "Coffee",
  "Tea",
  "Cold Coffee",
  "Sandwich",
  "Maggi",
  "Snack",
  "Quick Bite",
];

export const WEEKLY_MENU: any = {
  Monday: {
    breakfast: ["Veliayappam", "Tomato Bath", "Blueberry Muffins", "Tea", "Coffee", "Boost", "Milk", "Chocos", "Tomato Chutney", "Peanut Chutney With Red Chilli", "Sambar"],
    lunch: ["Veg Salad", "Roti", "Paneer Veg Mix", "Egg Chittinadu", "Soya Carrot Curry", "Jeera Rice", "Steamed Rice", "Pappu Charu", "Pepper Rasam", "Tomato Pachadhi", "Badusha", "Curd"],
    snacks: ["Samosa", "Boiled Peanuts", "Tea", "Boost", "Coffee"],
    dinner: ["Roti", "Aloo Corn", "Bell Pepper Rice", "Steamed Rice", "Rasam", "Dal Fry", "Curd", "Pickle", "Cut Fruits"],
  },
  Tuesday: {
    breakfast: ["Mysore Bonda", "Ghee Pongal", "Chocolate Cake", "Tea", "Coffee", "Boost", "Milk", "Corn Flakes", "Boiled Eggs", "Coconut Chutney", "Ginger Chutney", "Curd"],
    lunch: ["Salad", "Roti", "Aloo Chole Curry", "Cabbage Carrot Poriyal", "Mint Onion Pulao", "Steamed Rice", "Rasam", "Spinach Dal", "Vankaya Tomato Pachadi", "Gulab Jamun"],
    snacks: ["Wada Pav", "Black Chena", "Tea", "Coffee", "Boost"],
    dinner: ["Roti", "Veg Pulao", "Mirchi Ka Salan", "Lobiya Masala", "Steamed Rice", "Gongura Dal", "Rasam", "Pachadi", "Curd", "Cut Fruits"],
  },
  Wednesday: {
    breakfast: ["Plain/Ragi Idly", "Semiya Bath", "Fine Biscuit", "Tea", "Coffee", "Boost", "Milk", "Corn Flakes", "Ginger Chutney", "Sambar", "Peanut Chutney"],
    lunch: ["Salad", "Chapathi", "Pepper Chicken", "Tawa Paneer", "Bagara Rice", "Steamed Rice", "Sambar", "Pacchi Pulusu", "Gongura Pachadi", "Sheer Kurma", "Curd"],
    snacks: ["Veg Maggi", "Boiled Corn", "Tea", "Boost", "Coffee"],
    dinner: ["Roti", "Sambar Rice", "Yellow Dal Fry", "Rasam", "Steamed Rice", "Cut Fruits", "Curd Rice", "Pickle", "Fryums", "Rajma Masala"],
  },
  Thursday: {
    breakfast: ["Plain/Onion Pesarattu", "Kaju Upma", "Brownie", "Tea", "Coffee", "Boost", "Milk", "Chocos", "Boiled Eggs", "Peanut Chutney", "Tomato Chutney", "Mango Pickle"],
    lunch: ["Cucumber & Beetroot Salad", "Roti", "Coriander Brinjal", "Carrot Thurumu Fry", "Tamarind Pulihora", "Steamed Rice", "Tomato Rasam", "Mudha Pappu", "Curd", "Fryums", "Anamaya Laddu"],
    snacks: ["Coleslaw Sandwich", "Chudva", "Tea", "Coffee", "Boost"],
    dinner: ["Roti", "Mushroom Masala", "Jeera Rice", "Steamed Rice", "Spinach Dal", "Curd Rice", "Pickle", "Cut Fruits", "Rasam"],
  },
  Friday: {
    breakfast: ["Tawa Idly", "Kichdi", "Honey Cake", "Tea", "Coffee", "Boost", "Milk", "Peanut Chutney With Red Chilli", "Corn Flakes", "Sambar", "Tomato Pickle"],
    lunch: ["Veg Salad", "Pulka", "Egg Pulao", "Soya Kheema Pulao", "3 In 1 Salan", "Steamed Rice", "Sambar", "Mint Rasam", "Curd", "Rabdi"],
    snacks: ["Dahi Wada", "Black Channa", "Tea", "Coffee"],
    dinner: ["Roti", "Kadai Veg", "Gobi 65 Rice", "Steamed Rice", "Tomato Dal", "Curd", "Cut Fruits", "Pickle"],
  },
  Saturday: {
    breakfast: ["Karam/Onion Dosa", "Veg Upma", "Tea", "Coffee", "Boost", "Milk", "Chocos", "Ginger Chutney", "Peanut Chutney"],
    lunch: ["Carrot & Beetroot Salad", "Roti", "Malai Gobi", "Bendi Tomato", "Matar Pulao", "Steamed Rice", "Mango Dal", "Sambar", "Dosakaya Pachadi", "Jalebi", "Curd"],
    snacks: ["Bun Maska", "Bhelpuri", "Zaffrani Tea", "Coffee", "Boost"],
    dinner: ["Ghee Roti", "Tomato Drumstick", "Corn Pulao", "Steamed Rice", "Rasam", "Chutney", "Dal Tadka", "Cut Fruits", "Curd Rice", "Pickle"],
  },
  Sunday: {
    breakfast: ["Veg Upma", "Uggani", "Tea", "Coffee", "Boost", "Milk", "Chocos", "Peanut Chutney", "Curd", "Pickle"],
    lunch: ["Onion and Lemon Salad", "Chicken Biriyani", "Paneer Biriyani", "3 In 1 Salan", "Steamed Rice", "Pappu Charu", "Rasam", "Raita", "Ice Cream"],
    snacks: ["Pani Puri", "Dahi Puri", "Tea", "Coffee", "Boost"],
    dinner: ["Mudha Pappu Avakaya Rice", "Roti", "Lobiya Masala", "Sambar", "Steamed Rice", "Thotakura Dal", "Curd", "Pickle", "Cut Fruits"],
  },
};

export function getTodayName() {
  return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][
    new Date().getDay()
  ];
}

export function getTodayMenu() {
  return WEEKLY_MENU[getTodayName()];
}

export function getTodayMenuItems() {
  const menu = getTodayMenu();
  return [
    ...menu.breakfast,
    ...menu.lunch,
    ...menu.snacks,
    ...menu.dinner,
  ];
}

export function getAllMenuItems() {
  const allItems: string[] = [];

  Object.values(WEEKLY_MENU).forEach((day: any) => {
    allItems.push(...day.breakfast, ...day.lunch, ...day.snacks, ...day.dinner);
  });

  return [...new Set(allItems)];
}