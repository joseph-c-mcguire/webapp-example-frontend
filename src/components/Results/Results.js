import React from 'react';
import './Results.css'; // Import the CSS file

const Results = ({ result, handleNewEntry }) => {
  return (
    <div className="results-container">
      {result ? (
        <div className="results">
          <h3>Results</h3>
          <p>Predicted Class: {result.prediction}</p>
          <button onClick={handleNewEntry} className="new-entry-button">Enter New Data</button>
        </div>
      ) : (
        <p>No results to display.</p>
      )}
    </div>
  );
};

export default Results;