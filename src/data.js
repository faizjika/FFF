export const BUSINESSES = [
  { id:"pos", name:"POS Point", icon:"💳", cost:15000, baseIncome:1800, upgradeCost:9000, upgradeIncome:900, desc:"A neighborhood cash-out and transfer point." },
  { id:"food", name:"Food Spot", icon:"🍛", cost:45000, baseIncome:4800, upgradeCost:26000, upgradeIncome:2200, desc:"Fast Nigerian meals for busy customers." },
  { id:"fashion", name:"Fashion Store", icon:"👕", cost:80000, baseIncome:7600, upgradeCost:45000, upgradeIncome:3400, desc:"Ready-to-wear fashion and accessories." },
  { id:"phone", name:"Phone Shop", icon:"📱", cost:120000, baseIncome:10500, upgradeCost:65000, upgradeIncome:5000, desc:"Phones, accessories and repairs." },
  { id:"logistics", name:"Logistics Hub", icon:"🚚", cost:250000, baseIncome:18500, upgradeCost:120000, upgradeIncome:7800, desc:"Local delivery and dispatch operations." },
  { id:"solar", name:"Solar Company", icon:"☀️", cost:550000, baseIncome:36000, upgradeCost:260000, upgradeIncome:14500, desc:"Solar installations and maintenance." },
  { id:"supermarket", name:"Supermarket", icon:"🛒", cost:1200000, baseIncome:72000, upgradeCost:600000, upgradeIncome:28000, desc:"A full neighborhood retail operation." },
  { id:"hotel", name:"Boutique Hotel", icon:"🏨", cost:5000000, baseIncome:260000, upgradeCost:2500000, upgradeIncome:90000, desc:"Hospitality business for premium customers." }
];

export const BANKS = [
  { id:"wallet", name:"Cash Wallet", icon:"💵", fee:0 },
  { id:"main", name:"Hustle Current", icon:"🏦", fee:0.002 },
  { id:"savings", name:"Hustle Savings", icon:"🐖", fee:0 },
  { id:"business", name:"Business Account", icon:"💼", fee:0.001 }
];

export const PROPERTIES = [
  { id:"room", name:"Single Room", icon:"🛏️", price:350000, rent:12000, valueGrowth:0.012, area:"Agege" },
  { id:"flat", name:"2-Bed Flat", icon:"🏢", price:1400000, rent:42000, valueGrowth:0.015, area:"Yaba" },
  { id:"terrace", name:"Terrace House", icon:"🏠", price:6500000, rent:145000, valueGrowth:0.018, area:"Lekki" },
  { id:"duplex", name:"Family Duplex", icon:"🏡", price:18000000, rent:360000, valueGrowth:0.02, area:"Gwarinpa" },
  { id:"mansion", name:"Luxury Mansion", icon:"🏰", price:65000000, rent:1200000, valueGrowth:0.024, area:"Ikoyi" },
  { id:"commercial", name:"Commercial Plaza", icon:"🏬", price:120000000, rent:2400000, valueGrowth:0.026, area:"Ikeja" }
];

export const VEHICLES = [
  { id:"bike", name:"Dispatch Bike", icon:"🏍️", price:280000, income:6500, upkeep:1200, area:"Lagos" },
  { id:"keke", name:"Keke", icon:"🛺", price:900000, income:10500, upkeep:2200, area:"Abuja" },
  { id:"danfo", name:"Danfo Bus", icon:"🚌", price:4500000, income:30000, upkeep:7500, area:"Lagos" },
  { id:"sedan", name:"Executive Sedan", icon:"🚘", price:7500000, income:9000, upkeep:4500, area:"Lagos" },
  { id:"suv", name:"Premium SUV", icon:"🚙", price:22000000, income:0, upkeep:9500, area:"Abuja" },
  { id:"pickup", name:"Business Pickup", icon:"🛻", price:14500000, income:17000, upkeep:7000, area:"Port Harcourt" },
  { id:"sports", name:"Sports Coupe", icon:"🏎️", price:55000000, income:0, upkeep:18000, area:"Lagos" }
];

export const EVENTS = [
  { id:"traffic", title:"Traffic Nightmare", text:"A major route is blocked. Delivery income drops today.", effect:{incomeMult:0.72}, positive:false },
  { id:"viral", title:"You Go Viral", text:"A customer posts your business and demand surges.", effect:{incomeMult:1.45}, positive:true },
  { id:"fuel", title:"Fuel Price Shock", text:"Operating costs rise across your vehicle fleet.", effect:{vehicleCostMult:1.25}, positive:false },
  { id:"contract", title:"Big Contract", text:"A local company wants to work with you.", effect:{cash:95000}, positive:true },
  { id:"repair", title:"Unexpected Repairs", text:"A business machine needs urgent repairs.", effect:{cash:-35000}, positive:false },
  { id:"festival", title:"Festival Rush", text:"Customer traffic rises across retail businesses.", effect:{incomeMult:1.25}, positive:true },
  { id:"rent", title:"Property Demand", text:"Your rental properties receive extra demand.", effect:{propertyMult:1.35}, positive:true },
  { id:"slow", title:"Slow Market", text:"Customers are spending less this week.", effect:{incomeMult:0.82}, positive:false }
];

export const MISSIONS = [
  { id:"firstbiz", title:"First Hustle", text:"Buy your first business.", goal:1, stat:"businesses", reward:5000, xp:25 },
  { id:"threebiz", title:"Small Empire", text:"Own 3 businesses.", goal:3, stat:"businesses", reward:35000, xp:75 },
  { id:"million", title:"First Million", text:"Reach ₦1,000,000 net worth.", goal:1000000, stat:"netWorth", reward:100000, xp:150 },
  { id:"property", title:"Property Boss", text:"Own 2 properties.", goal:2, stat:"properties", reward:75000, xp:120 },
  { id:"fleet", title:"Build A Fleet", text:"Own 3 vehicles.", goal:3, stat:"vehicles", reward:100000, xp:120 },
  { id:"level5", title:"Serious Player", text:"Reach level 5.", goal:5, stat:"level", reward:250000, xp:250 },
  { id:"tenm", title:"₦10M Club", text:"Reach ₦10,000,000 net worth.", goal:10000000, stat:"netWorth", reward:750000, xp:400 }
];

export const STARTER = {
  cash: 250000,
  day: 1,
  xp: 0,
  level: 1,
  reputation: 10,
  businesses: {},
  properties: {},
  vehicles: {},
  banks: { wallet:250000, main:0, savings:0, business:0 },
  transactions: [{ id:1, day:1, type:"deposit", text:"Starting capital", amount:250000 }],
  activeEvent: null,
  eventUntilDay: 1,
  completedMissions: [],
  lastSaved: Date.now()
};

export function formatNaira(value) {
  const n = Math.round(value || 0);
  return "₦" + n.toLocaleString("en-NG");
}

export function totalAssets(state) {
  const businesses = BUSINESSES.reduce((sum,b)=>sum + (state.businesses[b.id]?.level ? b.cost + (state.businesses[b.id].level-1)*b.upgradeCost : 0),0);
  const properties = PROPERTIES.reduce((sum,p)=>sum + (state.properties[p.id]?.count ? p.price*state.properties[p.id].count*(1+p.valueGrowth*(state.day/30)) : 0),0);
  const vehicles = VEHICLES.reduce((sum,v)=>sum + (state.vehicles[v.id]?.count ? v.price*state.vehicles[v.id].count : 0),0);
  return businesses + properties + vehicles;
}

export function netWorth(state) {
  return Object.values(state.banks).reduce((a,b)=>a+b,0) + totalAssets(state);
}

export function levelForXp(xp) {
  return Math.max(1, Math.floor(Math.sqrt(xp/100))+1);
}

export function statValue(state, stat) {
  if (stat==="businesses") return Object.values(state.businesses).reduce((a,b)=>a+(b.level>0?1:0),0);
  if (stat==="properties") return Object.values(state.properties).reduce((a,b)=>a+b.count,0);
  if (stat==="vehicles") return Object.values(state.vehicles).reduce((a,b)=>a+b.count,0);
  if (stat==="netWorth") return netWorth(state);
  if (stat==="level") return state.level;
  return 0;
}