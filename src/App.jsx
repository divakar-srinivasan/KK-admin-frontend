import { BrowserRouter as Router , Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css'
import AddProject from './pages/addProject';

function App() {
  return(
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/addProject" element={<AddProject/>}/>
      </Routes>
    </Router>
  )
}

export default App
