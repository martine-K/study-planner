import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [blocks, setBlocks] = useState([]);
  const [st, setSt] = useState(null);
  useEffect(() => { api("/blocks/").then(setBlocks).catch(() => {}); api("/stats/").then(setSt).catch(() => {}); }, []);
  const today = blocks.filter((b) => new Date(b.start).toDateString() === new Date().toDateString());
  const next = blocks.find((b) => b.category === "study" && !b.completed && new Date(b.start) > new Date());
  return (<>
    <section className="hero"><h1>Welcome back, {user.first_name || "learner"} 👋</h1>
      <p>Prepare for Microsoft AZ-900 with a plan that fits your life.</p>
      <Link className="btn" to="/planner">Open planner</Link></section>
    <div className="grid">
      <div className="card"><h2>Next study session</h2>
        {next ? <><p><b>{next.topic}</b><br />{new Date(next.start).toLocaleString()}</p><Link className="btn" to={`/focus/${next.id}`}>Start now</Link></> : <p className="muted">Nothing scheduled. Generate your week in the planner.</p>}</div>
      <div className="card"><h2>Today</h2>
        {today.length ? <ul className="list">{today.map((b) => <li key={b.id}><span className={`tag ${b.category}`}>{b.category}</span> {b.title} <small>{new Date(b.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</small></li>)}</ul> : <p className="muted">No activities today.</p>}</div>
      <div className="card"><h2>Quick links</h2><p><Link to="/assistant">Ask the AI Study Buddy</Link></p><p><Link to="/break">Take a laughter break</Link></p><p><Link to="/report">View weekly progress</Link></p></div>
    </div>
    {st && <section className="card"><h2>📊 Progress statistics</h2>
      <div className="stats">
        <div><b>{st.readiness}%</b><span>Exam readiness</span></div>
        <div><b>{st.overall_rate}%</b><span>Completion rate</span></div>
        <div><b>{st.total_minutes}</b><span>Focus minutes</span></div>
        <div><b>{st.streak} 🔥</b><span>Day streak</span></div>
        <div><b>{st.completed_sessions}/{st.total_sessions}</b><span>Sessions done</span></div>
        <div><b>{st.upcoming}</b><span>Upcoming</span></div></div>
      <h3>Focus minutes, last 7 days</h3>
      <div className="chart" role="img" aria-label="Focus minutes per day">
        {st.daily.map((d) => <div key={d.day} className="col"><small>{d.minutes}</small>
          <i style={{ height: `${Math.max(4, Math.min(100, d.minutes / 90 * 100))}%` }} title={`${d.completed}/${d.planned} sessions`} /><span>{d.day}</span></div>)}</div>
      <h3>Topics (weakest first)</h3>
      {st.topics.length ? st.topics.map((t) => <div key={t.topic} className={`bar ${t.rate < 60 ? "weak" : ""}`}><span>{t.topic}</span><div><i style={{ width: `${t.rate}%` }} /></div><small>{t.rate}%</small></div>) : <p className="muted">Complete a study session to see topic progress.</p>}
    </section>}
  </>);
}
