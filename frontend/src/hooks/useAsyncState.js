import { useCallback, useState } from 'react';

export const ASYNC = Object.freeze({
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
});

export function useAsyncState(asyncFn, initialValue = null) {
  const [data, setData] = useState(initialValue);
  const [state, setState] = useState(ASYNC.IDLE);
  const [error, setError] = useState(null);

  const run = useCallback(
    async (...args) => {
      setState(ASYNC.LOADING);
      setError(null);

      try {
        const result = await asyncFn(...args);
        setData(result);
        setState(ASYNC.SUCCESS);
        return result;
      } catch (err) {
        setError(err);
        setState(ASYNC.ERROR);
        throw err;
      }
    },
    [asyncFn],
  );

  return {
    data,
    state,
    loading: state === ASYNC.LOADING,
    error,
    run,
    setData,
  };
}

export default useAsyncState;
