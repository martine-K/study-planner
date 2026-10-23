import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { Login, Signup } from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Planner from "./pages/Planner";
import Focus from "./pages/Focus";
import Break from "./pages/Break";
import Assistant from "./pages/Assistant";
import Report from "./pages/Report";
import Teacher from "./pages/Teacher";

const P = (el, role) => <ProtectedRoute role={role}>{el}</ProtectedRoute>;
export default function App() {
  return (<>
    <Navbar />
    <main className="page">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={P(<Dashboard />)} />
        <Route path="/planner" element={P(<Planner />)} />
        <Route path="/focus" element={P(<Focus />)} />
        <Route path="/focus/:id" element={P(<Focus />)} />
        <Route path="/break" element={P(<Break />)} />
        <Route path="/assistant" element={P(<Assistant />)} />
        <Route path="/report" element={P(<Report />)} />
        <Route path="/teacher" element={P(<Teacher />, "teacher")} />
      </Routes>
    </main>
  </>);
}
