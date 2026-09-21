import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';

type LocationState = {
  from?: {
    pathname?: string;
  };
};

type LoginRole = 'admin' | 'engineer';

type ActiveTooltip = {
  title: string;
  desc: string;
} | null;

function getLoginRole(search: string): LoginRole | null {
  const role = new URLSearchParams(search).get('role');
  return role === 'admin' || role === 'engineer' ? role : null;
}

export function LoginPage() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<ActiveTooltip>(null);
  const [cursorMode, setCursorMode] = useState<'default' | 'input' | 'button' | 'solar' | 'cyan'>('default');

  // Count-up animation values for sample metrics
  const [ambientTemp, setAmbientTemp] = useState(0);
  const [indoorTemp, setIndoorTemp] = useState(0);
  const [solarGain, setSolarGain] = useState(0);
  const [heatReduction, setHeatReduction] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const selectedRole = useMemo(() => getLoginRole(location.search), [location.search]);
  const locationState = location.state as LocationState | null;
  const targetPath = locationState?.from?.pathname || '/dashboard';

  useEffect(() => {
    document.title = 'Login | ThermoShelter AI';
  }, []);

  // Demo metrics count-up effect
  useEffect(() => {
    const duration = 1200;
    const startTime = performance.now();

    const animateMetrics = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // Ease-out cubic

      setAmbientTemp(Math.round(0 + ease * -12));
      setIndoorTemp(Math.round(0 + ease * 18));
      setSolarGain(Number((0 + ease * 2.4).toFixed(1)));
      setHeatReduction(Math.round(0 + ease * 32));

      if (progress < 1) {
        requestAnimationFrame(animateMetrics);
      }
    };

    const handle = requestAnimationFrame(animateMetrics);
    return () => cancelAnimationFrame(handle);
  }, []);

  // Cursor spotlight, parallax, 3D card tilt & magnetic button handling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;

      // Update cursor variables on container directly for CSS spotlight
      container.style.setProperty('--mouse-x', `${targetX}px`);
      container.style.setProperty('--mouse-y', `${targetY}px`);

      const ratioX = (targetX / rect.width - 0.5);
      const ratioY = (targetY / rect.height - 0.5);
      container.style.setProperty('--mouse-ratio-x', ratioX.toString());
      container.style.setProperty('--mouse-ratio-y', ratioY.toString());

      // Card relative position & 3D tilt
      if (cardRef.current) {
        const cardRect = cardRef.current.getBoundingClientRect();
        const cardX = e.clientX - cardRect.left;
        const cardY = e.clientY - cardRect.top;
        cardRef.current.style.setProperty('--card-mouse-x', `${cardX}px`);
        cardRef.current.style.setProperty('--card-mouse-y', `${cardY}px`);

        const tiltX = ((cardY / cardRect.height) - 0.5) * -3; // max 1.5 deg
        const tiltY = ((cardX / cardRect.width) - 0.5) * 3;
        cardRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
        cardRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);
      }

      // Magnetic button shift
      if (buttonRef.current) {
        const btnRect = buttonRef.current.getBoundingClientRect();
        const dist = Math.hypot(
          e.clientX - (btnRect.left + btnRect.width / 2),
          e.clientY - (btnRect.top + btnRect.height / 2)
        );
        if (dist < 100) {
          const shiftX = (e.clientX - (btnRect.left + btnRect.width / 2)) * 0.12;
          const shiftY = (e.clientY - (btnRect.top + btnRect.height / 2)) * 0.12;
          buttonRef.current.style.setProperty('--btn-tx', `${shiftX}px`);
          buttonRef.current.style.setProperty('--btn-ty', `${shiftY}px`);
        } else {
          buttonRef.current.style.setProperty('--btn-tx', '0px');
          buttonRef.current.style.setProperty('--btn-ty', '0px');
        }
      }
    };

    const updateFollower = () => {
      // Lerp for smooth cursor follower
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;

      if (followerRef.current) {
        followerRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }

      rafId = requestAnimationFrame(updateFollower);
    };

    window.addEventListener('mousemove', handleMouseMove);
    rafId = requestAnimationFrame(updateFollower);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!selectedRole) {
    return <Navigate to="/" replace state={location.state} />;
  }

  const loginRole = selectedRole;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login({ email, password, rememberMe, expectedRole: loginRole });
      setLoginSuccess(true);
      setTimeout(() => {
        navigate(targetPath, { replace: true });
      }, 400);
    } catch (loginError) {
      if (axios.isAxiosError(loginError) && loginError.response?.status === 429) {
        setError('Too many login attempts. Please try again later.');
      } else if (axios.isAxiosError(loginError) && !loginError.response) {
        setError('Unable to reach authentication server');
      } else {
        setError('Invalid email or password');
      }
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page" ref={containerRef}>
      {/* Custom Cursor Ring Follower */}
      <div
        ref={followerRef}
        className={`cursor-follower-ring mode-${cursorMode}`}
        aria-hidden="true"
      />

      {/* Layered Engineering Background */}
      <div className="login-bg-viewport" aria-hidden="true">
        <div className="layer-base-navy" />
        <div className="layer-grid-faint" />
        <div className="layer-grid-animated" />
        <div className="layer-glow-cyan" />
        <div className="layer-glow-orange" />
        <div className="layer-cursor-spotlight" />

        {/* Ambient Thermal Contour Paths */}
        <svg className="contour-svg" viewBox="0 0 1200 800" preserveAspectRatio="none">
          <path className="contour-line cold-line" d="M-50,150 C250,300 450,80 750,220 S1050,380 1250,200" />
          <path className="contour-line blend-line" d="M-50,450 C300,220 550,680 850,480 S1050,380 1250,550" />
          <path className="contour-line warm-line" d="M-50,700 C250,780 600,520 850,650 S1050,780 1250,600" />
        </svg>

        {/* Technical Floating Markers */}
        <div className="tech-markers">
          <span className="marker m1">Tₐ</span>
          <span className="marker m2">Qsolar</span>
          <span className="marker m3">ΔT</span>
          <span className="marker m4">U·A</span>
          <span className="marker m5">34.15°N</span>
          <span className="marker m6">77.57°E</span>
        </div>

        {/* Floating Thermal Particles */}
        <div className="floating-particles">
          <span className="particle p1" />
          <span className="particle p2" />
          <span className="particle p3" />
          <span className="particle p4" />
          <span className="particle p5" />
        </div>
      </div>

      {/* Main Split Layout Frame */}
      <div className="login-split-container">
        {/* Left Section: Thermal Engineering Visual (55-60%) */}
        <section className="login-visual-panel">
          <div className="visual-brand-header anim-stagger-1">
            <div className="drdo-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>DRDO / iDEX INITIATIVE</span>
            </div>

            <h1 className="main-logo-title">
              THERMOSHELTER <span className="gradient-ai">AI</span>
            </h1>

            <p className="main-subtitle">
              Climate-Adaptive Passive Shelter Design & Thermal Optimization Platform
            </p>

            <p className="main-tagline">
              Design for the climate. Optimize for comfort. Minimize external energy.
            </p>
            <p className="main-subtext">
              Engineering tools for climate-aware passive shelter analysis and optimization.
            </p>
          </div>

          {/* Interactive SVG Thermal Engineering Visualization */}
          <div className="shelter-visual-box anim-stagger-2">
            <div className="visual-canvas-wrap">
              <svg
                className="shelter-engineering-svg"
                viewBox="0 0 500 320"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="solarRayGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ffab00" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#ff5722" stopOpacity="0.2" />
                  </linearGradient>
                  <linearGradient id="pcmCoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#1a237e" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="indoorComfortGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#ff9100" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#00b0ff" stopOpacity="0.15" />
                  </linearGradient>
                </defs>

                {/* Sun Node */}
                <g
                  className="interactive-region solar-node"
                  onMouseEnter={() => {
                    setCursorMode('solar');
                    setActiveTooltip({
                      title: 'Solar Heat Gain',
                      desc: 'Solar radiation contributes passive thermal energy during daytime peak hours.',
                    });
                  }}
                  onMouseLeave={() => {
                    setCursorMode('default');
                    setActiveTooltip(null);
                  }}
                >
                  <circle cx="410" cy="45" r="24" fill="url(#solarRayGrad)" opacity="0.85" />
                  <circle cx="410" cy="45" r="32" stroke="#ffab00" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" className="spin-slow" />
                  <text x="410" y="49" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="700">☀</text>
                </g>

                {/* Solar Rays Flowing to Roof */}
                <path d="M385 60 L320 105" stroke="#ffab00" strokeWidth="2.5" strokeDasharray="5 4" className="pulse-flow" />
                <path d="M395 72 L340 115" stroke="#ffab00" strokeWidth="2" strokeDasharray="4 4" className="pulse-flow" />

                {/* Cold Ambient Airflow Outside (Cyan Arrow Paths) */}
                <path d="M20 140 Q 60 110, 100 130" stroke="#00e5ff" strokeWidth="2" strokeDasharray="4 4" className="cold-flow" />
                <path d="M15 190 Q 55 170, 95 195" stroke="#00e5ff" strokeWidth="2" strokeDasharray="4 4" className="cold-flow" />
                <text x="25" y="125" fill="#00e5ff" fontSize="10" fontWeight="600" opacity="0.9">Cold Ambient (-12°C)</text>

                {/* Shelter Roof & Main Structure */}
                <g
                  className="interactive-region shelter-structure"
                  onMouseEnter={() => {
                    setCursorMode('cyan');
                    setActiveTooltip({
                      title: 'Insulated Envelope',
                      desc: 'Multi-layer composite insulation wall envelope minimizes conductive heat loss.',
                    });
                  }}
                  onMouseLeave={() => {
                    setCursorMode('default');
                    setActiveTooltip(null);
                  }}
                >
                  {/* Roof */}
                  <polygon points="120,130 250,70 380,130" fill="#132338" stroke="#00e5ff" strokeWidth="2.5" />
                  {/* Insulation Wall Outer Boundary */}
                  <rect x="135" y="130" width="230" height="135" rx="4" fill="#0b1726" stroke="#00e5ff" strokeWidth="2" />
                  {/* Inner Layer */}
                  <rect x="150" y="145" width="200" height="105" rx="3" fill="url(#indoorComfortGrad)" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" />
                </g>

                {/* PCM Thermal Storage Core */}
                <g
                  className="interactive-region pcm-core"
                  onMouseEnter={() => {
                    setCursorMode('solar');
                    setActiveTooltip({
                      title: 'Thermal Storage Core',
                      desc: 'Phase Change Material (PCM) absorbs excess daytime solar gain and releases heat at night.',
                    });
                  }}
                  onMouseLeave={() => {
                    setCursorMode('default');
                    setActiveTooltip(null);
                  }}
                >
                  <rect x="210" y="175" width="80" height="50" rx="4" fill="url(#pcmCoreGrad)" stroke="#ff9100" strokeWidth="1.5" className="glow-pulse" />
                  <text x="250" y="198" textAnchor="middle" fill="#ffab00" fontSize="10" fontWeight="700">PCM CORE</text>
                  <text x="250" y="213" textAnchor="middle" fill="#38bdf8" fontSize="9">Latent Storage</text>
                </g>

                {/* Indoor Comfort Zone Text */}
                <g
                  className="interactive-region indoor-zone"
                  onMouseEnter={() => {
                    setCursorMode('cyan');
                    setActiveTooltip({
                      title: 'Indoor Comfort Zone',
                      desc: 'Maintains stable indoor climate (+18°C) despite severe sub-zero exterior temperatures.',
                    });
                  }}
                  onMouseLeave={() => {
                    setCursorMode('default');
                    setActiveTooltip(null);
                  }}
                >
                  <text x="250" y="162" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="700">Indoor Temp: +18°C</text>
                </g>

                {/* Heat Loss Vector Arrow */}
                <g
                  className="interactive-region heat-loss-vector"
                  onMouseEnter={() => {
                    setCursorMode('cyan');
                    setActiveTooltip({
                      title: 'Heat Loss Vector',
                      desc: 'Controlled thermal transfer rate (Reduced by 32% via composite insulation).',
                    });
                  }}
                  onMouseLeave={() => {
                    setCursorMode('default');
                    setActiveTooltip(null);
                  }}
                >
                  <path d="M350 200 L430 200" stroke="#ff5722" strokeWidth="2.5" strokeDasharray="4 3" markerEnd="url(#arrow)" className="pulse-flow" />
                  <text x="360" y="190" fill="#ff7043" fontSize="10" fontWeight="600">Heat Loss (Restricted)</text>
                </g>

                {/* Equation Decorators */}
                <text x="145" y="278" fill="#64748b" fontSize="10" fontFamily="monospace">Q = U × A × ΔT</text>
                <text x="285" y="278" fill="#64748b" fontSize="10" fontFamily="monospace">Qsolar = A × G × SHGC</text>
              </svg>

              {/* Interactive Tooltip Card */}
              {activeTooltip && (
                <div className="svg-tooltip-overlay anim-fade-in">
                  <strong>{activeTooltip.title}</strong>
                  <p>{activeTooltip.desc}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sample Demo Simulation Metrics Strip */}
          <div className="demo-metrics-strip anim-stagger-3">
            <div className="strip-header">
              <span className="dot-live" />
              <span>SAMPLE / DEMO SIMULATION</span>
            </div>
            <div className="metrics-grid">
              <div className="metric-box">
                <span className="metric-label">Ambient Outdoor</span>
                <strong className="metric-val cool">{ambientTemp}°C</strong>
              </div>
              <div className="metric-box">
                <span className="metric-label">Indoor Comfort</span>
                <strong className="metric-val warm">+{indoorTemp}°C</strong>
              </div>
              <div className="metric-box">
                <span className="metric-label">Solar Gain</span>
                <strong className="metric-val solar">{solarGain} kW</strong>
              </div>
              <div className="metric-box">
                <span className="metric-label">Heat Loss Cut</span>
                <strong className="metric-val gain">↓{heatReduction}%</strong>
              </div>
            </div>
          </div>
        </section>

        {/* Right Section: Login Workspace (40-45%) */}
        <section className="login-workspace-panel">
          <div
            ref={cardRef}
            className={`login-card-glass anim-stagger-4 ${loginSuccess ? 'auth-success-flash' : ''}`}
            aria-label="Sign in form"
          >
            {/* Spotlight Inner Light */}
            <div className="card-spotlight-inner" />

            {/* Header Badge & Title */}
            <div className="card-header-block">
              <div className="access-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>SECURE ENGINEERING ACCESS</span>
              </div>
              <h2 id="login-title">Welcome Back</h2>
              <p className="card-subtitle">
                Sign in to continue to your {loginRole === 'admin' ? 'Admin Console' : 'Engineer Workspace'}.
              </p>
            </div>

            {/* Form */}
            <form className="login-form-modern" onSubmit={handleSubmit}>
              {/* Email Input */}
              <div
                className="input-group-modern"
                onMouseEnter={() => setCursorMode('input')}
                onMouseLeave={() => setCursorMode('default')}
              >
                <div className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <input
                  id="email-input"
                  autoComplete="email"
                  inputMode="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=" "
                  required
                  type="email"
                  value={email}
                />
                <label htmlFor="email-input">
                  {loginRole === 'admin' ? 'Admin Email Address' : 'Engineer Email Address'}
                </label>
              </div>

              {/* Password Input */}
              <div
                className="input-group-modern"
                onMouseEnter={() => setCursorMode('input')}
                onMouseLeave={() => setCursorMode('default')}
              >
                <div className="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  id="password-input"
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=" "
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                />
                <label htmlFor="password-input">Security Password</label>
                <button
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="password-toggle-btn"
                  onClick={() => setShowPassword((visible) => !visible)}
                  type="button"
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Options Row */}
              <div className="options-row">
                <label className="remember-checkbox">
                  <input
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    type="checkbox"
                  />
                  <span className="custom-check-box" />
                  <span>Remember Session</span>
                </label>
                <a
                  className="forgot-link"
                  href="mailto:admin@thermoshelter.ai?subject=ThermoShelter%20AI%20Password%20Reset"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Error Message */}
              {error && (
                <div className="login-error-box anim-shake" role="alert">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Magnetic Submit Button */}
              <button
                ref={buttonRef}
                className="btn-submit-magnetic"
                disabled={isSubmitting || loginSuccess}
                onMouseEnter={() => setCursorMode('button')}
                onMouseLeave={() => setCursorMode('default')}
                type="submit"
              >
                <span className="btn-inner">
                  {loginSuccess ? (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Authenticated</span>
                    </>
                  ) : isSubmitting ? (
                    <>
                      <span className="spinner-icon" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <svg className="btn-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </>
                  )}
                </span>
              </button>

              {/* Links */}
              <div className="card-footer-links">
                <p className="switch-line">
                  Wrong workspace? <Link to="/">Choose user type</Link>
                </p>

                {loginRole === 'engineer' && (
                  <p className="switch-line highlight">
                    New to ThermoShelter AI?{' '}
                    <Link
                      to="/register"
                      onMouseEnter={() => setCursorMode('cyan')}
                      onMouseLeave={() => setCursorMode('default')}
                    >
                      Create Engineer Account →
                    </Link>
                  </p>
                )}
              </div>

              <div className="jwt-security-tag">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>Encrypted JWT Token Handshake</span>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
