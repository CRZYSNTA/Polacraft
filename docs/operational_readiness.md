# Polacraft - Production Operational Readiness & Launch Guide

This document outlines the operational procedures, monitoring configuration, backup strategies, and deployment recovery flows for **Polacraft**.

---

## 1. Database Backup & Disaster Recovery Strategy

Polacraft utilizes a live **Neon PostgreSQL** database (`neondb`).

### A. Point-In-Time Recovery (PITR)
- Neon automatically creates continuous WAL logs and snapshots.
- Allows restoring the database to any millisecond within the retention window (7 to 30 days depending on plan).

### B. Automated Daily Logical Backups (`pg_dump`)
Set up a daily cron job or GitHub Action running:
```bash
pg_dump "$DATABASE_URL" --format=custom --file=polacraft_backup_$(date +%Y%m%m_%H%M%S).dump
```
Upload the encrypted backup dump to AWS S3 or Cloudflare R2 bucket with a 30-day lifecycle retention rule.

---

## 2. Error & Exception Monitoring (Sentry)

Install `@sentry/nextjs`:
```bash
npm install @sentry/nextjs
```

In `sentry.client.config.ts` and `sentry.server.config.ts`:
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.2, // Capture 20% of transaction performance data
  debug: false,
});
```

---

## 3. Uptime & Health Check Endpoint

An automated health check endpoint is implemented at `/api/health` returning HTTP 200 OK when database connectivity is active.

- **Recommended Monitors**: UptimeRobot, Better Stack, or Pingdom.
- **Polling Interval**: Every 60 seconds.
- **Notification Channels**: PagerDuty, Slack, or SMS.

---

## 4. Cloudinary Media Asset Management & Optimization

- **Auto Format & Quality**: Enabled (`f_auto, q_auto, flags_strip_profile`).
- **Orphaned File Cleanup**: Replaced or deleted product images automatically invoke `deleteCloudinaryAsset(publicId)` via server actions.
- **Production Requirement**: Cloudinary keys must be defined in production environment variables (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`).

---

## 5. Deployment Rollback & Recovery Procedure

If a deployment experiences an anomaly after release:
1. **Instant Vercel Rollback**: Navigate to Vercel Project Dashboard → Deployments → Select previous stable build → Click **Promote to Production**.
2. **Database Migration Revert**: If a schema migration failed, run `npx prisma migrate resolve` or revert the Neon database branch snapshot.
