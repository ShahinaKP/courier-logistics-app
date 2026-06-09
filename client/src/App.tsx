import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import BagManagement from "./pages/BagManagement";
import TruckSchedules from "./pages/TruckSchedules";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/bags" element={<BagManagement />} />
        <Route path="/trucks" element={<TruckSchedules />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
