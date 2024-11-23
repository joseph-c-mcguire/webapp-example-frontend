import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import Header from '../Header/Header'; // Import Header
import Footer from '../Footer/Footer'; // Import Footer

const DiagnosticPlots = ({ data }) => {
  const [confusionMatrix, setConfusionMatrix] = useState([[0, 0], [0, 0]]);
  const [rocCurve, setRocCurve] = useState({ fpr: [], tpr: [], roc_auc: 0 });
  const [featureImportance, setFeatureImportance] = useState({});
  const [featureNames, setFeatureNames] = useState([]);
  const [modelName, setModelName] = useState(''); // Default to empty
  const [classLabel, setClassLabel] = useState(''); // Default to empty
  const [availableModels, setAvailableModels] = useState([]); // Add state for available models
  const [classNames, setClassNames] = useState([]); // Add state for class names
  const [probabilities, setProbabilities] = useState([]); // Add state for probabilities
  const [loading, setLoading] = useState(false); // Add state for loading

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
      const url = process.env.REACT_APP_BACKEND_URL;
      setLoading(true);

      // Fetch confusion matrix from the backend
      axios.post(`${url}/confusion-matrix`, { data, model_name: modelName, class_label: classLabel })
        .then(response => {
          setConfusionMatrix(response.data.confusion_matrix);
          setClassNames(response.data.labels); // Update class names from the response
        })
        .catch(error => console.error('Error fetching confusion matrix:', error));

      // Fetch ROC curve data from the backend
      axios.post(`${url}/roc-curve`, { data, model_name: modelName, class_label: classLabel })
        .then(response => {
          setRocCurve(response.data);
        })
        .catch(error => console.error('Error fetching ROC curve data:', error));

      // Fetch feature importance data from the backend
      axios.get(`${url}/feature-importance`, { params: { model_name: modelName } })
        .then(response => {
          setFeatureImportance(response.data.feature_importance);
        })
        .catch(error => console.error('Error fetching feature importance data:', error));

      // Fetch feature names from the backend
      axios.get(`${url}/feature-names`)
        .then(response => {
          setFeatureNames(response.data.feature_names);
        })
        .catch(error => console.error('Error fetching feature names:', error));

      // Fetch prediction probabilities from the backend
      axios.post(`${url}/predict-probabilities`, { data, model_name: modelName })
        .then(response => {
          setProbabilities(response.data.probabilities);
        })
        .catch(error => console.error('Error fetching prediction probabilities:', error))
        .finally(() => {
          setLoading(false);
        });
    }
  }, [data, modelName, classLabel]); // Add modelName and classLabel as dependencies

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
        <div className="form-group">
          <label htmlFor="classLabel">Class Label:</label>
          <select id="classLabel" value={classLabel} onChange={(e) => setClassLabel(e.target.value)}>
            <option value="">Select a class label</option>
            {classNames.map(className => (
              <option key={className} value={className}>{className}</option>
            ))}
          </select>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          modelName && classLabel ? (
            <>
              <h2>Confusion Matrix</h2>
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
              <h2>Feature Importance</h2>
              <Plot
                data={[
                  {
                    x: featureNames.length ? featureNames : ['Feature 1', 'Feature 2', 'Feature 3'],
                    y: featureNames.length ? featureNames.map(name => featureImportance[name] || 0) : [0, 0, 0],
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
              <Plot
                data={[
                  {
                    x: probabilities.length ? probabilities.map(prob => prob[1]) : [0, 0, 0], // Assuming binary classification
                    type: 'histogram',
                    marker: { color: 'green' },
                  },
                ]}
                layout={{
                  title: 'Prediction Probabilities',
                  xaxis: { title: 'Probability' },
                  yaxis: { title: 'Count' },
                }}
              />
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