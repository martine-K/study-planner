import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Form({ title, children, onSubmit, error, footer }) {
  return (
    <form className="card auth" onSubmit={onSubmit}>
      <h1>{title}</h1>{children}
      {error && <p className="error" role="alert">{error}</p>}
      <button className="btn">{title}</button><p className="muted">{footer}</p>
    </form>
  );
}

export function Login() {
  const { login } = useAuth(); const nav = useNavigate();
  const [f, setF] = useState({ email: "", password: "" }); const [error, setError] = useState("");
  const submit = async (e) => { e.preventDefault(); try { await login(f.email, f.password); nav("/"); } catch (x) { setError(x.message); } };
  return (
    <Form title="Sign in" onSubmit={submit} error={error} footer={<>No account? <Link to="/signup">Sign up</Link></>}>
      <label>Email<input type="email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
      <label>Password<input type="password" required value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></label>
    </Form>
  );
}

export function Signup() {
  const { signup } = useAuth(); const nav = useNavigate();
  const [f, setF] = useState({ name: "", email: "", password: "", role: "student", teacher_email: "" });
  const [error, setError] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => { e.preventDefault(); try { await signup(f); nav("/"); } catch (x) { setError(x.message); } };
  return (
    <Form title="Create account" onSubmit={submit} error={error} footer={<>Have an account? <Link to="/login">Sign in</Link></>}>
      <label>Full name<input required value={f.name} onChange={set("name")} /></label>
      <label>Email<input type="email" required value={f.email} onChange={set("email")} /></label>
      <label>Password (6+ characters)<input type="password" minLength={6} required value={f.password} onChange={set("password")} /></label>
      <label>I am a<select value={f.role} onChange={set("role")}><option value="student">Student</option><option value="teacher">Teacher</option></select></label>
      {f.role === "student" && <label>Teacher's email (optional, receives your weekly report)<input type="email" value={f.teacher_email} onChange={set("teacher_email")} /></label>}
    </Form>
  );
}
