import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/ui/Card';

function AdminDashboard() {
  return (
    <>
      <PageHeader title="Admin dashboard" subtitle="Placeholder dashboard for Phase 1." />
      <div className="grid">
        <Card className="issue-card">
          <h3>Pending assignments</h3>
          <p>4 issues awaiting review.</p>
        </Card>
        <Card className="issue-card">
          <h3>Resolved today</h3>
          <p>6 issues closed successfully.</p>
        </Card>
        <Card className="issue-card">
          <h3>Escalations</h3>
          <p>2 items require managerial review.</p>
        </Card>
      </div>
    </>
  );
}

export default AdminDashboard;
