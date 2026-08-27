import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SearchPage from './pages/SearchPage';
import CommerceDetailPage from './pages/CommerceDetailPage';
import FavoritesPage from './pages/FavoritesPage';
import AdminPage from './pages/AdminPage';
import CommerceProfilePage from './pages/CommerceProfilePage';
import MyProductsPage from './pages/MyProductsPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/recherche" replace />} />

          <Route path="/recherche" element={<SearchPage />} />
          <Route path="/commerces/:id" element={<CommerceDetailPage />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/favoris"
            element={
              <ProtectedRoute allowedRoles={['client']}>
                <FavoritesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mon-commerce"
            element={
              <ProtectedRoute allowedRoles={['commercant']}>
                <CommerceProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mes-produits"
            element={
              <ProtectedRoute allowedRoles={['commercant']}>
                <MyProductsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;