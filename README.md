# Front-end for Predictive Maintenance System

## Description
This is the frontend for a web-app example, primarily built in React, the back-end displays a dataset obtained from Kaggle on synthetic data generated for predictive maintenance. The following app allows you do some basic Exploratory Data Analysis (EDA) and check out some model diagnostics such as querying the model with different new inputs, performance metrics.

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

To install the front-end node.js dependices, use the command:

```sh
npm install
```

## Design and Major Decisions

### Software Design
The front-end of the Predictive Maintenance System is built using React, a popular JavaScript library for building user interfaces. The application follows a component-based architecture, which allows for modular and reusable code. Each component is responsible for a specific part of the user interface and can be composed together to build complex UIs.

### Major Design Decisions
1. **Component-Based Architecture**: The application is divided into multiple components, each handling a specific part of the UI. This makes the code more maintainable and reusable.
2. **State Management**: The application uses React's built-in state management for local component state. For global state management, a context API or a state management library like Redux can be used.
3. **Styling**: The application uses CSS modules for styling components. This ensures that styles are scoped to the component and do not leak to other parts of the application.
4. **Routing**: React Router is used for handling navigation within the application. This allows for a single-page application (SPA) experience with multiple views.
5. **API Integration**: The application communicates with the back-end via RESTful APIs. Axios is used for making HTTP requests to the back-end server.
6. **Testing**: Unit tests are written using Jest and React Testing Library to ensure the reliability of the components.

### Scalability and Use Case
1. **Scalability**: The application is designed to be scalable by following a component-based architecture. Each component is self-contained and can be developed, tested, and deployed independently. This allows the application to grow and handle more complex features without significant refactoring.
2. **Performance Optimization**: Lazy loading and code splitting are used to optimize the performance of the application. Only the necessary components are loaded initially, reducing the initial load time and improving the user experience.
3. **Responsive Design**: The application is designed to be responsive, ensuring that it works well on various devices and screen sizes. This is achieved using CSS media queries and flexible grid layouts.
4. **Use Case**: The primary use case of the application is to provide a user-friendly interface for performing Exploratory Data Analysis (EDA) and model diagnostics for a particular predictive maintenance dataset and model sets. It allows users to interact with the model, query it with new inputs, and view performance metrics. This makes it suitable for data scientists and engineers working on predictive maintenance projects. 

### Expanding Use Case
1. **Using Different Datasets**: The application can be easily adapted to work with different datasets by modifying the API endpoints and data processing logic. The standardized backend design ensures that the front-end can seamlessly interact with various datasets without significant changes to the codebase.
2. **Standardized Backend**: The backend follows a RESTful API design, which allows for consistent and predictable interactions between the front-end and back-end. This standardization makes it easier to integrate new datasets and models, as the front-end can rely on a consistent API structure.
3. **Modular Components**: The component-based architecture of the front-end allows for easy addition of new features and functionalities. For example, new components can be created to handle specific types of data visualizations or model diagnostics, making it straightforward to expand the application's capabilities.
4. **Customizable Queries**: The application can be extended to allow users to customize their queries and inputs to the model. This can be achieved by adding new input forms and validation logic, enabling users to interact with the model in more flexible ways.
5. **Enhanced Data Analysis**: Additional data analysis tools and visualizations can be integrated into the application to provide deeper insights into the datasets. This can include advanced statistical analysis, machine learning model comparisons, and interactive dashboards.

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

