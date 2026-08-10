"use client";

import { useRef, useEffect, useMemo, type CSSProperties } from "react";
import Link from "next/link";

interface Img {
  src?: string;
  srcSet?: string;
  alt?: string;
}

type Direction = "cw" | "ccw" | "alternate";
type Fit = "cover" | "contain";

interface PhotoItem {
  image?: Img | string;
  focusY?: number;
  slug?: string;
}

interface Photo {
  src?: string;
  srcSet?: string;
  alt?: string;
  slug?: string;
  focusY: number;
}

interface ImageGroupProps {
  images?: { items?: PhotoItem[] };
  count?: number;
  rings?: number;
  innerRadius?: number;
  ringGap?: number;
  cardWidth?: number;
  cardHeight?: number;
  fit?: Fit;
  tilt?: number;
  rounded?: number;
  speed?: number;
  direction?: Direction;
  style?: CSSProperties;
}

const FALLBACK: Photo[] = [
  { src: "/assets/custom_grid_poster.png", focusY: 50, slug: "messi" },
  { src: "/assets/custom_grid_split_3.png", focusY: 50, slug: "aavesham" },
  { src: "/assets/custom_grid_split_2x2.png", focusY: 50, slug: "manichitrathazhu" },
  { src: "/assets/custom_grid_retro.png", focusY: 50, slug: "lucifer" },
  { src: "/assets/custom_grid_pocket.png", focusY: 50, slug: "premam" },
  { src: "/assets/custom_grid_photobooth.png", focusY: 50, slug: "kumbalangi-nights" },
];

const DEFAULTS = {
  images: { items: [] as PhotoItem[] },
  count: 63,
  rings: 4,
  innerRadius: 126,
  ringGap: 145,
  cardWidth: 80,
  cardHeight: 100,
  fit: "cover" as Fit,
  focusY: 50,
  tilt: 0,
  rounded: 6,
  speed: 7,
  direction: "cw" as Direction,
};

function resolveSrc(image: Img | string | undefined): string | undefined {
  if (!image) return undefined;
  if (typeof image === "string") return image.trim() || undefined;
  return image.src || undefined;
}

const ROUND_K = 2;
const SPEED_K = 0.0008;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function ringDir(direction: Direction, ring: number) {
  if (direction === "ccw") return -1;
  if (direction === "alternate") return ring % 2 === 0 ? 1 : -1;
  return 1;
}

interface Card {
  angle: number;
  radius: number;
  dir: number;
  tilt: number;
  w: number;
  h: number;
  img: Photo;
}

function transformFor(c: Card, angle: number) {
  const x = Math.cos(angle) * c.radius;
  const y = Math.sin(angle) * c.radius;
  return `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) rotate(${c.tilt.toFixed(2)}deg)`;
}

export default function ImageGroup(props: ImageGroupProps) {
  const {
    images = DEFAULTS.images,
    count = DEFAULTS.count,
    rings = DEFAULTS.rings,
    innerRadius = DEFAULTS.innerRadius,
    ringGap = DEFAULTS.ringGap,
    cardWidth = DEFAULTS.cardWidth,
    cardHeight = DEFAULTS.cardHeight,
    fit = DEFAULTS.fit,
    tilt = DEFAULTS.tilt,
    rounded = DEFAULTS.rounded,
    speed = DEFAULTS.speed,
    direction = DEFAULTS.direction,
    style,
  } = props;

  const pool = useMemo<Photo[]>(() => {
    const picked = (images?.items ?? [])
      .map((it) => ({
        src: resolveSrc(it?.image),
        srcSet: typeof it?.image === "object" ? it.image?.srcSet : undefined,
        alt: typeof it?.image === "object" ? it.image?.alt : undefined,
        slug: it?.slug,
        focusY: typeof it?.focusY === "number" ? it.focusY : DEFAULTS.focusY,
      }))
      .filter((it) => it.src);
    return picked.length ? picked : FALLBACK;
  }, [images]);

  const radiusPx = rounded * ROUND_K;
  const cards = useMemo<Card[]>(() => {
    const ringN = Math.max(1, Math.round(rings));
    const total = Math.max(ringN, Math.round(count));
    const rnd = mulberry32(0x9e3779b1);

    const radii: number[] = [];
    let totalCirc = 0;
    for (let r = 0; r < ringN; r++) {
      const rad = Math.max(1, innerRadius + r * ringGap);
      radii.push(rad);
      totalCirc += 2 * Math.PI * rad;
    }

    const out: Card[] = [];
    for (let r = 0; r < ringN; r++) {
      const circ = 2 * Math.PI * radii[r];
      const per = Math.max(2, Math.round((total * circ) / totalCirc));
      for (let j = 0; j < per; j++) {
        out.push({
          angle: (j / per) * Math.PI * 2 + r * 0.6,
          radius: radii[r],
          dir: ringDir(direction, r),
          tilt: (rnd() * 2 - 1) * tilt,
          w: cardWidth,
          h: cardHeight,
          img: pool[out.length % pool.length],
        });
      }
    }
    return out;
  }, [rings, count, innerRadius, ringGap, cardWidth, cardHeight, tilt, direction, pool]);

  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (speed === 0) return;
    const base = speed * SPEED_K;
    const angles = cards.map((c) => c.angle);
    let raf = 0;
    let last = 0;

    const frame = (now: number) => {
      const dt = last ? Math.min(64, now - last) : 16.7;
      last = now;
      for (let i = 0; i < cards.length; i++) {
        const el = refs.current[i];
        if (!el) continue;
        angles[i] += base * cards[i].dir * (dt / 16.7);
        el.style.transform = transformFor(cards[i], angles[i]);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [cards, speed]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minWidth: 120,
        minHeight: 120,
        overflow: "hidden",
        ...style,
      }}
    >
      {cards.map((c, i) => {
        const content = (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={c.img.src}
            srcSet={c.img.srcSet}
            alt={c.img.alt ?? ""}
            draggable={false}
            loading="lazy"
            decoding="async"
            style={{
              width: "100%",
              height: "100%",
              objectFit: fit,
              objectPosition: fit === "cover" ? `center ${c.img.focusY}%` : "center",
              display: "block",
            }}
          />
        );

        return (
          <div
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: c.w,
              height: c.h,
              marginLeft: -c.w / 2,
              marginTop: -c.h / 2,
              borderRadius: radiusPx,
              overflow: "hidden",
              boxShadow: "0 14px 30px rgba(0,0,0,0.14)",
              transform: transformFor(c, c.angle),
              pointerEvents: "auto",
              cursor: c.img.slug ? "pointer" : "default"
            }}
          >
            {c.img.slug ? (
              <Link href={`/product/${c.img.slug}`} prefetch={false} style={{ display: "block", width: "100%", height: "100%" }}>
                {content}
              </Link>
            ) : (
              content
            )}
          </div>
        );
      })}
    </div>
  );
}