import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MonitorForm.css'; // Import the CSS file

const MonitorForm = ({ setResult }) => {
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
  const [backendUrl, setBackendUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableModels, setAvailableModels] = useState([]); // Add state for available models
  const [probabilityResult, setProbabilityResult] = useState(null); // Add state for probability result
  const [classNames, setClassNames] = useState([]); // Add state for class names

  useEffect(() => {
    const url = process.env.REACT_APP_BACKEND_URL;
    setBackendUrl(url);
    console.log("Backend URL from env: ", url); // Log the backend URL for debugging

    // Fetch available models from the backend
    axios.get(`${url}/api/helper/available-models`)
      .then(response => {
        setAvailableModels(response.data.available_models);
      })
      .catch(error => {
        console.error('Error fetching available models:', error);
      });

    // Fetch class names from the backend
    axios.get(`${url}/api/helper/class-names`)
      .then(response => {
        setClassNames(response.data.class_names);
      })
      .catch(error => {
        console.error('Error fetching class names:', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const { type, airTemperature, processTemperature, rotationalSpeed, torque, toolWear } = formData;
    if (!type || !airTemperature || !processTemperature || !rotationalSpeed || !torque || !toolWear) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const endpoint = 'predict-probabilities';
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
      setProbabilityResult(response.data.probabilities[0]); // Set probability result
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
      {probabilityResult && (
        <div className="probability-result">
          <h3>Probability Result:</h3>
          <ul>
            {classNames.map((className, index) => (
              <li key={className}>{className}: {probabilityResult[index].toFixed(4)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MonitorForm;