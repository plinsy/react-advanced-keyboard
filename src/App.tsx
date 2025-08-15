import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FullDemo, Demo, BackspaceDemo, NotFound } from './pages';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FullDemo />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/backspace-demo" element={<BackspaceDemo />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
