import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";

const FOCUS_SECONDS = 30 * 60; // a break is required after every 30 minutes
export default function Focus() {
  const { id } = useParams(); const nav = useNavigate();
  const [left, setLeft] = useState(FOCUS_SECONDS); const [run, setRun] = useState(false);
  useEffect(() => {
    if (!run) return;
    const t = setInterval(() => setLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [run]);
  useEffect(() => {
    if (left > 0) return;
    (id ? api(`/blocks/${id}/`, { method: "PATCH", body: { completed: true, focus_minutes: 30 } }) : Promise.resolve())
      .finally(() => nav("/break"));
  }, [left]);
  const m = String(Math.floor(left / 60)).padStart(2, "0"), s = String(left % 60).padStart(2, "0");
  return (
    <div className="card center"><h1>Focus session</h1>
      <div className="clock">{m}:{s}</div>
      <p className="muted">Stay on one topic. A laughter break unlocks when the timer ends.</p>
      <button className="btn" onClick={() => setRun(!run)}>{run ? "Pause" : "Start"}</button>{" "}
      <button className="btn ghost" onClick={() => nav("/break")}>End early</button></div>
  );
}
