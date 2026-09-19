import Navbar from './Navbar';
import Sidebar from './Sidebar';

function AppShell({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-shell__content">
        <Navbar />
        <main className="page">{children}</main>
      </div>
    </div>
  );
}

export default AppShell;
