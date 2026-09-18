import { useMemo } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import IssueCard from '../../components/issues/IssueCard';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';
import { issuesFixture } from '../../api/fixtures/issues.fixture';

function MyIssues() {
  const useFixtures = import.meta.env.VITE_USE_FIXTURES === 'true';
  const issues = useMemo(() => (useFixtures ? issuesFixture : []), [useFixtures]);

  return (
    <>
      <PageHeader
        title="My issues"
        subtitle="Review the status of your campus service requests."
        actions={<Button type="button" variant="secondary">Filter</Button>}
      />

      {issues.length === 0 ? (
        <EmptyState title="No issues yet" description="You have not submitted any issues." />
      ) : (
        <div className="grid">
          {issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      )}
    </>
  );
}

export default MyIssues;
