import { useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listIssues } from '../../api/endpoints';
import { issuesFixture } from '../../api/fixtures/issues.fixture';
import IssueCard from '../../components/issues/IssueCard';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import Spinner from '../../components/ui/Spinner';
import { ASYNC, useAsyncState } from '../../hooks/useAsyncState';

const USE_FIXTURES = import.meta.env.VITE_USE_FIXTURES === 'true';

function StudentHome() {
  const fetchIssues = useCallback(async () => {
    if (USE_FIXTURES) {
      await new Promise((resolve) => setTimeout(resolve, 150));
      return issuesFixture;
    }
    return listIssues();
  }, [USE_FIXTURES]);

  const { data: response, loading, error, state, run } = useAsyncState(fetchIssues, null);

  useEffect(() => {
    run().catch(() => {});
  }, [run]);

  const allIssues = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
      ? response.data
      : [];

  const recent = [...allIssues]
    .sort((a, b) => {
      const aTime = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, 3);

  return (
    <>
      <PageHeader
        title="Welcome back"
        subtitle="Track campus issues and submit new service requests."
        actions={
          <Link to="/student/new">
            <Button type="button" variant="primary">Report an issue</Button>
          </Link>
        }
      />

      <section className="dashboard-recent">
        <div className="dashboard-recent__head">
          <h2 className="dashboard-recent__title">Recent activity</h2>
        </div>

        {loading ? <Spinner label="Loading issues…" /> : null}

        {!loading && state === ASYNC.ERROR ? (
          <ErrorState
            title="Could not load recent issues"
            message={error?.message || 'Something went wrong loading issues.'}
            onRetry={() => { run().catch(() => {}); }}
          />
        ) : null}

        {!loading && state === ASYNC.SUCCESS && recent.length === 0 ? (
          <EmptyState
            title="No issues reported yet"
            description="Submit the first campus issue to get started."
            action={
              <Link to="/student/new">
                <Button type="button">Report an issue</Button>
              </Link>
            }
          />
        ) : null}

        {!loading && state === ASYNC.SUCCESS && recent.length > 0 ? (
          <>
            <div className="dashboard-recent__grid">
              {recent.map((issue) => <IssueCard key={issue.id} issue={issue} />)}
            </div>
            <div className="dashboard-recent__footer">
              <Link to="/student/issues" className="dashboard-recent__viewall">
                View all issues →
              </Link>
            </div>
          </>
        ) : null}
      </section>
    </>
  );
}

export default StudentHome;
