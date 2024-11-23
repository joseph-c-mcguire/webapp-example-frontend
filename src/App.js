import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import MonitorForm from './components/MonitorForm/MonitorForm';
import Results from './components/Results/Results';
import DataDescription from './components/DataDescription/DataDescription';
import InteractiveDashboard from './components/InteractiveDashboard/InteractiveDashboard';
import DiagnosticPlots from './components/DiagnosticPlots/DiagnosticPlots';
import ModelDescription from './components/ModelDescription/ModelDescription';
import './App.css';
import './components/InteractiveDashboard/InteractiveDashboard.css';
import './components/DiagnosticPlots/DiagnosticPlots.css';

const App = () => {
  const [result, setResult] = useState(null);
  const [probabilities, setProbabilities] = useState([]);
  const [data, setData] = useState([]);

  const handleNewEntry = () => {
    setResult(null);
    setProbabilities([]);
  };

  useEffect(() => {
    // Fetch data from the backend
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://webapp-example-backend-6b9cff025ec9.herokuapp.com';
    fetch(`${backendUrl}/data`)
      .then(response => response.json())
      .then(data => {
        console.log('Fetched data:', data);
        setData(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <div className="app-container">
        <Header />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<DataDescription />} />
            <Route path="/eda" element={<InteractiveDashboard data={data} />} />
            <Route path="/model-description" element={<ModelDescription />} />
            <Route path="/model-querying" element={
              <div className="content-column">
                <MonitorForm setResult={setResult} />
                <Results result={result} handleNewEntry={handleNewEntry} />
              </div>
            } />
            <Route path="/model-diagnostics" element={<DiagnosticPlots data={data} />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;