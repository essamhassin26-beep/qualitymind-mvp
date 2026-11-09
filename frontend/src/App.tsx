import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PIRs from './pages/PIRs';
import Suppliers from './pages/Suppliers';
import Inspection from './pages/Inspection';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="pirs" element={<PIRs />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="inspection" element={<Inspection />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
