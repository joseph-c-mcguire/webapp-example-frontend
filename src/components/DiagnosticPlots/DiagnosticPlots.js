import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';

const DiagnosticPlots = ({ data }) => {
  const [confusionMatrix, setConfusionMatrix] = useState([[0, 0], [0, 0]]);
  const [rocCurve, setRocCurve] = useState({ fpr: [], tpr: [], roc_auc: 0 });
  const [featureImportance, setFeatureImportance] = useState({});
  const [featureNames, setFeatureNames] = useState([]);
  const [modelName, setModelName] = useState('best_model'); // Add state for model name
  const [classLabel, setClassLabel] = useState(''); // Add state for class label
  const [availableModels, setAvailableModels] = useState([]); // Add state for available models
  const [classNames, setClassNames] = useState([]); // Add state for class names

  useEffect(() => {
    const url = process.env.REACT_APP_BACKEND_URL;

    // Fetch available models from the backend
    axios.get(`${url}/available-models`)
      .then(response => {
        setAvailableModels(response.data.available_models);
      })
      .catch(error => {
        console.error('Error fetching available models:', error);
      });

    // Fetch class names from the backend
    axios.get(`${url}/class-names`)
      .then(response => {
        setClassNames(response.data.class_names);
      })
      .catch(error => {
        console.error('Error fetching class names:', error);
      });
  }, []);

  useEffect(() => {
    if (data.length > 0 && classLabel) {
      // Fetch confusion matrix from the backend
      fetch(`${process.env.REACT_APP_BACKEND_URL}/confusion-matrix`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data, model_name: modelName, class_label: classLabel }) // Use the specified model name and class label
      })
        .then(response => response.json())
        .then(result => {
          setConfusionMatrix(result.confusion_matrix);
        })
        .catch(error => console.error('Error fetching confusion matrix:', error));

      // Fetch ROC curve data from the backend
      fetch(`${process.env.REACT_APP_BACKEND_URL}/roc-curve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data, model_name: modelName, class_label: classLabel }) // Use the specified model name and class label
      })
        .then(response => response.json())
        .then(result => {
          setRocCurve(result);
        })
        .catch(error => console.error('Error fetching ROC curve data:', error));

      // Fetch feature importance data from the backend
      fetch(`${process.env.REACT_APP_BACKEND_URL}/feature-importance?model_name=${modelName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(result => {
          setFeatureImportance(result.feature_importance);
        })
        .catch(error => console.error('Error fetching feature importance data:', error));

      // Fetch feature names from the backend
      fetch(`${process.env.REACT_APP_BACKEND_URL}/feature-names`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(result => {
          setFeatureNames(result.feature_names);
        })
        .catch(error => console.error('Error fetching feature names:', error));
    }
  }, [data, modelName, classLabel]); // Add modelName and classLabel as dependencies

  return (
    <div className="diagnostic-plots-container">
      <h2>Confusion Matrix</h2>
      <div className="form-group">
        <label htmlFor="modelName">Model Name:</label>
        <select id="modelName" value={modelName} onChange={(e) => setModelName(e.target.value)}>
          {availableModels.map(model => (
            <option key={model} value={model}>{model}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="classLabel">Class Label:</label>
        <select id="classLabel" value={classLabel} onChange={(e) => setClassLabel(e.target.value)}>
          {classNames.map(className => (
            <option key={className} value={className}>{className}</option>
          ))}
        </select>
      </div>
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
          xaxis: {
            title: 'Predicted Label',
            tickmode: 'array',
            tickvals: [0, 1],
            ticktext: ['Class 0', 'Class 1'],
          },
          yaxis: {
            title: 'True Label',
            tickmode: 'array',
            tickvals: [0, 1],
            ticktext: ['Class 0', 'Class 1'],
          },
        }}
      />
      <h2>ROC Curve</h2>
      <Plot
        data={[
          {
            x: rocCurve.fpr,
            y: rocCurve.tpr,
            type: 'scatter',
            mode: 'lines',
            name: `ROC Curve (AUC = ${rocCurve.roc_auc.toFixed(2)})`,
            line: { color: 'blue' },
          },
        ]}
        layout={{
          title: 'ROC Curve',
          xaxis: { title: 'False Positive Rate' },
          yaxis: { title: 'True Positive Rate' },
        }}
      />
      <h2>Feature Importance</h2>
      <Plot
        data={[
          {
            x: featureNames,
            y: featureNames.map(name => featureImportance[name] || 0),
            type: 'bar',
            marker: { color: 'orange' },
          },
        ]}
        layout={{
          title: 'Feature Importance',
          xaxis: { title: 'Features' },
          yaxis: { title: 'Importance' },
        }}
      />
    </div>
  );
};

export default DiagnosticPlots;