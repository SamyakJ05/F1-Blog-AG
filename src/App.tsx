import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Drivers from './pages/Drivers/Drivers';
import Calendar from './pages/Calendar/Calendar';
import Results from './pages/Results/Results';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
