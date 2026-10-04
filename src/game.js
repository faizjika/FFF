import { BANKS, BUSINESSES, EVENTS, MISSIONS, PROPERTIES, STARTER, VEHICLES, levelForXp, netWorth, statValue } from "./data";

export const clone = (x) => JSON.parse(JSON.stringify(x));

export function loadGame() {
  try {
    const raw = localStorage.getItem("naija-hustle-save-v1");
    if (!raw) return clone(STARTER);
    const parsed = JSON.parse(raw);
    return { ...clone(STARTER), ...parsed, banks:{...clone(STARTER).banks,...parsed.banks} };
  } catch { return clone(STARTER); }
}

export function saveGame(state) {
  const next = {...state, lastSaved:Date.now()};
  localStorage.setItem("naija-hustle-save-v1", JSON.stringify(next));
  return next;
}

function tx(state, text, amount, type="income") {
  state.transactions.unshift({id:Date.now()+Math.random(), day:state.day, type, text, amount});
  state.transactions = state.transactions.slice(0,100);
}

function spendFromWallet(state, amount, text) {
  if (state.banks.wallet < amount) return false;
  state.banks.wallet -= amount;
  tx(state,text,-amount,"expense");
  return true;
}

function addWallet(state, amount, text) {
  state.banks.wallet += amount;
  tx(state,text,amount,"income");
}

export function buyBusiness(state,id) {
  const b=BUSINESSES.find(x=>x.id===id);
  if (!b || state.businesses[id]?.level) return {state,error:"You already own this business."};
  if (!spendFromWallet(state,b.cost,`Bought ${b.name}`)) return {state,error:"Not enough cash."};
  state.businesses[id]={level:1};
  state.xp += 30;
  return {state,error:null};
}

export function upgradeBusiness(state,id) {
  const b=BUSINESSES.find(x=>x.id===id);
  const level=state.businesses[id]?.level||0;
  if (!b || !level) return {state,error:"Buy the business first."};
  const cost=b.upgradeCost*level;
  if (!spendFromWallet(state,cost,`Upgraded ${b.name} to level ${level+1}`)) return {state,error:"Not enough cash."};
  state.businesses[id].level++;
  state.xp += 20;
  return {state,error:null};
}

export function buyProperty(state,id) {
  const p=PROPERTIES.find(x=>x.id===id);
  if (!p) return {state,error:"Property not found."};
  if (!spendFromWallet(state,p.price,`Bought ${p.name}`)) return {state,error:"Not enough cash."};
  if (!state.properties[id]) state.properties[id]={count:0};
  state.properties[id].count++;
  state.xp += 45;
  return {state,error:null};
}

export function buyVehicle(state,id) {
  const v=VEHICLES.find(x=>x.id===id);
  if (!v) return {state,error:"Vehicle not found."};
  if (!spendFromWallet(state,v.price,`Bought ${v.name}`)) return {state,error:"Not enough cash."};
  if (!state.vehicles[id]) state.vehicles[id]={count:0};
  state.vehicles[id].count++;
  state.xp += 35;
  return {state,error:null};
}

export function transfer(state,from,to,amount) {
  amount=Math.floor(Number(amount));
  if (!BANKS.some(b=>b.id===from)||!BANKS.some(b=>b.id===to)||from===to) return {state,error:"Choose two different accounts."};
  if (!Number.isFinite(amount)||amount<=0) return {state,error:"Enter a valid amount."};
  const fee=amount*(BANKS.find(b=>b.id===to)?.fee||0);
  if (state.banks[from] < amount+fee) return {state,error:"Insufficient funds."};
  state.banks[from]-=amount+fee;
  state.banks[to]+=amount;
  tx(state,`Transfer ${from} → ${to}`, -amount-fee,"transfer");
  state.xp+=5;
  return {state,error:null};
}

export function nextDay(state) {
  const next=clone(state);
  next.day++;
  const event=EVENTS[Math.floor(Math.random()*EVENTS.length)];
  next.activeEvent=event;
  next.eventUntilDay=next.day;

  const incomeMult=event.effect.incomeMult||1;
  let income=0;
  BUSINESSES.forEach(b=>{
    const owned=next.businesses[b.id]?.level||0;
    if (owned) income += (b.baseIncome+(owned-1)*b.upgradeIncome)*owned;
  });
  VEHICLES.forEach(v=>{
    income += (next.vehicles[v.id]?.count||0)*v.income;
  });
  const propertyMult=event.effect.propertyMult||1;
  PROPERTIES.forEach(p=>{
    income += (next.properties[p.id]?.count||0)*p.rent*propertyMult;
  });
  income*=incomeMult;

  let upkeep=0;
  VEHICLES.forEach(v=>{ upkeep+=(next.vehicles[v.id]?.count||0)*v.upkeep*(event.effect.vehicleCostMult||1); });
  income-=upkeep;

  addWallet(next,Math.max(0,Math.round(income)),`Day ${next.day} business & asset income`);
  if (upkeep>0) tx(next,`Day ${next.day} fleet upkeep`,-Math.round(upkeep),"expense");

  if (event.effect.cash) addWallet(next,event.effect.cash,event.title);
  next.reputation=Math.max(0,Math.min(100,next.reputation+(event.positive?2:-1)));
  next.xp += Math.max(10,Math.floor(Math.abs(income)/1000));
  next.level=levelForXp(next.xp);
  checkMissions(next);
  return next;
}

export function checkMissions(state) {
  for (const m of MISSIONS) {
    if (state.completedMissions.includes(m.id)) continue;
    if (statValue(state,m.stat)>=m.goal) {
      state.completedMissions.push(m.id);
      addWallet(state,m.reward,`Mission reward: ${m.title}`);
      state.xp += m.xp;
      state.reputation=Math.min(100,state.reputation+5);
    }
  }
  state.level=levelForXp(state.xp);
}

export function exportSave(state) {
  return JSON.stringify(state,null,2);
}

export function importSave(raw) {
  const parsed=JSON.parse(raw);
  if (!parsed || typeof parsed !== "object" || !parsed.banks) throw new Error("Invalid save file");
  return {...clone(STARTER),...parsed};
}

export function initialStats(state) {
  return {
    cash:Object.values(state.banks).reduce((a,b)=>a+b,0),
    netWorth:netWorth(state),
    businesses:statValue(state,"businesses"),
    properties:statValue(state,"properties"),
    vehicles:statValue(state,"vehicles")
  };
}