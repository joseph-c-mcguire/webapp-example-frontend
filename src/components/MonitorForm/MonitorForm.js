import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MonitorForm.css'; // Import the CSS file
import Plot from 'react-plotly.js'; // Import Plotly for bar plot

const MonitorForm = ({ setResult }) => {
  // State to manage form data
  const [formData, setFormData] = useState({
    type: 'M',
    airTemperature: '300',
    processTemperature: '350',
    rotationalSpeed: '1500',
    torque: '50',
    toolWear: '10',
    modelName: 'Decision Tree', // Add modelName to formData
    resultType: 'probability' // Default to probability
  });
  // State to manage backend URL
  const [backendUrl, setBackendUrl] = useState('');
  // State to manage loading status
  const [loading, setLoading] = useState(false);
  // State to manage error messages
  const [error, setError] = useState(null);
  // State to manage available models
  const [availableModels, setAvailableModels] = useState([]);
  // State to manage probability result
  const [probabilityResult, setProbabilityResult] = useState(null);
  // State to manage class names
  const [classNames, setClassNames] = useState([]);

  // useEffect to fetch backend URL, available models, and class names
  useEffect(() => {
    const url = process.env.REACT_APP_BACKEND_URL || 'https://webapp-example-backend-6b9cff025ec9.herokuapp.com';
    setBackendUrl(url);
    console.log("Backend URL from env: ", url); // Log the backend URL for debugging

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

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Validate form inputs
  const validateForm = () => {
    const { type, airTemperature, processTemperature, rotationalSpeed, torque, toolWear } = formData;
    if (!type || !airTemperature || !processTemperature || !rotationalSpeed || !torque || !toolWear) {
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const endpoint = '/predict-probabilities'; // Added 'api/' prefix
      const requestData = {
        model_name: formData.modelName, // Use the specified model name
        data: [ // Wrap features inside an array
          {
            Type: formData.type,
            'Air temperature [K]': parseFloat(formData.airTemperature),
            'Process temperature [K]': parseFloat(formData.processTemperature),
            'Rotational speed [rpm]': parseInt(formData.rotationalSpeed, 10),
            'Torque [Nm]': parseFloat(formData.torque),
            'Tool wear [min]': parseInt(formData.toolWear, 10)
          }
        ]
      };
      const response = await axios.post(`${backendUrl}/${endpoint}`, requestData);
      setResult(response.data);
      setProbabilityResult(response.data.probabilities[0] || []); // Ensure probabilities are defined
    } catch (error) {
      console.error('Error predicting model performance:', error);
      const errorMessage = error.response && error.response.data ? JSON.stringify(error.response.data) : error.message;
      setError(`There was an error processing your request: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="monitor-form-container">
      <h2>Model Query</h2>
      <form onSubmit={handleSubmit} className="monitor-form">
        {/* Form fields for input */}
        <div className="form-group">
          <label htmlFor="type">Quality of the item:</label>
          <select id="type" name="type" value={formData.type} onChange={handleChange}>
            <option value="">Select Quality</option>
            <option value="L">Low</option>
            <option value="M">Medium</option>
            <option value="H">High</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="airTemperature">Air Temperature [K]:</label>
          <input
            id="airTemperature"
            type="text"
            name="airTemperature"
            value={formData.airTemperature}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="processTemperature">Process Temperature [K]:</label>
          <input
            id="processTemperature"
            type="text"
            name="processTemperature"
            value={formData.processTemperature}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="rotationalSpeed">Rotational Speed [rpm]:</label>
          <input
            id="rotationalSpeed"
            type="text"
            name="rotationalSpeed"
            value={formData.rotationalSpeed}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="torque">Torque [Nm]:</label>
          <input
            id="torque"
            type="text"
            name="torque"
            value={formData.torque}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="toolWear">Tool Wear [min]:</label>
          <input
            id="toolWear"
            type="text"
            name="toolWear"
            value={formData.toolWear}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="modelName">Model Name:</label>
          <select id="modelName" name="modelName" value={formData.modelName} onChange={handleChange}>
            {availableModels.map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="submit-button" disabled={loading} role="button" name="submit">
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      {loading && <div className="spinner"></div>}
      {error && <p className="error-message">{error}</p>}
      {probabilityResult && classNames.length > 0 && (
        <div className="probability-result">
          <h3>Probability Result:</h3>
          <Plot
            data={[
              {
                x: classNames,
                y: probabilityResult.map(prob => prob.toFixed(4)),
                type: 'bar',
                marker: { color: 'blue' },
              },
            ]}
            layout={{ title: 'Class Probabilities', xaxis: { title: 'Class', automargin: true }, yaxis: { title: 'Probability', automargin: true } }} // Ensure axis titles are not cut off
          />
        </div>
      )}
    </div>
  );
};

export default MonitorForm;