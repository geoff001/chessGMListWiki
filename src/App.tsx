import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GrandmasterList from './components/GrandmasterList';
import GrandmasterProfile from './components/GrandmasterProfile';
import './App.css'

const App = () => {
  return (
    <Router basename="/chessGMListWiki">
      <div className="App">
        <Routes>
          <Route path="/" element={<GrandmasterList />} />
          <Route path="/profile/:username" element={<GrandmasterProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App