import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ paddingTop: '180px', paddingBottom: '100px', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <span style={{ fontSize: '4rem', fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--color-charcoal-accent)' }}>404</span>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.03em' }}>Frame Exceeded Boundaries</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '35ch', lineHeight: '1.6' }}>
          The editorial canvas or Malayalam movie poster slug you are looking for has been moved or is outside our print archives.
        </p>
        <Link href="/shop" className="btn-magnetic btn-primary" style={{ padding: '0.8rem 2.2rem', fontSize: '0.9rem', marginTop: '1rem' }}>
          Back to Exhibition
        </Link>
      </div>
    </div>
  );
}
