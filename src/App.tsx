import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components';
import { Dashboard, Projects, MaterialRequests, RecentRequests } from './pages';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-page-ink">
        <Sidebar />
        <main className="transition-all duration-300 lg:ml-64 min-w-0">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/requests" element={<MaterialRequests />} />
            <Route path="/recent" element={<RecentRequests />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;