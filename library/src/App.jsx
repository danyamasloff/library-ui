import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container } from '@mui/material';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

// Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';

function App() {
    const { isAuthenticated } = useSelector((state) => state.auth);

    return (
        <>
            <Header />
            <Container component="main" sx={{ py: 4, flexGrow: 1 }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/dashboard"
                        element={isAuthenticated ? <Dashboard /> : <Login />}
                    />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Container>
            <Footer />
        </>
    );
}

export default App;