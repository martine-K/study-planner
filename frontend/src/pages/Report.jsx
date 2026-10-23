import { useEffect, useState } from "react";
import { api } from "../api";

export function ReportCard({ r }) {
  return (<>
    <div className="stats"><div><b>{r.rate}%</b><span>Completion</span></div><div><b>{r.completed}/{r.planned}</b><span>Sessions</span></div><div><b>{r.focus_minutes}</b><span>Focus min</span></div></div>
    {r.topics.map((t) => <div key={t.topic} className="bar"><span>{t.topic}</span><div><i style={{ width: `${t.rate}%` }} /></div><small>{t.rate}%</small></div>)}
    <h3>Feedback</h3><ul>{r.feedback.map((f, i) => <li key={i}>{f}</li>)}</ul></>);
}

export default function Report() {
  const [r, setR] = useState(null); const [msg, setMsg] = useState("");
  useEffect(() => { api("/report/").then(setR); }, []);
  const send = async () => { await api("/report/", { method: "POST" }); setMsg("Report emailed to you and your teacher."); };
  if (!r) return <p>Loading...</p>;
  return <div className="card"><h1>Weekly performance</h1><ReportCard r={r} /><button className="btn" onClick={send}>Email report now</button><p className="muted">{msg}</p></div>;
}
