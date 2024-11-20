import React from 'react';
import './DataDescription.css'; // Ensure the CSS file is imported

const DataDescription = () => {
  return (
    <div className="card">
      <div className="data-description-container">
        <h2>Description</h2>
        <p>
          The following is an example of a React site with a Python Flask backend.
          The site is a predictive maintenance classification model that predicts whether a machine will fail based on the input features.
          This is based on the <a href="https://archive.ics.uci.edu/ml/datasets/AI4I+2020+Predictive+Maintenance+Dataset" target="_blank" rel="noopener noreferrer">UCI Machine Predictive Maintenance Classification Dataset</a>.
        </p>
        <ul>
          <li> Models are trained using a grid-search cross-validation approach, which can be found here: <a href="https://github.com/joseph-c-mcguire/webapp-example-backend/blob/main/train_model.py">GitHub Webapp-Example-Backend</a>.</li>
          <li> The frontend is built using React, and the backend is built using Flask.</li>
          <li> The GitHub can be found here: <a href="https://github.com/joseph-c-mcguire/webapp-example-frontend">GitHub Webapp-Example-Frontend</a>. </li>
        </ul>
        <h2>About Dataset</h2>
        <h3>Machine Predictive Maintenance Classification Dataset</h3>
        <p>
          Since real predictive maintenance datasets are generally difficult to obtain and in particular difficult to publish, we present and provide a synthetic dataset that reflects real predictive maintenance encountered in the industry to the best of our knowledge.
        </p>
        <p>The dataset consists of 10,000 data points stored as rows with 7 features in columns:</p>
        <ul>
          <li>Type: consisting of a letter L, M, or H for low (50% of all products), medium (30%), and high (20%) as product quality variants and a variant-specific serial number</li>
          <li>Air Temperature [K]: generated using a random walk process later normalized to a standard deviation of 2 K around 300 K</li>
          <li>Process Temperature [K]: generated using a random walk process normalized to a standard deviation of 1 K, added to the air temperature plus 10 K</li>
          <li>Rotational Speed [rpm]: calculated from power of 2860 W, overlaid with a normally distributed noise</li>
          <li>Torque [Nm]: torque values are normally distributed around 40 Nm with an σ = 10 Nm and no negative values</li>
          <li>Tool Wear [min]: The quality variants H/M/L add 5/3/2 minutes of tool wear to the used tool in the process</li>
          <li>Machine Failure: label that indicates whether the machine has failed in this particular data point for any of the following failure modes are true</li>
        </ul>
        <ul>
          <li>Target: Failure or Not</li>
        </ul>
        <p>Acknowledgements:</p>
        <ul>
          <li>UCI: <a href="https://archive.ics.uci.edu/ml/datasets/AI4I+2020+Predictive+Maintenance+Dataset" target="_blank" rel="noopener noreferrer">UCI Dataset</a></li>
          <li>Kaggle: <a href="https://www.kaggle.com/datasets/shivamb/machine-predictive-maintenance-classification" target="_blank" rel="noopener noreferrer">Kaggle Dataset</a></li>
        </ul>
      </div>
    </div>
  );
};

export default DataDescription;
