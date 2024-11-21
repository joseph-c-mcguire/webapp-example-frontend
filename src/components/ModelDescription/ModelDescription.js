import React from 'react';
import './ModelDescription.css'; // Ensure the CSS file is imported

const ModelDescription = () => {
  return (
    <div className="model-description-container">
      <h2>Model Descriptions</h2>
      <ul>
        <li>
          <strong>Support Vector Machines (SVM):</strong> 
          A supervised learning model that analyzes data for classification and regression analysis.
          <ul>
            <li>Supports probability predictions: Yes (with probability=True)</li>
            <li>Supports feature importance: No (but can use coefficients for linear SVM)</li>
            <li>Supports multi-class predictions: Yes (using one-vs-rest or one-vs-one)</li>
            <li>Reference: <a href="https://scikit-learn.org/stable/modules/generated/sklearn.svm.SVC.html" target="_blank" rel="noopener noreferrer">Sklearn SVM</a></li>
          </ul>
        </li>
        <li>
          <strong>Gradient Boosting:</strong> 
          A machine learning technique for regression and classification problems, which produces a prediction model in the form of an ensemble of weak prediction models, typically decision trees.
          <ul>
            <li>Supports probability predictions: Yes</li>
            <li>Supports feature importance: Yes</li>
            <li>Supports multi-class predictions: Yes</li>
            <li>Reference: <a href="https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.GradientBoostingClassifier.html" target="_blank" rel="noopener noreferrer">Sklearn Gradient Boosting</a></li>
          </ul>
        </li>
        <li>
          <strong>Random Forest:</strong> 
          An ensemble learning method for classification, regression, and other tasks that operates by constructing a multitude of decision trees at training time.
          <ul>
            <li>Supports probability predictions: Yes</li>
            <li>Supports feature importance: Yes</li>
            <li>Supports multi-class predictions: Yes</li>
            <li>Reference: <a href="https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestClassifier.html" target="_blank" rel="noopener noreferrer">Sklearn Random Forest</a></li>
          </ul>
        </li>
        <li>
          <strong>Decision Tree:</strong> 
          A decision support tool that uses a tree-like model of decisions and their possible consequences, including chance event outcomes, resource costs, and utility.
          <ul>
            <li>Supports probability predictions: Yes</li>
            <li>Supports feature importance: Yes</li>
            <li>Supports multi-class predictions: Yes</li>
            <li>Reference: <a href="https://scikit-learn.org/stable/modules/generated/sklearn.tree.DecisionTreeClassifier.html" target="_blank" rel="noopener noreferrer">Sklearn Decision Tree</a></li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default ModelDescription;