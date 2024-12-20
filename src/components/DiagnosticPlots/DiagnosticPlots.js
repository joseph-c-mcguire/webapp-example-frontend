import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import Header from '../Header/Header'; // Import Header component
import Footer from '../Footer/Footer'; // Import Footer component

const DiagnosticPlots = ({ data }) => {
  // State variables
  const [confusionMatrix, setConfusionMatrix] = useState([]); // Confusion matrix data
  const [rocCurve, setRocCurve] = useState({ fpr: [], tpr: [], roc_auc: 0 }); // ROC curve data
  const [featureImportance, setFeatureImportance] = useState({}); // Feature importance data
  const [featureNames, setFeatureNames] = useState([]); // Feature names
  const [modelName, setModelName] = useState(''); // Selected model name
  const [availableModels, setAvailableModels] = useState([]); // List of available models
  const [classNames, setClassNames] = useState([]); // List of class names
  const [probabilities, setProbabilities] = useState([]); // Prediction probabilities
  const [loading, setLoading] = useState(false); // Loading state
  const [selectedClass, setSelectedClass] = useState(''); // Selected class for histogram
  const [numBins, setNumBins] = useState(10); // Number of bins for histogram

  // Fetch available models and class names on component mount
  useEffect(() => {
    const url = process.env.REACT_APP_BACKEND_URL || 'https://webapp-example-backend-6b9cff025ec9.herokuapp.com';

    // Fetch available models from the backend
    axios.get(`${url}/api/helper/available-models`)
      .then(response => {
        setAvailableModels(response.data.available_models);
        console.log('Available Models:', response.data.available_models); // Log available models
      })
      .catch(error => {
        console.error('Error fetching available models:', error);
      });

    // Fetch class names from the backend
    axios.get(`${url}/api/helper/class-names`)
      .then(response => {
        setClassNames(response.data.class_names);
        console.log('Class Names:', response.data.class_names); // Log class names
      })
      .catch(error => {
        console.error('Error fetching class names:', error);
      });
  }, []);

  // Set default selected class when class names are fetched
  useEffect(() => {
    if (classNames.length > 0 && !selectedClass) {
      setSelectedClass(classNames[0]); // Default to first class if not set
    }
  }, [classNames, selectedClass]);

  // Fetch diagnostic data when data, modelName, or selectedClass changes
  useEffect(() => {
    if (data.length > 0 && modelName) {
      const url = process.env.REACT_APP_BACKEND_URL || 'https://webapp-example-backend-6b9cff025ec9.herokuapp.com';
      setLoading(true);

      // Fetch confusion matrix from the backend with class_label
      axios.post(`${url}/api/diagnostics/confusion-matrix`, { 
        model_name: modelName,
        class_label: selectedClass // Add class_label
      })
        .then(response => {
          setConfusionMatrix(response.data.confusion_matrix);
          if (process.env.NODE_ENV !== 'test') {
            console.log('Confusion Matrix:', response.data.confusion_matrix); // Log in non-test environments
          }
        })
        .catch(error => console.error('Error fetching confusion matrix:', error));

      // Fetch ROC curve data from the backend with class_label
      axios.post(`${url}/api/diagnostics/roc-curve`, { 
        model_name: modelName,
        class_label: selectedClass // Add class_label
      })
        .then(response => {
          setRocCurve(response.data);
          if (process.env.NODE_ENV !== 'test') {
            console.log('ROC Curve:', response.data); // Log in non-test environments
          }
        })
        .catch(error => console.error('Error fetching ROC curve data:', error));

      // Fetch feature importance data from the backend
      axios.get(`${url}/api/diagnostics/feature-importance`, { params: { model_name: modelName } })
        .then(response => {
          setFeatureImportance(response.data.feature_importance || {});
          setFeatureNames(Object.keys(response.data.feature_importance || {})); // Use keys as feature names
        })
        .catch(error => console.error('Error fetching feature importance data:', error));

      // Fetch prediction probabilities from the backend
      axios.post(`${url}/predict-probabilities`, { data, model_name: modelName }) // Use url with default
        .then(response => {
          if (process.env.NODE_ENV !== 'test') {
            console.log('Prediction Probabilities:', response.data.probabilities); // Log in non-test environments
          }
          setProbabilities(response.data.probabilities || []);
        })
        .catch(error => {
          console.error('Error fetching prediction probabilities:', error);
          setProbabilities([]); // Reset probabilities on error
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [data, modelName, selectedClass]); // Add selectedClass to dependencies

  // Log probabilities structure and selected class
  useEffect(() => {
    if (process.env.NODE_ENV !== 'test') {
      console.log('Current Selected Class:', selectedClass);
      console.log('Probability Results:', probabilities);
    }
  }, [probabilities, selectedClass]);

  return (
    <>
      <Header /> {/* Add Header */}
      <div className="diagnostic-plots-container">
        <div className="form-group">
          <label htmlFor="modelName">Model Name:</label>
          <select id="modelName" value={modelName} onChange={(e) => setModelName(e.target.value)}>
            <option value="">Select a model</option>
            {availableModels.map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>
        {/* Add Dropdown for Class Selection */}
        {probabilities.length > 0 && classNames.length > 0 && (
          <div className="form-group">
            <label htmlFor="selectedClass">Select Class for Histogram:</label>
            <select
              id="selectedClass"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              {classNames.map(className => (
                <option key={className} value={className}>{className}</option>
              ))}
            </select>
          </div>
        )}
        {/* Add Slider for Number of Bins */}
        {probabilities.length > 0 && (
          <div className="form-group">
            <label htmlFor="numBins">Number of Bins:</label>
            <input
              type="range"
              id="numBins"
              min="1"
              max="50"
              value={numBins}
              onChange={(e) => setNumBins(e.target.value)}
            />
            <span>{numBins}</span>
          </div>
        )}
        {loading ? (
          <div>Loading...</div>
        ) : (
          modelName ? ( // Remove classLabel condition
            <>
              <h2>Confusion Matrix</h2>
              {confusionMatrix.length > 0 ? (
                <Plot
                  data={[
                    {
                      z: confusionMatrix,
                      type: 'heatmap',
                      colorscale: 'Viridis',
                      showscale: true,
                      text: confusionMatrix.map(row => row.map(value => `Count: ${value}`)),
                      hoverinfo: 'text',
                      zmin: Math.min(...confusionMatrix.flat()) || 0.1, // Avoid log(0)
                      zmax: Math.max(...confusionMatrix.flat()),
                      colorbar: {
                        title: 'Count',
                        tickvals: [1, 10, 100, 1000], // Example tick values for log scale
                        ticktext: ['1', '10', '100', '1000'],
                      },
                      zsmooth: 'best',
                      zauto: false,
                      ztype: 'log', // Set z-axis to log scale
                    },
                  ]}
                  layout={{
                    title: 'Confusion Matrix',
                    annotations: confusionMatrix.flatMap((row, i) =>
                      row.map((value, j) => ({
                        x: j,
                        y: i,
                        text: value,
                        showarrow: false,
                        font: { color: 'white' },
                      }))
                    ),
                    xaxis: {
                      title: 'Predicted Label',
                      tickmode: 'array',
                      tickvals: classNames.map((_, index) => index),
                      ticktext: classNames,
                      automargin: true, // Ensure axis title is not cut off
                    },
                    yaxis: {
                      title: 'True Label',
                      tickmode: 'array',
                      tickvals: classNames.map((_, index) => index),
                      ticktext: classNames,
                      automargin: true, // Ensure axis title is not cut off
                    },
                  }}
                />
              ) : (
                <p>No confusion matrix data available.</p>
              )}

              <h2>Feature Importance</h2>
              <Plot
                data={[
                  {
                    x: featureNames, // Ensure featureNames is defined
                    y: featureNames.map(name => featureImportance[name] || 0), // Safe mapping
                    type: 'bar',
                    marker: { color: 'orange' },
                  },
                ]}
                layout={{
                  title: 'Feature Importance',
                  xaxis: { title: 'Features', automargin: true }, // Ensure axis title is not cut off
                  yaxis: { title: 'Importance', automargin: true }, // Ensure axis title is not cut off
                }}
              />
              <h2>ROC Curve</h2>
              <Plot
                data={[
                  {
                    x: rocCurve.fpr.length ? rocCurve.fpr : [0, 1],
                    y: rocCurve.tpr.length ? rocCurve.tpr : [0, 1],
                    type: 'scatter',
                    mode: 'lines',
                    name: `ROC Curve (AUC = ${rocCurve.roc_auc.toFixed(2)})`,
                    line: { color: 'blue' },
                  },
                  {
                    x: [0, 1],
                    y: [0, 1],
                    type: 'scatter',
                    mode: 'lines',
                    name: 'Baseline',
                    line: { color: 'red', dash: 'dash' },
                  },
                ]}
                layout={{
                  title: `ROC Curve (AUC = ${rocCurve.roc_auc.toFixed(2)})`,
                  xaxis: { title: 'False Positive Rate', automargin: true }, // Ensure axis title is not cut off
                  yaxis: { title: 'True Positive Rate', automargin: true }, // Ensure axis title is not cut off
                  showlegend: true,
                }}
              />
              {probabilities.length > 0 && selectedClass ? (
                <Plot
                  data={[
                    {
                      x: probabilities
                        .map(prob => {
                          const value = prob[classNames.indexOf(selectedClass)];
                          if (value === undefined) {
                            console.warn(`Selected class "${selectedClass}" not found in probability object:`, prob);
                            return null; // Return null if the class is not found
                          }
                          return value;
                        })
                        .filter(val => val !== null && typeof val === 'number' && !isNaN(val)), // Filter out null values
                      type: 'histogram',
                      marker: { color: 'green' },
                      nbinsx: numBins, // Set number of bins
                    },
                  ]}
                  layout={{
                    title: `Prediction Probabilities for ${selectedClass}`,
                    xaxis: { title: 'Probability', automargin: true }, // Ensure axis title is not cut off
                    yaxis: { title: 'Count', automargin: true }, // Ensure axis title is not cut off
                  }}
                />
              ) : (
                <p>No prediction probabilities to display.</p>
              )}
            </>
          ) : (
            <div>Please select a model and class label to view the diagnostic plots.</div>
          )
        )}
      </div>
      <Footer /> {/* Add Footer */}
    </>
  );
};

export default DiagnosticPlots;