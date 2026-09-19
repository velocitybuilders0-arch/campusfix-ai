import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider';
import ProtectedRoute from './auth/ProtectedRoute';
import AppShell from './components/layout/AppShell';
import AdminDashboard from './pages/admin/AdminDashboard';
import NotFound from './pages/NotFound';
import IssueDetails from './pages/student/IssueDetails';
import MyIssues from './pages/student/MyIssues';
import NewIssue from './pages/student/NewIssue';
import StudentHome from './pages/student/StudentHome';
import Login from './pages/auth/Login';
import AdminIssueDetails from './pages/admin/AdminIssueDetails';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route path="/" element={<Navigate to="/student" replace />} />
              <Route path="/student" element={<StudentHome />} />
              <Route path="/student/new" element={<NewIssue />} />
              <Route path="/student/issues" element={<MyIssues />} />
              <Route path="/student/issues/:issueId" element={<IssueDetails />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/issues/:issueId" element={<AdminIssueDetails />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
