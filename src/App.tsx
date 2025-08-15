import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FullDemo, Demo, BackspaceDemo, NotFound, TypingTest } from './pages';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FullDemo />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/backspace-demo" element={<BackspaceDemo />} />
        <Route path="/typing-test" element={<TypingTest />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
