import React, {useEffect, useMemo, useRef, useState} from "react";
import {BANKS,BUSINESSES,EVENTS,MISSIONS,PROPERTIES,STARTER,VEHICLES,formatNaira,levelForXp,netWorth,statValue} from "./data";
import {buyBusiness,buyProperty,buyVehicle,checkMissions,exportSave,importSave,loadGame,nextDay,saveGame,transfer,upgradeBusiness} from "./game";

const tabs=[["home","🏠","Empire"],["business","💼","Business"],["bank","🏦","Bank"],["property","🏠","Property"],["garage","🚘","Garage"],["missions","🎯","Missions"]];

function Card({children,className=""}){return <div className={`card ${className}`}>{children}</div>}
function Button({children,onClick,disabled=false,kind=""}){return <button className={`btn ${kind}`} onClick={onClick} disabled={disabled}>{children}</button>}
function Stat({label,value,icon}){return <div className="stat"><span>{icon}</span><div><small>{label}</small><strong>{value}</strong></div></div>}

export default function App(){
  const [state,setState]=useState(loadGame);
  const [tab,setTab]=useState("home");
  const [notice,setNotice]=useState("");
  const [modal,setModal]=useState(null);
  const fileRef=useRef();

  useEffect(()=>{ setState(s=>saveGame(s)); },[]);
  useEffect(()=>{ const t=setTimeout(()=>setState(s=>saveGame(s)),500); return()=>clearTimeout(t); },[state]);

  const stats=useMemo(()=>({
    net:netWorth(state),
    cash:Object.values(state.banks).reduce((a,b)=>a+b,0),
    businesses:statValue(state,"businesses"),
    properties:statValue(state,"properties"),
    vehicles:statValue(state,"vehicles")
  }),[state]);

  const act=(fn)=>{
    setState(s=>{
      const result=fn({...s});
      if(result?.error) {setNotice(result.error); setTimeout(()=>setNotice(""),2500); return s;}
      setNotice("Saved ✓"); setTimeout(()=>setNotice(""),1200);
      return saveGame(result.state||result);
    });
  };

  const reset=()=>{if(confirm("Reset your Naija Hustle save?")) {localStorage.removeItem("naija-hustle-save-v1");location.reload();}};
  const downloadSave=()=>{
    const blob=new Blob([exportSave(state)],{type:"application/json"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="naija-hustle-save.json";a.click();URL.revokeObjectURL(a.href);
  };
  const importFile=e=>{
    const file=e.target.files?.[0]; if(!file)return;
    const r=new FileReader(); r.onload=()=>{try{setState(saveGame(importSave(r.result)));setNotice("Save imported ✓")}catch{setNotice("Invalid save file")}};
    r.readAsText(file);
  };

  return <div className="app">
    <header className="topbar">
      <div className="brand"><div className="logo">₦</div><div><b>NAIJA HUSTLE</b><small>BUILD YOUR EMPIRE</small></div></div>
      <div className="header-money"><small>NET WORTH</small><b>{formatNaira(stats.net)}</b></div>
    </header>

    <main>
      <section className="hero">
        <div>
          <div className="eyebrow">DAY {state.day} • LEVEL {state.level}</div>
          <h1>Your hustle.<br/><span>Your empire.</span></h1>
          <p>Start small. Build businesses. Own property. Build a fleet. Become a Nigerian business boss.</p>
          <div className="hero-actions"><Button onClick={()=>act(nextDay)} kind="primary">☀️ Start Day {state.day+1}</Button><Button onClick={()=>setModal("settings")}>⚙️ Save & Settings</Button></div>
        </div>
        <div className="hero-art"><div className="city">🏙️</div><div className="hero-car">🚘</div><div className="coin">₦</div></div>
      </section>

      <section className="stats-grid">
        <Stat label="Available Cash" value={formatNaira(stats.cash)} icon="💵"/>
        <Stat label="Businesses" value={stats.businesses} icon="💼"/>
        <Stat label="Properties" value={stats.properties} icon="🏠"/>
        <Stat label="Vehicles" value={stats.vehicles} icon="🚘"/>
      </section>

      {state.activeEvent && <Card className={`event ${state.activeEvent.positive?"good":"bad"}`}>
        <div className="event-icon">{state.activeEvent.positive?"📈":"⚠️"}</div>
        <div><b>{state.activeEvent.title}</b><p>{state.activeEvent.text}</p></div>
        <span>Day {state.eventUntilDay}</span>
      </Card>}

      <div className="content">
        {tab==="home"&&<Home state={state} stats={stats} act={act} setTab={setTab}/>}
        {tab==="business"&&<Business state={state} act={act}/>}
        {tab==="bank"&&<Bank state={state} act={act}/>}
        {tab==="property"&&<Property state={state} act={act}/>}
        {tab==="garage"&&<Garage state={state} act={act}/>}
        {tab==="missions"&&<Missions state={state}/>}
      </div>
    </main>

    <nav className="bottom-nav">{tabs.map(([id,icon,label])=><button key={id} className={tab===id?"active":""} onClick={()=>setTab(id)}><span>{icon}</span><small>{label}</small></button>)}</nav>
    {notice&&<div className="toast">{notice}</div>}
    {modal==="settings"&&<div className="modal-bg" onClick={()=>setModal(null)}><div className="modal" onClick={e=>e.stopPropagation()}>
      <h2>Save & Settings</h2><p>Your core save is stored on this device. Export it if you want a backup.</p>
      <Button onClick={downloadSave}>⬇️ Export Save</Button>
      <Button onClick={()=>fileRef.current?.click()}>⬆️ Import Save</Button>
      <input ref={fileRef} type="file" accept=".json" hidden onChange={importFile}/>
      <Button onClick={reset} kind="danger">Reset Game</Button>
      <Button onClick={()=>setModal(null)}>Close</Button>
    </div></div>}
  </div>
}

function Home({state,stats,act,setTab}){
  const owned=BUSINESSES.filter(b=>state.businesses[b.id]?.level);
  const missions=MISSIONS.filter(m=>!state.completedMissions.includes(m.id)).slice(0,3);
  return <div className="two-col">
    <div>
      <Section title="Your Empire" action={<span className="muted">Day {state.day}</span>}/>
      {owned.length===0?<Card className="empty"><div className="big">💼</div><h3>Your empire starts here.</h3><p>Buy your first business and start generating daily income.</p><Button onClick={()=>setTab("business")} kind="primary">Explore Businesses</Button></Card>:
      <div className="list">{owned.slice(0,4).map(b=><Card key={b.id} className="row-card"><div className="asset-icon">{b.icon}</div><div className="grow"><b>{b.name}</b><small>Level {state.businesses[b.id].level} • {formatNaira(b.baseIncome*state.businesses[b.id].level)}/day base</small></div><Button onClick={()=>act(s=>upgradeBusiness(s,b.id))}>Upgrade</Button></Card>)}</div>}
    </div>
    <div>
      <Section title="Next Targets"/>
      <div className="list">{missions.map(m=><Card key={m.id}><div className="mission-top"><b>{m.title}</b><span>+{m.xp} XP</span></div><p>{m.text}</p><small>Reward {formatNaira(m.reward)}</small></Card>)}</div>
    </div>
  </div>
}
function Section({title,action}){return <div className="section-head"><h2>{title}</h2>{action}</div>}

function Business({state,act}){
  return <><Section title="Businesses" action={<span className="muted">Buy • Upgrade • Earn</span>}/><div className="cards-grid">{BUSINESSES.map(b=>{
    const owned=state.businesses[b.id]?.level||0; const cost=owned?b.upgradeCost*owned:b.cost;
    return <Card key={b.id}><div className="card-icon">{b.icon}</div><h3>{b.name}</h3><p>{b.desc}</p><div className="price">{owned?`Level ${owned}`:formatNaira(b.cost)}</div>{owned&&<small>Next upgrade: {formatNaira(cost)}</small>}<Button onClick={()=>act(s=>owned?upgradeBusiness(s,b.id):buyBusiness(s,b.id))} kind={owned?"":"primary"}>{owned?`Upgrade • ${formatNaira(cost)}`:`Buy • ${formatNaira(cost)}`}</Button></Card>
  })}</div></>
}

function Bank({state,act}){
  const [from,setFrom]=useState("wallet"),[to,setTo]=useState("main"),[amount,setAmount]=useState("");
  return <><Section title="Banking" action={<span className="muted">Every account has its own balance</span>}/><div className="bank-grid">{BANKS.map(b=><Card key={b.id} className="bank-card"><div className="bank-head"><span className="card-icon">{b.icon}</span><div><b>{b.name}</b><small>{b.id==="wallet"?"Physical cash":"Independent account"}</small></div></div><strong className="bank-balance">{formatNaira(state.banks[b.id]||0)}</strong><div className="bank-id">Account •••• {b.id.slice(0,4).toUpperCase()}</div></Card>)}</div>
  <Card className="transfer"><h3>Transfer Money</h3><div className="form-grid"><label>From<select value={from} onChange={e=>setFrom(e.target.value)}>{BANKS.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</select></label><label>To<select value={to} onChange={e=>setTo(e.target.value)}>{BANKS.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</select></label><label>Amount<input inputMode="numeric" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="₦10,000"/></label></div><Button kind="primary" onClick={()=>{act(s=>transfer(s,from,to,amount));setAmount("")}}>Transfer</Button></Card>
  <Section title="Recent Transactions"/><Card className="transactions">{state.transactions.slice(0,12).map(t=><div className="tx" key={t.id}><span>{t.type==="expense"?"↘️":t.type==="transfer"?"↔️":"↗️"}</span><div className="grow"><b>{t.text}</b><small>Day {t.day}</small></div><strong className={t.amount<0?"negative":"positive"}>{t.amount<0?"-":"+"}{formatNaira(Math.abs(t.amount))}</strong></div>)}</Card></>
}

function Property({state,act}){
  return <><Section title="Property Portfolio" action={<span className="muted">Rent • Appreciate • Expand</span>}/><div className="cards-grid">{PROPERTIES.map(p=>{const count=state.properties[p.id]?.count||0;return <Card key={p.id}><div className="property-art">{p.icon}</div><small>{p.area}</small><h3>{p.name}</h3><p>Rent: {formatNaira(p.rent)}/day • Growth {Math.round(p.valueGrowth*1000)/10}%</p><div className="price">{formatNaira(p.price)}</div><div className="owned">{count?`Owned: ${count}`:"Not owned"}</div><Button onClick={()=>act(s=>buyProperty(s,p.id))} kind="primary">Buy Property</Button></Card>})}</div></>
}
function Garage({state,act}){
  return <><Section title="Vehicle Garage" action={<span className="muted">Income • Transport • Status</span>}/><div className="cards-grid">{VEHICLES.map(v=>{const count=state.vehicles[v.id]?.count||0;return <Card key={v.id}><div className="vehicle-art">{v.icon}</div><small>{v.area}</small><h3>{v.name}</h3><p>Income {formatNaira(v.income)}/day • Upkeep {formatNaira(v.upkeep)}/day</p><div className="price">{formatNaira(v.price)}</div><div className="owned">{count?`Garage: ${count}`:"Not owned"}</div><Button onClick={()=>act(s=>buyVehicle(s,v.id))} kind="primary">Buy Vehicle</Button></Card>})}</div></>
}
function Missions({state}){
  return <><Section title="Missions" action={<span className="muted">{state.completedMissions.length}/{MISSIONS.length} complete</span>}/><div className="list">{MISSIONS.map(m=>{const done=state.completedMissions.includes(m.id);const progress=Math.min(100,Math.round(statValue(state,m.stat)/m.goal*100));return <Card key={m.id}><div className="mission-top"><div><h3>{m.title}</h3><p>{m.text}</p></div><span>{done?"✓ COMPLETE":`+${m.xp} XP`}</span></div><div className="progress"><i style={{width:`${progress}%`}}/></div><small>{done?"Reward collected":`${statValue(state,m.stat).toLocaleString()} / ${m.goal.toLocaleString()} • Reward ${formatNaira(m.reward)}`}</small></Card>})}</div></>
}