import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Forum from './pages/Forum';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import './App.css';

const ProtectedRoute = ({ children, adminOnly }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Ielādē...</div>;
  if (!user) return <Login />;
  if (adminOnly && user.role !== 'admin') return <div className="error">Piekļuve liegta</div>;
  return children;
};

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/zinas" element={<News />} />
          <Route path="/zinas/:id" element={<NewsDetail />} />
          <Route path="/forums" element={<Forum />} />
          <Route path="/forums/:id" element={<PostDetail />} />
          <Route path="/forums/jauns" element={
            <ProtectedRoute><CreatePost /></ProtectedRoute>
          } />
          <Route path="/pieteikties" element={<Login />} />
          <Route path="/registreties" element={<Register />} />
          <Route path="/profils" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}><Admin /></ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;