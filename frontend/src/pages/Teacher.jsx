import { useEffect, useState } from "react";
import { api } from "../api";
import { ReportCard } from "./Report";

export default function Teacher() {
  const [list, setList] = useState([]);
  useEffect(() => { api("/teacher/students/").then(setList); }, []);
  return (<><h1>My students</h1>
    {list.length === 0 && <p className="muted">No students linked yet. Students add your email when they sign up.</p>}
    {list.map((s) => <section className="card" key={s.id}><h2>{s.student} <small>{s.email}</small></h2><ReportCard r={s} /></section>)}</>);
}
