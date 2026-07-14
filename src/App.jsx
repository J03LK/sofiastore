import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Catalog from './pages/Catalog/Catalog';
import Product from './pages/Product/Product';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import NotFound from './pages/NotFound/NotFound';
import Layout from './components/layout/Layout';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/shared/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="catalog" element={<Catalog />} />
          <Route path="product/:id" element={<Product />} />
          <Route path="login" element={<Login />} />
          <Route path="dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
