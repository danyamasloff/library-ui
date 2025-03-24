import { Routes, Route, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container } from '@mui/material';
import { AnimatePresence } from 'framer-motion';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Catalog from './pages/Catalog';
import NotFound from './pages/NotFound';

// Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';

function App() {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const location = useLocation();

    return (
        <>
            <Header />
            <Container component="main" sx={{ py: 4, flexGrow: 1, minHeight: 'calc(100vh - 200px)' }}>
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/dashboard"
                            element={isAuthenticated ? <Dashboard /> : <Login />}
                        />
                        <Route
                            path="/profile"
                            element={isAuthenticated ? <Profile /> : <Login />}
                        />
                        <Route path="/catalog" element={<Catalog />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </AnimatePresence>
            </Container>
            <Footer />
        </>
    );
}

export default App;