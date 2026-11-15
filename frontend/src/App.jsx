import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HealthPage from './pages/HealthPage.jsx';
import TransferenciasPage from './pages/TransferenciasPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TransferenciasPage />} />
        <Route path="/health" element={<HealthPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
