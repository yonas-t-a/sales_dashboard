// Demo data for the dashboard. Replace these values with your API response.
export const countrySales = [
  { country: "United States of America", label: "United States", sales: 12500, color: "#ffad00" },
  { country: "Brazil", label: "Brazil", sales: 8200, color: "#ff4963" },
  { country: "China", label: "China", sales: 16400, color: "#8c4cff" },
  { country: "Saudi Arabia", label: "Saudi Arabia", sales: 5100, color: "#00ae9f" },
  { country: "Democratic Republic of the Congo", label: "DR Congo", sales: 2800, color: "#6c91ff" },
  { country: "Indonesia", label: "Indonesia", sales: 6300, color: "#00bc9b" },
] as const;

export const salesSummary = [
  { label: "Total Sales", value: "$1k", change: "+8% from yesterday", color: "pink", icon: "sales" },
  { label: "Total Order", value: "300", change: "+5% from yesterday", color: "peach", icon: "orders" },
  { label: "Product Sold", value: "5", change: "+1.2% from yesterday", color: "green", icon: "products" },
  { label: "New Customers", value: "8", change: "0.5% from yesterday", color: "purple", icon: "customers" },
] as const;

export const visitors = {
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
  loyal: [315, 320, 260, 210, 185, 220, 280, 315, 290, 245, 185, 140],
  new: [250, 255, 200, 150, 150, 250, 335, 355, 325, 280, 210, 145],
  unique: [280, 355, 360, 310, 250, 210, 220, 265, 300, 300, 240, 205],
};

export const revenue = [
  { day: "Monday", online: 14000, offline: 12500 },
  { day: "Tuesday", online: 17500, offline: 11500 },
  { day: "Wednesday", online: 5500, offline: 23000 },
  { day: "Thursday", online: 16000, offline: 6500 },
  { day: "Friday", online: 12000, offline: 11000 },
  { day: "Saturday", online: 17000, offline: 13500 },
  { day: "Sunday", online: 21500, offline: 11000 },
];

export const satisfaction = {
  lastMonth: [40, 54, 22, 22, 32, 32, 51],
  thisMonth: [85, 70, 78, 61, 81, 51, 95],
};

export const targets = [
  { month: "Jan", reality: 59, target: 77 },
  { month: "Feb", reality: 51, target: 70 },
  { month: "Mar", reality: 44, target: 87 },
  { month: "Apr", reality: 59, target: 70 },
  { month: "May", reality: 71, target: 100 },
  { month: "June", reality: 71, target: 100 },
  { month: "July", reality: 71, target: 100 },
];

export const products = [
  { name: "Home Decor Range", popularity: 78, sales: 45, color: "blue" },
  { name: "Disney Princess Pink Bag 18′", popularity: 61, sales: 29, color: "green" },
  { name: "Bathroom Essentials", popularity: 55, sales: 18, color: "purple" },
  { name: "Apple Smartwatches", popularity: 33, sales: 25, color: "orange" },
] as const;

export const volume = [
  { volume: 100, services: 56 },
  { volume: 121, services: 42 },
  { volume: 100, services: 26 },
  { volume: 90, services: 29 },
  { volume: 70, services: 26 },
  { volume: 76, services: 45 },
];
