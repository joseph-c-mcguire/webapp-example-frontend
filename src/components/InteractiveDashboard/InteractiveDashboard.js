import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import './InteractiveDashboard.css'; // Import the CSS file
import { linearRegression, linearRegressionLine, rSquared } from 'simple-statistics'; // Import simple-statistics library

const InteractiveDashboard = () => {
	const [data, setData] = useState([]);
	const [xVariable, setXVariable] = useState('Air temperature [K]');
	const [yVariable, setYVariable] = useState('Process temperature [K]');
	const [colorVariable, setColorVariable] = useState('Target'); // Updated default value
	const [plotType, setPlotType] = useState('scatter');
	const [opacity, setOpacity] = useState(0.1); // New state for opacity
	const [bins, setBins] = useState(10); // New state for number of bins
	const [showLinearFit, setShowLinearFit] = useState(false); // New state for linear fit

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

	const uniqueCategories = [...new Set(data.map(d => d[colorVariable] || 'Unknown'))];
	const categoryColors = uniqueCategories.map((_, index) => `hsl(${index * 360 / uniqueCategories.length}, 70%, 50%)`); // Generate unique colors
	const categoryLabels = uniqueCategories.map(category => category.toString() || 'Unknown');
	const fitColors = ['turquoise', 'pink']; // Colors for linear fits

	const scatterData = {
		x: data.map(d => d[xVariable] || 0),
		y: data.map(d => d[yVariable] || 0),
		type: 'scatter',
		mode: 'markers',
		marker: { 
			color: data.map(d => uniqueCategories.indexOf(d[colorVariable] || 'Unknown')),
			colorscale: categoryColors.map((color, index) => [index / (uniqueCategories.length - 1), color]),
			showscale: false, // Disable continuous color scale
		},
		opacity: opacity, // Set opacity for scatter plots
		name: 'Data Points', // Name for the legend
	};

	const linearFitData = showLinearFit ? uniqueCategories.map((category, index) => {
		const filteredData = data.filter(d => d[colorVariable] === category);
		const xValues = filteredData.map(d => d[xVariable]);
		const yValues = filteredData.map(d => d[yVariable]);
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
	}) : [];

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

	return (
		<div className="dashboard-card">
			<h2>Interactive Data Analysis</h2> {/* Updated title */}
			<div className="controls">
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
					</select>
				</label>
					<label className="control-label">
					Plot type:
					<select className="control-select" value={plotType} onChange={handlePlotTypeChange}>
						<option value="scatter">Scatter</option>
						<option value="bar">Bar</option>
					</select>
				</label>
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
							},
							yaxis: {
								title: yVariable, // Label for the y-axis
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
				) : (
					barPlots
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
