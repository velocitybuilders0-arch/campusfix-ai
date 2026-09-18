import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import AdminDashboard from './pages/admin/AdminDashboard';
import NotFound from './pages/NotFound';
import IssueDetails from './pages/student/IssueDetails';
import MyIssues from './pages/student/MyIssues';
import NewIssue from './pages/student/NewIssue';
import StudentHome from './pages/student/StudentHome';

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Navigate to="/student" replace />} />
          <Route path="/student" element={<StudentHome />} />
          <Route path="/student/new" element={<NewIssue />} />
          <Route path="/student/issues" element={<MyIssues />} />
          <Route path="/student/issues/:issueId" element={<IssueDetails />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
