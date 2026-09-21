import React, { useState, useEffect, useRef } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './App.css';

import { IntroPage } from './auth/IntroPage';
import { LoginPage } from './auth/LoginPage';
import { RegisterPage } from './auth/RegisterPage';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { useAuth } from './auth/AuthContext';
import { Shelter3D } from './components/Shelter3D';
import { ThermalSimulator } from './components/ThermalSimulator';
import { OptimizationDashboard } from './components/OptimizationDashboard';
import { PcmLibrary } from './components/PcmLibrary';
import { IoTTelemetry } from './components/IoTTelemetry';
import { AnsysValidation } from './components/AnsysValidation';
import { ReportsViewer } from './components/ReportsViewer';
import { LocationThermalAnalysis } from './components/LocationThermalAnalysis';
import { GenomeEngine } from './components/GenomeEngine';

const navItems = [
  {
    key: '/digital-twin',
    icon: 'DT',
    label: '3D Digital Twin',
    title: 'Current Location Home Geometry',
    description: 'Live location based home thermal envelope and solar orientation modeling.',
  },
  {
    key: '/thermal',
    icon: 'TH',
    label: 'Thermal Simulator',
    title: 'Thermal Simulator',
    description: 'Run shelter thermal simulations and compare passive cooling outcomes.',
  },
  {
    key: '/optimization',
    icon: 'OP',
    label: 'Optimization',
    title: 'Genetic Optimization',
    description: 'Tune shelter parameters for better thermal performance.',
  },
  {
    key: '/pcm-library',
    icon: 'PC',
    label: 'PCM Library',
    title: 'PCM Material Library',
    description: 'Review phase-change material properties and use-case fit.',
  },
  {
    key: '/iot',
    icon: 'IO',
    label: 'IoT Telemetry',
    title: 'IoT Telemetry',
    description: 'Monitor live sensor readings from connected shelter units.',
  },
  {
    key: '/ansys',
    icon: 'AN',
    label: 'ANSYS Validation',
    title: 'ANSYS Validation',
    description: 'Validate simulated results against ANSYS analysis jobs.',
  },
  {
    key: '/reports',
    icon: 'RP',
    label: 'Reports',
    title: 'Executive Reports',
    description: 'Generate and inspect summary reports for review.',
  },
  {
    key: '/genome-engine',
    icon: 'GE',
    label: 'Genome Engine',
    title: 'Thermal Genome Engine',
    description: 'Reverse shelter design using climate-adaptive thermal genome optimization.',
  }
];

const depthSurfaceSelector = [
  '.panel',
  '.metric-tile',
  '.chart-box',
  '.location-map-card',
  '.home-core',
  '.zone-list > li',
  '.border-list > li',
  '.genome-card',
  '.setup-card',
  '.rec-card',
  '.genome-details-panel',
  '.engine-content',
].join(', ');

function currentRoute(pathname: string) {
  return navItems.find((item) => item.key === pathname) ?? navItems[0];
}

function PageShell({ children }: { children: React.ReactNode }) {
  const route = currentRoute(useLocation().pathname);

  return (
    <section className="page-shell">
      <div className="page-heading">
        <h1>{route.title}</h1>
        <p>{route.description}</p>
      </div>
      {children}
    </section>
  );
}

function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const selectedRoute = currentRoute(location.pathname);
  const layoutRef = useRef<HTMLDivElement>(null);

  // Theme settings (persisting manually to support the toggle, default to light mode to match dashboard layout)
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    const layout = layoutRef.current;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;

    if (!layout || reduceMotion || !finePointer) {
      return undefined;
    }

    let activeSurface: HTMLElement | null = null;
    let animationFrame = 0;

    const registerSurfaces = (root: ParentNode = layout) => {
      root.querySelectorAll<HTMLElement>(depthSurfaceSelector).forEach((surface) => {
        surface.classList.add('depth-surface');
      });
    };

    const resetSurface = (surface: HTMLElement | null) => {
      if (!surface) return;
      surface.classList.remove('is-depth-active');
      surface.style.setProperty('--depth-rotate-x', '0deg');
      surface.style.setProperty('--depth-rotate-y', '0deg');
      surface.style.setProperty('--depth-glow-x', '50%');
      surface.style.setProperty('--depth-glow-y', '50%');
    };

    const handlePointerMove = (event: PointerEvent) => {
      const eventTarget = event.target as HTMLElement;
      const surface = eventTarget.closest<HTMLElement>('.depth-surface');

      if (!surface || !layout.contains(surface)) {
        resetSurface(activeSurface);
        activeSurface = null;
        return;
      }

      if (activeSurface !== surface) {
        resetSurface(activeSurface);
        activeSurface = surface;
        surface.classList.add('is-depth-active');
      }

      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        const rect = surface.getBoundingClientRect();
        const x = Math.min(Math.max(event.clientX - rect.left, 0), rect.width);
        const y = Math.min(Math.max(event.clientY - rect.top, 0), rect.height);
        const rotateX = (0.5 - y / rect.height) * 4;
        const rotateY = (x / rect.width - 0.5) * 5;

        surface.style.setProperty('--depth-rotate-x', `${rotateX.toFixed(2)}deg`);
        surface.style.setProperty('--depth-rotate-y', `${rotateY.toFixed(2)}deg`);
        surface.style.setProperty('--depth-glow-x', `${((x / rect.width) * 100).toFixed(1)}%`);
        surface.style.setProperty('--depth-glow-y', `${((y / rect.height) * 100).toFixed(1)}%`);
      });
    };

    const handlePointerLeave = () => {
      resetSurface(activeSurface);
      activeSurface = null;
    };

    registerSurfaces();
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.matches(depthSurfaceSelector)) node.classList.add('depth-surface');
            registerSurfaces(node);
          }
        });
      });
    });

    observer.observe(layout, { childList: true, subtree: true });
    layout.addEventListener('pointermove', handlePointerMove, { passive: true });
    layout.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
      layout.removeEventListener('pointermove', handlePointerMove);
      layout.removeEventListener('pointerleave', handlePointerLeave);
      resetSurface(activeSurface);
    };
  }, [location.pathname]);

  // Profile Dropdown state
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute dynamic route index
  const selectedIndex = navItems.findIndex((item) => item.key === location.pathname);
  const displayIndex = String(selectedIndex !== -1 ? selectedIndex + 1 : 1).padStart(2, '0');

  // Compute User Initials
  const initials = user?.fullName
    ? user.fullName
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : user?.email
      ? user.email.slice(0, 2).toUpperCase()
      : 'US';

  return (
    <div className={`app-layout ${isDark ? 'dark' : 'light'}`} ref={layoutRef}>
      <aside className="app-sidebar">
        <div className="brand-block">
          <div className="brand-mark">TS</div>
          <div>
            <h2>ThermoShelter AI</h2>
            <p>SIH 2026 Platform</p>
          </div>
        </div>

        <nav className="side-menu" aria-label="Platform modules">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={item.key === selectedRoute.key ? 'side-menu-item active' : 'side-menu-item'}
              type="button"
              onClick={() => navigate(item.key)}
            >
              <span className="nav-token">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-layout">
        <header className="top-navbar">
          {/* Left Side: Module number, page label, DRDO Badge */}
          <div className="navbar-left">
            <span className="navbar-module-num">{displayIndex}</span>
            <span className="navbar-separator">|</span>
            <strong className="navbar-title">{selectedRoute.label}</strong>
            <span className="drdo-badge">DRDO / iDEX</span>
          </div>

          {/* Right Side: Notification Icon, Theme toggle, Profile Section */}
          <div className="navbar-right">
            {/* Notification Bell Icon */}
            <button className="navbar-icon-btn notifications-bell" type="button" title="View Notifications">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="notification-indicator" />
            </button>

            {/* Theme Toggle Icon */}
            <button className="navbar-icon-btn theme-toggle" type="button" onClick={() => setIsDark(!isDark)} title="Toggle theme">
              {isDark ? (
                // Sun Icon for Light Mode
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                // Moon Icon for Dark Mode
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            <span className="navbar-divider" />

            {/* Profile Dropdown Container */}
            <div className="navbar-profile-container" ref={dropdownRef}>
              <button
                className={`navbar-profile-trigger ${profileOpen ? 'active' : ''}`}
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <div className="avatar">{initials}</div>
                <div className="profile-text">
                  <span className="username">{user?.fullName || 'User'}</span>
                  <span className="role">{user?.role || 'engineer'}</span>
                </div>
                <svg className={`chevron ${profileOpen ? 'open' : ''}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Profile Dropdown Menu */}
              {profileOpen && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    <strong>{user?.fullName || 'User'}</strong>
                    <span>{user?.email}</span>
                  </div>
                  <hr className="dropdown-divider" />
                  <button type="button" className="dropdown-item" onClick={() => { alert('Profile module coming soon!'); setProfileOpen(false); }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Profile</span>
                  </button>
                  <button type="button" className="dropdown-item" onClick={() => { alert('Settings panel coming soon!'); setProfileOpen(false); }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeWidth="2" />
                      <circle cx="12" cy="12" r="3" strokeWidth="2" />
                    </svg>
                    <span>Settings</span>
                  </button>
                  <hr className="dropdown-divider" />
                  <button type="button" className="dropdown-item logout-btn" onClick={() => { setProfileOpen(false); logout(); }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="app-content">
          <Routes>
            <Route path="/" element={<Navigate to="/digital-twin" replace />} />
            <Route path="/dashboard" element={<Navigate to="/digital-twin" replace />} />
            <Route
              path="/digital-twin"
              element={(
                <PageShell>
                  <LocationThermalAnalysis />
                  <section className="panel">
                    <div className="panel-header">
                      <h2>Current Location Home Geometry & Solar Orientation Model</h2>
                    </div>
                    <Shelter3D length={8} width={4} height={3} />
                  </section>
                </PageShell>
              )}
            />
            <Route path="/thermal" element={<PageShell><ThermalSimulator /></PageShell>} />
            <Route path="/optimization" element={<PageShell><OptimizationDashboard /></PageShell>} />
            <Route path="/pcm-library" element={<PageShell><PcmLibrary /></PageShell>} />
            <Route path="/iot" element={<PageShell><IoTTelemetry /></PageShell>} />
            <Route path="/ansys" element={<PageShell><AnsysValidation /></PageShell>} />
            <Route path="/reports" element={<PageShell><ReportsViewer /></PageShell>} />
            <Route path="/genome-engine" element={<PageShell><GenomeEngine /></PageShell>} />
            <Route path="*" element={<Navigate to="/digital-twin" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDarkTheme = savedTheme === 'dark';

    document.body.classList.toggle('dark', isDarkTheme);
    document.body.classList.toggle('light', !isDarkTheme);
    document.documentElement.classList.toggle('dark', isDarkTheme);
    document.documentElement.classList.toggle('light', !isDarkTheme);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<IntroPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/*" element={<DashboardLayout />} />
      </Route>
    </Routes>
  );
}
