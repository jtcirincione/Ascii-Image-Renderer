import logo from './logo.svg';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
