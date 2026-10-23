import { useState } from "react";
import { api } from "../api";

export default function Assistant() {
  const [msgs, setMsgs] = useState([{ role: "ai", text: "Hi! Ask me anything about AZ-900, e.g. “What is IaaS vs PaaS?”" }]);
  const [q, setQ] = useState(""); const [busy, setBusy] = useState(false);
  const send = async (e) => {
    e.preventDefault(); if (!q.trim()) return;
    const question = q; setQ(""); setBusy(true); setMsgs((m) => [...m, { role: "me", text: question }]);
    try { const r = await api("/assistant/", { method: "POST", body: { question } }); setMsgs((m) => [...m, { role: "ai", text: r.answer }]); }
    catch (x) { setMsgs((m) => [...m, { role: "ai", text: x.message }]); }
    setBusy(false);
  };
  return (
    <div className="card"><h1>AI Study Buddy</h1>
      <div className="chat">{msgs.map((m, i) => <p key={i} className={`msg ${m.role}`}>{m.text}</p>)}{busy && <p className="msg ai">Thinking...</p>}</div>
      <form className="row" onSubmit={send}><input placeholder="Ask about Azure..." value={q} onChange={(e) => setQ(e.target.value)} /><button className="btn" disabled={busy}>Send</button></form></div>
  );
}
