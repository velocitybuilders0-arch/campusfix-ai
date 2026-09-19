import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/ui/Card';

function AdminDashboard() {
  return (
    <>
      <PageHeader title="Admin dashboard" subtitle="Overview of campus issues and resolution activity." />
      <div className="grid">
        <Card>
          <h3>Admin tools coming online</h3>
          <p>
            Live statistics and management tools will appear here once the
            backend is connected.
          </p>
        </Card>
      </div>
    </>
  );
}

export default AdminDashboard;
