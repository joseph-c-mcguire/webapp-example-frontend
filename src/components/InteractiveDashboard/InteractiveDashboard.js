import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import './InteractiveDashboard.css'; // Import the CSS file
import { linearRegression, linearRegressionLine, rSquared, sampleCorrelation, sampleRankCorrelation } from 'simple-statistics'; // Import sampleRankCorrelation from simple-statistics

const InteractiveDashboard = () => {
	const [data, setData] = useState([]);
	const [xVariable, setXVariable] = useState('Air temperature [K]');
	const [yVariable, setYVariable] = useState('Process temperature [K]');
	const [colorVariable, setColorVariable] = useState('Target'); // Updated default value
	const [plotType, setPlotType] = useState('scatter');
	const [opacity, setOpacity] = useState(1); // Default opacity to 1
	const [bins, setBins] = useState(10); // New state for number of bins
	const [showLinearFit, setShowLinearFit] = useState(false); // New state for linear fit
	const [classNames, setClassNames] = useState([]); // Add state for class names
	const [correlationType, setCorrelationType] = useState('pearson'); // New state for correlation type

	// Load data from API
	useEffect(() => {
		const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://webapp-example-backend-6b9cff025ec9.herokuapp.com';
		axios.get(`${backendUrl}/api/helper/data`) // Use backendUrl with default
			.then(response => {
				setData(response.data || []); // Ensure data is defined
			})
			.catch(error => {
				console.error('Error fetching data:', error);
			});

		// Fetch class names from the backend
		axios.get(`${backendUrl}/api/helper/class-names`)
			.then(response => {
				setClassNames(response.data.class_names);
				console.log('Class Names:', response.data.class_names); // Added log
			})
			.catch(error => {
				console.error('Error fetching class names:', error);
			});
	}, []);

	const handleXChange = (event) => {
		setXVariable(event.target.value);
	};

	const handleYChange = (event) => {
		setYVariable(event.target.value);
	};

	const handleColorChange = (event) => {
		setColorVariable(event.target.value);
	};

	const handlePlotTypeChange = (event) => {
		setPlotType(event.target.value);
	};

	const handleOpacityChange = (event) => {
		setOpacity(parseFloat(event.target.value));
	};

	const handleBinsChange = (event) => {
		setBins(parseInt(event.target.value, 10));
	};

	const handleShowLinearFitChange = (event) => {
		setShowLinearFit(event.target.checked);
	};

	const handleCorrelationTypeChange = (event) => {
		setCorrelationType(event.target.value);
	};

	const uniqueCategories = [...new Set(data.map(d => d[colorVariable] !== undefined ? d[colorVariable] : 'Unknown'))];
	const categoryColors = uniqueCategories.map((_, index) => `hsl(${index * 360 / uniqueCategories.length}, 70%, 50%)`); // Generate unique colors
	let categoryLabels = uniqueCategories.map(category => category.toString() || 'Unknown');

	// Define 'targetLabels' based on the 'Target' variable in your data
	const targetLabels = [...new Set(data.map(d => d['Target'] !== undefined ? d['Target'] : 'Unknown'))];

	// Define 'typeLabels' based on the 'Type' variable in your data
	const typeLabels = [...new Set(data.map(d => d['Type'] !== undefined ? d['Type'] : 'Unknown'))];

	// Update the categoryLabels when 'Color by' is set to 'Target' or 'Type'
	if (colorVariable === 'Target') {
		categoryLabels = targetLabels.map(label => label.toString());
	} else if (colorVariable === 'Type') {
		categoryLabels = typeLabels.map(label => label.toString());
	}

	const scatterData = {
		x: data.map(d => d[xVariable] || 0),
		y: data.map(d => d[yVariable] || 0),
		type: 'scatter',
		mode: 'markers',
		marker: { 
			color: data.map(d => uniqueCategories.indexOf(d[colorVariable] !== undefined ? d[colorVariable] : 'Unknown')),
			colorscale: categoryColors.map((color, index) => [index / (uniqueCategories.length - 1), color]),
			showscale: false, // Disable continuous color scale
		},
		opacity: opacity, // Set opacity for scatter plots
		name: 'Data Points', // Name for the legend
	};

	const fitColors = ['turquoise', 'pink', 'orange', 'green', 'purple', 'black']; // Define more colors if needed

	const linearFitData = showLinearFit ? uniqueCategories.map((category, index) => {
		const filteredData = data.filter(d => d[colorVariable] === category);
		const xValues = filteredData.map(d => d[xVariable]);
		const yValues = filteredData.map(d => d[yVariable]);
		if (xValues.length === 0 || yValues.length === 0) {
			return null; // Skip if no data points
		}
		const regressionResult = linearRegression(filteredData.map(d => [d[xVariable], d[yVariable]]));
		const regressionLine = linearRegressionLine(regressionResult);
		const r2 = rSquared(filteredData.map(d => [d[xVariable], d[yVariable]]), regressionLine);
		return {
			x: [Math.min(...xValues), Math.max(...xValues)],
			y: [regressionLine(Math.min(...xValues)), regressionLine(Math.max(...xValues))],
			type: 'scatter',
			mode: 'lines',
			name: `Linear Fit (${categoryLabels[index]}): y = ${regressionResult.m.toFixed(2)}x + ${regressionResult.b.toFixed(2)} (R² = ${r2.toFixed(2)})`,
			line: {
				color: fitColors[index],
			},
		};
	}).filter(Boolean) : [];

	// Add linear fit for total data
	if (showLinearFit) {
		const totalXValues = data.map(d => d[xVariable]);
		const totalYValues = data.map(d => d[yVariable]);
		if (totalXValues.length > 0 && totalYValues.length > 0) {
			const totalRegressionResult = linearRegression(data.map(d => [d[xVariable], d[yVariable]]));
			const totalRegressionLine = linearRegressionLine(totalRegressionResult);
			const totalR2 = rSquared(data.map(d => [d[xVariable], d[yVariable]]), totalRegressionLine);
			linearFitData.push({
				x: [Math.min(...totalXValues), Math.max(...totalXValues)],
				y: [totalRegressionLine(Math.min(...totalXValues)), totalRegressionLine(Math.max(...totalXValues))],
				type: 'scatter',
				mode: 'lines',
				name: `Total Linear Fit: y = ${totalRegressionResult.m.toFixed(2)}x + ${totalRegressionResult.b.toFixed(2)} (R² = ${totalR2.toFixed(2)})`,
				line: {
					color: 'black',
				},
			});
		}
	}

	const plotData = plotType === 'scatter' ? [scatterData, ...linearFitData].filter(Boolean) : uniqueCategories.map((category, index) => ({
		x: data.filter(d => d[colorVariable] === category).map(d => d[xVariable]),
		y: data.filter(d => d[colorVariable] === category).map(() => 1),
		type: 'histogram',
		name: categoryLabels[index],
		marker: {
			color: categoryColors[index],
		},
		nbinsx: bins, // Set number of bins
	}));

	const barPlots = plotType === 'bar' ? uniqueCategories.map((category, index) => (
		<Plot
			key={category}
			data={[
				{
					x: data.filter(d => d[colorVariable] === category).map(d => d[xVariable]),
					y: data.filter(d => d[colorVariable] === category).map(() => 1),
					type: 'histogram',
					name: categoryLabels[index],
					marker: {
						color: categoryColors[index],
					},
					nbinsx: bins, // Set number of bins
				},
			]}
			layout={{
				title: `${categoryLabels[index]} Histogram`,
				xaxis: {
					title: xVariable, // Label for the x-axis
				},
				yaxis: {
					title: 'Counts', // Label for the y-axis
				},
				barmode: 'stack', // Stack bars for bar plot
				showlegend: false, // Hide legend for bar plot
			}}
		/>
	)) : null;

	const boxPlotData = uniqueCategories.map((category, index) => ({
		y: data.filter(d => d[colorVariable] === category).map(d => d[xVariable]), // Use xVariable for Y-axis
		x: Array(data.filter(d => d[colorVariable] === category).length).fill(categoryLabels[index]), // Use categoryLabels for X-axis
		type: 'box',
		name: categoryLabels[index],
		marker: {
			color: categoryColors[index],
		},
	}));

	const violinPlotData = uniqueCategories.map((category, index) => ({
		y: data.filter(d => d[colorVariable] === category).map(d => d[xVariable]), // Use xVariable for Y-axis
		x: Array(data.filter(d => d[colorVariable] === category).length).fill(categoryLabels[index]), // Use categoryLabels for X-axis
		type: 'violin',
		name: categoryLabels[index],
		marker: {
			color: categoryColors[index],
		},
	}));

	const calculateCorrelationMatrix = (data) => {
		const variables = Object.keys(data[0] || {});
		const matrix = variables.map((xVar) => {
			return variables.map((yVar) => {
				const xValues = data.map(d => d[xVar]);
				const yValues = data.map(d => d[yVar]);
				let corr = 0;
				if (xValues.length && yValues.length) {
					if (correlationType === 'pearson') {
						corr = sampleCorrelation(xValues, yValues); // Calculate Pearson's R
					} else if (correlationType === 'spearman') {
						corr = sampleRankCorrelation(xValues, yValues); // Calculate Spearman's Rank Correlation
					}
				}
				return corr;
			});
		});
		return { variables, matrix };
	};

	const { variables, matrix } = calculateCorrelationMatrix(data);

	const correlationHeatmap = {
		z: matrix,
		x: variables,
		y: variables,
		type: 'heatmap',
		colorscale: 'Viridis',
		showscale: true,
		zmin: -1, // Set minimum value for color scale
		zmax: 1,  // Set maximum value for color scale
	};

	return (
		<div className="dashboard-card">
			<h2>Interactive Data Analysis</h2> {/* Updated title */}
			<div className="controls">
				{plotType !== 'heatmap' && (
					<>
						<label className="control-label">
							X-axis:
							<select className="control-select" value={xVariable} onChange={handleXChange}>
								<option value="Air temperature [K]">Air temperature [K]</option>
								<option value="Process temperature [K]">Process temperature [K]</option>
								<option value="Rotational speed [rpm]">Rotational speed [rpm]</option>
								<option value="Torque [Nm]">Torque [Nm]</option>
								<option value="Tool wear [min]">Tool wear [min]</option>
							</select>
						</label>
						{plotType === 'scatter' && (
							<label className="control-label">
								Y-axis:
								<select className="control-select" value={yVariable} onChange={handleYChange}>
									<option value="Air temperature [K]">Air temperature [K]</option>
									<option value="Process temperature [K]">Process temperature [K]</option>
									<option value="Rotational speed [rpm]">Rotational speed [rpm]</option>
									<option value="Torque [Nm]">Torque [Nm]</option>
									<option value="Tool wear [min]">Tool wear [min]</option>
								</select>
							</label>
						)}
						<label className="control-label">
							Color by:
							<select className="control-select" value={colorVariable} onChange={handleColorChange}>
								<option value="Target">Target</option> {/* Updated option */}
								<option value="Failure Type">Failure Type</option> {/* Add option for Failure Type */}
								<option value="Type">Type</option> {/* Add option for Type */}
							</select>
						</label>
					</>
				)}
				<label className="control-label">
					Plot type:
					<select className="control-select" value={plotType} onChange={handlePlotTypeChange}>
						<option value="scatter">Scatter</option>
						<option value="bar">Bar</option>
						<option value="heatmap">Correlation Heatmap</option> {/* Add option for Correlation Heatmap */}
						<option value="box">Box Plot</option> {/* Add option for Box Plot */}
						<option value="violin">Violin Plot</option> {/* Add option for Violin Plot */}
					</select>
				</label>
				{plotType === 'heatmap' && (
					<label className="control-label">
						Correlation Type:
						<select className="control-select" value={correlationType} onChange={handleCorrelationTypeChange}>
							<option value="pearson">Pearson</option>
							<option value="spearman">Spearman</option>
						</select>
					</label>
				)}
				{plotType === 'scatter' && (
					<>
						<label className="control-label">
							Opacity:
							<div className="slider-container">
								<span className="slider-label">0</span>
								<input
									className="control-slider"
									type="range"
									value={opacity}
									onChange={handleOpacityChange}
									step="0.1"
									min="0"
									max="1"
								/>
								<span className="slider-value">{opacity}</span>
								<span className="slider-label">1</span>
							</div>
						</label>
						<label className="control-label">
							Show Linear Fit:
							<input
								className="control-checkbox"
								type="checkbox"
								checked={showLinearFit}
								onChange={handleShowLinearFitChange}
							/>
						</label>
					</>
				)}
				{plotType === 'bar' && (
					<label className="control-label">
						Bins:
						<div className="slider-container">
							<span className="slider-label">10</span>
							<input
								className="control-slider"
								type="range"
								value={bins}
								onChange={handleBinsChange}
								step="10"
								min="10"
								max="1000"
							/>
							<span className="slider-value">{bins}</span>
							<span className="slider-label">1000</span>
						</div>
					</label>
				)}
			</div>
			<div className="plot-container">
				{plotType === 'scatter' ? (
					<Plot
						data={plotData}
						layout={{
							xaxis: {
								title: xVariable, // Label for the x-axis
								automargin: true, // Ensure axis title is not cut off
							},
							yaxis: {
								title: yVariable, // Label for the y-axis
								automargin: true, // Ensure axis title is not cut off
							},
							showlegend: false, // Hide legend for scatter plot
							legend: {
								x: 1,
								y: 1,
								traceorder: 'normal',
								font: {
									family: 'sans-serif',
									size: 12,
									color: '#000',
								},
								bgcolor: '#E2E2E2',
								bordercolor: '#FFFFFF',
								borderwidth: 2,
							},
						}}
					/>
				) : plotType === 'bar' ? (
					barPlots
				) : plotType === 'box' ? (
					<Plot
						data={boxPlotData}
						layout={{
							title: 'Box Plot',
							xaxis: { title: colorVariable, automargin: true }, // Use colorVariable for X-axis title
							yaxis: { title: xVariable, automargin: true }, // Use xVariable for Y-axis title
						}}
					/>
				) : plotType === 'violin' ? (
					<Plot
						data={violinPlotData}
						layout={{
							title: 'Violin Plot',
							xaxis: { title: colorVariable, automargin: true }, // Use colorVariable for X-axis title
							yaxis: { title: xVariable, automargin: true }, // Use xVariable for Y-axis title
						}}
					/>
				) : (
					<Plot
						data={[correlationHeatmap]}
						layout={{
							title: 'Correlation Heatmap',
							xaxis: { title: 'Variables', automargin: true }, // Ensure axis title is not cut off
							yaxis: { title: 'Variables', automargin: true }, // Ensure axis title is not cut off
						}}
					/>
				)}
				<div className="custom-legend">
					{uniqueCategories.map((category, index) => (
						<div key={category} className="legend-item">
							<span className="legend-color" style={{ backgroundColor: categoryColors[index] }}></span>
							<span className="legend-label">{categoryLabels[index]}</span>
						</div>
					))}
					{plotType === 'scatter' && showLinearFit && linearFitData.map((fit, index) => (
						<div key={fit.name} className="legend-item">
							<span className="legend-color" style={{ backgroundColor: fitColors[index] }}></span>
							<span className="legend-label">{fit.name}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default InteractiveDashboard;
