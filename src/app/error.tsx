'use client';

import React, { useEffect } from 'react';
import { RefreshCw, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global boundary caught exception:", error);
  }, [error]);

  const router = useRouter();

  return (
    <div style={{ paddingTop: '160px', paddingBottom: '100px', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', maxWidth: '400px' }}>
        <span style={{ fontSize: '3rem' }}>⚠️</span>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Something went wrong</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
          We encountered an unexpected error rendering the art gallery frame. Let's try reloading the state.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button 
            onClick={() => reset()} 
            className="btn-magnetic btn-primary" 
            style={{ padding: '0.8rem 1.8rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <RefreshCw size={14} /> Retry Frame
          </button>
          <button 
            onClick={() => router.push('/')} 
            className="btn-secondary" 
            style={{ padding: '0.8rem 1.8rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '12px' }}
          >
            <Home size={14} /> Back Home
          </button>
        </div>
      </div>
    </div>
  );
}
