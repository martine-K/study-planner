import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const links = user ? [
    ["/", "Dashboard"], ["/planner", "Planner"], ["/focus", "Focus"], ["/break", "Break"],
    ["/assistant", "AI Buddy"], ["/report", "Progress"], ...(user.role === "teacher" ? [["/teacher", "Teacher"]] : []),
  ] : [];
  return (
    <header className="nav">
      <Link to="/" className="brand"><span className="logo"><i/><i/><i/><i/></span>Study Planner</Link>
      <button className="burger" aria-label="Menu" onClick={() => setOpen(!open)}>☰</button>
      <nav className={open ? "open" : ""} onClick={() => setOpen(false)}>
        {links.map(([to, label]) => <NavLink key={to} to={to} end={to === "/"}>{label}</NavLink>)}
        {user ? <button className="btn ghost" onClick={logout}>Sign out</button>
              : <><NavLink to="/login">Sign in</NavLink><NavLink to="/signup" className="btn">Sign up</NavLink></>}
      </nav>
    </header>
  );
}
