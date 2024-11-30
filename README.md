# Front-end for Predictive Maintenance System

## Overview
The Predictive Maintenance System is a web application designed to perform Exploratory Data Analysis (EDA) and model diagnostics on a predictive maintenance dataset. The frontend is built using React and communicates with a backend server to fetch and display data. The application allows users to interact with the model, query it with new inputs, and view performance metrics.

## Description
This is the front-end for serving a set of machine learning models trained on a [UCI predictive maintenance dataset](https://archive.ics.uci.edu/ml/datasets/AI4I+2020+Predictive+Maintenance+Dataset). 
The back-end API can be found here: [https://github.com/joseph-c-mcguire/webapp-example-backend](https://github.com/joseph-c-mcguire/webapp-example-backend).
This is built on top of Node.js's React framework, as is partly a learning exercise for myself to get comfortable and build a web application using React.

The design of the application is:
- **Interactive Design** Design that allows for interactivity of the user in terms of diagnosing and understanding the data set being used and the models that are trained on it.
- **Component-Wise Features** Building out new visual elements for the webapplication by building out new components that are managed by `src/App.js`.
- **Test-Driven Development** By using unit tests and CI pipeline through GitHub Actions, I'll ensure that compatibility with the back-end is maintained and that the web app isn't crashing.
- **Heroku Deployment** Uses Heroku for deploying and hosting the web application, you can find the website served here: [https://webapp-example-frontend-56f2ec31cf0a.herokuapp.com/model-diagnostics](https://webapp-example-frontend-56f2ec31cf0a.herokuapp.com/model-diagnostics)


## Running the Front-end
To run the front-end application, use the following command:

```sh
npm run start
```

This will start the development server and open the application in your default web browser. The application will be available at http://localhost.

## Running Unit Tests
To run the unit tests, use the following command:

This will launch the test runner in interactive watch mode. The tests will automatically re-run when you make changes to the code.
```sh
npm run test
```
## Installation

To install the front-end node.js dependencies, use the command:

```sh
npm install
```

### How to Use
1. **Installation**: Follow the instructions in the "Installation" section to install the necessary dependencies.
2. **Running the Application**: Use the command `npm run start` to start the development server and open the application in your default web browser.
3. **Running Unit Tests**: Use the command `npm run test` to run the unit tests in interactive watch mode.
4. **Building for Production**: Use the command `npm run build` to create a production build of the application.
5. **Serving the Production Build**: Use the command `npm run serve` to serve the production build locally.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm run start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

### `npm run serve`

This will serve the app in [https://localhost:3000](https://localhost:3000) based on the results from `npm run build`. This is used in production.

