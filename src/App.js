import { Navigate, Route, Routes } from "react-router-dom";
import "@/App.css";
import { LandingPage } from "@/pages/LandingPage";
import { SurveyPage } from "@/pages/SurveyPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/survey" element={<SurveyPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
