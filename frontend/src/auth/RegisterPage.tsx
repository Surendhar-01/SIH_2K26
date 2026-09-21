import { useMemo, useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL, api } from '../api';
import { useAuth } from './AuthContext';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getPasswordScore(password: string) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z\d]/.test(password)) score += 1;
  return score;
}

function getPasswordStrength(score: number) {
  if (score <= 2) return { label: 'Weak', className: 'weak' };
  if (score <= 4) return { label: 'Good', className: 'good' };
  return { label: 'Strong', className: 'strong' };
}

export function RegisterPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const normalizedEmail = email.trim().toLowerCase();
  const passwordScore = getPasswordScore(password);
  const passwordStrength = getPasswordStrength(passwordScore);
  const validation = useMemo(
    () => ({
      fullName: fullName.trim().length >= 2,
      email: emailPattern.test(normalizedEmail),
      password: passwordScore === 5,
      confirmPassword: password.length > 0 && password === confirmPassword,
    }),
    [confirmPassword, fullName, normalizedEmail, password, passwordScore],
  );
  const isFormValid = Object.values(validation).every(Boolean);

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!isFormValid) {
      setError('Please complete all registration requirements.');
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post(`${API_BASE_URL}/auth/register`, {
        fullName: fullName.trim(),
        email: normalizedEmail,
        password,
      });
      setMessage('Account created successfully');
      window.setTimeout(() => navigate('/login', { replace: true }), 900);
    } catch (registerError) {
      if (axios.isAxiosError(registerError) && registerError.response?.status === 409) {
        setError('An account with this email already exists.');
      } else if (axios.isAxiosError(registerError) && !registerError.response) {
        setError('Unable to reach authentication server.');
      } else {
        setError('Unable to create account. Please check the form and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <div className="thermal-background" aria-hidden="true">
        <span className="thermal-line line-one" />
        <span className="thermal-line line-two" />
        <span className="thermal-line line-three" />
        <span className="thermal-particle particle-one" />
        <span className="thermal-particle particle-two" />
        <span className="thermal-particle particle-three" />
        <span className="thermal-particle particle-four" />
      </div>

      <section className="login-card register-card" aria-labelledby="register-title">
        <div className="login-brand-row">
          <div className="brand-mark login-mark">TS</div>
          <div>
            <p className="login-kicker">Thermal Engineering Access</p>
            <h1 id="register-title">Create Account</h1>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-field field-delay-one">
            <span>Full Name</span>
            <input
              autoComplete="name"
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Aarav Sharma"
              required
              type="text"
              value={fullName}
            />
            {fullName && !validation.fullName && <small>Full name is required.</small>}
          </label>

          <label className="login-field field-delay-two">
            <span>Email Address</span>
            <input
              autoComplete="email"
              inputMode="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="engineer@thermoshelter.ai"
              required
              type="email"
              value={email}
            />
            {email && !validation.email && <small>Use a valid email address.</small>}
          </label>

          <label className="login-field field-delay-three">
            <span>Password</span>
            <div className="password-input-wrap">
              <input
                autoComplete="new-password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Create secure password"
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
              />
              <button
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="password-toggle"
                onClick={() => setShowPassword((visible) => !visible)}
                type="button"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          <div className="password-strength" aria-live="polite">
            <div className="strength-track">
              <span className={passwordStrength.className} style={{ width: `${(passwordScore / 5) * 100}%` }} />
            </div>
            <span>{password ? passwordStrength.label : 'Password strength'}</span>
          </div>

          <label className="login-field field-delay-three">
            <span>Confirm Password</span>
            <div className="password-input-wrap">
              <input
                autoComplete="new-password"
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm secure password"
                required
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
              />
              <button
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                className="password-toggle"
                onClick={() => setShowConfirmPassword((visible) => !visible)}
                type="button"
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {confirmPassword && !validation.confirmPassword && <small>Passwords must match.</small>}
          </label>

          <ul className="password-rules" aria-label="Password requirements">
            <li className={password.length >= 8 ? 'valid' : ''}>8+ characters</li>
            <li className={/[A-Z]/.test(password) ? 'valid' : ''}>Uppercase letter</li>
            <li className={/[a-z]/.test(password) ? 'valid' : ''}>Lowercase letter</li>
            <li className={/\d/.test(password) ? 'valid' : ''}>Number</li>
            <li className={/[^A-Za-z\d]/.test(password) ? 'valid' : ''}>Special character</li>
          </ul>

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}
          {message && <p className="login-success">{message}</p>}

          <button className="login-button" disabled={isSubmitting || !isFormValid} type="submit">
            <span>{isSubmitting ? 'Creating account...' : 'Create Account'}</span>
          </button>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
