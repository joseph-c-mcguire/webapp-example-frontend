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
  // State variables to store result, probabilities, data, and class names
  const [result, setResult] = useState(null);
  const [probabilities, setProbabilities] = useState([]);
  const [data, setData] = useState([]);
  const [classNames, setClassNames] = useState([]);

  // Function to handle new entry, resetting result and probabilities
  const handleNewEntry = () => {
    setResult(null);
    setProbabilities([]);
  };

  // useEffect hook to fetch data and class names from the backend on component mount
  useEffect(() => {
    // Fetch data from the backend
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://webapp-example-backend-6b9cff025ec9.herokuapp.com';
    const formattedBackendUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl; // Remove trailing slash if present
    fetch(`${formattedBackendUrl}/api/helper/data`) // Ensure single slash
      .then(response => response.json())
      .then(data => {
        console.log('Fetched data:', data);
        setData(data);
      })
      .catch(error => console.error('Error fetching data:', error));

    // Fetch class names from the backend
    fetch(`${formattedBackendUrl}/api/helper/class-names`)
      .then(response => response.json())
      .then(data => {
        console.log('Fetched class names:', data.class_names);
        setClassNames(data.class_names);
      })
      .catch(error => console.error('Error fetching class names:', error));
  }, []);

  return (
    <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <div className="app-container">
        <Header />
        <div className="main-content">
          <Routes>
            {/* Route for Data Description */}
            <Route path="/" element={<DataDescription />} />
            {/* Route for Interactive Dashboard */}
            <Route path="/eda" element={<InteractiveDashboard data={data} />} />
            {/* Route for Model Description */}
            <Route path="/model-description" element={<ModelDescription />} />
            {/* Route for Model Querying */}
            <Route path="/model-querying" element={
              <div className="content-column">
                <MonitorForm setResult={setResult} />
              </div>
            } />
            {/* Route for Model Diagnostics */}
            <Route path="/model-diagnostics" element={<DiagnosticPlots data={data} />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;