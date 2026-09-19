import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';
import { supabase } from '../../lib/supabase';
import Button from '../../components/ui/Button';
import ErrorState from '../../components/ui/ErrorState';
import FormField from '../../components/ui/FormField';

function Login() {
  const { session, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isLoading && session) {
    return <Navigate to="/student" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        throw error;
      }

      const destination = location.state?.from?.pathname || '/student';
      navigate(destination, { replace: true });
    } catch (error) {
      setErrorMessage(error.message || 'Unable to sign in. Check your email and password and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card card">
        <h1>Sign in to CampusFix</h1>
        <p className="page__subtitle">Use your campus account to report and track issues.</p>

        <form onSubmit={handleSubmit} noValidate>
          <FormField label="Email" required htmlFor="login-email">
            <input
              id="login-email"
              className="field__input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </FormField>

          <FormField label="Password" required htmlFor="login-password">
            <input
              id="login-password"
              className="field__input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </FormField>

          {errorMessage ? <ErrorState title="Sign in failed" message={errorMessage} /> : null}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </section>
    </main>
  );
}

export default Login;
