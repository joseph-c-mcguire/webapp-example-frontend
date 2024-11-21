import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import MonitorForm from './components/MonitorForm/MonitorForm';
import Results from './components/Results/Results';
import DataDescription from './components/DataDescription/DataDescription';
import InteractiveDashboard from './components/InteractiveDashboard/InteractiveDashboard';
import DiagnosticPlots from './components/DiagnosticPlots/DiagnosticPlots';
import ModelDescription from './components/ModelDescription/ModelDescription'; // Import the new component
import './App.css'; // Import the CSS file
import './components/InteractiveDashboard/InteractiveDashboard.css'; // Import the new CSS file
import './components/DiagnosticPlots/DiagnosticPlots.css'; // Import the new CSS file

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
    fetch(`${process.env.REACT_APP_BACKEND_URL}/data`)
      .then(response => response.json())
      .then(data => {
        console.log('Fetched data:', data);
        setData(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Header />
        <div className="main-content">
          <DataDescription />
          <InteractiveDashboard data={data} />
          <ModelDescription /> {/* Add the new component here */}
          <div className="content-column"> {/* Change to column layout */}
            <MonitorForm setResult={setResult} />
            <Results result={result} handleNewEntry={handleNewEntry} />
          </div>
          <DiagnosticPlots data={data} />
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;