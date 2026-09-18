import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getIssue } from '../../api/endpoints';
import { issuesFixture } from '../../api/fixtures/issues.fixture';
import IssueDetailLayout from '../../components/issues/IssueDetailLayout';
import ErrorState from '../../components/ui/ErrorState';
import Spinner from '../../components/ui/Spinner';
import { ASYNC, useAsyncState } from '../../hooks/useAsyncState';

function IssueDetails() {
  const { issueId } = useParams();
  const useFixtures = import.meta.env.VITE_USE_FIXTURES === 'true';

  const fetchIssue = useCallback(async () => {
    if (useFixtures) {
      // TEMPORARY fixture branch — remove when backend is live.
      await new Promise((resolve) => {
        setTimeout(resolve, 150);
      });
      return issuesFixture.find((item) => item.id === issueId) || null;
    }

    return getIssue(issueId);
  }, [issueId, useFixtures]);

  const { data: issue, loading, error, state, run } = useAsyncState(fetchIssue, null);

  useEffect(() => {
    if (issueId) {
      run();
    }
  }, [issueId, run]);

  if (loading || state === ASYNC.IDLE) {
    return <Spinner label="Loading issue..." />;
  }

  if (state === ASYNC.ERROR || error) {
    return <ErrorState title="Issue could not be loaded" message={error?.message || 'Unable to load issue details.'} />;
  }

  if (!issue) {
    return <ErrorState title="Issue not found" message={`No issue exists for ${issueId}.`} />;
  }

  return <IssueDetailLayout issue={issue} />;
}

export default IssueDetails;
