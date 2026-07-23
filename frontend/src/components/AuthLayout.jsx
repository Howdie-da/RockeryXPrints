// src/components/AuthLayout.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';

/**
 * AuthLayout wrapper component:
 * - authentication = false: Guest-only routes (e.g. AuthPage). Logged in users are redirected to dashboard.
 * - authentication = true: Protected routes (e.g. Dashboard, OrderDetails). Guest users are redirected to /auth.
 */
export default function AuthLayout({ children, authentication = true }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useSelector((state) => state.auth);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Wait until initial auth fetch finishes
    if (loading) return;

    const queryParams = new URLSearchParams(location.search);
    const redirectPath = queryParams.get('redirect') || '/dashboard';

    if (authentication && !user) {
      // Protected route: user is NOT logged in -> redirect to /auth
      navigate(`/auth?redirect=${encodeURIComponent(location.pathname)}`, { replace: true });
    } else if (!authentication && user) {
      // Guest-only route (e.g. /auth): user IS logged in -> redirect away to dashboard
      navigate(redirectPath, { replace: true });
    } else {
      setChecking(false);
    }
  }, [user, loading, authentication, navigate, location]);

  if (loading || checking) {
    return (
      <div className="min-h-dvh bg-white flex items-center justify-center font-space text-xs font-bold uppercase tracking-widest text-neutral-400">
        VERIFYING SESSION...
      </div>
    );
  }

  return <>{children}</>;
}
