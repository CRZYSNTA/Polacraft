import React from 'react';

export default function Loading() {
  return (
    <div style={{ paddingTop: '180px', paddingBottom: '100px', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
        <div className="shimmer-loader-box" />
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
          Curating Fine Art Prints...
        </h3>
        <style>{`
          .shimmer-loader-box {
            width: 60px;
            height: 80px;
            border-radius: 6px;
            background: linear-gradient(90deg, #EFECE6 25%, #FAFAF8 50%, #EFECE6 75%);
            background-size: 200% 100%;
            animation: loading-shimmer 1.5s infinite;
            border: 1px solid var(--border-color);
          }
          @keyframes loading-shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </div>
    </div>
  );
}
