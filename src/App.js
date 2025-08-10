import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SymptomAnalyzer from './pages/SymptomAnalyzer';
import MentalHealth from './pages/MentalHealth';
import XrayReader from './pages/XrayReader';
import DiseaseOutbreak from './pages/DiseaseOutbreak';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/symptom-analyzer" element={<SymptomAnalyzer />} />
            <Route path="/mental-health" element={<MentalHealth />} />
            <Route path="/xray-reader" element={<XrayReader />} />
            <Route path="/disease-outbreak" element={<DiseaseOutbreak />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
