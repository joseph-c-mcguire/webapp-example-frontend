import React from 'react';
import './DataDescription.css'; // Ensure the CSS file is imported

// Functional component to display data description
const DataDescription = () => {
  return (
      <div className="data-description-container">
        <h2>Description</h2>
        <p>
          {/* Brief introduction about the website and its purpose */}
          Welcome! This is a React website built to deploy a scikit-learn classification model trained on a University of California, Irvine dataset.
          The back-end and deployment of the model are through a Flask backend.
        </p>
        <p>
          {/* Description of the predictive maintenance classification model */}
          The site is a predictive maintenance classification model that predicts whether a machine will fail based on the input features.
          This is based on the <a href="https://archive.ics.uci.edu/ml/datasets/AI4I+2020+Predictive+Maintenance+Dataset" target="_blank" rel="noopener noreferrer">UCI Machine Predictive Maintenance Classification Dataset</a>.
        </p>
        <ul>
          {/* List of key points about the project */}
          <li> Models are trained using a grid-search cross-validation approach, which can be found here: <a href="https://github.com/joseph-c-mcguire/webapp-example-backend/blob/main/train_model.py">GitHub Webapp-Example-Backend</a>.</li>
          <li> The frontend is built using React, and the backend is built using Flask.</li>
          <li> The GitHub can be found here: <a href="https://github.com/joseph-c-mcguire/webapp-example-frontend">GitHub Webapp-Example-Frontend</a>. </li>
        </ul>
        <h2>About the Dataset</h2>
        <h3>Machine Predictive Maintenance Classification Dataset</h3>
        <p>
          {/* Information about the dataset */}
          Since real predictive maintenance datasets are generally difficult to obtain and in particular difficult to publish, we present and provide a synthetic dataset that reflects real predictive maintenance encountered in the industry to the best of our knowledge.
        </p>
        <p>The dataset consists of 10,000 data points stored as rows with 14 features in columns:</p>
        <ul>
          {/* List of dataset features */}
          <li><strong>UID:</strong> unique identifier ranging from 1 to 10000</li>
          <li><strong>Product ID:</strong> consisting of a letter L, M, or H for low (50% of all products), medium (30%), and high (20%) as product quality variants and a variant-specific serial number</li>
          <li><strong>Air Temperature [K]:</strong> generated using a random walk process later normalized to a standard deviation of 2 K around 300 K</li>
          <li><strong>Process Temperature [K]:</strong> generated using a random walk process normalized to a standard deviation of 1 K, added to the air temperature plus 10 K</li>
          <li><strong>Rotational Speed [rpm]:</strong> calculated from a power of 2860 W, overlaid with a normally distributed noise</li>
          <li><strong>Torque [Nm]:</strong> torque values are normally distributed around 40 Nm with an σ = 10 Nm and no negative values</li>
          <li><strong>Tool Wear [min]:</strong> The quality variants H/M/L add 5/3/2 minutes of tool wear to the used tool in the process</li>
          <li><strong>Machine Failure:</strong> label that indicates whether the machine has failed in this particular data point for any of the following failure modes are true</li>
          <li><strong>Target:</strong> Failure or Not</li>
          <li><strong>Failure Type:</strong> Type of Failure</li>
        </ul>
        <h3>Failure Modes</h3>
        <p>The machine failure consists of five independent failure modes:</p>
        <ul>
          {/* List of failure modes */}
          <li><strong>Tool Wear Failure (TWF):</strong> the tool will be replaced or fail at a randomly selected tool wear time between 200 – 240 mins (120 times in our dataset). At this point in time, the tool is replaced 69 times, and fails 51 times (randomly assigned).</li>
          <li><strong>Heat Dissipation Failure (HDF):</strong> heat dissipation causes a process failure if the difference between air- and process temperature is below 8.6 K and the tool’s rotational speed is below 1380 rpm. This is the case for 115 data points.</li>
          <li><strong>Power Failure (PWF):</strong> the product of torque and rotational speed (in rad/s) equals the power required for the process. If this power is below 3500 W or above 9000 W, the process fails, which is the case 95 times in our dataset.</li>
          <li><strong>Overstrain Failure (OSF):</strong> if the product of tool wear and torque exceeds 11,000 minNm for the L product variant (12,000 M, 13,000 H), the process fails due to overstrain. This is true for 98 datapoints.</li>
          <li><strong>Random Failures (RNF):</strong> each process has a chance of 0.1% to fail regardless of its process parameters. This is the case for only 5 datapoints, less than could be expected for 10,000 datapoints in our dataset.</li>
        </ul>
        <p>If at least one of the above failure modes is true, the process fails and the 'machine failure' label is set to 1. It is therefore not transparent to the machine learning method, which of the failure modes has caused the process to fail.</p>
        <h3>Acknowledgements</h3>
        <ul>
          {/* Acknowledgements for dataset sources */}
          <li>UCI: <a href="https://archive.ics.uci.edu/ml/datasets/AI4I+2020+Predictive+Maintenance+Dataset" target="_blank" rel="noopener noreferrer">UCI Dataset</a></li>
          <li>Kaggle: <a href="https://www.kaggle.com/datasets/shivamb/machine-predictive-maintenance-classification" target="_blank" rel="noopener noreferrer">Kaggle Dataset</a></li>
        </ul>
      </div>
  );
};

export default DataDescription;
