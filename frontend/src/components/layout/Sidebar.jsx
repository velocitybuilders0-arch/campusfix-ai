import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Sidebar navigation">
      <div className="sidebar__brand">CampusFix</div>
      <nav className="sidebar__nav">
        <NavLink className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`.trim()} to="/student">
          Home
        </NavLink>
        <NavLink className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`.trim()} to="/student/new">
          Submit issue
        </NavLink>
        <NavLink className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`.trim()} to="/student/issues">
          My issues
        </NavLink>
        <NavLink className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`.trim()} to="/admin">
          Admin dashboard
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
