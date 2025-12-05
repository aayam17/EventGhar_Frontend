// frontend/src/App.jsx

// Import the Dashboard component from the pages directory
import Dashboard from './pages/Dashboard.jsx'; 
import './App.css'; // Keep the CSS import for global styles

function App() {
  // The App component now acts as the main router/layout holder, 
  // currently rendering only the Dashboard.
  return <Dashboard />;
}

export default App;