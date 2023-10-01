import App from "./App";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

export default function Root(props) {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </Router>
  );
}
