import './App.css';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import HomePage from './pages/homePages/HomePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
