import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

const AZ900 = "Cloud concepts, Azure architecture, Compute and networking, Storage, Identity and security, Cost management, Governance and compliance";
const split = (s) => s.split(",").map((x) => x.trim()).filter(Boolean);

export default function Planner() {
  const [blocks, setBlocks] = useState([]); const [msg, setMsg] = useState("");
  const [g, setG] = useState({ topics: AZ900, chores: "Wash dishes, Laundry, Clean room", hobbies: "Music, Football, Drawing", session_minutes: 30 });
  const [n, setN] = useState({ title: "", category: "study", topic: "", start: "", end: "" });
  const load = () => api("/blocks/").then(setBlocks);
  useEffect(() => { load(); }, []);

  const generate = async (e) => {
    e.preventDefault(); setMsg("Building your week...");
    const r = await api("/generate/", { method: "POST", body: { topics: split(g.topics), chores: split(g.chores), hobbies: split(g.hobbies), session_minutes: +g.session_minutes } });
    setMsg(`Created ${r.created} activities.`); load();
  };
  const add = async (e) => { e.preventDefault(); await api("/blocks/", { method: "POST", body: n }); setN({ ...n, title: "" }); load(); };
  const del = async (id) => { await api(`/blocks/${id}/`, { method: "DELETE" }); load(); };

  const days = blocks.reduce((m, b) => { const k = new Date(b.start).toDateString(); (m[k] ||= []).push(b); return m; }, {});
  return (<>
    <h1>Weekly planner</h1>
    <div className="grid">
      <form className="card" onSubmit={generate}><h2>Auto-plan my week</h2>
        <label>AZ-900 topics (comma separated)<textarea rows={3} value={g.topics} onChange={(e) => setG({ ...g, topics: e.target.value })} /></label>
        <label>Home chores<input value={g.chores} onChange={(e) => setG({ ...g, chores: e.target.value })} /></label>
        <label>Hobbies<input value={g.hobbies} onChange={(e) => setG({ ...g, hobbies: e.target.value })} /></label>
        <label>Concentration time (minutes)<input type="number" min="10" max="30" value={g.session_minutes} onChange={(e) => setG({ ...g, session_minutes: e.target.value })} /></label>
        <button className="btn">Generate plan</button><p className="muted">{msg}</p></form>
      <form className="card" onSubmit={add}><h2>Add activity</h2>
        <label>Title<input required value={n.title} onChange={(e) => setN({ ...n, title: e.target.value })} /></label>
        <label>Type<select value={n.category} onChange={(e) => setN({ ...n, category: e.target.value })}>
          {["study", "chore", "hobby", "meal", "rest"].map((c) => <option key={c}>{c}</option>)}</select></label>
        {n.category === "study" && <label>Topic<input value={n.topic} onChange={(e) => setN({ ...n, topic: e.target.value })} /></label>}
        <label>Start<input type="datetime-local" required value={n.start} onChange={(e) => setN({ ...n, start: e.target.value })} /></label>
        <label>End<input type="datetime-local" required value={n.end} onChange={(e) => setN({ ...n, end: e.target.value })} /></label>
        <button className="btn">Add</button></form>
    </div>
    {Object.entries(days).map(([day, list]) => (
      <section key={day} className="card"><h2>{day}</h2>
        <ul className="list">{list.map((b) => (
          <li key={b.id}><span className={`tag ${b.category}`}>{b.category}</span> {b.title}{b.completed && " ✓"}
            <small>{new Date(b.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</small>
            {b.category === "study" && !b.completed && <Link className="btn small" to={`/focus/${b.id}`}>Start</Link>}
            <button className="btn ghost small" onClick={() => del(b.id)}>Remove</button></li>))}</ul></section>))}
  </>);
}
