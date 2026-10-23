import { useState } from "react";
import { Link } from "react-router-dom";

const FACTS = [
  "Laughing lowers stress hormones and boosts oxygen flow to your brain.",
  "Octopuses have three hearts and blue blood.",
  "Honey never spoils. Edible honey was found in ancient Egyptian tombs.",
  "Bananas are berries, but strawberries are not.",
  "Your brain uses about 20% of your body's energy.",
  "A group of flamingos is called a flamboyance.",
];
const RIDDLES = [
  ["Why did the cloud engineer break up with the server?", "There was no connection and too much latency!"],
  ["What do you call a sleeping Azure VM?", "A deallocated dreamer."],
  ["Why was the data so calm?", "It was stored in cool tier storage."],
  ["What's a developer's favourite hangout?", "The Foo Bar."],
];
const pick = (a, cur) => { let i; do { i = Math.floor(Math.random() * a.length); } while (a.length > 1 && i === cur); return i; };

export default function Break() {
  const [f, setF] = useState(0); const [r, setR] = useState(0); const [show, setShow] = useState(false);
  const [breath, setBreath] = useState(false);
  return (<>
    <h1>😄 Mind-warming break</h1>
    <div className="grid">
      <div className="card"><h2>Fun fact</h2><p className="big">{FACTS[f]}</p><button className="btn" onClick={() => setF(pick(FACTS, f))}>Another fact</button></div>
      <div className="card"><h2>Laugh riddle</h2><p className="big">{RIDDLES[r][0]}</p>
        {show ? <p className="answer">{RIDDLES[r][1]}</p> : <button className="btn" onClick={() => setShow(true)}>Reveal</button>}
        <p><button className="btn ghost" onClick={() => { setR(pick(RIDDLES, r)); setShow(false); }}>Next riddle</button></p></div>
      <div className="card center"><h2>Breathe</h2><div className={`bubble ${breath ? "on" : ""}`} />
        <button className="btn" onClick={() => setBreath(!breath)}>{breath ? "Stop" : "Start breathing"}</button></div>
    </div>
    <p><Link className="btn" to="/planner">Back to planner</Link></p></>);
}
