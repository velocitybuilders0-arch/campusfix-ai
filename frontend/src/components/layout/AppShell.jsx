import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

function AppShell() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-shell__content">
        <Navbar />
        <main className="page"><Outlet /></main>
      </div>
    </div>
  );
}

export default AppShell;
