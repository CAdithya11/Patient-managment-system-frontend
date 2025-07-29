import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PatientManagement from './pages/homePages/PatientManagementDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PatientManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
