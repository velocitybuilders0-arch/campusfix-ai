import { Link } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

function StudentHome() {
  return (
    <>
      <PageHeader
        title="Welcome back"
        subtitle="Track campus issues and submit new service requests."
        actions={
          <Link to="/student/new">
            <Button type="button">Report an issue</Button>
          </Link>
        }
      />

      <Card>
        <h3>Campus overview</h3>
        <p>
          Live statistics will appear here once the backend is connected. For now, use My Issues to view and track reported issues.
        </p>
      </Card>
    </>
  );
}

export default StudentHome;
