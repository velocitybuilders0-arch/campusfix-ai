import { useCallback, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getIssue } from '../../api/endpoints';
import { issuesFixture } from '../../api/fixtures/issues.fixture';
import IssueDetailLayout from '../../components/issues/IssueDetailLayout';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import Spinner from '../../components/ui/Spinner';
import { ASYNC, useAsyncState } from '../../hooks/useAsyncState';

const USE_FIXTURES = import.meta.env.VITE_USE_FIXTURES === 'true';

function IssueDetails() {
  const { issueId } = useParams();

  const fetchIssue = useCallback(async () => {
    if (USE_FIXTURES) {
      // TEMPORARY fixture branch — remove when backend is live.
      await new Promise((resolve) => setTimeout(resolve, 150));
      return issuesFixture.find((item) => item.id === issueId) || null;
    }
    return getIssue(issueId);
  }, [issueId]);

  const { data: issue, loading, error, state, run } = useAsyncState(fetchIssue, null);

  useEffect(() => {
    if (issueId) {
      run().catch(() => {});
    }
  }, [issueId, run]);

  const backLink = (
    <p style={{ marginBottom: '1rem' }}>
      <Link to="/student/issues">← Back to issues</Link>
    </p>
  );

  if (loading || state === ASYNC.IDLE) {
    return (
      <>
        {backLink}
        <Spinner label="Loading issue…" />
      </>
    );
  }

  if (state === ASYNC.ERROR || error) {
    return (
      <>
        {backLink}
        <ErrorState
          title="Could not load issue"
          message={error?.message || 'Unable to load issue details.'}
          onRetry={() => { run().catch(() => {}); }}
        />
      </>
    );
  }

  if (!issue) {
    return (
      <>
        {backLink}
        <EmptyState
          title="Issue not found"
          description={`No issue exists for ${issueId}.`}
          action={<Link to="/student/issues">Back to My Issues</Link>}
        />
      </>
    );
  }

  return (
    <>
      {backLink}
      <IssueDetailLayout issue={issue} />
    </>
  );
}

export default IssueDetails;
