import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import Header from '../Header/Header'; // Import Header
import Footer from '../Footer/Footer'; // Import Footer

const DiagnosticPlots = ({ data }) => {
  const [confusionMatrix, setConfusionMatrix] = useState([]); // Initialize as empty array
  const [rocCurve, setRocCurve] = useState({ fpr: [], tpr: [], roc_auc: 0 });
  const [featureImportance, setFeatureImportance] = useState({});
  const [featureNames, setFeatureNames] = useState([]);
  const [modelName, setModelName] = useState(''); // Default to empty
  const [availableModels, setAvailableModels] = useState([]); // Add state for available models
  const [classNames, setClassNames] = useState([]); // Add state for class names
  const [probabilities, setProbabilities] = useState([]); // Add state for probabilities
  const [loading, setLoading] = useState(false); // Add state for loading
  const [selectedClass, setSelectedClass] = useState(''); // New state for selected class

  useEffect(() => {
    const url = process.env.REACT_APP_BACKEND_URL || 'https://webapp-example-backend-6b9cff025ec9.herokuapp.com';

    // Fetch available models from the backend
    axios.get(`${url}/api/helper/available-models`)
      .then(response => {
        setAvailableModels(response.data.available_models);
        console.log('Available Models:', response.data.available_models); // Added log
      })
      .catch(error => {
        console.error('Error fetching available models:', error);
      });

    // Fetch class names from the backend
    axios.get(`${url}/api/helper/class-names`)
      .then(response => {
        setClassNames(response.data.class_names);
        console.log('Class Names:', response.data.class_names); // Added log
      })
      .catch(error => {
        console.error('Error fetching class names:', error);
      });
  }, []);

  useEffect(() => {
    if (classNames.length > 0 && !selectedClass) {
      setSelectedClass(classNames[0]); // Default to first class if not set
    }
  }, [classNames, selectedClass]);

  useEffect(() => {
    if (data.length > 0 && modelName) { // Remove classLabel from condition
      const url = process.env.REACT_APP_BACKEND_URL || 'https://webapp-example-backend-6b9cff025ec9.herokuapp.com';
      setLoading(true);

      // Fetch confusion matrix from the backend without class_label
      axios.post(`${url}/api/diagnostics/confusion-matrix`, { model_name: modelName }) // Remove class_label
        .then(response => {
          setConfusionMatrix(response.data.confusion_matrix);
          console.log('Confusion Matrix:', response.data.confusion_matrix); // Log the confusion matrix
        })
        .catch(error => console.error('Error fetching confusion matrix:', error));

      // Fetch ROC curve data from the backend
      axios.post(`${url}/api/diagnostics/roc-curve`, { model_name: modelName }) // Remove class_label if not needed
        .then(response => {
          setRocCurve(response.data);
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
      axios.post(`${url}/api/predict-probabilities`, { data, model_name: modelName }) // Use url with default
        .then(response => {
          console.log('Prediction Probabilities:', response.data.probabilities); // Log the probabilities
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
  }, [data, modelName]); // Remove classLabel from dependencies

  // 1. Verify and Log probabilities Structure
  useEffect(() => {
    console.log('Current Selected Class:', selectedClass);
    console.log('Probability Results:', probabilities);
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
        {loading ? (
          <div>Loading...</div>
        ) : (
          modelName ? ( // Remove classLabel condition
            <>
              <h2>Confusion Matrix</h2>
              {confusionMatrix.length > 0 ? (
                // Update the Plotly heatmap configuration
                <Plot
                  data={[
                    {
                      z: confusionMatrix,
                      type: 'heatmap',
                      colorscale: 'Viridis',
                      showscale: true,
                      text: confusionMatrix.map(row => row.map(value => `Count: ${value}`)),
                      hoverinfo: 'text',
                    },
                  ]}
                  layout={{
                    title: 'Confusion Matrix',
                    annotations: confusionMatrix.flatMap((row, i) =>
                      row.map((value, j) => ({
                        x: classNames[j],
                        y: classNames[i],
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
                      automargin: true,
                    },
                    yaxis: {
                      title: 'True Label',
                      tickmode: 'array',
                      tickvals: classNames.map((_, index) => index),
                      ticktext: classNames,
                      automargin: true,
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
                  xaxis: { title: 'Features', automargin: true },
                  yaxis: { title: 'Importance', automargin: true },
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
                  xaxis: { title: 'False Positive Rate' },
                  yaxis: { title: 'True Positive Rate' },
                  showlegend: true,
                }}
              />
              <h2>Prediction Probabilities</h2>
              {probabilities.length > 0 && selectedClass ? (
                <Plot
                  data={[
                    {
                      x: probabilities
                        .map(prob => {
                          const value = prob[selectedClass];
                          if (value === undefined) {
                            console.warn(`Selected class "${selectedClass}" not found in probability object:`, prob);
                          }
                          return value;
                        })
                        .filter(val => typeof val === 'number' && !isNaN(val)),
                      type: 'histogram',
                      marker: { color: 'green' },
                    },
                  ]}
                  layout={{
                    title: `Prediction Probabilities for ${selectedClass}`,
                    xaxis: { title: 'Probability' },
                    yaxis: { title: 'Count' },
                  }}
                />
              ) : (
                <p>No prediction probabilities to display.</p>
              )}
            </>
          ) : (
            <div>Please select a model to view the diagnostic plots.</div>
          )
        )}
      </div>
      <Footer />
    </>
  );
};

export default DiagnosticPlots;