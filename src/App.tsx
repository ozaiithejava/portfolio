import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { FloatingThemeToggle } from './components/FloatingThemeToggle';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Admin } from './pages/Admin';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-500 overflow-x-hidden selection:bg-primary/30 selection:text-primary">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>

        {/* Helper UI */}
        <FloatingThemeToggle />
      </div>
    </ThemeProvider>
  );
}

export default App;
