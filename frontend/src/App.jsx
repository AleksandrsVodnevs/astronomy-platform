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
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import PublicProfile from './pages/PublicProfile';
import Admin from './pages/Admin';
import Materials from './pages/Materials';
import MaterialDetail from './pages/MaterialDetail';
import NotFound from './pages/NotFound';
import './App.css';
import Footer from './components/Footer';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

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
          <Route path="/forums/jauns" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
          <Route path="/materiali" element={<Materials />} />
          <Route path="/materiali/:id" element={<MaterialDetail />} />
          <Route path="/pieteikties" element={<Login />} />
          <Route path="/registreties" element={<Register />} />
          <Route path="/aizmirsu-paroli" element={<ForgotPassword />} />
          <Route path="/atjaunot-paroli/:token" element={<ResetPassword />} />
          <Route path="/profils" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/profils/:id" element={<PublicProfile />} />
          <Route path="/admin" element={<ProtectedRoute adminOnly={true}><Admin /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
          <Route path="/noteikumi" element={<Terms />} />
          <Route path="/privatums" element={<Privacy />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
export default App;
