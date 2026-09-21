import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

type LocationState = {
  from?: {
    pathname?: string;
  };
};

type WorkspaceRole = 'engineer' | 'admin';

const workflowSteps = [
  {
    id: '01',
    title: 'Climate Input',
    detail: 'Ambient temperature, solar irradiance, wind and humidity',
  },
  {
    id: '02',
    title: 'Thermal Simulation',
    detail: 'Indoor comfort, heat flux, and envelope behavior',
  },
  {
    id: '03',
    title: 'Design Optimization',
    detail: 'PCM, insulation, orientation, and passive ventilation',
  },
  {
    id: '04',
    title: 'Recommended Shelter',
    detail: 'Final thermal design package for deployment',
  },
];

function setPointerVars(element: HTMLElement, event: React.MouseEvent<HTMLElement>) {
  const rect = element.getBoundingClientRect();
  element.style.setProperty('--card-x', `${event.clientX - rect.left}px`);
  element.style.setProperty('--card-y', `${event.clientY - rect.top}px`);

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const tiltX = ((event.clientY - centerY) / rect.height) * -3;
  const tiltY = ((event.clientX - centerX) / rect.width) * 3;
  element.style.setProperty('--tilt-x', `${tiltX}deg`);
  element.style.setProperty('--tilt-y', `${tiltY}deg`);
}

export function IntroPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState | null;
  const fromPath = locationState?.from?.pathname;
  const pageRef = useRef<HTMLElement>(null);
  const cursorDotRef = useRef<HTMLSpanElement>(null);
  const cursorRingRef = useRef<HTMLSpanElement>(null);
  const pointerRef = useRef({ x: 50, y: 50, ringX: 50, ringY: 50, active: false });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const page = pageRef.current;
    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;

    if (!page || !dot || !ring || reduceMotion || !isFinePointer) {
      return undefined;
    }

    const animate = () => {
      const pointer = pointerRef.current;
      pointer.ringX += (pointer.x - pointer.ringX) * 0.18;
      pointer.ringY += (pointer.y - pointer.ringY) * 0.18;

      page.style.setProperty('--mouse-x', `${pointer.x}px`);
      page.style.setProperty('--mouse-y', `${pointer.y}px`);
      page.style.setProperty('--parallax-x', `${(pointer.x / window.innerWidth - 0.5) * 10}px`);
      page.style.setProperty('--parallax-y', `${(pointer.y / window.innerHeight - 0.5) * 10}px`);
      dot.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;
      ring.style.transform = `translate3d(${pointer.ringX}px, ${pointer.ringY}px, 0)`;

      rafRef.current = window.requestAnimationFrame(animate);
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerRef.current.x = event.clientX;
      pointerRef.current.y = event.clientY;
      if (!pointerRef.current.active) {
        pointerRef.current.ringX = event.clientX;
        pointerRef.current.ringY = event.clientY;
        pointerRef.current.active = true;
        page.classList.add('cursor-ready');
      }
    };

    const handlePointerOut = () => page.classList.remove('cursor-ready');

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerOut);
    rafRef.current = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerOut);
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const navigateToRole = (role: WorkspaceRole) => {
    navigate(`/login?role=${role}`, {
      state: fromPath ? { from: { pathname: fromPath } } : null,
    });
  };

  return (
    <main className="intro-gateway-page" ref={pageRef}>
      <div className="gateway-cursor-layer" aria-hidden="true">
        <span className="cursor-dot" ref={cursorDotRef} />
        <span className="cursor-ring" ref={cursorRingRef} />
      </div>

      <div className="gateway-background" aria-hidden="true">
        <div className="cursor-spotlight" />
        <div className="eng-grid" />
        <div className="eng-grid animated-grid" />
        <div className="radial-glow glow-left-cool" />
        <div className="radial-glow glow-right-warm" />

        <svg className="contour-svg" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <path className="contour-line cold-line" d="M-80,210 C180,360 390,120 610,270 S860,420 1080,260" />
          <path className="contour-line blend-line" d="M-90,500 C260,260 520,730 760,540 S940,430 1090,610" />
          <path className="contour-line warm-line" d="M-80,805 C210,900 500,650 720,760 S920,890 1080,720" />
          <path className="contour-line faint-line" d="M-90,360 C210,520 430,400 650,470 S930,590 1090,420" />
        </svg>

        <div className="coordinate-points">
          <span>34.15N</span>
          <span>77.57E</span>
          <span>850W/m2</span>
        </div>

        <div className="slow-particles">
          <span className="floater-dot f1" />
          <span className="floater-dot f2" />
          <span className="floater-dot f3" />
          <span className="floater-dot f4" />
          <span className="floater-cross f5">+</span>
          <span className="floater-cross f6">+</span>
        </div>
      </div>

      <div className="gateway-container">
        <header className="gateway-header">
          <div className="drdo-badge-row anim-item">
            <span className="badge-bullet" />
            <span className="badge-text">DRDO / iDEX - Thermal Design Platform</span>
          </div>

          <div className="brand-group">
            <h1 className="gateway-logo anim-item">THERMOSHELTER <span>AI</span></h1>
            <p className="gateway-sub-logo anim-item">
              Climate-Adaptive Passive Shelter Design & Thermal Optimization Platform
            </p>
          </div>
        </header>

        <div className="gateway-main-grid">
          <div className="gateway-left-panel">
            <div className="hero-text-block">
              <h2 className="anim-item">
                Design shelters that <span>adapt</span> to their <span>environment</span>.
              </h2>
              <p className="anim-item">
                Simulate heat flow, analyze climate conditions and optimize passive shelter designs
                for improved thermal comfort with minimum external energy.
              </p>
            </div>

            <div
              className="technical-illustration-card anim-item thermal-card"
              onMouseMove={(event) => setPointerVars(event.currentTarget, event)}
            >
              <div className="card-spotlight" />
              <div className="demo-badge">SAMPLE SIMULATION DATA</div>

              <div className="thermal-tooltip solar-tip">Solar Gain</div>
              <div className="thermal-tooltip shelter-tip">Envelope / Insulation</div>
              <div className="thermal-tooltip pcm-tip">Thermal Storage</div>
              <div className="thermal-tooltip ambient-tip">Ambient Temperature</div>
              <div className="thermal-tooltip loss-tip">Conductive Heat Loss</div>

              <div className="illustrator-stage">
                <svg className="shelter-diagram-svg" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 200 L80 140 L130 180 L200 110 L280 200" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="2" strokeDasharray="3 3" />

                  <g className="sun-pulse-g solar-hover-zone">
                    <circle cx="340" cy="50" r="22" fill="rgba(234, 88, 12, 0.12)" />
                    <circle cx="340" cy="50" r="12" fill="none" stroke="#ea580c" strokeWidth="2" />
                    <circle cx="340" cy="50" r="4" fill="#f97316" />
                  </g>

                  <path className="ray-line ray-1" d="M320 65 L230 110" stroke="#f97316" strokeWidth="1.5" strokeDasharray="4 4" />
                  <path className="ray-line ray-2" d="M325 75 L255 125" stroke="#f97316" strokeWidth="1.5" strokeDasharray="4 4" />
                  <path className="ray-particle" d="M320 65 L230 110" />
                  <path className="ray-particle delayed" d="M325 75 L255 125" />

                  <g className="shelter-wireframe-g shelter-hover-zone">
                    <rect x="180" y="100" width="100" height="70" rx="3" stroke="#0891b2" strokeWidth="2.5" fill="rgba(8, 145, 178, 0.05)" />
                    <rect className="pcm-pulse-zone" x="185" y="105" width="90" height="60" rx="2" stroke="rgba(249, 115, 22, 0.4)" strokeWidth="1.5" fill="none" />
                    <text x="230" y="90" textAnchor="middle" fill="#0891b2" fontSize="9" fontWeight="bold">Shelter Envelope</text>
                    <text x="210" y="125" fill="#f97316" fontSize="8" fontWeight="bold">PCM Core</text>
                  </g>

                  <circle cx="230" cy="135" r="22" fill="rgba(234, 88, 12, 0.1)" className="interior-glow" />
                  <path className="heat-arrow-path path-left ambient-hover-zone" d="M70 135 H180" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
                  <path className="heat-arrow-path path-right loss-hover-zone" d="M280 135 H350" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />

                  <circle className="cold-particle c1" cx="82" cy="128" r="2" fill="#06b6d4" />
                  <circle className="cold-particle c2" cx="110" cy="142" r="1.8" fill="#67e8f9" />
                  <circle className="loss-particle l1" cx="304" cy="129" r="2" fill="#f97316" />
                  <circle className="loss-particle l2" cx="330" cy="141" r="1.8" fill="#ef4444" />

                  <g className="indicator-labels">
                    <text x="90" y="125" fill="#06b6d4" fontSize="8" fontWeight="bold">Ambient: -12 C</text>
                    <text x="290" y="125" fill="#ef4444" fontSize="8" fontWeight="bold">Heat Loss</text>
                    <text x="230" y="150" textAnchor="middle" fill="#22c55e" fontSize="9" fontWeight="bold">Indoor Comfort 18 C</text>
                  </g>
                </svg>

                <div className="demo-metrics-panel">
                  <div className="metric-row count-row">
                    <span className="label">Ambient Temp</span>
                    <strong className="value stroke-cool">-12 C</strong>
                  </div>
                  <div className="metric-row count-row">
                    <span className="label">Indoor Zone</span>
                    <strong className="value stroke-warm">+18 C</strong>
                  </div>
                  <div className="metric-row count-row">
                    <span className="label">Solar Load</span>
                    <strong className="value stroke-solar">2.4 kW</strong>
                  </div>
                  <div className="metric-row highlighted count-row">
                    <span className="label">Thermal Storage</span>
                    <strong className="value stroke-green">32% Loss</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="gateway-right-panel">
            <div className="workspace-card-box">
              <div
                className="workspace-item engineer-gateway anim-item spotlight-card magnetic-card"
                onMouseMove={(event) => setPointerVars(event.currentTarget, event)}
              >
                <div className="card-spotlight" />
                <div className="workspace-main-visual">
                  <div className="workspace-icon">EN</div>
                  <div className="workspace-body">
                    <h3>Engineer Workspace</h3>
                    <p>
                      Create shelter projects, run thermal simulations, compare structures,
                      configure PCMs, and optimize passive ventilation designs.
                    </p>
                  </div>
                </div>

                <div className="workspace-footer">
                  <button
                    onClick={() => navigateToRole('engineer')}
                    className="action-btn primary-gateway-btn magnetic-btn"
                    type="button"
                  >
                    <span>Enter Engineer Workspace -&gt;</span>
                  </button>
                  <p className="signup-helper">
                    New Engineer? <Link to="/register" className="highlight-link">Create Account -&gt;</Link>
                  </p>
                </div>
              </div>

              <div
                className="workspace-item admin-gateway anim-item spotlight-card"
                onMouseMove={(event) => setPointerVars(event.currentTarget, event)}
              >
                <div className="card-spotlight" />
                <div className="workspace-main-visual">
                  <div className="workspace-icon compact">AD</div>
                  <div className="workspace-body">
                    <h3>Admin Console</h3>
                    <p>
                      Manage insulation databases, seed default projects, review system
                      validation records, and configure overall application metadata.
                    </p>
                  </div>
                </div>

                <div className="workspace-footer">
                  <button
                    onClick={() => navigateToRole('admin')}
                    className="action-btn secondary-gateway-btn"
                    type="button"
                  >
                    <span>Open Admin Console -&gt;</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="gateway-workflow-nav anim-item">
          <div className="workflow-container">
            <div className="line-progress-bg">
              <span className="active-progress-fill" />
            </div>

            <div className="workflow-stepper">
              {workflowSteps.map((step) => (
                <div className="step-node" key={step.id}>
                  <span className="step-badge">{step.id}</span>
                  <strong>{step.title}</strong>
                  <small>{step.detail}</small>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="gateway-footer anim-item">
          <div className="foot-left">
            <span>ThermoShelter AI</span>
            <span className="divider">-</span>
            <span>Passive Thermal Design & Optimization</span>
          </div>
          <div className="foot-right">
            <span>DRDO / iDEX Challenge Solution</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
