// src/components/Nav.jsx
import { useNavigate } from 'react-router-dom';

function Nav() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    navigate('/');
  };

  return (
    <nav className="w-full flex justify-between items-center px-20 py-8 shadow-lg bg-[#1a202c]">
      <h1
        className="text-5xl font-bold tracking-wide text-gray-200 hover:text-white transition-all duration-300 cursor-pointer"
        onClick={() => navigate('/home')}
      >
        🚀 Projects
      </h1>

      <div className="flex gap-6">
        <button
          onClick={() => navigate('/addProject')}
          className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg text-lg font-semibold 
          hover:bg-green-700 transition-transform transform hover:scale-105"
        >
          ➕ Add Project
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg text-lg font-semibold 
          hover:bg-red-700 transition-transform transform hover:scale-105"
        >
          🔒 Logout
        </button>
      </div>
    </nav>
  );
}

export default Nav;
